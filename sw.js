// IMPORTANTE: cada vez que cambies index.html, sube este número (v1 -> v2 -> v3...)
// o los móviles seguirán mostrando la versión guardada antigua.
const CACHE = 'contingencia-v7';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Primero la copia guardada (funciona sin red); si no está, se pide a la red.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r =>
      r || fetch(e.request).catch(() => caches.match('./index.html'))
    )
  );
});
