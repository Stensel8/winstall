/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist, type RuntimeCaching } from "@serwist/sw";
import { NetworkOnly } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const customCache: RuntimeCaching[] = [
  {
    matcher: ({ request }) => request.mode === 'navigate',
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ url }) => {
      const blockedDomains = ['px.ads.linkedin.com', 'www.googletagmanager.com', 'cmp.osano.com'];
      return blockedDomains.some(domain => url.hostname.includes(domain));
    },
    handler: new NetworkOnly(),
  },
  ...defaultCache,
];

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customCache,
});
