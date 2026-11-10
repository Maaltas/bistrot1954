// Genera public/og.jpg (1200x630) amb la imatge tipogràfica del disseny (dis. §6.4, arq. §6.6).
// Ús: npm run og   (només quan canvien el nom, la cuina o l'adreça; el fitxer es versiona).
//
// 1. Obre amb Chromium (el de Playwright; si no hi és, Chrome o Edge instal·lats) una plantilla de 1200x630.
// 2. Hi carrega Alegreya i Alegreya Sans dels paquets @fontsource, sense xarxa.
// 3. Espera document.fonts.ready i desa una captura JPEG (qualitat 85).
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { parse } from 'yaml';

const arrel = new URL('../', import.meta.url);
const ruta = (relativa) => fileURLToPath(new URL(relativa, arrel));

const restaurant = parse(readFileSync(ruta('contingut/restaurant.yaml'), 'utf8'));
const nom = restaurant.nom;
const cuina = restaurant.cuina?.ca ?? null;
const adreca = `${restaurant.adreca.carrer}, ${restaurant.adreca.municipi}`;

const font = (paquet, fitxer) =>
  `data:font/woff2;base64,${readFileSync(ruta(`node_modules/@fontsource/${paquet}/files/${fitxer}`)).toString('base64')}`;
const alegreya700 = font('alegreya', 'alegreya-latin-700-normal.woff2');
const alegreyaSans500 = font('alegreya-sans', 'alegreya-sans-latin-500-normal.woff2');

const escapa = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const html = `<!doctype html>
<html lang="ca"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Alegreya'; font-weight: 700; src: url(${alegreya700}) format('woff2'); }
@font-face { font-family: 'Alegreya Sans'; font-weight: 500; src: url(${alegreyaSans500}) format('woff2'); }
html, body { margin: 0; width: 1200px; height: 630px; }
body { display: flex; flex-direction: column; justify-content: center; padding-left: 96px; box-sizing: border-box;
  background: #1F3C99; color: #F3F5F7; }
h1 { margin: 0; font-family: 'Alegreya', serif; font-weight: 700; font-size: 160px; line-height: 1; font-variant-numeric: oldstyle-nums; letter-spacing: -0.01em; }
p { margin: 0; font-family: 'Alegreya Sans', sans-serif; font-weight: 500; font-size: 40px; line-height: 1.3; }
.dades { margin-top: 32px; }
</style></head><body>
<h1>${escapa(nom)}</h1>
<div class="dades">${cuina ? `<p>${escapa(cuina)}</p>` : ''}<p>${escapa(adreca)}</p></div>
</body></html>`;

async function obreNavegador() {
  const intents = [{}, { channel: 'chrome' }, { channel: 'msedge' }];
  let darrerError;
  for (const opcions of intents) {
    try {
      return await chromium.launch(opcions);
    } catch (e) {
      darrerError = e;
    }
  }
  throw new Error(
    `No s'ha pogut obrir cap navegador. Executa "npx playwright install chromium" i torna-ho a provar.\n${darrerError}`,
  );
}

const navegador = await obreNavegador();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await pagina.setContent(html);
  await pagina.evaluate(() => document.fonts.ready);
  const jpeg = await pagina.screenshot({ type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  writeFileSync(ruta('public/og.jpg'), jpeg);
} finally {
  await navegador.close();
}
console.log(`public/og.jpg generat (${Math.round(statSync(ruta('public/og.jpg')).size / 1024)} KB)`);
