// Aria Sports - Service Worker for Braze Push Notifications
// This file is required by the Braze Web SDK for push notification support

self.addEventListener('push', function(event) {
  const payload = event.data ? event.data.json() : {};
  
  const title = payload.title || 'Aria Sports';
  const options = {
    body: payload.body || payload.alert || 'You have a new notification',
    icon: payload.icon || '/aria_sports_logo.png',
    badge: '/aria_sports_logo.png',
    data: payload.data || {},
    tag: payload.tag || 'aria-sports-notification'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Handle notification click - open the app or a specific URL
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If a window is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Braze service worker integration
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

