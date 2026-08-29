import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function seedCards(page: import('@playwright/test').Page, count: number) {
  await page.evaluate(async cardCount => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('recall-anchor', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const cards = Array.from({ length: cardCount }, (_, index) => ({ id: `limit-${index}`, deck: 'Limit test', prompt: `Prompt ${index + 1}`, type: 'exact', answer: `Answer ${index + 1}`, aliases: [], tolerance: 0, checklist: [], intervalDays: 0, dueAt: new Date(0).toISOString(), reviewCount: 0, createdAt: new Date().toISOString() }));
    await new Promise<void>((resolve, reject) => { const tx = db.transaction('app', 'readwrite'); tx.objectStore('app').put({ cards, reviews: [] }, 'data'); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
    db.close();
  }, count);
}

async function storedCards(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('recall-anchor', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const cards = await new Promise<Array<{ prompt: string }>>((resolve, reject) => {
      const request = db.transaction('app').objectStore('app').get('data');
      request.onsuccess = () => resolve(request.result.cards);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return cards;
  });
}

async function encryptedBackup(page: import('@playwright/test').Page, payload: unknown, passphrase: string): Promise<string> {
  return page.evaluate(async ({ payload, passphrase: phrase }) => {
    const encoder = new TextEncoder();
    const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const material = await crypto.subtle.importKey('raw', encoder.encode(phrase), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 180000, hash: 'SHA-256' }, material,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(payload)));
    return JSON.stringify({
      format: 'recall-anchor-backup', version: 1, cipher: 'AES-GCM', kdf: 'PBKDF2-SHA256-180000',
      salt: toBase64(salt), iv: toBase64(iv), data: toBase64(new Uint8Array(data))
    });
  }, { payload, passphrase });
}

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Answer before');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Answer before');
  await expect(page.getByText('You are offline. Review and export still work.')).toBeVisible();
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  await page.getByRole('link', { name: 'View all cards' }).click();
  await expect(page).toHaveURL(/\/cards\?demo=1$/);
  await expect(page.getByText('You are offline. Review and export still work.')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const csv = await readFile(await (await downloadPromise).path(), 'utf8');
  expect(csv).toContain('"café"');
});

test('@claim:answer-types scores exact, numeric, and checklist answers', async ({ page }) => {
  await page.goto('/demo');
  const answer = page.getByLabel('Your answer');
  await answer.fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  await page.getByRole('button', { name: 'Review next card' }).click();
  await answer.fill('299800');
  await page.getByText('Certain', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  await page.getByRole('button', { name: 'Review next card' }).click();
  await answer.fill('claim and evidence');
  await page.getByText('Unsure', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('67%');
  await expect(page.getByText('reasoning', { exact: true })).toBeVisible();
});

test('@claim:interval-reason records the answer and explains the next interval', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Unsure', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByText('café', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Why this interval changed' })).toBeVisible();
  await expect(page.getByText(/Unsure confidence shortened it/)).toBeVisible();
});

test('@claim:csv-export exports review evidence as CSV', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const path = await (await downloadPromise).path();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('"Typed answer"');
  expect(csv.split('\r\n')).toHaveLength(3);
});

test('@claim:anki-export exports all cards with Anki fields', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Anki card CSV' }).click();
  const path = await (await downloadPromise).path();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('"Front","Back","Card type","Rubric","Deck","Tags"');
  expect(csv.split('\r\n')).toHaveLength(4);
});

test('@claim:encrypted-backup exports AES-GCM data, restores valid records, and preserves data on malformed import', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  await page.getByLabel('Backup passphrase').fill('correct-horse');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export encrypted backup' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  const envelope = JSON.parse(await readFile(path!, 'utf8'));
  expect(envelope.cipher).toBe('AES-GCM');
  expect(JSON.stringify(envelope)).not.toContain('café');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: /Remove card:/ }).first().click();
  await expect(page.getByText('2 cards ·')).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('recall-anchor-demo', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('app', 'readwrite');
      const store = tx.objectStore('app');
      const request = store.get('data');
      request.onsuccess = () => store.put({ ...request.result, reviews: [] }, 'data');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await page.getByLabel('Backup passphrase').fill('correct-horse');
  await page.getByLabel('Choose an encrypted backup').setInputFiles(path!);
  await page.getByRole('button', { name: 'Import encrypted backup' }).click();
  await expect(page.getByText('3 cards ·')).toBeVisible();
  const restoredDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const restoredPath = await (await restoredDownload).path();
  expect((await readFile(restoredPath!, 'utf8')).split('\r\n')).toHaveLength(3);

  const malformed = await encryptedBackup(page, { cards: [{}], reviews: [] }, 'correct-horse');
  let confirmationShown = false;
  page.on('dialog', dialog => { confirmationShown = true; dialog.accept(); });
  await page.getByLabel('Backup passphrase').fill('correct-horse');
  await page.getByLabel('Choose an encrypted backup').setInputFiles({ name: 'malformed.json', mimeType: 'application/json', buffer: Buffer.from(malformed) });
  await page.getByRole('button', { name: 'Import encrypted backup' }).click();
  await expect(page.getByText('This backup has invalid card or review data. Your current collection was not changed.')).toBeVisible();
  expect(confirmationShown).toBe(false);
  await expect(page.getByText('3 cards ·')).toBeVisible();
  await page.reload();
  await expect(page.getByText('3 cards ·')).toBeVisible();
});

test('@claim:demo-isolation keeps sample data out of real storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText(/3 due/)).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'No cards yet' })).toBeVisible();
});

test('@claim:demo-sample opens three due sample cards in isolated storage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/?demo=1$/);
  await expect(page.getByText('Foundations · 3 due', { exact: true })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toContainText('Demo — sample data, nothing is saved to your cards.');
  await expect(page.getByLabel('Your answer')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/cards$/);
  await expect(page.getByRole('heading', { name: 'No cards yet' })).toBeVisible();
});

test('@claim:demo-reset restores the sample without changing real cards', async ({ page }) => {
  await page.goto('/cards');
  await page.getByLabel('Prompt').fill('Real card stays here');
  await page.getByLabel('Expected answer').fill('real answer');
  await page.getByRole('button', { name: 'Save card' }).click();
  await page.goto('/?demo=1');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.getByRole('link', { name: 'View all cards' }).click();
  const changed = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  expect((await readFile(await (await changed).path(), 'utf8')).split('\r\n')).toHaveLength(4);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Sample cards were reset.')).toBeVisible();
  const reset = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  expect((await readFile(await (await reset).path(), 'utf8')).split('\r\n')).toHaveLength(3);
  await expect(page.getByText('3 cards · 3 due')).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByText('Real card stays here')).toBeVisible();
});

test('@claim:exact-normalization matches decomposed accents, case, and spaces', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByLabel('Your answer').fill('  CAFE\u0301   ');
  await page.getByText('Certain', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  await expect(page.getByRole('heading', { name: 'Answer key', exact: true })).toBeVisible();
});

test('@claim:local-privacy sends no study data off origin', async ({ page }) => {
  const requests: Array<{ url: string; body: string | null }> = [];
  page.on('request', request => requests.push({ url: request.url(), body: request.postData() }));
  await page.goto('/demo');
  const productOrigin = new URL(page.url()).origin;
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.getByRole('link', { name: 'View all cards' }).click();
  await page.getByRole('button', { name: 'Export Anki card CSV' }).click();
  await page.getByLabel('Backup passphrase').fill('private-passphrase');
  const backupDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export encrypted backup' }).click();
  await backupDownload;
  const offOrigin = requests.filter(request => new URL(request.url).origin !== productOrigin);
  expect(offOrigin).toEqual([]);
  expect(requests.some(request => request.body?.includes('private-passphrase'))).toBe(false);
  expect(requests.some(request => /analytics|telemetry|beacon/i.test(request.url))).toBe(false);
});

test('@claim:local-data-deletion clears every documented local data store', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.getByLabel('Prompt').fill('Private real card');
  await page.getByLabel('Expected answer').fill('private answer');
  await page.getByRole('button', { name: 'Save card' }).click();
  await page.getByRole('link', { name: 'Study due cards' }).click();
  await page.getByLabel('Your answer').fill('private answer');
  await page.getByText('Certain', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.evaluate(() => {
    localStorage.setItem('sb_license:answer-anchored-flashcards', 'local-deletion-license');
    localStorage.setItem('sb_license:answer-anchored-flashcards:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });

  await page.goto('/?demo=1');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.evaluate(async () => navigator.serviceWorker.ready);

  const seeded = await page.evaluate(async () => ({
    databases: (await indexedDB.databases()).map(database => database.name),
    localKeys: Object.keys(localStorage),
    caches: await globalThis.caches.keys(),
    registrations: (await navigator.serviceWorker.getRegistrations()).length
  }));
  expect(seeded.databases).toEqual(expect.arrayContaining(['recall-anchor', 'recall-anchor-demo']));
  expect(seeded.localKeys).toEqual(expect.arrayContaining([
    'sb_license:answer-anchored-flashcards',
    'sb_license:answer-anchored-flashcards:verdict'
  ]));
  expect(seeded.caches.length).toBeGreaterThan(0);
  expect(seeded.registrations).toBeGreaterThan(0);

  const origin = new URL(page.url()).origin;
  const session = await context.newCDPSession(page);
  await session.send('Storage.clearDataForOrigin', { origin, storageTypes: 'all' });

  await expect.poll(() => page.evaluate(async () => ({
    databases: (await indexedDB.databases()).map(database => database.name),
    localKeys: Object.keys(localStorage),
    caches: await globalThis.caches.keys(),
    registrations: (await navigator.serviceWorker.getRegistrations()).length
  }))).toEqual({ databases: [], localKeys: [], caches: [], registrations: 0 });

  await page.goto('/cards');
  await expect(page.getByRole('heading', { name: 'No cards yet' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.length)).toBe(0);
  await page.goto('/?demo=1');
  await expect(page.getByText('Foundations · 3 due', { exact: true })).toBeVisible();
});

test('@claim:card-removal-retention removes a card and keeps its past review row', async ({ page }) => {
  const prompt = 'Which layer protects a leaf from water loss?';
  const answer = 'waxy cuticle';
  await page.goto('/?demo=1');
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  await page.getByLabel('Prompt').fill(prompt);
  await page.getByLabel('Expected answer').fill(answer);
  await page.getByRole('button', { name: 'Save card' }).click();
  await page.getByRole('link', { name: 'Study due cards' }).click();

  for (const sampleAnswer of ['café', '299792', 'claim, evidence, reasoning']) {
    await page.getByLabel('Your answer').fill(sampleAnswer);
    await page.getByText('Certain', { exact: true }).click();
    await page.getByRole('button', { name: 'Score my answer' }).click();
    await page.getByRole('button', { name: 'Review next card' }).click();
  }
  await expect(page.getByText(prompt, { exact: true })).toBeVisible();
  await page.getByLabel('Your answer').fill(answer);
  await page.getByText('Certain', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.getByRole('link', { name: 'View all cards' }).click();

  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe(`Remove “${prompt}”? Its past review rows stay in exports.`);
    await dialog.accept();
  });
  await page.getByRole('button', { name: `Remove card: ${prompt}` }).click();
  await expect(page.getByText('Card removed. Past review rows were kept.')).toBeVisible();
  await expect(page.getByText(prompt, { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText(prompt, { exact: true })).toHaveCount(0);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  const download = await downloadPromise;
  const csv = await readFile((await download.path())!, 'utf8');
  expect(csv).toContain(`"${prompt}"`);
  expect(csv).toContain(`"${answer}"`);
});

test('@claim:free-limit makes creation idempotent and stops concurrent tabs at 30 cards', async ({ page, context }) => {
  await page.goto('/cards');
  await page.getByLabel('Prompt').fill('One rapid submission');
  await page.getByLabel('Expected answer').fill('one answer');
  await page.locator('[data-card-form]').evaluate((form: HTMLFormElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await expect(page.locator('.card-list').getByText('One rapid submission')).toHaveCount(1);
  expect((await storedCards(page)).filter(card => card.prompt === 'One rapid submission')).toHaveLength(1);

  await seedCards(page, 29);
  await page.reload();
  const second = await context.newPage();
  await second.goto('/cards');
  await page.getByRole('textbox', { name: 'Prompt', exact: true }).fill('Boundary tab A');
  await page.getByLabel('Expected answer').fill('A');
  await second.getByRole('textbox', { name: 'Prompt', exact: true }).fill('Boundary tab B');
  await second.getByLabel('Expected answer').fill('B');
  await Promise.all([
    page.getByRole('button', { name: 'Save card' }).click(),
    second.getByRole('button', { name: 'Save card' }).click()
  ]);

  const cards = await storedCards(page);
  expect(cards).toHaveLength(30);
  expect(cards.filter(card => card.prompt.startsWith('Boundary tab'))).toHaveLength(1);
  await expect(page.getByText('Your 30-card free plan is full.', { exact: true })).toBeVisible();
  await expect(page.locator('[data-card-form]')).toHaveCount(0);
  await expect(second.getByText('Your 30-card free plan is full.', { exact: true })).toBeVisible();
  await expect(second.locator('[data-card-form]')).toHaveCount(0);
});

test('@claim:license-network contacts Sociobot only for license flows', async ({ page }) => {
  const verificationRequests: string[] = [];
  await page.route('https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/verify?*', route => {
    verificationRequests.push(route.request().url());
    return route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } });
  });
  await page.goto('/?demo=1');
  await page.waitForTimeout(100);
  expect(verificationRequests).toEqual([]);

  await page.goto('/cards');
  await page.getByText('Restore a purchase').click();
  await page.getByLabel('Paste your license').fill('explicit-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect.poll(() => verificationRequests.length).toBe(1);
  expect(verificationRequests[0]).toContain('license=explicit-token');

  await page.goto('/?license=returned-token');
  await expect.poll(() => verificationRequests.length).toBe(2);
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:answer-anchored-flashcards'))).toBe('returned-token');

  await page.evaluate(() => localStorage.setItem('sb_license:answer-anchored-flashcards:verdict', JSON.stringify({ valid: true, checkedAt: 0 })));
  await page.reload();
  await expect.poll(() => verificationRequests.length).toBe(3);
  expect(verificationRequests.every(url => new URL(url).origin === 'https://api.sociobot.in')).toBe(true);
});

test('@claim:license-revocation returns paid features to the free plan', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/verify?*', route => route.fulfill({ json: { valid: false, reason: 'revoked', expires_at: null } }));
  await page.goto('/cards');
  await seedCards(page, 30);
  await page.evaluate(() => {
    localStorage.setItem('sb_license:answer-anchored-flashcards', 'revoked-token');
    localStorage.setItem('sb_license:answer-anchored-flashcards:verdict', JSON.stringify({ valid: true, checkedAt: 0 }));
  });
  await page.reload();
  await expect(page.getByText('Your license is no longer active. Free features still work.')).toBeVisible();
  await expect(page.locator('[data-card-form]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export review CSV' })).toBeVisible();
});

test('@claim:paid-desk verifies checkout and a license, then adds unlimited cards plus trends', async ({ page, request }) => {
  const products = await request.get('https://api.sociobot.in/api/v1/products');
  expect(products.ok()).toBe(true);
  const catalog = await products.json() as { data: Array<{ slug: string; price_minor: number; checkout_url: string }> };
  const listed = catalog.data.find(item => item.slug === 'answer-anchored-flashcards');
  expect(listed).toEqual(expect.objectContaining({
    price_minor: 1900,
    checkout_url: 'https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/checkout'
  }));
  const checkout = await request.get(listed!.checkout_url, { maxRedirects: 0 });
  expect(checkout.status()).toBe(303);
  expect(new URL(checkout.headers().location).hostname).toBe('checkout.dodopayments.com');
  const hostedCheckout = await request.get(listed.checkout_url);
  expect(hostedCheckout.ok()).toBe(true);
  expect(await hostedCheckout.text()).toContain('One-time Recall Anchor Desk license');
  await page.goto('/terms');
  await expect(page.locator('.legal')).toContainText('The Desk purchase opens Sociobot’s hosted checkout.');
  await expect(page.locator('.legal')).toContainText('A license must be active for paid features to remain available.');
  await expect(page.locator('.legal')).not.toContainText(/merchant of record|refund/i);
  await page.route('https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/verify?*', route => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/cards');
  await expect(page.getByRole('link', { name: /Buy Recall Anchor Desk license for \$19/ })).toHaveAttribute('href', listed!.checkout_url);
  await seedCards(page, 30);
  await page.reload();
  await expect(page.getByText('Your 30-card free plan is full.', { exact: true })).toBeVisible();
  await page.getByText('Restore a purchase').click();
  await page.getByLabel('Paste your license').fill('test-license-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Recall Anchor Desk license · active')).toBeVisible();
  await expect(page.locator('[data-card-form]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your last 20 reviews' })).toBeVisible();
});
