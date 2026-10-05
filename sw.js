/* Szlakownik service worker: caches the app shell so the page opens offline.
   Map tiles are cached by the page itself (Cache Storage, see app.js), not here. */
const VERSION = 'szlakownik-shell-v4';
const SHELL = ['./', './index.html', './app.css', './app.js', './vendor/leaflet.js', './vendor/leaflet.css', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('szlakownik-shell-') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.includes(url.hostname);
  if (!sameOrigin && !isFont) return; // tiles, routing, elevation: handled by the page
  // Stale-while-revalidate: answer from cache, refresh in the background.
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const cached = await cache.match(e.request, { ignoreSearch: sameOrigin });
    const network = fetch(e.request).then((resp) => { if (resp && resp.ok && (resp.type === 'basic' || resp.type === 'cors')) cache.put(e.request, resp.clone()); return resp; }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    const resp = await network;
    if (resp) return resp;
    if (e.request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
    return Response.error();
  }));
});
