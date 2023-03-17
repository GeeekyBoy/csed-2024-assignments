import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

self.skipWaiting();
clientsClaim();

registerRoute(
  ({ request }) => request.destination !== "",
  new NetworkFirst({
    cacheName: "offlineCache",
  })
);
