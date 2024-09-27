const cacheName = 'interactive-guide-cache-v1';
const assets = [
    '/index.html',
    '/manifest.json',
    '/service-worker.js'
];

// Cache the assets on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(assets);
        })
    );
});

// Fetch the assets from the cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Update the cache when there's a new service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
