var PRECACHE = 'precache-v1';
var RUNTIME = 'runtime';

// list the files you want cached by the service worker
PRECACHE_URLS = [
    "index.html",
    "img/avatar.jpg",
    "img/icon.png",
    "img/footer-logo.png",
    "img/ic_launcher_4.png",
    "img/ic_launcher_5.png",
    "img/learnmindandflexheadersmall.jpg",
    "home.html",
    "change_password.html",
    "courses_library.html",
    "invite.html",
    "manifest.json",
    "my_courses.html",
    "my_profile.html",
    "css/mdl/material.min.css",
    "css/global.css",
    "js/mdl/material.min.js",
    "course_view.html",
    "lecture_view.html",
    "sign_up.html",
    "https://fonts.gstatic.com/s/materialicons/v36/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2" // google fonts. 
];


// the rest below handles the installing and caching
self.addEventListener('install', event => {
    event.waitUntil(
            caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting())
            );
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
            caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
        }));
    }).then(() => self.clients.claim())
            );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
                caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                return fetch(event.request).then(response => {
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
                );
    }
});