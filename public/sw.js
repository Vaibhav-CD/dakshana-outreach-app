// Dakshana PWA Service Worker for Mobile Notifications & System Alerts
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle clicks on native phone notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const noticeData = event.notification.data || {};
  const targetUrl = noticeData.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          // Send message to web app to open this specific notice
          if (noticeData.noticeId) {
            client.postMessage({
              type: 'OPEN_NOTICE',
              noticeId: noticeData.noticeId
            });
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
