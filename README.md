# Pyreneeën Hutten Tocht

Persoonlijke reisgids met interactieve paklijst.

- **Live site:** https://sjoerdkoelewijn.github.io/hike/
- **Content bewerken:** https://sjoerdkoelewijn.github.io/hike/admin/

## Content aanpassen (de normale manier)

1. Ga naar https://sjoerdkoelewijn.github.io/hike/admin/
2. Log in met je Tina Cloud-account.
3. Kies **Pagina**, pas iets aan en klik **Save**.
4. Na ongeveer 1–2 minuten staat de wijziging live.

Elke opslag start een nieuwe publicatie. Meerdere dingen aanpassen? Doe ze
achter elkaar en sla daarna één keer op.

## Wat kun je zelf aanpassen?

- **Hero** — kicker, titel, ondertitel, achtergrondfoto en de chips.
- **Blokken** — toevoegen, verslepen en verwijderen. Types:
  - *Tekstsectie* — kop, tekst, optionele knop, voetnoot en tipkader.
  - *Route* — statistieken, etappes en de AllTrails-knop.
  - *Hutten* — lijst met hutten (nacht, naam, info, link).
  - *Paklijst* — groepen met afvinkbare items.
- **Menu** — elk blok heeft een schakelaar **Toon in menu**. Aan = er verschijnt
  een knop in de balk die naar dat blok springt. De volgorde volgt de
  blokvolgorde.
- **Footer-tekst**.

### Opmaak in tekstvelden

- Lege regel = nieuwe alinea
- `**vet**` voor vetgedrukte tekst
- Regels die met `- ` beginnen worden een lijst

## Lokaal draaien

```bash
npm install
npm run tina:dev
```

- Site: http://localhost:4321/
- CMS: http://localhost:4321/admin/

Lokaal draait het CMS in "local mode": opslaan schrijft direct naar
`content/page.json` op je computer (geen login nodig).

## Hoe het werkt

| Onderdeel | Keuze |
|-----------|-------|
| Frontend | Astro, volledig statisch |
| CMS | TinaCMS + Tina Cloud (formulieren op `/admin`) |
| Content | `content/page.json` in deze repo |
| Publiceren | GitHub Actions → GitHub Pages |
| Lettertype | Manrope, self-hosted via @fontsource |

De pagina leest `content/page.json` rechtstreeks in; er is geen server nodig.
De paklijst onthoudt aangevinkte items per bezoeker in de browser
(`localStorage`), niet op een server.

## Instellingen

| Naam | Waar | Wat |
|------|------|-----|
| `TINA_PUBLIC_CLIENT_ID` | GitHub repo variable | Publieke Tina Cloud sleutel |
| `TINA_TOKEN` | GitHub repo secret | Geheime Tina Cloud token |
| `BASE_PATH` | lokaal `/`, productie `/hike` | Basispad van de site |

Voor lokaal werken met de cloud: kopieer `.env.example` naar `.env` en vul aan.
`.env` staat in `.gitignore` en hoort daar te blijven.

## ⚠️ Bij wijzigingen aan het schema

Verandert er iets in `tina/config.ts` (nieuwe velden of bloktypes), dan moet
`tina/tina-lock.json` opnieuw worden gegenereerd en meegecommit:

```bash
npm run tina:dev
```

Laat dit één keer draaien, stop het, en commit de bijgewerkte
`tina/tina-lock.json`. Zonder die stap meldt `/admin` een *GraphQL Schema
Mismatch*. Content bewerken verandert dit bestand niet — dit geldt alleen voor
schemawijzigingen.
