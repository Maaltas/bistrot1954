# Tasques d'implementació · Web del Bistrot 1954

Els dissenyadors hi afegeixen tasques i el programador les marca (`[x]`, amb una nota d'una línia si cal). Cada tasca indica el document i la secció que la defineixen. Les tasques de cada bloc s'han de fer en ordre.

## Backend

Definides a `docs/arquitectura.md`, versió 2 (abreujat "arq."), que incorpora les respostes de l'Oriol i la resolució de D-11. Notes:
- Les tasques B-01 a B-21 no depenen del disseny. B-22 fa servir les famílies tipogràfiques de `docs/disseny-frontend.md`.
- Els números B-14 (`ImatgePlat.astro`), B-16 (rutes) i B-22 (tipografies) es mantenen perquè les tasques de Frontend hi fan referència.
- **B-31 i B-32 estan bloquejades** fins que l'Oriol ho digui (D-13 i D-14 a `docs/dubtes.md`). Fins aleshores el programador no crea cap repositori remot, no fa cap `push` i no activa cap servei extern.
- Per simular un build de publicació a PowerShell: `$env:CI="true"; npm run build; Remove-Item Env:CI` (arq. §2.3).
- **Adreça i URL local** (arq. §2.4, §5.2):
  - la web es publicarà a `https://maaltas.github.io/bistrot1954/`, amb `base: '/bistrot1954'` i sense domini propi;
  - **en local es prova a `http://localhost:4321/bistrot1954/`** (`npm run dev` o `npm run preview`);
  - les rutes `/`, `/es/`… d'aquestes tasques són relatives a la base.

- [ ] **B-01** · Inicialitzar git a l'arrel (`git init`, branca `main`) amb el `.gitignore` d'arq. §10.1 (inclou `.obsidian/`) i `.gitattributes` amb `* text=auto eol=lf` (arq. §2.3). No afegir cap remot. Verificació: `git status` no llista `node_modules/`, `dist/`, `.astro/`, `.env` ni `.obsidian/`; `git remote -v` no mostra res.
- [ ] **B-02** · Crear el projecte Astro 6 a l'arrel sense plantilla d'exemple, amb:
  - `package.json` amb `engines` (arq. §5.3);
  - `.node-version` = `26.13.0`;
  - `tsconfig.json` estricte;
  - les dependències d'arq. §2.1, incloses les de dev per al QA i `@fontsource/alegreya` i `@fontsource/alegreya-sans`, i sense `wrangler`.

  Verificació: `npm ci` acaba sense errors a PowerShell i a Git Bash.
- [ ] **B-03** · Afegir els scripts npm d'arq. §5.3 (`dev`, `build`, `preview`, `test`, `pendents`, `comprova`, `og`), portables a `cmd.exe`; `pendents` acaba sempre amb codi 0. Verificació: `npm run build` amb una pàgina buida genera `dist/index.html`.
- [ ] **B-04** · Crear `contingut/restaurant.yaml` amb el contingut exacte d'arq. §4.3.1: `web_url: null`, telèfon, horari, Google Maps, presentació literal amb els emojis, `estadistiques.goatcounter: null` i avís legal de demostració. Verificació: el fitxer és idèntic al d'arq. §4.3.1, inclòs l'apòstrof `’` de "d’aquí".
- [ ] **B-05** · Crear `contingut/seleccio.yaml` amb el contingut inicial exacte d'arq. §3.2 (8 plats). Verificació: cada `id` existeix a `contingut/plats.json`.
- [ ] **B-06** · Crear `src/lib/entorn.ts` i configurar `astro.config.mjs` segons arq. §2.4. Ha d'incloure:
  - build local o de publicació (`CI`);
  - `site` i `base`: per defecte `https://maaltas.github.io` + `/bistrot1954`; a GitHub Actions, derivats de `GITHUB_REPOSITORY_OWNER` i `GITHUB_REPOSITORY`; amb `web_url`, aquest valor + `/`;
  - l'avís `[entorn]` si els valors derivats no coincideixen amb els per defecte;
  - la funció `ruta()`;
  - i18n ca/es, sitemap, `security.csp` i tipografies;
  - sense prefetch ni view transitions.

  Verificació:
  - `npm run build` → el canonical de `dist/index.html` és `https://maaltas.github.io/bistrot1954/`;
  - `npm run preview` → la web respon a `http://localhost:4321/bistrot1954/`;
  - test unitari d'`entorn.ts`:
    - `GITHUB_REPOSITORY_OWNER="Maaltas"` + `GITHUB_REPOSITORY="Maaltas/bistrot1954"` → `https://maaltas.github.io` + `/bistrot1954`, sense avís;
    - `"Altre/prova"` → `https://altre.github.io` + `/prova`, amb avís;
    - amb `web_url` → `base` `/`.
- [ ] **B-07** · Implementar `src/lib/contingut.ts`: lectura amb `?raw`, esquemes Zod d'arq. §4.1-§4.3 (incloses les regles de `telefon`, `horari`, `presentacio`, `estadistiques` i `avis_legal` d'arq. §4.3.3) i errors i avisos en català d'arq. §3.1. Verificació (test unitari):
  - `plats.json` i `restaurant.yaml` reals validen;
  - un JSON trencat dona un error amb el nom del fitxer;
  - amb `demostracio: true` i `nif: "B12345678"`, error.
- [ ] **B-08** · Implementar `netejaCaption()` a `src/lib/neteja.ts`: passos N1-N7 d'arq. §3.3, funció pura, amb les llistes `SIGNATURA` i de frases promocionals exactament com a l'arquitectura. Verificació: la cobreixen els tests de B-10.
- [ ] **B-09** · Implementar `assignaIdiomes()` a `src/lib/idioma.ts`: passos I1-I5 d'arq. §3.3, amb `PARAULES_CA` i `PARAULES_ES` exactament com a l'arquitectura. Verificació: per als 8 captions reals, l'ordre detectat coincideix amb la taula d'arq. §3.4.2.
- [ ] **B-10** · Tests Vitest a `tests/unit/`:
  - crear `tests/fixtures/historia-esperada.json` (arq. §3.4.3) i `tests/fixtures/presentacio-esperada.json` (arq. §4.3.2), copiats **literalment**;
  - un test per plat real (8);
  - els casos E1-E15 d'arq. §3.4.4;
  - la presentació neta en català i en castellà;
  - l'invariant de paraules d'arq. §3.5.2.

  Verificació: `npm test` en verd.
- [ ] **B-11** · Validar `nom` com a fragment del caption (o amb `nom_confirmat: true`) i `idiomes` segons la llargada (arq. §3.2, §3.3 I5). Verificació: un test amb un nom que no és al caption fa fallar la validació amb un missatge que diu l'`id`.
- [ ] **B-12** · Resoldre les imatges amb `import.meta.glob` (`jpg`, `jpeg`, `png`, `webp`) i l'ordre de prioritat d'arq. §6.2, amb els avisos d'arq. §3.1 (sense imatge; menys de 400 px). Verificació:
  - amb les 8 captures actuals (`plat-0N.jpeg`), el build no mostra cap avís d'imatge;
  - un test unitari amb un glob buit dona exactament 8 avisos "sense imatge";
  - un altre amb una imatge de 300 px dona l'avís de mida.
- [ ] **B-13** · Muntar `getPlats()` i `getRestaurant()` amb el model d'arq. §4.4: fallback d'idioma P2, presentació neta, `telefonVisible`, `telefonEnllac`, `mapaUrl` i `estadistiques`. Verificació (test):
  - `plat-03` té `historia.ca.paragrafs[0][0]` que comença per "El pastís de formatge" i `historia.es.lang === 'es'`;
  - `telefonEnllac === 'tel:+34936273536'` i `telefonVisible === '936 27 35 36'`;
  - `presentacio.ca` coincideix amb la fixture.
- [ ] **B-14** · Crear el component tècnic `src/components/ImatgePlat.astro` (arq. §6.3-§6.5). Requisits:
  - `<Picture>` amb AVIF, WebP i JPEG;
  - `widths` amb la regla d'arq. §6.3 i `sizes` = `(min-width: 400px) 450px, 112.5vw`;
  - sense retall ni `layout`, dins d'un contenidor de finestra 5:7;
  - eager + `fetchpriority="high"` per a la primera imatge i lazy per a la resta;
  - cap sortida quan `imatge` és `null`.

  Verificació: R-08 i R-09 d'arq. §11. A `dist/index.html`, cada `<picture>` té `source` `image/avif` i `image/webp` amb `360w` i l'ample real de la captura (p. ex. `450w`), i cap variant més ampla.
- [ ] **B-15** · Crear `src/components/Paragrafs.astro`, `Historia.astro` i `Presentacio.astro` (arq. §3.3 P1-P4, §4.3.2, §4.5, §10.2): un `<p>` per paràgraf, `<br>` entre línies, `lang` quan difereix de la pàgina, `data-historia` / `data-presentacio` i sense `set:html`. Verificació: el cas E13 es veu com a text i no hi ha cap `<script>` al DOM.
- [ ] **B-16** · Crear les rutes `/` (`src/pages/index.astro`) i `/es/` (`src/pages/es/index.astro`) amb `Base.astro`: `#inici` amb `Presentacio.astro` i els plats amb els ganxos d'HTML d'arq. §4.5. Marcatge mínim: l'aspecte el defineixen les tasques de Frontend, i la posició de la presentació, D-15. Verificació:
  - `dist/index.html` i `dist/es/index.html` tenen 8 `article[data-plat-id]` cadascun, en l'ordre de `seleccio.yaml`;
  - cada pàgina té un `[data-presentacio]` dins de `#inici` (C-09);
  - tots els enllaços interns i recursos porten `base` (T-07 d'arq. §11).
- [ ] **B-17** · Crear la pàgina `src/pages/404.astro`, bilingüe, amb `noindex` i enllaços absoluts fets amb `ruta()` (arq. §5.2). Verificació: amb `npm run preview`, `http://localhost:4321/bistrot1954/no-existeix/` i `…/bistrot1954/es/no-existeix/` responen 404 amb aquesta pàgina, amb estils, i els seus enllaços porten a `/bistrot1954/` i `/bistrot1954/es/` (T-04).
- [ ] **B-18** · Implementar `src/lib/contacte.ts` (arq. §8): trucar, mapa i Instagram, només per als camps no nuls. Verificació (test):
  - `tel:+34936273536` i text "936 27 35 36";
  - el mapa és `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`;
  - amb `telefon: null` no surt cap `tel:`;
  - amb `google_maps_url: null` surt la cerca d'arq. §8.
- [ ] **B-19** · Crear `src/components/Seo.astro` (arq. §6.6, §7.1-§7.2):
  - title, description, canonical i `hreflang` (també entre les pàgines legals);
  - OG amb `og.jpg`, o sense `og:image` si el fitxer no existeix, amb avís;
  - Twitter, `meta referrer`, i `noindex` a la 404 i a les pàgines legals en mode demostració.

  Totes les URL absolutes, a partir de `<web>` = `https://maaltas.github.io/bistrot1954/`. Verificació: S-01, S-02, S-03 i S-08 d'arq. §11.
- [ ] **B-20** · Generar el JSON-LD `Restaurant` a `src/lib/seo.ts` + `src/components/JsonLd.astro` (arq. §7.3): sense claus nul·les i amb `<` escapat. Verificació: S-04; el JSON-LD de `/` és idèntic a l'exemple d'arq. §7.3 (URL `https://maaltas.github.io/bistrot1954/`), tant en el build local com en el de publicació.
- [ ] **B-21** · Crear `src/pages/robots.txt.ts` i el filtre del sitemap, que exclou la 404 i les pàgines legals en mode demostració (arq. §7.4). Verificació: S-05.
- [ ] **B-22** · Autoallotjar les tipografies amb l'API de tipografies d'Astro (arq. §6.7): Alegreya 400 i 700 i Alegreya Sans 500. Verificació: 0 peticions a `fonts.googleapis.com` o `fonts.gstatic.com`; ≤ 3 fitxers WOFF2 i ≤ 120 KB.
- [ ] **B-23** · Avís legal (arq. §4.3.3, §5.4):
  - textos a `src/i18n/legal.ts`;
  - pàgines `src/pages/avis-legal.astro` i `src/pages/es/aviso-legal.astro`, amb marcatge mínim (l'aspecte el defineix F-20);
  - dades d'`avis_legal` dins de `[data-dada-ficticia]` + "(dada fictícia)", i el correu sense `mailto:`;
  - el paràgraf de GoatCounter només si hi ha codi;
  - enllaç des del peu de `/` i `/es/`.

  Verificació: C-10 d'arq. §11.
- [ ] **B-24** · CSP i metes de seguretat (arq. §10.3, §9.6). No crear `public/CNAME`, `public/_headers` ni `wrangler.jsonc`. Verificació: P-05; no existeix `dist/CNAME`; 0 avisos de CSP a la consola (P-03).
- [ ] **B-25** · Deixar les estadístiques preparades i desactivades (arq. §10.6):
  - `public/js/count.js`, còpia de `https://gc.zgo.at/count.js`, amb la data i l'origen anotats al README;
  - `src/components/Estadistiques.astro`;
  - l'excepció de la CSP.

  Tot, condicionat a build de publicació + codi. Verificació:
  - build local → cap `goatcounter` a `dist/**/*.html`;
  - build de publicació amb el codi temporal `prova` (es desfà) → l'script a `/`, amb `src="/bistrot1954/js/count.js"`, `data-goatcounter="https://prova.goatcounter.com/count"` i `connect-src` amb aquest domini;
  - amb `null` → res.
- [ ] **B-26** · Crear `.github/workflows/publica.yml` segons arq. §9.2. No crear cap repositori remot ni fer cap `push`. Verificació: T-06 d'arq. §11.
- [ ] **B-27** · Escriure `scripts/pendents.mjs` (arq. §3.6, §6.1). Ha de llistar:
  - posts sense classificar, amb el caption i el bloc YAML per enganxar;
  - plats sense foto;
  - fitxers mal anomenats, en HEIC o de menys de 400 px.

  Verificació: amb una entrada de prova a `plats.json` (que després es desfà), la llista amb el bloc YAML.
- [ ] **B-28** · Preparar la infraestructura de QA (arq. §2.3, §5.1, §11):
  - `vitest.config.ts`, amb `getViteConfig()`;
  - `playwright.config.ts`, amb `testDir: 'tests/qa'`, `webServer` = `npm run preview` amb `url: 'http://localhost:4321/bistrot1954/'` i `use.baseURL: 'http://localhost:4321/bistrot1954/'`;
  - `npx playwright install chromium`, documentat. Verificació: `npx playwright test --list` s'executa sense errors.
- [ ] **B-29** · Escriure `README.md`, que ha d'explicar:
  - requisits i PATH de Node a Windows (arq. §2.3);
  - arrencada en local;
  - com afegir un plat, amb el criteri de les captures (arq. §3.6, §6.1);
  - `npm run og` (arq. §6.6);
  - publicar (arq. §9.4-§9.5), indicant que està bloquejat fins que l'Oriol ho digui;
  - tornar enrere (arq. §9.7);
  - activar les estadístiques (arq. §10.6).

  Ha de dir clarament que en local la web és a `http://localhost:4321/bistrot1954/` i que, publicada, serà a `https://maaltas.github.io/bistrot1954/`. Verificació: seguint-lo des de zero en una PowerShell nova, la web arrenca a `http://localhost:4321/bistrot1954/`.
- [ ] **B-30** · Comprovar els criteris d'arq. §11 (T, C, R, P, S, A) en el build local i, els marcats "publicació", en un build de publicació, abans de passar al QA. Anotar en aquesta tasca les puntuacions de Lighthouse i els pesos. Verificació: tots els criteris aplicables es compleixen.
- [ ] **B-31** · **BLOQUEJADA (D-13 a `docs/dubtes.md`)** · Activar la publicació quan l'Oriol doni el vistiplau final, seguint els passos d'arq. §9.4:
  - crear el repositori públic `Maaltas/bistrot1954` i fer-hi `push`;
  - Pages amb Source = GitHub Actions;
  - variable `PUBLICAR = si`.

  Verificació:
  - `https://maaltas.github.io/bistrot1954/` i `…/bistrot1954/es/` responen 200 per HTTPS, amb estils i fotos;
  - una ruta inexistent dins de `/bistrot1954/` mostra la 404 de la web;
  - es compleixen T-05, T-07, P-01, P-02, P-08 i S-01 a S-05 en producció.
- [ ] **B-32** · **BLOQUEJADA (D-14 a `docs/dubtes.md`)** · Activar GoatCounter quan l'Oriol doni el codi: `estadistiques.goatcounter` a `restaurant.yaml` + `git push` (arq. §10.6). Verificació, en producció:
  - l'única petició a tercers és `POST https://<codi>.goatcounter.com/count` (P-01);
  - 0 galetes (P-02);
  - la visita surt al tauler de GoatCounter;
  - la pàgina de privacitat menciona GoatCounter.

## Frontend

Definides a `docs/disseny-frontend.md` (abreujat "dis."). Es fan després de B-16 (les pàgines ja renderitzen els plats amb els ganxos d'arq. §4.5). Els criteris V-xx són a dis. §10. Les tasques F-12, F-20 i F-22 depenen de D-11 a `docs/dubtes.md`: mentrestant s'aplica el que diu el disseny.

- [ ] **F-01** · Crear `src/styles/tokens.css` amb tots els tokens de dis. §5: colors (§5.1), famílies, mides i interlineats (§5.2), espaiat, mides de maquetació i radis (§5.3), l'ombra de la barra (§5.4) i els breakpoints (§5.5). Verificació: cada token de dis. §5 hi és amb el valor exacte, i cap altre fitxer CSS conté colors en hex.
- [ ] **F-02** · Aplicar les tipografies (juntament amb B-22): Alegreya 400 i 700, Alegreya Sans 500, reserves Georgia / `system-ui`, `preload` només de l'Alegreya 400, i les regles de xifres (antigues a la marca; de caixa alta i tabulars a l'adreça, l'horari i el telèfon) (dis. §5.2). Verificació: V-15; a la pàgina, "1954" de l'`h1` es veu amb xifres d'estil antic.
- [ ] **F-03** · Estils base a `src/styles/global.css`: fons porcellana, text tinta, enllaços subratllats, anell de focus (cobalt sobre porcellana, porcellana sobre cobalt), selecció de text, classe de text només per a lectors de pantalla, `color-scheme: light`, `hover` només amb `hover: hover` i les regles de `prefers-reduced-motion` (dis. §5, §7). Verificació: en una pàgina de prova, Tab mostra l'anell sobre tots dos fons; V-16 i V-21.
- [ ] **F-04** · Afegir a `src/i18n/textos.ts` tots els textos de dis. §9.2 en català i castellà, i la funció que formata l'horari (dis. §9.3) i el telèfon visible (dis. §8). Verificació: test unitari en què l'horari d'avui dona exactament "De dilluns a dissabte, de 20:00 a 23:00" i "De lunes a sábado, de 20:00 a 23:00", i el telèfon "936 27 35 36" amb enllaç `tel:+34936273536`.
- [ ] **F-05** · Estructura de `Base.astro`: enllaç "Vés als plats" com a primer element enfocable, regions `header` / `main` / `footer`, un sol `h1`, i els marges de desplaçament d'àncores i de focus (dis. §2, §4.2, §7). Verificació: V-19; l'HTML té un sol `h1` per pàgina.
- [ ] **F-06** · Barra d'accions inferior (< 900 px): "Com arribar" (secundari) i "Trucar" (principal, a la dreta), àrea segura inferior, espai al final de la pàgina, i barra no fixa quan l'alçada és < 480 px (dis. §3.1, §8). Verificació: V-02, V-04 i V-22.
- [ ] **F-07** · Barra superior fixa (≥ 900 px): "Plats", "On som", selector d'idioma, "Com arribar" i "Trucar al 936 27 35 36" (dis. §3.1, §8). Verificació: V-03 i V-09.
- [ ] **F-08** · Selector d'idioma a l'obertura (mòbil), a la barra superior, al peu i a l'avís legal, cap a la pàgina equivalent de l'altre idioma, amb `lang` i `hreflang` (dis. §8, §9.2). Verificació: V-07, i a `/avis-legal/` porta a `/es/aviso-legal/`.
- [ ] **F-09** · Obertura (`#inici`): fons cobalt, `h1` "Bistrot 1954" amb `--mida-marca`, tipus de cuina, adreça i horari des de `restaurant.yaml`, i a continuació el `div[data-presentacio]` (B-15) amb l'estil de les històries en porcellana, 24 px per sobre; a ≥ 900 px, dades a la columna de 400 px i presentació a la columna de text dels plats (dis. §3.2, D-15). Verificació: V-05, V-06 (obertura) i V-30.
- [ ] **F-10** · Capçalera de la secció de plats (`#plats`): `h2` "Els plats" / "Los platos" i la frase d'introducció en acer (dis. §3.3, §9.2). Verificació: els textos coincideixen literalment amb dis. §9.2 a `/` i `/es/`.
- [ ] **F-11** · Article de plat amb foto: ordre al DOM (nom, foto, història, enllaç), graella de dis. §4.2 per a cada breakpoint, estils de nom, història i enllaç, i el nom del plat al text de l'enllaç només per a lectors de pantalla (dis. §4.1, §4.2, §4.7, §4.8). Verificació: V-08 i V-14; els 8 enllaços tenen noms accessibles diferents.
- [ ] **F-12** · Finestra de la foto 5:7 ancorada a dalt a l'esquerra (opció A de dis. §6.2), sobre `ImatgePlat.astro` (B-14): `srcset` amb la variant a l'ample real de la font, `sizes` de dis. §6.3, fons aigualit mentre carrega. Si D-11 es resol amb l'opció B, s'adapta. Verificació: V-10, V-11 i V-12; R-08 d'arq. §11 continua complint-se.
- [ ] **F-13** · Variant sense foto: el `h3` com a bloc cobalt (dis. §4.3) i l'enllaç "Veure la foto a Instagram". Verificació: V-24 amb un build temporal sense una foto (que no es versiona).
- [ ] **F-14** · Variant sense història: sense `[data-historia]` i amb l'enllaç just després del nom (dis. §4.4). Verificació: V-25.
- [ ] **F-15** · Història llarga: sense cap retall, partició de paraules llargues i foto fixa a 96 px a ≥ 900 px (dis. §4.5). Verificació: V-26 amb el cas E9.
- [ ] **F-16** · Secció "On som" (`#on-som`): fons cobalt, adreça gran, "Com arribar", `h3` "Horari" amb l'horari formatat, `h3` "Telèfon" amb el número i "Trucar"; dues columnes a ≥ 900 px (dis. §3.4, §8, §9.3). Verificació: V-06 (on som) i V-04.
- [ ] **F-17** · Peu: nom, "@bistrot1954 a Instagram", "Avís legal i privacitat", selector d'idioma, línia superior porcellana al 30 % (dis. §3.5). Verificació: els quatre enllaços hi són a `/` i `/es/` i fan ≥ 44 px d'alt al mòbil.
- [ ] **F-18** · Estats dels botons i enllaços (repòs, `hover`, `focus-visible`, `active`) per als quatre tipus de botó i els enllaços (dis. §7). Verificació: V-18, V-20 i V-21.
- [ ] **F-19** · Pàgina 404 bilingüe amb enllaços absoluts a `/` i `/es/` (dis. §3.6). Verificació: V-28.
- [ ] **F-20** · Layout de l'avís legal i privacitat de demostració a `/avis-legal/` i `/es/aviso-legal/`: avís de demostració a dalt i "(dada fictícia)" al costat de cada dada inventada (dis. §3.7, §9.2). Les dades i les rutes les fixa l'arquitecte (D-11, punt 8). Verificació: V-27.
- [ ] **F-21** · Icones: `public/favicon.svg` i `public/apple-touch-icon.png` amb el plat geomètric de dis. §6.5. Verificació: cap 404 a la consola (P-03 d'arq. §11) i, a la pestanya del navegador, es veu el cercle cobalt amb l'anell.
- [ ] **F-22** · Imatge per compartir tipogràfica `public/og.jpg` de 1200×630 px (dis. §6.4) i `og:image` apuntant-hi (D-11, punt 3). Verificació: el fitxer fa 1200×630 i ≤ 150 KB; `og:image`, `og:image:width`, `og:image:height` i `og:image:alt` hi apunten a `/` i `/es/`.
- [ ] **F-23** · Revisió visual final a 320, 375, 768 i 1280 px de totes les pàgines, amb captures a `tests/captures/` (dis. §10). Verificació: es compleixen V-01 a V-30; les captures coincideixen amb els wireframes de dis. §3.
