import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has one clear heading and working routes', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Recall Anchor — Score typed flashcard answers');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/?demo=1$/);
  await expect(page.getByText('Demo — sample data')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Score flashcards');
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByText('The address may be wrong or the page may have moved.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('terms keep purchase copy to the declared checkout and license behavior', async ({ page }) => {
  await page.goto('/terms');
  const terms = page.locator('.legal');
  await expect(terms).toContainText('The Desk purchase opens Sociobot’s hosted checkout.');
  await expect(terms).toContainText('A license must be active for paid features to remain available.');
  await expect(terms).not.toContainText(/merchant of record|refund|measure learning ability|guarantee recall/i);
});

test('every app route updates title, description, canonical, Open Graph, and Twitter metadata', async ({ page }) => {
  const routes = [
    ['/', 'Recall Anchor — Score typed flashcard answers', 'Score exact, numeric, and checklist flashcards from the answer you type.'],
    ['/study', 'Study — Recall Anchor', 'Type an answer before the answer key appears.'],
    ['/cards', 'Cards — Recall Anchor', 'Create, import, and export answer-anchored flashcards.'],
    ['/demo', 'Demo — Recall Anchor', 'Try answer-anchored review with isolated sample data.'],
    ['/privacy', 'Privacy — Recall Anchor', 'How Recall Anchor stores and handles your study data.'],
    ['/terms', 'Terms — Recall Anchor', 'Terms for using Recall Anchor.'],
    ['/not-a-real-card', 'Page not found — Recall Anchor', 'This page does not exist.']
  ];
  for (const [path, title, description] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://answer-anchored-flashcards.sociobot.in${path === '/not-a-real-card' ? '/404' : path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://answer-anchored-flashcards.sociobot.in${path === '/not-a-real-card' ? '/404' : path}`);
  }
});
