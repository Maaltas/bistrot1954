// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { parse } from 'yaml';
import { calculaEntorn } from './src/lib/entorn.ts';

// Dades del restaurant que fan falta per configurar el build (arq. §2.4, §7.4, §10.3, §10.6).
const restaurant = parse(readFileSync(new URL('./contingut/restaurant.yaml', import.meta.url), 'utf8'));

const { publicacio, site, base, avisos } = calculaEntorn(process.env, restaurant.web_url ?? null);
for (const avis of avisos) console.warn(avis);

const demostracio = restaurant.avis_legal?.demostracio === true;
const codiGoatcounter = restaurant.estadistiques?.goatcounter ?? null;

// CSP per meta (arq. §10.3). L'única excepció és el recompte de GoatCounter, només en un build de
// publicació i amb codi.
const connectSrc =
  publicacio && codiGoatcounter ? `connect-src 'self' https://${codiGoatcounter}.goatcounter.com` : "connect-src 'self'";

/** Les pàgines legals i la 404 no surten al sitemap (mentre l'avís legal sigui de demostració). */
const esPaginaExclosa = (/** @type {string} */ pagina) => {
  const ruta = new URL(pagina).pathname;
  if (/\/404(\.html|\/)?$/.test(ruta)) return true;
  if (demostracio && /\/(avis-legal|aviso-legal)\/?$/.test(ruta)) return true;
  return false;
};

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    locales: ['ca', 'es'],
    defaultLocale: 'ca',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (pagina) => !esPaginaExclosa(pagina),
      i18n: { defaultLocale: 'ca', locales: { ca: 'ca-ES', es: 'es-ES' } },
    }),
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        connectSrc,
        "base-uri 'self'",
        "form-action 'none'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Alegreya',
      cssVariable: '--font-alegreya',
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Alegreya Sans',
      cssVariable: '--font-alegreya-sans',
      weights: [500],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  prefetch: false,
});
