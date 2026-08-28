import { test, expect } from '@playwright/test';

test('@claim:keyboard-review mobile demo completes a keyboard-only review', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('body')).toHaveCSS('min-width', '320px');
  await page.getByLabel('Your answer').fill('mitochondria');
  await page.getByText('Close', { exact: true }).click();
  await page.getByLabel('Your answer').press('Control+Enter');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  expect(await page.evaluate(() => { document.documentElement.scrollLeft = 100; return document.documentElement.scrollLeft; })).toBe(0);
});
