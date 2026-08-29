import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const contentTypes: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json'
};

test('service worker announces and activates an available update', async ({ page }) => {
  let worker = await readFile('dist/sw.js');
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url || '/', 'http://127.0.0.1').pathname;
    try {
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const body = pathname === '/sw.js' ? worker : await readFile(join('dist', relative));
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(relative)] || 'application/octet-stream',
        'Cache-Control': pathname === '/sw.js' ? 'no-cache' : 'public, max-age=60'
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Update test server did not start.');

  try {
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    worker = Buffer.from(worker.toString().replace('recall-anchor-v5', 'recall-anchor-v5-test'));
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.update());
    await expect(page.getByText('A new version is ready.')).toBeVisible();
    const reloaded = page.waitForEvent('load');
    await page.getByRole('button', { name: 'Update now' }).click();
    await reloaded;

    await expect.poll(() => page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return Boolean(navigator.serviceWorker.controller && registration?.active && !registration.waiting);
    })).toBe(true);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
