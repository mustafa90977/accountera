/**
 * Accountera - Progressive Web App (PWA) Service Worker
 * Version: 1.0.0
 * Provides offline caching, lightning-fast loads, and resilient accounting practice.
 */

const CACHE_NAME = 'accountera-pwa-v1';

const STATIC_PRECACHE_URLS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.webmanifest',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon.svg',
  './icons/icon-maskable.svg',

  // Style Tokens & Sheets
  './css/theme/theme.css',
  './css/base/tokens.css',
  './css/base/reset.css',
  './css/base/typography.css',
  './css/layout/app-shell.css',
  './css/layout/topbar.css',
  './css/layout/bottom-nav.css',
  './css/components/buttons.css',
  './css/components/cards.css',
  './css/components/modals.css',
  './css/components/forms.css',
  './css/views/landing.css',
  './css/views/learning.css',
  './css/views/practice.css',
  './css/views/company-workspace.css',
  './css/views/admin-dashboard.css',
  './css/views/student-dashboard.css',
  './css/views/accountely-theme.css',

  // Application Scripts
  './src/main.js',
  './src/core/auth.js',
  './src/core/supabase-client.js',
  './src/core/simulation-bridge.js',
  './src/core/default-company-data.js',
  './src/core/services/learning-service.js',
  './src/core/engine/egyptian-coa.js',
  './src/core/engine/accountera-accounting-core.js',
  './src/core/engine/document-transaction-engine.js',
  './src/core/engine/egyptian-simulation-modules.js',
  './src/core/engine/career-paths-and-mentor.js',
  './src/ui/icons.js',
  './src/ui/landing-view.js',
  './src/ui/auth-view.js',
  './src/ui/learning-view.js',
  './src/ui/practice-view.js',
  './src/ui/company-workspace-view.js',
  './src/ui/student-dashboard-view.js',
  './src/ui/student-settings-view.js',
  './src/ui/student-plans-view.js',
  './src/ui/professional-portfolio-view.js',
  './src/ui/teacher-dashboard-view.js',
  './src/ui/admin-dashboard-view.js',
  './src/ui/animation-manager.js',

  // Simulation Suite Pages & Engines
  './simulation/simulation/dashboard/index.html',
  './simulation/simulation/journal/index.html',
  './simulation/simulation/ledger/index.html',
  './simulation/simulation/statements/index.html',
  './simulation/simulation/bank-recon/index.html',
  './simulation/simulation/cash-count/index.html',
  './simulation/simulation/inventory-count/index.html',
  './simulation/simulation/tax-returns/index.html',
  './simulation/simulation/js/state.js',
  './simulation/simulation/js/journal.js',
  './simulation/simulation/js/career-engine.js'
];

// 1. Install Event: Pre-cache core shell & assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled so that missing optional files do not break overall installation
      return Promise.allSettled(
        STATIC_PRECACHE_URLS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
            })
            .catch((err) => {
              // Non-blocking catch for dynamic runtime assets
            })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Offline & Cache Strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET, extension requests, and external Supabase API calls
  if (request.method !== 'GET') return;
  if (url.protocol.startsWith('chrome-extension')) return;
  if (url.hostname.includes('supabase.co')) return;

  // Navigation requests (HTML pages): Network-first with Cache fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          // Fallback to main app shell or simulation dashboard if offline
          if (url.pathname.includes('/simulation/')) {
            const simCached = await caches.match('./simulation/simulation/dashboard/index.html');
            if (simCached) return simCached;
          }
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and no network, do nothing; cachedResponse is returned
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Message Event: Allow client to trigger immediate update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
