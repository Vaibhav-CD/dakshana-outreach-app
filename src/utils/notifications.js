/**
 * Dakshana Mobile & Desktop Native System Notifications Utility
 * Integrates Web Notifications API with Service Worker for Android/iOS/Desktop.
 */

export async function registerServiceWorker() {
  if (typeof window === 'undefined') return null
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      return reg
    } catch (err) {
      console.warn('Service worker registration failed:', err)
      return null
    }
  }
  return null
}

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (err) {
    console.warn('Notification permission request error:', err)
    return 'denied'
  }
}

/**
 * Dispatch a native phone notification into the OS status bar / notification shade
 */
export async function sendPhoneNotification({
  title,
  body,
  tag = 'dakshana-notice',
  noticeId = null,
  url = '/'
}) {
  if (!isNotificationSupported()) return false
  if (Notification.permission !== 'granted') return false

  const notificationOptions = {
    body: body || 'New circular notice published by Dakshana Secretariat.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: tag,
    renotify: true,
    vibrate: [200, 100, 200, 100, 250],
    data: {
      url: url,
      noticeId: noticeId,
      timestamp: Date.now()
    }
  }

  // 1. Android & modern mobile browsers: Use ServiceWorkerRegistration.showNotification()
  if ('serviceWorker' in navigator) {
    try {
      let reg = await navigator.serviceWorker.getRegistration()
      if (!reg) {
        reg = await registerServiceWorker()
      }
      if (reg && reg.showNotification) {
        await reg.showNotification(title || 'Dakshana Secretariat Notice', notificationOptions)
        return true
      }
    } catch (swErr) {
      console.warn('ServiceWorker showNotification failed, trying fallback:', swErr)
    }
  }

  // 2. Desktop browser fallback
  try {
    const notif = new Notification(title || 'Dakshana Secretariat Notice', notificationOptions)
    notif.onclick = () => {
      window.focus()
      notif.close()
    }
    return true
  } catch (err) {
    console.warn('Native notification fallback failed:', err)
    return false
  }
}
