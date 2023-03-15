import { skipWaiting, clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";

skipWaiting();
clientsClaim();

registerRoute(
  ({ request }) => request.destination !== "",
  new NetworkFirst({
    cacheName: "offlineCache",
  })
);
