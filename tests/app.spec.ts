import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has one clear heading and working routes', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Recall Anchor — Score typed flashcard answers');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Score the answer');
});

test('creates an exact card and persists it after reload', async ({ page }) => {
  await page.goto('/cards');
  await page.getByLabel('Prompt').fill('Capital of Senegal?');
  await page.getByLabel('Expected answer').fill('Dakar');
  await page.getByRole('button', { name: 'Save card' }).click();
  await expect(page.getByText('Capital of Senegal?')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Capital of Senegal?')).toBeVisible();
});

for (const path of ['/', '/demo', '/cards', '/privacy', '/terms', '/not-a-real-card']) {
  test(`has no serious accessibility issues on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  });
}

test('unknown URLs show the designed 404 route', async ({ page }) => {
  await page.goto('/not-a-real-card');
  await expect(page).toHaveTitle('Page not found — Recall Anchor');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('not in the deck');
});
