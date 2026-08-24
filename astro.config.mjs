import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// GitHub Pages project-site: https://sjoerdkoelewijn.github.io/hike/
const SITE_URL = process.env.SITE_URL || 'https://sjoerdkoelewijn.github.io';
// Basispad: '/hike' in productie, geen basispad lokaal (BASE_PATH=/) — anders
// botst het /hike-pad met het TinaCMS /admin-paneel tijdens lokaal bewerken.
const BASE_PATH = process.env.BASE_PATH || '/hike';

// Wat nooit in de offline-cache hoort: het TinaCMS-paneel (~11 MB), de sitemap
// en de service worker zelf.
const EXCLUDED = [/^admin\//, /^sitemap.*\.xml$/, /^robots\.txt$/, /^sw\.js$/];

// Deze horen bij de "app shell": zonder deze bestanden kun je de pagina niet
// tonen. De rest (foto's, fonts van andere schriften) volgt na het laden.
function isShell(rel) {
  return (
    rel === 'index.html' ||
    rel === 'manifest.json' ||
    rel === 'icon.svg' ||
    rel.endsWith('.css') ||
    (rel.endsWith('.woff2') && /latin/.test(rel))
  );
}

function walk(dir, root = dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, root, out);
    else out.push(path.relative(root, full).split(path.sep).join('/'));
  }
  return out;
}

/* Schrijft na de build een sw.js met de precache-lijst van de zojuist
   gegenereerde (gehashte) bestanden, zodat de site offline werkt. */
function serviceWorker() {
  return {
    name: 'hike-service-worker',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const files = walk(outDir).filter((rel) => !EXCLUDED.some((re) => re.test(rel)));

        const hash = createHash('sha256');
        for (const rel of files.slice().sort()) {
          hash.update(rel);
          hash.update(readFileSync(path.join(outDir, rel)));
        }
        const version = hash.digest('hex').slice(0, 12);

        const shell = files.filter(isShell).map((f) => './' + f);
        const extra = files.filter((f) => !isShell(f)).map((f) => './' + f);

        const template = readFileSync(
          fileURLToPath(new URL('./scripts/sw-template.js', import.meta.url)),
          'utf8'
        );
        const sw = template
          .replace('__VERSION__', version)
          .replace('__SHELL_ASSETS__', JSON.stringify(shell, null, 2))
          .replace('__EXTRA_ASSETS__', JSON.stringify(extra, null, 2));

        writeFileSync(path.join(outDir, 'sw.js'), sw);
        logger.info(`sw.js geschreven (${version}): ${shell.length} shell + ${extra.length} extra`);
      },
    },
  };
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  integrations: [sitemap(), serviceWorker()],
});
