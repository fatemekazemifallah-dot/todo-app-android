// ===== sw.js =====

const CACHE_NAME = 'flowlist-v1';

// لیست فایل‌هایی که باید کش بشن
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

// ===== نصب سرویس‌ورکر =====
self.addEventListener('install', event => {
  console.log('✅ Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All files cached');
        return self.skipWaiting();
      })
  );
});

// ===== فعال‌سازی سرویس‌ورکر =====
self.addEventListener('activate', event => {
  console.log('✅ Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// ===== مدیریت درخواست‌ها =====
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر توی کش بود، همون رو برگردون
        if (response) {
          return response;
        }
        // وگرنه برو به شبکه
        return fetch(event.request)
          .then(response => {
            // اگه پاسخ موفق بود، توی کش ذخیره کن
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          });
      })
  );
});

// ===== دریافت پیام از اپلیکیشن برای نمایش اعلان =====
self.addEventListener('message', event => {
  console.log('📩 Message received in Service Worker:', event.data);
  
  if (event.data && event.data.type === 'show-notification') {
    const { title, body, icon } = event.data.payload;
    
    console.log('🔔 Showing notification:', { title, body, icon });
    
    // نمایش اعلان
    self.registration.showNotification(title, {
      body: body,
      icon: icon || '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      tag: 'task-reminder',
      requireInteraction: true,
      data: {
        url: '/'
      }
    });
  }
});

// ===== کلیک روی اعلان =====
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event.notification);
  
  event.notification.close();
  
  // باز کردن اپلیکیشن وقتی کاربر روی اعلان کلیک می‌کنه
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // اگه قبلاً باز بود، اون رو فوکوس کن
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // وگرنه یه پنجره جدید باز کن
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});