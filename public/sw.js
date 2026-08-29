const VERSION = 'recall-anchor-v9';
const SHELL = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/favicon.svg', '/assets/hero-768-v1.webp', '/assets/hero-1200-v1.webp', '/assets/social-v1.webp', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    const index = await fetch('/index.html');
    const html = await index.clone().text();
    const buildAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map(match => match[1]);
    await cache.put('/index.html', index);
    await cache.addAll(buildAssets);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(VERSION).then(cache => cache.put('/index.html', copy));
      }
      return response;
    }).catch(() => caches.match('/index.html', { ignoreVary: true }).then(response => response || caches.match('/offline.html', { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
