import { test, expect } from '@playwright/test';

test('@claim:keyboard-review mobile demo completes a keyboard-only review', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('body')).toHaveCSS('min-width', '320px');
  await page.getByLabel('Your answer').fill('café');
  await page.getByText('Close', { exact: true }).click();
  await page.getByLabel('Your answer').press('Control+Enter');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('100%');
  expect(await page.evaluate(() => { document.documentElement.scrollLeft = 100; return document.documentElement.scrollLeft; })).toBe(0);
});

test('390 px controls meet touch size and the review does not overflow', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy']) {
    await page.goto(path);
    const undersized = await page.locator('a:visible, button:visible, summary:visible').evaluateAll(elements => elements
      .map(element => ({ text: element.textContent?.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
      .filter(item => item.width < 44 || item.height < 44));
    expect(undersized, `${path} has undersized controls`).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await page.goto('/demo');
  await expect(page.locator('.confidence input').first()).toHaveCSS('width', '1px');
  expect(await page.evaluate(() => document.querySelector('.review-shell')!.scrollWidth)).toBeLessThanOrEqual(390);
});

test('all three landing facts fit in the first screen on phone and desktop', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const fact of ['Works offline after your first visit', 'Cards stay in this browser', 'Free for 30 cards']) {
      const box = await page.getByText(fact, { exact: true }).boundingBox();
      expect(box, `${fact} has no box at ${viewport.width}px`).not.toBeNull();
      expect(box!.y + box!.height, `${fact} is below the first screen at ${viewport.width}px`).toBeLessThanOrEqual(viewport.height);
    }
  }
});
