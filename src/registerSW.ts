export async function registerServiceWorker() {
  // Skip service worker registration in development environment
  if (import.meta.env.DEV) {
    console.log('Service Worker registration skipped in development.');
    return;
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}
