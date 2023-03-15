importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);
workbox.setConfig({
  debug: false,
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  ({ request }) => request.destination !== "",
  new workbox.strategies.NetworkFirst({
    cacheName: "offlineCache",
  })
);
