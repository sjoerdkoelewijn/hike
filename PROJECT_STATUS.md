# PROJECT_STATUS — Pyreneeën Hutten Tocht → TinaCMS

## Huidige fase
**Fase 0 — Voorbereiding** (migratie van statisch `index.html` naar Astro + TinaCMS + Tina Cloud + GitHub Pages via Actions)

## Context
- Bestaande live site: één statisch bestand `index.html`, gehost op GitHub Pages (legacy, branch `main` root) op https://sjoerdkoelewijn.github.io/hike/
- Repo: https://github.com/sjoerdkoelewijn/hike (publiek)
- De **bestaande site is de leidende "design-bron"** — we bouwen het uiterlijk 1-op-1 na (kleuren, Manrope-font, beige/crème kaarten, groen accent). Ontwerp-intake (Fase 1) is dus grotendeels al beslist.
- Doel: content bewerkbaar maken via `/admin` (Tina-formulieren), site herpubliceert zichzelf via GitHub Actions.

## Pre-flight (Fase 0)
- Node: v24.18.0 ✅
- Git + gebruiker geconfigureerd ✅
- gh CLI: geauthenticeerd als sjoerdkoelewijn ✅
- npm: aanwezig ✅
- Tina Cloud gratis laag: te verifiëren
- Tina Cloud account van gebruiker: **open vraag**

## Beslissingen
- Gebruiker heeft een Tina Cloud account ✅ (project nog aan te maken; doen we vlak voor go-live).
- Bouwplan goedgekeurd: **blok-gebaseerde single page**.
- **Hero en navigatiebalk zijn vaste elementen (geen verplaatsbare blokken).**
- **Navigatie is auto-gegenereerd uit de blokken**: elk blok heeft een schakelaar "Toon in menu" + optioneel menu-label. Menuknop springt naar het eigen blok; volgorde volgt blokvolgorde. (Geen losse anker-matching.)
- Bloktypes: `text` (kop + rich-text body + optionele tip), `route` (stats + etappes + AllTrails-knop), `huts` (lijst hutten), `packing` (groepen + items).
- Losse instellingen: footertekst.
- Font: Manrope via @fontsource (self-hosted i.p.v. Google Fonts).
- Base path: `/hike` (GitHub Pages project-site).
- Live-cutover pas op het eind (van legacy Pages root → GitHub Actions + dist); huidige site blijft tot dan draaien.

## Afwijkingen t.o.v. brochure-template (bevestigd voor deze persoonlijke pagina)
- Geen contactformulier, cookiebanner, analytics of privacybeleid (geen dataverzameling).

## Voortgang
- [x] Fase 0 pre-flight
- [x] Fase 3.1 scaffold: package.json, astro.config.mjs (base /hike), tsconfig, .gitignore; deps geïnstalleerd (Astro 7, Tina 3, @fontsource/manrope)
- [x] tina/config.ts (schema): page-collection met blokken (text/route/huts/packing), hero, footer; text-body = markdown-string met knop/voetnoot/tip
- [x] content/page.json — volledige migratie van huidige index.html (incl. alle editor-wijzigingen)
- [x] Astro layout + componenten (Hero, Nav auto-menu, TextBlock, RouteBlock, HutsBlock, PackingBlock) + paklijst-JS + generieke scrollspy
- [x] markdown-renderer (src/lib/markdown.ts) + slug/anker-helper
- [x] `npm run build` slaagt; site draait lokaal op http://localhost:4321/hike/ en rendert 1-op-1
- [x] review met gebruiker: uiterlijk goedgekeurd ("ziet er goed uit")
- [x] `/admin` lokaal werkend: base-pad omgevingsafhankelijk (BASE_PATH via cross-env; '/' lokaal, '/hike' prod). Form-editor laadt in lokale modus, alle blokken bewerkbaar, Save schrijft naar content/page.json
- [x] checkbox-vinkje gecentreerd (via translate i.p.v. vaste px-offset)
- [ ] gebruiker probeert /admin uit
- [ ] Tina Cloud project + Client ID/token + GitHub Secret
- [ ] GitHub Actions workflow + Pages op "GitHub Actions" zetten (cutover)

## Lokaal draaien
- Gebruiker (in echte terminal, TTY): `npm run tina:dev` → site op http://localhost:4321/ , CMS op http://localhost:4321/admin/
- In non-TTY (Claude): astro daemoniseert; workaround = `npm run dev` (daemon) + apart `npx tinacms dev -c "npx astro dev logs --follow"`.
- Astro-daemon beheren: `npx astro dev status|stop|logs`.

## Technische notities
- Astro 7 `astro dev` draait als background-daemon (stop/status/logs); breekt `tinacms dev -c "astro dev"` supervisie → nog op te lossen voor lokaal /admin.
- Frontend leest content direct uit content/page.json (import), niet via de gegenereerde Tina-client → simpel & volledig statisch.
- Nog NIET gepusht: Astro-scaffold staat alleen lokaal; huidige live site (root index.html via legacy Pages) draait ongewijzigd door tot de cutover.

## Openstaande vragen
- (geen op dit moment)

## Afwijkingen t.o.v. het brochure-template (personal single-page site)
- Waarschijnlijk niet nodig: contactformulier, cookiebanner, analytics, privacybeleid, meerdere pagina's. Nog te bevestigen.
