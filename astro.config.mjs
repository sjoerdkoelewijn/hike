import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project-site: https://sjoerdkoelewijn.github.io/hike/
const SITE_URL = process.env.SITE_URL || 'https://sjoerdkoelewijn.github.io';
// Basispad: '/hike' in productie, geen basispad lokaal (BASE_PATH=/) — anders
// botst het /hike-pad met het TinaCMS /admin-paneel tijdens lokaal bewerken.
const BASE_PATH = process.env.BASE_PATH || '/hike';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  integrations: [sitemap()],
});
