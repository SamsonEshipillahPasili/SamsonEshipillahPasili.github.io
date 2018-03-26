var PRECACHE = 'precache-v1';
var RUNTIME = 'runtime';

// list the files you want cached by the service worker
PRECACHE_URLS = [
    "/MindAndFlex/index.html",
    "/MindAndFlex/img/avatar.jpg",
    "/MindAndFlex/img/icon.png",
    "/MindAndFlex/img/footer-logo.png",
    "/MindAndFlex/img/ic_launcher_4.png",
    "/MindAndFlex/img/ic_launcher_5.png",
    "/MindAndFlex/img/learnmindandflexheadersmall.jpg",
    "/MindAndFlex/home.html",
    "/MindAndFlex/change_password.html",
    "/MindAndFlex/courses_library.html",
    "/MindAndFlex/invite.html",
    "/MindAndFlex/manifest.json",
    "/MindAndFlex/my_courses.html",
    "/MindAndFlex/my_profile.html",
    "/MindAndFlex/css/mdl/material.min.css",
    "/MindAndFlex/css/global.css",
    "/MindAndFlex/js/mdl/material.min.js",
    "/MindAndFlex/course_view.html",
    "/MindAndFlex/lecture_view.html",
    "/MindAndFlex/sign_up.html"
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