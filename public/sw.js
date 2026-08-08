// sw.js

// ۱. یه نسخه برای سرویس‌ورکر
const CACHE_NAME = 'flowlist-v1';

// ۲. لیست فایل‌هایی که باید کش بشن (همون فایل‌های خروجی)
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // فایل‌های JS و CSS که توی `dist` ساخته میشن رو اینجا نمی‌نویسیم،
  // چون Vite اسمشون رو هش می‌کنه. برای همین از `self.skipWaiting()` استفاده می‌کنیم.
];

// ۳. نصب سرویس‌ورکر و کش کردن فایل‌ها
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ۴. فعال‌سازی سرویس‌ورکر و پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ۵.拦截 درخواست‌ها و پاسخ از کش
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر توی کش بود، همون رو برگردون
        if (response) {
          return response;
        }
        // وگرنه برو به شبکه
        return fetch(event.request);
      })
  );
});