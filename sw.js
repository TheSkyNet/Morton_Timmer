const CACHE_NAME = 'morton-timmer-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        // Only cache internal assets
                        if (event.request.url.startsWith(self.location.origin)) {
                            cache.put(event.request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    });
                });
            })
            .catch(() => caches.match('./index.html'))
    );
});
