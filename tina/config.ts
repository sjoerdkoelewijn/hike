import { defineConfig } from 'tinacms';

// Moet gelijk lopen met `base` in astro.config.mjs: '/hike' in productie, '/' lokaal.
// Tina wil hier alleen het segment zonder slashes ('hike' of leeg), anders zoekt
// het admin-paneel z'n assets op /admin/... in plaats van /hike/admin/...
const basePath = (process.env.BASE_PATH ?? '/hike').replace(/^\/+|\/+$/g, '');

const menuFields: any[] = [
  { type: 'boolean', name: 'showInMenu', label: 'Toon in menu' },
  { type: 'string', name: 'menuLabel', label: 'Menu-label (optioneel, standaard = de kop)' },
];

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: { outputFolder: 'admin', publicFolder: 'public', basePath },
  media: { tina: { mediaRoot: 'images', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'page',
        label: 'Pagina',
        path: 'content',
        format: 'json',
        match: { include: 'page' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero (kop bovenaan)',
            fields: [
              { type: 'string', name: 'kicker', label: 'Kicker (klein label)' },
              { type: 'string', name: 'title', label: 'Titel' },
              { type: 'string', name: 'subtitle', label: 'Ondertitel' },
              { type: 'image', name: 'image', label: 'Achtergrondfoto' },
              { type: 'string', name: 'chips', label: 'Chips (labels)', list: true },
            ],
          },
          {
            type: 'object',
            name: 'blocks',
            label: 'Blokken',
            list: true,
            ui: { itemProps: (i: any) => ({ label: i?.title || i?._template }) },
            templates: [
              {
                name: 'text',
                label: 'Tekstsectie',
                ui: { itemProps: (i: any) => ({ label: i?.title || 'Tekstsectie' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Kop' },
                  ...menuFields,
                  {
                    type: 'string', name: 'body', label: 'Tekst',
                    description: 'Lege regel = nieuwe alinea. **vet** voor vetgedrukt. Regels met "- " worden een lijst.',
                    ui: { component: 'textarea' },
                  },
                  { type: 'string', name: 'buttonLabel', label: 'Knop — tekst (optioneel)' },
                  { type: 'string', name: 'buttonUrl', label: 'Knop — link (optioneel)' },
                  { type: 'boolean', name: 'buttonGhost', label: 'Knop — omlijnde stijl (ghost)' },
                  { type: 'string', name: 'footnote', label: 'Kleine voetnoot onder de knop (optioneel)', ui: { component: 'textarea' } },
                  { type: 'string', name: 'tipLabel', label: 'Tip — label (optioneel)' },
                  { type: 'string', name: 'tipText', label: 'Tip — tekst (optioneel)', ui: { component: 'textarea' } },
                ],
              },
              {
                name: 'route',
                label: 'Route',
                ui: { itemProps: (i: any) => ({ label: i?.title ? `${i.title} (route)` : 'Route' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Kop' },
                  ...menuFields,
                  { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
                  {
                    type: 'object', name: 'stats', label: 'Statistieken', list: true,
                    ui: { itemProps: (i: any) => ({ label: i?.label }) },
                    fields: [
                      { type: 'string', name: 'value', label: 'Waarde' },
                      { type: 'string', name: 'label', label: 'Label' },
                    ],
                  },
                  { type: 'string', name: 'alltrailsUrl', label: 'AllTrails-link' },
                  { type: 'string', name: 'alltrailsLabel', label: 'Knop-tekst' },
                  {
                    type: 'object', name: 'etappes', label: 'Etappes', list: true,
                    ui: { itemProps: (i: any) => ({ label: i?.day }) },
                    fields: [
                      { type: 'string', name: 'day', label: 'Dag' },
                      { type: 'string', name: 'meta', label: 'Details (afstand, hoogte, tijd)' },
                    ],
                  },
                ],
              },
              {
                name: 'huts',
                label: 'Hutten',
                ui: { itemProps: (i: any) => ({ label: i?.title ? `${i.title} (hutten)` : 'Hutten' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Kop' },
                  ...menuFields,
                  {
                    type: 'object', name: 'huts', label: 'Hutten', list: true,
                    ui: { itemProps: (i: any) => ({ label: i?.naam }) },
                    fields: [
                      { type: 'string', name: 'nacht', label: 'Nacht-label' },
                      { type: 'string', name: 'naam', label: 'Naam' },
                      { type: 'string', name: 'info', label: 'Info', ui: { component: 'textarea' } },
                      { type: 'string', name: 'url', label: 'Link (URL)' },
                      { type: 'string', name: 'urlLabel', label: 'Link-tekst' },
                    ],
                  },
                ],
              },
              {
                name: 'packing',
                label: 'Paklijst',
                ui: { itemProps: (i: any) => ({ label: i?.title ? `${i.title} (paklijst)` : 'Paklijst' }) },
                fields: [
                  { type: 'string', name: 'title', label: 'Kop' },
                  ...menuFields,
                  { type: 'string', name: 'counterWord', label: 'Teller-woord (bv. "gepakt")' },
                  { type: 'string', name: 'resetLabel', label: 'Reset-knop tekst' },
                  {
                    type: 'object', name: 'groups', label: 'Groepen', list: true,
                    ui: { itemProps: (i: any) => ({ label: i?.name }) },
                    fields: [
                      { type: 'string', name: 'name', label: 'Groepsnaam' },
                      {
                        type: 'object', name: 'items', label: 'Items', list: true,
                        ui: { itemProps: (i: any) => ({ label: i?.label }) },
                        fields: [
                          { type: 'string', name: 'label', label: 'Item' },
                          { type: 'string', name: 'note', label: 'Notitie (optioneel)' },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { type: 'string', name: 'footerText', label: 'Footer-tekst' },
        ],
      },
    ],
  },
});
