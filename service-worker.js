const CACHE_NAME = 'anubhav-calc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// install
self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// activate
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// fetch
self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then(cached => {
      if (cached) return cached;
      return fetch(ev.request).then(res => {
        // optionally cache new requests (skip non-GET)
        if (ev.request.method === 'GET' && res && res.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(ev.request, res.clone()));
        }
        return res;
      }).catch(()=> caches.match('/index.html'));
    })
  );
});
