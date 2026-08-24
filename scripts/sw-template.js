/* Service worker voor de Pyreneeën-hutten-tocht.
   Dit bestand is een sjabloon: bij `astro build` worden de drie placeholders
   hieronder vervangen door de echte, gehashte bestandsnamen uit dist/
   (zie astro.config.mjs). Alle paden zijn relatief aan sw.js, zodat het
   zowel op / als op /hike/ werkt. Bewerk dus dit bestand, niet dist/sw.js. */
const VERSION = '__VERSION__';
const SHELL_CACHE = 'hike-shell-' + VERSION;
const EXTRA_CACHE = 'hike-extra-' + VERSION;

/* Het minimum om de pagina offline te tonen: HTML, CSS, de latijnse fonts,
   het icoon en het manifest. Wordt bij install meteen opgehaald. */
const SHELL_ASSETS = __SHELL_ASSETS__;

/* De rest (foto's, fonts van andere schriften). Zwaarder, dus pas nadat de
   pagina geladen is en ons een 'cache-all'-bericht stuurt. */
const EXTRA_ASSETS = __EXTRA_ASSETS__;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    // Eén voor één, zodat één mislukt bestand de hele install niet afbreekt.
    await Promise.all(SHELL_ASSETS.map((a) => shell.add(a).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((k) => (k === SHELL_CACHE || k === EXTRA_CACHE ? null : caches.delete(k)))
    );
    await self.clients.claim();
  })());
});

/* De pagina vraagt na het laden (en als er verbinding is) om een volledige
   offline-kopie, zodat de tocht zelf zonder bereik werkt. */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'cache-all') {
    event.waitUntil(cacheEverything());
  }
});

async function cacheEverything() {
  const cache = await caches.open(EXTRA_CACHE);
  for (const asset of EXTRA_ASSETS) {
    const url = new URL(asset, self.registration.scope).href;
    if (await cache.match(url)) continue;
    try {
      const res = await fetch(url);
      if (res && res.ok) await cache.put(url, res.clone());
    } catch (e) {
      return; // weer offline: rustig stoppen, volgende keer verder
    }
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // niets van buiten cachen
  if (url.pathname.includes('/admin')) return;      // TinaCMS altijd rechtstreeks

  // De pagina zelf: eerst netwerk (verse content), offline de bewaarde versie.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const shell = await caches.open(SHELL_CACHE);
      const fallback = new URL('index.html', self.registration.scope).href;
      try {
        const res = await fetch(req);
        if (res && res.ok) shell.put(fallback, res.clone());
        return res;
      } catch (e) {
        return (await shell.match(fallback)) || Response.error();
      }
    })());
    return;
  }

  // Alle overige bestanden hebben een hash in de naam of veranderen zelden:
  // eerst uit de cache, anders van het netwerk (en dan bewaren).
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const shell = await caches.open(SHELL_CACHE);
  const cached = (await shell.match(req)) || (await caches.match(req));
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const extra = await caches.open(EXTRA_CACHE);
      extra.put(req, res.clone());
    }
    return res;
  } catch (e) {
    return Response.error();
  }
}
