/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist, type RuntimeCaching } from "@serwist/sw";
import { NetworkFirst, NetworkOnly } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

// Filter out _next/static build artifacts from precache to avoid stale cache issues
const filteredManifest = (self.__SW_MANIFEST || []).filter((entry) => {
  const url = typeof entry === 'string' ? entry : entry.url;
  // Exclude build-specific static files that change on every deployment
  return !url.includes('/_next/static/') || url.endsWith('.css') || url.endsWith('.woff2');
});

// Custom runtime caching strategy
const runtimeCaching: RuntimeCaching[] = [
  // Next.js build artifacts - always fetch fresh to avoid 400 errors
  {
    matcher: ({ url }) => url.pathname.startsWith('/_next/static/'),
    handler: new NetworkFirst({
      cacheName: 'next-static-resources',
      networkTimeoutSeconds: 10,
    }),
  },
  // External tracking scripts - never cache
  {
    matcher: ({ url }) => {
      const blockedDomains = ['px.ads.linkedin.com', 'www.googletagmanager.com', 'cmp.osano.com'];
      return blockedDomains.some(domain => url.hostname.includes(domain));
    },
    handler: new NetworkOnly(),
  },
  // Use default cache strategies for everything else
  ...defaultCache,
];

installSerwist({
  precacheEntries: filteredManifest,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  // Force activate immediately to replace old SW
  disableDevLogs: true,
});

// Handle SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Add version to force SW update on changes
const SW_VERSION = '__BUILD_ID__';  // Will be replaced during build
console.log('[SW] Service Worker version:', SW_VERSION);
