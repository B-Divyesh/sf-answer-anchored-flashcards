import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function seedThirtyCards(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('recall-anchor', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const cards = Array.from({ length: 30 }, (_, index) => ({ id: `limit-${index}`, deck: 'Limit test', prompt: `Prompt ${index + 1}`, type: 'exact', answer: `Answer ${index + 1}`, aliases: [], tolerance: 0, checklist: [], intervalDays: 0, dueAt: new Date(0).toISOString(), reviewCount: 0, createdAt: new Date().toISOString() }));
    await new Promise<void>((resolve, reject) => { const tx = db.transaction('app', 'readwrite'); tx.objectStore('app').put({ cards, reviews: [] }, 'data'); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
    db.close();
  });
}

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
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
});

test('@claim:answer-types scores exact, numeric, and checklist answers', async ({ page }) => {
  await page.goto('/demo');
  const answer = page.getByLabel('Your answer');
  await answer.fill('mitochondria');
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
  await page.getByLabel('Your answer').fill('mitochondria');
  await page.getByText('Unsure', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByText('mitochondria', { exact: true })).toBeVisible();
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
  await page.getByRole('button', { name: 'Export Anki CSV' }).click();
  const path = await (await downloadPromise).path();
  const csv = await readFile(path!, 'utf8');
  expect(csv).toContain('"Front","Back","Card type","Rubric","Deck","Tags"');
  expect(csv.split('\r\n')).toHaveLength(4);
});

test('@claim:encrypted-backup exports AES-GCM data and restores it', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Cards', exact: true }).click();
  await page.getByLabel('Backup passphrase').fill('correct-horse');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export encrypted backup' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  const envelope = JSON.parse(await readFile(path!, 'utf8'));
  expect(envelope.cipher).toBe('AES-GCM');
  expect(JSON.stringify(envelope)).not.toContain('mitochondria');
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: /Remove card:/ }).first().click();
  await expect(page.getByText('2 cards ·')).toBeVisible();
  await page.getByLabel('Backup passphrase').fill('correct-horse');
  await page.getByLabel('Choose an encrypted backup').setInputFiles(path!);
  await page.getByRole('button', { name: 'Import encrypted backup' }).click();
  await expect(page.getByText('3 cards ·')).toBeVisible();
});

test('@claim:demo-isolation keeps sample data out of real storage', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText(/3 due/)).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'No cards yet' })).toBeVisible();
});

test('@claim:local-privacy sends no study data off origin', async ({ page }) => {
  const offOrigin: string[] = [];
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') offOrigin.push(request.url()); });
  await page.goto('/demo');
  await page.getByLabel('Your answer').fill('mitochondria');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await page.getByRole('link', { name: 'View all cards' }).click();
  await page.getByRole('button', { name: 'Export Anki CSV' }).click();
  expect(offOrigin).toEqual([]);
});

test('@claim:free-limit stops the free collection at 30 cards', async ({ page }) => {
  await page.goto('/cards');
  await seedThirtyCards(page);
  await page.reload();
  await expect(page.getByText('Your 30-card free plan is full.')).toBeVisible();
  await expect(page.locator('[data-card-form]')).toHaveCount(0);
});

test('@claim:paid-desk verifies a license and adds unlimited cards plus trends', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/answer-anchored-flashcards/verify?*', route => route.fulfill({ json: { valid: true, reason: 'ok', expires_at: null } }));
  await page.goto('/cards');
  await seedThirtyCards(page);
  await page.reload();
  await expect(page.getByText('Your 30-card free plan is full.')).toBeVisible();
  await page.getByText('Restore a purchase').click();
  await page.getByLabel('Paste your license').fill('test-license-token');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByText('Recall Anchor Desk · active')).toBeVisible();
  await expect(page.locator('[data-card-form]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your last 20 reviews' })).toBeVisible();
});
