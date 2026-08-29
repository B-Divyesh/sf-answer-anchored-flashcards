import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function addExactCard(page: import('@playwright/test').Page, prompt: string, answer = 'answer') {
  await page.getByLabel('Prompt').fill(prompt);
  await page.getByLabel('Expected answer').fill(answer);
  await page.getByRole('button', { name: 'Save card' }).click();
  await expect(page.getByText(prompt)).toBeVisible();
}

test('checklist scoring matches complete rubric items, not substrings', async ({ page }) => {
  await page.goto('/cards');
  await page.getByLabel('Prompt').fill('Name the two requirements.');
  await page.getByLabel('Answer type').selectOption('checklist');
  await page.getByLabel('Checklist items').fill('art\noxygen');
  await page.getByRole('button', { name: 'Save card' }).click();
  await page.getByRole('link', { name: 'Study due cards' }).click();
  await page.getByLabel('Your answer').fill('earth');
  await page.getByText('Close', { exact: true }).click();
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('0%');
  await expect(page.locator('.evidence-grid .missing')).toHaveCount(2);
  await expect(page.getByText(/Review again in 10 minutes/)).toBeVisible();
});

test('one answer submit records exactly one review', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.locator('[data-answer-form]').evaluate((form: HTMLFormElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('recall-anchor-demo', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const result = await new Promise<any>((resolve, reject) => {
      const request = db.transaction('app').objectStore('app').get('data');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return { reviews: result.reviews.length, reviewCount: result.cards.find((card: any) => card.id === 'sample-exact').reviewCount };
  });
  expect(stored).toEqual({ reviews: 3, reviewCount: 3 });
});

test('concurrent tabs merge card additions instead of losing stale writes', async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await Promise.all([first.goto('/cards'), second.goto('/cards')]);
  await addExactCard(first, 'First tab card');
  await addExactCard(second, 'Second tab card');
  await first.reload();
  await expect(first.getByText('First tab card')).toBeVisible();
  await expect(first.getByText('Second tab card')).toBeVisible();
});

for (const path of ['/', '/demo', '/cards', '/privacy', '/terms', '/not-a-real-card']) {
  test(`dark mode has no serious accessibility issues on ${path}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  });
}

test('dark review controls and scored evidence retain accessible contrast', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/demo');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  let results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  await page.getByRole('button', { name: 'Score my answer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('static host policy serves real 404s and immutable hashed assets', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'));
  const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'));
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ route: '/demo', rewrite: '/index.html' }),
    expect.objectContaining({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } })
  ]));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  expect(manifest.start_url).toBe(`/?v=${packageJson.version}`);
  const static404 = await readFile('public/404.html', 'utf8');
  expect(static404).toContain('Skip to main content');
  expect(static404).toContain('property="og:title" content="Page not found — Recall Anchor"');
  expect(static404).toContain(`Version ${packageJson.version}`);
  expect(static404).toContain('href="/privacy"');
  expect(static404).toContain('href="/terms"');
});
