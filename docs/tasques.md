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

- [x] **B-01** · Inicialitzar git a l'arrel (`git init`, branca `main`) amb el `.gitignore` d'arq. §10.1 (inclou `.obsidian/`) i `.gitattributes` amb `* text=auto eol=lf` (arq. §2.3). No afegir cap remot. Verificació: `git status` no llista `node_modules/`, `dist/`, `.astro/`, `.env` ni `.obsidian/`; `git remote -v` no mostra res.
- [x] **B-02** · Crear el projecte Astro 6 a l'arrel sense plantilla d'exemple, amb:
  - `package.json` amb `engines` (arq. §5.3);
  - `.node-version` = `26.13.0`;
  - `tsconfig.json` estricte;
  - les dependències d'arq. §2.1, incloses les de dev per al QA i `@fontsource/alegreya` i `@fontsource/alegreya-sans`, i sense `wrangler`.

  Verificació: `npm ci` acaba sense errors a PowerShell i a Git Bash.
  - Nota: Fet: Astro 6.4.8; `npm ci` OK a PowerShell. Migrat a Astro 7.4.10 per D-16 (B-33); ja no hi ha cap `override`.
  - Nota de l'arquitecte (2026-11-10): l'arquitectura passa a Astro `^7.4.10` per D-16. La migració és la tasca B-33.

- [x] **B-03** · Afegir els scripts npm d'arq. §5.3 (`dev`, `build`, `preview`, `test`, `pendents`, `comprova`, `og`), portables a `cmd.exe`; `pendents` acaba sempre amb codi 0. Verificació: `npm run build` amb una pàgina buida genera `dist/index.html`.
- [x] **B-04** · Crear `contingut/restaurant.yaml` amb el contingut exacte d'arq. §4.3.1: `web_url: null`, telèfon, horari, Google Maps, presentació literal amb els emojis, `estadistiques.goatcounter: null` i avís legal de demostració. Verificació: el fitxer és idèntic al d'arq. §4.3.1, inclòs l'apòstrof `’` de "d’aquí".
- [x] **B-05** · Crear `contingut/seleccio.yaml` amb el contingut inicial exacte d'arq. §3.2 (8 plats). Verificació: cada `id` existeix a `contingut/plats.json`.
- [x] **B-06** · Crear `src/lib/entorn.ts` i configurar `astro.config.mjs` segons arq. §2.4. Ha d'incloure:
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
  - Nota: Fet: canonical `https://maaltas.github.io/bistrot1954/`; preview a `http://localhost:4321/bistrot1954/`; test unitari d'`entorn.ts` i builds amb `CI=true` comprovats (Maaltas/bistrot1954 sense avís; Altre/prova amb avís).

- [x] **B-07** · Implementar `src/lib/contingut.ts`: lectura amb `?raw`, esquemes Zod d'arq. §4.1-§4.3 (incloses les regles de `telefon`, `horari`, `presentacio`, `estadistiques` i `avis_legal` d'arq. §4.3.3) i errors i avisos en català d'arq. §3.1. Verificació (test unitari):
  - `plats.json` i `restaurant.yaml` reals validen;
  - un JSON trencat dona un error amb el nom del fitxer;
  - amb `demostracio: true` i `nif: "B12345678"`, error.
- [x] **B-08** · Implementar `netejaCaption()` a `src/lib/neteja.ts`: passos N1-N7 d'arq. §3.3, funció pura, amb les llistes `SIGNATURA` i de frases promocionals exactament com a l'arquitectura. Verificació: la cobreixen els tests de B-10.
- [x] **B-09** · Implementar `assignaIdiomes()` a `src/lib/idioma.ts`: passos I1-I5 d'arq. §3.3, amb `PARAULES_CA` i `PARAULES_ES` exactament com a l'arquitectura. Verificació: per als 8 captions reals, l'ordre detectat coincideix amb la taula d'arq. §3.4.2.
- [x] **B-10** · Tests Vitest a `tests/unit/`:
  - crear `tests/fixtures/historia-esperada.json` (arq. §3.4.3) i `tests/fixtures/presentacio-esperada.json` (arq. §4.3.2), copiats **literalment**;
  - un test per plat real (8);
  - els casos E1-E15 d'arq. §3.4.4;
  - la presentació neta en català i en castellà;
  - l'invariant de paraules d'arq. §3.5.2.

  Verificació: `npm test` en verd.
- [x] **B-11** · Validar `nom` com a fragment del caption (o amb `nom_confirmat: true`) i `idiomes` segons la llargada (arq. §3.2, §3.3 I5). Verificació: un test amb un nom que no és al caption fa fallar la validació amb un missatge que diu l'`id`.
- [x] **B-12** · Resoldre les imatges amb `import.meta.glob` (`jpg`, `jpeg`, `png`, `webp`) i l'ordre de prioritat d'arq. §6.2, amb els avisos d'arq. §3.1 (sense imatge; menys de 400 px). Verificació:
  - amb les 8 captures actuals (`plat-0N.jpeg`), el build no mostra cap avís d'imatge;
  - un test unitari amb un glob buit dona exactament 8 avisos "sense imatge";
  - un altre amb una imatge de 300 px dona l'avís de mida.
- [x] **B-13** · Muntar `getPlats()` i `getRestaurant()` amb el model d'arq. §4.4: fallback d'idioma P2, presentació neta, `telefonVisible`, `telefonEnllac`, `mapaUrl` i `estadistiques`. Verificació (test):
  - `plat-03` té `historia.ca.paragrafs[0][0]` que comença per "El pastís de formatge" i `historia.es.lang === 'es'`;
  - `telefonEnllac === 'tel:+34936273536'` i `telefonVisible === '936 27 35 36'`;
  - `presentacio.ca` coincideix amb la fixture.
- [x] **B-14** · Crear el component tècnic `src/components/ImatgePlat.astro` (arq. §6.3-§6.5). Requisits:
  - `<Picture>` amb AVIF, WebP i JPEG;
  - `widths` amb la regla d'arq. §6.3 i `sizes` = `(min-width: 400px) 450px, 112.5vw`;
  - sense retall ni `layout`, dins d'un contenidor de finestra 5:7;
  - eager + `fetchpriority="high"` per a la primera imatge i lazy per a la resta;
  - cap sortida quan `imatge` és `null`.

  Verificació: R-08 i R-09 d'arq. §11. A `dist/index.html`, cada `<picture>` té `source` `image/avif` i `image/webp` amb `360w` i l'ample real de la captura (p. ex. `450w`), i cap variant més ampla.
- [x] **B-15** · Crear `src/components/Paragrafs.astro`, `Historia.astro` i `Presentacio.astro` (arq. §3.3 P1-P4, §4.3.2, §4.5, §10.2): un `<p>` per paràgraf, `<br>` entre línies, `lang` quan difereix de la pàgina, `data-historia` / `data-presentacio` i sense `set:html`. Verificació: el cas E13 es veu com a text i no hi ha cap `<script>` al DOM.
- [x] **B-16** · Crear les rutes `/` (`src/pages/index.astro`) i `/es/` (`src/pages/es/index.astro`) amb `Base.astro`: `#inici` amb `Presentacio.astro` i els plats amb els ganxos d'HTML d'arq. §4.5. Marcatge mínim: l'aspecte el defineixen les tasques de Frontend, i la posició de la presentació, D-15. Verificació:
  - `dist/index.html` i `dist/es/index.html` tenen 8 `article[data-plat-id]` cadascun, en l'ordre de `seleccio.yaml`;
  - cada pàgina té un `[data-presentacio]` dins de `#inici` (C-09);
  - tots els enllaços interns i recursos porten `base` (T-07 d'arq. §11).
- [x] **B-17** · Crear la pàgina `src/pages/404.astro`, bilingüe, amb `noindex` i enllaços absoluts fets amb `ruta()` (arq. §5.2). Verificació: amb `npm run preview`, `http://localhost:4321/bistrot1954/no-existeix/` i `…/bistrot1954/es/no-existeix/` responen 404 amb aquesta pàgina, amb estils, i els seus enllaços porten a `/bistrot1954/` i `/bistrot1954/es/` (T-04).
- [x] **B-18** · Implementar `src/lib/contacte.ts` (arq. §8): trucar, mapa i Instagram, només per als camps no nuls. Verificació (test):
  - `tel:+34936273536` i text "936 27 35 36";
  - el mapa és `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`;
  - amb `telefon: null` no surt cap `tel:`;
  - amb `google_maps_url: null` surt la cerca d'arq. §8.
- [x] **B-19** · Crear `src/components/Seo.astro` (arq. §6.6, §7.1-§7.2):
  - title, description, canonical i `hreflang` (també entre les pàgines legals);
  - OG amb `og.jpg`, o sense `og:image` si el fitxer no existeix, amb avís;
  - Twitter, `meta referrer`, i `noindex` a la 404 i a les pàgines legals en mode demostració.

  Totes les URL absolutes, a partir de `<web>` = `https://maaltas.github.io/bistrot1954/`. Verificació: S-01, S-02, S-03 i S-08 d'arq. §11.
- [x] **B-20** · Generar el JSON-LD `Restaurant` a `src/lib/seo.ts` + `src/components/JsonLd.astro` (arq. §7.3): sense claus nul·les i amb `<` escapat. Verificació: S-04; el JSON-LD de `/` és idèntic a l'exemple d'arq. §7.3 (URL `https://maaltas.github.io/bistrot1954/`), tant en el build local com en el de publicació.
- [x] **B-21** · Crear `src/pages/robots.txt.ts` i el filtre del sitemap, que exclou la 404 i les pàgines legals en mode demostració (arq. §7.4). Verificació: S-05.
- [x] **B-22** · Autoallotjar les tipografies amb l'API de tipografies d'Astro (arq. §6.7): Alegreya 400 i 700 i Alegreya Sans 500. Verificació: 0 peticions a `fonts.googleapis.com` o `fonts.gstatic.com`; ≤ 3 fitxers WOFF2 i ≤ 120 KB.
  - Nota: Fet: 2 fitxers WOFF2 (60 KB en total) amb el proveïdor Google d'Astro (cal xarxa durant el build); 0 peticions a tercers.

- [x] **B-23** · Avís legal (arq. §4.3.3, §5.4):
  - textos a `src/i18n/legal.ts`;
  - pàgines `src/pages/avis-legal.astro` i `src/pages/es/aviso-legal.astro`, amb marcatge mínim (l'aspecte el defineix F-20);
  - dades d'`avis_legal` dins de `[data-dada-ficticia]` + "(dada fictícia)", i el correu sense `mailto:`;
  - el paràgraf de GoatCounter només si hi ha codi;
  - enllaç des del peu de `/` i `/es/`.

  Verificació: C-10 d'arq. §11.
- [x] **B-24** · CSP i metes de seguretat (arq. §10.3, §9.6). No crear `public/CNAME`, `public/_headers` ni `wrangler.jsonc`. Verificació: P-05; no existeix `dist/CNAME`; 0 avisos de CSP a la consola (P-03).
- [ ] **B-25** · Deixar les estadístiques preparades i desactivades (arq. §10.6):
  - `public/js/count.js`, còpia de `https://gc.zgo.at/count.js`, amb la data i l'origen anotats al README;
  - `src/components/Estadistiques.astro`;
  - l'excepció de la CSP.

  Tot, condicionat a build de publicació + codi. Verificació:
  - build local → cap `goatcounter` a `dist/**/*.html`;
  - build de publicació amb el codi temporal `prova` (es desfà) → l'script a `/`, amb `src="/bistrot1954/js/count.js"`, `data-goatcounter="https://prova.goatcounter.com/count"` i `connect-src` amb aquest domini;
  - amb `null` → res.
  - **Parcial (no marcada):** el component, l'excepció de la CSP i la condició (publicació + codi) estan fets i verificats (build amb codi `prova` → script amb `src="/bistrot1954/js/count.js"`, `data-goatcounter` i `connect-src`; amb `null` o en local → res). **Falta `public/js/count.js`:** és un script de tercers (`https://gc.zgo.at/count.js`) i no l'he baixat sense permís explícit (D-17). Mentre no existeixi, no s'ha d'activar GoatCounter.

- [x] **B-26** · Crear `.github/workflows/publica.yml` segons arq. §9.2. No crear cap repositori remot ni fer cap `push`. Verificació: T-06 d'arq. §11.
- [x] **B-27** · Escriure `scripts/pendents.mjs` (arq. §3.6, §6.1). Ha de llistar:
  - posts sense classificar, amb el caption i el bloc YAML per enganxar;
  - plats sense foto;
  - fitxers mal anomenats, en HEIC o de menys de 400 px.

  Verificació: amb una entrada de prova a `plats.json` (que després es desfà), la llista amb el bloc YAML.
- [x] **B-28** · Preparar la infraestructura de QA (arq. §2.3, §5.1, §11):
  - `vitest.config.ts`, amb `getViteConfig()`;
  - `playwright.config.ts`, amb `testDir: 'tests/qa'`, `webServer` = `npm run preview` amb `url: 'http://localhost:4321/bistrot1954/'` i `use.baseURL: 'http://localhost:4321/bistrot1954/'`;
  - `npx playwright install chromium`, documentat. Verificació: `npx playwright test --list` s'executa sense errors.
  - Nota: Fet: `npx playwright test --list` funciona (hi ha una prova mínima a `tests/qa/arrencada.spec.ts`). `npx playwright install chromium` NO s'ha executat (baixada d'uns 150 MB): ho ha de fer el QA, o fer servir `channel: 'msedge'` (Edge és a l'equip).

- [x] **B-29** · Escriure `README.md`, que ha d'explicar:
  - requisits i PATH de Node a Windows (arq. §2.3);
  - arrencada en local;
  - com afegir un plat, amb el criteri de les captures (arq. §3.6, §6.1);
  - `npm run og` (arq. §6.6);
  - publicar (arq. §9.4-§9.5), indicant que està bloquejat fins que l'Oriol ho digui;
  - tornar enrere (arq. §9.7);
  - activar les estadístiques (arq. §10.6).

  Ha de dir clarament que en local la web és a `http://localhost:4321/bistrot1954/` i que, publicada, serà a `https://maaltas.github.io/bistrot1954/`. Verificació: seguint-lo des de zero en una PowerShell nova, la web arrenca a `http://localhost:4321/bistrot1954/`.
  - Nota: Fet: `README.md`. L'activació de GoatCounter inclou baixar `count.js` a mà (vegeu B-25).

- [x] **B-33** · **Migrar a Astro 7.4.x (D-16).** Es fa abans de tancar B-30; el número no segueix l'ordre perquè s'ha afegit després. Passos (arq. §2.1, §2.4, §5.3, §10.4):
  1. `astro` a `^7.4.10`; `@astrojs/sitemap`, `@astrojs/check` i Vitest a versions compatibles amb Astro 7 i Vite 8 (Vitest `^5`).
  2. `engines.node` a `>=22.23.4`.
  3. `compressHTML: true` a `astro.config.mjs`.
  4. Si Astro 7 ja té estables les API de tipografies o de CSP, fer servir la forma estable.
  5. Corregir els errors del compilador en Rust (etiquetes sense tancar, imbricació invàlida), si n'hi ha.
  6. Treure l'`override` de `sharp` si `npm audit` passa sense ell.
  7. Comprovar que no hi ha cap ús d'APIs eliminades a la v7.

  No tocar res més.

  Verificació:
  - `npm ci`, `npm test` i `npm run build` en verd, i build sense avisos `[contingut]`;
  - `npm audit --omit=dev` amb 0 altes i crítiques (P-07); només s'accepta la baixa d'`esbuild`, si encara hi és, com a observació;
  - la sortida no canvia respecte de la versió 6: tornen a passar els criteris C-01 a C-10, T-04, T-05, T-07, R-08, R-09, P-05 i S-01 a S-08, i els textos de `[data-historia]` i dels botons conserven els espais.
  - Nota (fet 2026-11-10): `astro@7.4.10` amb Vite 8.3.7 i Vitest 5.1.0 (cap altre canvi de versió: `@astrojs/sitemap` 3.7.4 i `@astrojs/check` 0.9.12 ja eren compatibles). `engines.node` a `>=22.23.4`, `compressHTML: true` explícit i `override` de `sharp` tret. No ha calgut tocar cap `.astro`: el compilador nou no s'ha queixat de cap HTML, i les API de tipografies i CSP ja eren les estables. `npm audit --omit=dev`: **0 vulnerabilitats** (també ha desaparegut la baixa d'`esbuild`). Build, `astro check` (0/0/0), 140 tests, `html-validate` i els meus checks sobre `dist/` en verd. El `<body>` de les 5 pàgines és idèntic al de la versió 6 (només canvien els identificadors d'àmbit del CSS, l'ordre de les declaracions CSS minificades i un hash d'estil menys a la CSP); els espais de "Veure la publicació a Instagram" i del telèfon es conserven. A 375 i 1280 px es compleixen els mateixos criteris visuals que abans.

- [x] **B-30** · Comprovar els criteris d'arq. §11 (T, C, R, P, S, A) en el build local i, els marcats "publicació", en un build de publicació, abans de passar al QA. **Cal tornar-ho a mesurar després de B-33.** Anotar en aquesta tasca les puntuacions de Lighthouse i els pesos. Verificació: tots els criteris aplicables es compleixen.
  - **Fet (re-mesurat després de B-33, 2026-11-10):** tots els criteris locals aplicables es compleixen, també P-07 (`npm audit --omit=dev`: 0 vulnerabilitats; `astro` 7.4.10). Lighthouse mòbil amb Edge, build local, `/` i `/es/`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,8 s, CLS 0, TBT 0 ms; càrrega inicial 190 KiB. Pesos: HTML 27 KB, CSS 11,7 KB (2 fitxers), JS 0, tipografies 60 KB (2 fitxers), imatge més gran 43 KB, `og.jpg` 37 KB. S-06 (`html-validate`): 0 errors, amb la regla `tel-non-breaking` desactivada a `.htmlvalidate.json` (D-18). Build sense cap avís `[contingut]`. Build de publicació (`CI=true`): canonical, `hreflang`, OG i JSON-LD amb `https://maaltas.github.io/bistrot1954/`, sense avís `[entorn]` i amb l'avís esperat de l'avís legal de demostració; sense GoatCounter si el codi és `null`. Els criteris "publicació" que depenen d'estar en línia (T-05 a producció, P-01, P-02 i P-08 en producció, S-01 a S-05 en producció) queden per a B-31.

- [x] **B-34** · **Redisseny P3 (D-19): paquets de `genera-og.mjs`.** Feina, segons arq. §2.1 i §6.6:
  - a `devDependencies`, substituir `@fontsource/alegreya` i `@fontsource/alegreya-sans` per `@fontsource/eb-garamond` i `@fontsource/jost`;
  - fer que `scripts/genera-og.mjs` carregui els fitxers locals d'EB Garamond 400 cursiva i Jost 500, sense xarxa.

  La plantilla visual i la regeneració d'`og.jpg` són de F-42. Es fa abans de F-42 o juntament amb ella. Verificació:
  - `npm ci` i `npm run og` funcionen sense cap petició de xarxa;
  - `package.json` ja no menciona Alegreya;
  - `public/og.jpg` fa 1200×630 px i ≤ 150 KB (R-07).
  - Nota: Fet: `@fontsource/eb-garamond` i `@fontsource/jost` en lloc dels d'Alegreya; `genera-og.mjs` carrega EB Garamond 400 cursiva i Jost 500 dels fitxers locals. `npm run og` sense xarxa: `og.jpg` 1200×630 i 33 KB.
- [x] **B-35** · **Redisseny P3 (D-19): tornar a verificar els criteris tècnics que canvien.** Es fa després de F-24 a F-44. Criteris, a `http://localhost:4321/bistrot1954/`:
  - T-08: sense `/propostes/` ni famílies tipogràfiques de més;
  - R-06b: tipografies ≤ 3 fitxers i ≤ 150 KB; entre 120 i 150 KB és una observació (arq. §6.7);
  - R-09: `sizes` = `(min-width: 900px) 338px, 293px`, i cap imatge més ampla que el fitxer de `currentSrc`;
  - R-06, R-07, R-08, P-05 (els hashes de la CSP canviaran amb el CSS nou) i C-01 a C-10.

  Anotar en aquesta tasca les puntuacions de Lighthouse i els pesos nous, com es va fer a B-30. Verificació: tots aquests criteris es compleixen, sense cap avís `[contingut]` ni `[entorn]`.
  - Nota: Fet (2026-11-11, build local): T-08 (cap `dist/propostes/`, només EB Garamond i Jost), R-06b (3 fitxers, 59,7 KB; sota l'objectiu de 120 KB), R-07 (imatge més gran 43 KB, `og.jpg` 33 KB), R-08 i R-09 (`sizes` = `(min-width: 900px) 338px, 293px`, `srcset` amb 360w i l'ample real, cap imatge més ampla que el fitxer), P-05 (CSP nova, sense `unsafe-inline` ni `frame-ancestors`), C-01 a C-10, S-01 a S-08, T-07 i P-04, amb els meus checks sobre `dist/`. `html-validate`: 0 errors. `npm audit --omit=dev`: 0 vulnerabilitats. Lighthouse mòbil amb Edge, `/` i `/es/`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 0,9 s, CLS 0, TBT 0 ms; càrrega inicial 245 KiB. Pesos: HTML 27 KB, CSS 11,3 KB (2 fitxers), JS 0. Cap avís `[contingut]` ni `[entorn]`; el build de publicació (`CI=true`) només avisa de l'avís legal de demostració.
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
- [x] **B-36** · **Regla de l'Oriol (2026-11-11): treure el nom del plat a l'inici de la història (N8).** Feina (arq. §3.3, "Nom del plat a l'inici de la història"):
  - implementar `treuNomInicial(paragrafs, nom, lang)` a `src/lib/neteja.ts`, com a funció pura, amb:
    - comparació sense majúscules i amb la normalització de §3.2;
    - només separadors forts: final de línia, `. : ; ! ? …` o un guió amb espais (ni espai ni coma);
    - eliminació de la línia o del paràgraf buits;
    - majúscula de la primera lletra només si s'ha tret el nom;
    - `[]` si no queda res.
  - cridar-la des de `src/lib/contingut.ts` després d'`assignaIdiomes()`, per a cada idioma amb el seu `nom` (o `nom.ca` si l'idioma no en té) i abans del fallback P2. Una història que queda buida passa a `null` (P1).

  Verificació:
  - els casos E16-E23 d'arq. §3.4.4 passen;
  - els casos E1-E15 continuen passant.
  - Nota: Fet: `treuNomInicial(paragrafs, nom, lang)` a `src/lib/neteja.ts` (funció pura, sense mutar l'entrada), cridada des de `contingut.ts` després d'`assignaIdiomes()` i abans del fallback P2, amb `nom.es ?? nom.ca` per a l'idioma castellà. E16-E23 i E1-E15 passen.
- [x] **B-37** · **Fixture i tests de N8** (arq. §3.4.3, §3.5). Feina:
  - substituir `tests/fixtures/historia-esperada.json` copiant **literalment** la versió 2026-11-11 d'arq. §3.4.3; canvien plat-01, 02, 06 i 08;
  - fer que els tests per plat real comparin la cadena sencera (N1-N8, amb els noms de `seleccio.yaml`, p. ex. via `getPlats()`) amb la fixture;
  - adaptar l'invariant de paraules perquè la primera paraula de la història no distingeixi la caixa de la primera lletra (§3.5.2);
  - afegir la comprovació "la història no comença pel nom" (§3.5.4).

  Verificació: `npm test` en verd; a `getPlats()`:
  - plat-01 (ca) comença per "Pasta que s'acaba a la paella";
  - plat-02 (ca) comença per "Dolç, untuós";
  - plat-03 (ca) continua començant per "El pastís de formatge".
  - Nota: Fet: `tests/fixtures/historia-esperada.json` copiada literalment d'arq. §3.4.3 (versió 2026-11-11); tests per plat real amb N1-N8 i els noms de `seleccio.yaml`; invariant de paraules amb la primera lletra sense distingir la caixa; comprovació "no comença pel nom". A `getPlats()`: plat-01 (ca) comença per "Pasta que s'acaba a la paella", plat-02 per "Dolç, untuós" i plat-03 per "El pastís de formatge". 167 tests en verd.
- [ ] **B-38** · **Comprovar i publicar la regla N8 i la retirada de l'enllaç al post** (arq. §4.4, §4.5, §9.5). Es fa després de B-36, de B-37 i de les tasques de Frontend que treuen l'enllaç del component.
  - `Plat.urlPost` es conserva al model i a `getPlats()` (no s'esborra del codi ni de `plats.json`), però cap component el renderitza.
  - El JSON-LD no canvia: mai no ha inclòs URL de posts.

  Verificació, en local (`http://localhost:4321/bistrot1954/` i `…/es/`) i, un cop publicat (`npm run comprova` + `git push`), a `https://maaltas.github.io/bistrot1954/`:
  - C-01 a C-11 i T-07;
  - S-04 sense canvis;
  - build sense avisos `[contingut]`.
  - **Verificat, pendent de publicar (no marcada: no s'ha fet cap `git push`).** En local, `npm run comprova` en verd (167 tests, 0 errors a `astro check`, cap avís `[contingut]` ni `[entorn]`), `html-validate` 0 errors, `npm audit --omit=dev` 0 vulnerabilitats i els checks sobre `dist/` en verd: C-01 a C-11 (C-07: cap `<a>` dins dels articles i l'únic enllaç a Instagram és el del perfil; C-11: les històries són les de la fixture i cap comença pel nom), T-07 i S-04 (el JSON-LD no canvia i no porta URL de posts). El build de publicació (`CI=true`) només avisa de l'avís legal de demostració. Falta fer `git push` i comprovar-ho a `https://maaltas.github.io/bistrot1954/`.
## Frontend

Definides a `docs/disseny-frontend.md` (abreujat "dis."). Es fan després de B-16 (les pàgines ja renderitzen els plats amb els ganxos d'arq. §4.5). Els criteris V-xx són a dis. §10. Les tasques F-12, F-20 i F-22 depenen de D-11 a `docs/dubtes.md`: mentrestant s'aplica el que diu el disseny.

> **2026-11-11 · Redisseny P3.** F-01 a F-23 implementen "Pisa blava" (dis. versió 1) i estan fetes. `docs/disseny-frontend.md` versió 2 ("La carta") les substitueix totalment o en part. Cada tasca porta una nota "Redisseny P3" que ho indica: si diu *substituïda*, la tasca de la subsecció "Redisseny P3" que es cita la torna a fer amb el disseny nou; si diu *vigent*, continua valent tal com està. No es desmarquen.

- [x] **F-01** · *Redisseny P3: substituïda per F-25.* · Crear `src/styles/tokens.css` amb tots els tokens de dis. §5: colors (§5.1), famílies, mides i interlineats (§5.2), espaiat, mides de maquetació i radis (§5.3), l'ombra de la barra (§5.4) i els breakpoints (§5.5). Verificació: cada token de dis. §5 hi és amb el valor exacte, i cap altre fitxer CSS conté colors en hex.
- [x] **F-02** · *Redisseny P3: substituïda per F-26.* · Aplicar les tipografies (juntament amb B-22): Alegreya 400 i 700, Alegreya Sans 500, reserves Georgia / `system-ui`, `preload` només de l'Alegreya 400, i les regles de xifres (antigues a la marca; de caixa alta i tabulars a l'adreça, l'horari i el telèfon) (dis. §5.2). Verificació: V-15; a la pàgina, "1954" de l'`h1` es veu amb xifres d'estil antic.
- [x] **F-03** · *Redisseny P3: substituïda per F-27.* · Estils base a `src/styles/global.css`: fons porcellana, text tinta, enllaços subratllats, anell de focus (cobalt sobre porcellana, porcellana sobre cobalt), selecció de text, classe de text només per a lectors de pantalla, `color-scheme: light`, `hover` només amb `hover: hover` i les regles de `prefers-reduced-motion` (dis. §5, §7). Verificació: en una pàgina de prova, Tab mostra l'anell sobre tots dos fons; V-16 i V-21.
- [x] **F-04** · *Redisseny P3: vigent (els textos i el format de l'horari no canvien, dis. §9).* · Afegir a `src/i18n/textos.ts` tots els textos de dis. §9.2 en català i castellà, i la funció que formata l'horari (dis. §9.3) i el telèfon visible (dis. §8). Verificació: test unitari en què l'horari d'avui dona exactament "De dilluns a dissabte, de 20:00 a 23:00" i "De lunes a sábado, de 20:00 a 23:00", i el telèfon "936 27 35 36" amb enllaç `tel:+34936273536`.
- [x] **F-05** · *Redisseny P3: vigent; F-27 i F-32 en canvien els marges de desplaçament.* · Estructura de `Base.astro`: enllaç "Vés als plats" com a primer element enfocable, regions `header` / `main` / `footer`, un sol `h1`, i els marges de desplaçament d'àncores i de focus (dis. §2, §4.2, §7). Verificació: V-19; l'HTML té un sol `h1` per pàgina.
- [x] **F-06** · *Redisseny P3: comportament vigent; l'aspecte, substituït per F-28.* · Barra d'accions inferior (< 900 px): "Com arribar" (secundari) i "Trucar" (principal, a la dreta), àrea segura inferior, espai al final de la pàgina, i barra no fixa quan l'alçada és < 480 px (dis. §3.1, §8). Verificació: V-02, V-04 i V-22.
- [x] **F-07** · *Redisseny P3: comportament vigent; l'aspecte, substituït per F-29.* · Barra superior fixa (≥ 900 px): "Plats", "On som", selector d'idioma, "Com arribar" i "Trucar al 936 27 35 36" (dis. §3.1, §8). Verificació: V-03 i V-09.
- [x] **F-08** · *Redisseny P3: vigent (destins, `lang` i `hreflang`); l'estil el fan F-29, F-30, F-37 i F-40.* · Selector d'idioma a l'obertura (mòbil), a la barra superior, al peu i a l'avís legal, cap a la pàgina equivalent de l'altre idioma, amb `lang` i `hreflang` (dis. §8, §9.2). Verificació: V-07, i a `/avis-legal/` porta a `/es/aviso-legal/`.
- [x] **F-09** · *Redisseny P3: substituïda per F-30.* · Obertura (`#inici`): fons cobalt, `h1` "Bistrot 1954" amb `--mida-marca`, tipus de cuina, adreça i horari des de `restaurant.yaml`, i a continuació el `div[data-presentacio]` (B-15) amb l'estil de les històries en porcellana, 24 px per sobre; a ≥ 900 px, dades a la columna de 400 px i presentació a la columna de text dels plats (dis. §3.2, D-15). Verificació: V-05, V-06 (obertura) i V-30.
- [x] **F-10** · *Redisseny P3: substituïda per F-31.* · Capçalera de la secció de plats (`#plats`): `h2` "Els plats" / "Los platos" i la frase d'introducció en acer (dis. §3.3, §9.2). Verificació: els textos coincideixen literalment amb dis. §9.2 a `/` i `/es/`.
- [x] **F-11** · *Redisseny P3: substituïda per F-32 (l'ordre al DOM i el nom per a lectors de pantalla continuen vigents).* · Article de plat amb foto: ordre al DOM (nom, foto, història, enllaç), graella de dis. §4.2 per a cada breakpoint, estils de nom, història i enllaç, i el nom del plat al text de l'enllaç només per a lectors de pantalla (dis. §4.1, §4.2, §4.7, §4.8). Verificació: V-08 i V-14; els 8 enllaços tenen noms accessibles diferents.
- [x] **F-12** · *Redisseny P3: substituïda per F-33 (el `srcset` amb l'ample real continua vigent).* · Finestra de la foto 5:7 ancorada a dalt a l'esquerra (opció A de dis. §6.2), sobre `ImatgePlat.astro` (B-14): `srcset` amb la variant a l'ample real de la font, `sizes` de dis. §6.3, fons aigualit mentre carrega. Si D-11 es resol amb l'opció B, s'adapta. Verificació: V-10, V-11 i V-12; R-08 d'arq. §11 continua complint-se.
- [x] **F-13** · *Redisseny P3: substituïda per F-34.* · Variant sense foto: el `h3` com a bloc cobalt (dis. §4.3) i l'enllaç "Veure la foto a Instagram". Verificació: V-24 amb un build temporal sense una foto (que no es versiona).
- [x] **F-14** · *Redisseny P3: comportament vigent; F-34 en revisa l'aspecte.* · Variant sense història: sense `[data-historia]` i amb l'enllaç just després del nom (dis. §4.4). Verificació: V-25.
- [x] **F-15** · *Redisseny P3: substituïda per F-35 (desapareix la foto fixa).* · Història llarga: sense cap retall, partició de paraules llargues i foto fixa a 96 px a ≥ 900 px (dis. §4.5). Verificació: V-26 amb el cas E9.
- [x] **F-16** · *Redisseny P3: substituïda per F-36.* · Secció "On som" (`#on-som`): fons cobalt, adreça gran, "Com arribar", `h3` "Horari" amb l'horari formatat, `h3` "Telèfon" amb el número i "Trucar"; dues columnes a ≥ 900 px (dis. §3.4, §8, §9.3). Verificació: V-06 (on som) i V-04.
- [x] **F-17** · *Redisseny P3: substituïda per F-37.* · Peu: nom, "@bistrot1954 a Instagram", "Avís legal i privacitat", selector d'idioma, línia superior porcellana al 30 % (dis. §3.5). Verificació: els quatre enllaços hi són a `/` i `/es/` i fan ≥ 44 px d'alt al mòbil.
- [x] **F-18** · *Redisseny P3: substituïda per F-38.* · Estats dels botons i enllaços (repòs, `hover`, `focus-visible`, `active`) per als quatre tipus de botó i els enllaços (dis. §7). Verificació: V-18, V-20 i V-21.
- [x] **F-19** · *Redisseny P3: substituïda per F-39 (els enllaços absoluts continuen vigents).* · Pàgina 404 bilingüe amb enllaços absoluts a `/` i `/es/` (dis. §3.6). Verificació: V-28.
- [x] **F-20** · *Redisseny P3: substituïda per F-40 (les marques de dada fictícia continuen vigents).* · Layout de l'avís legal i privacitat de demostració a `/avis-legal/` i `/es/aviso-legal/`: avís de demostració a dalt i "(dada fictícia)" al costat de cada dada inventada (dis. §3.7, §9.2). Les dades i les rutes les fixa l'arquitecte (D-11, punt 8). Verificació: V-27.
- [x] **F-21** · *Redisseny P3: substituïda per F-41.* · Icones: `public/favicon.svg` i `public/apple-touch-icon.png` amb el plat geomètric de dis. §6.5. Verificació: cap 404 a la consola (P-03 d'arq. §11) i, a la pestanya del navegador, es veu el cercle cobalt amb l'anell.
- [x] **F-22** · *Redisseny P3: substituïda per F-42.* · Imatge per compartir tipogràfica `public/og.jpg` de 1200×630 px (dis. §6.4) i `og:image` apuntant-hi (D-11, punt 3). Verificació: el fitxer fa 1200×630 i ≤ 150 KB; `og:image`, `og:image:width`, `og:image:height` i `og:image:alt` hi apunten a `/` i `/es/`.
- [x] **F-23** · *Redisseny P3: substituïda per F-44.* · Revisió visual final a 320, 375, 768 i 1280 px de totes les pàgines, amb captures a `tests/captures/` (dis. §10). Verificació: es compleixen V-01 a V-30; les captures coincideixen amb els wireframes de dis. §3.
  - Nota: Fet: comprovacions automàtiques amb Edge a 320, 375, 768 i 1280 px (V-01, V-02/03, V-05, V-07 a V-11, V-14, V-16 a V-22, V-30), totes OK; captures a `tests/captures/` (no versionades). Els layouts sense foto, sense història i amb història llarga s'han provat amb un build temporal (revertit). V-23 i V-26 (espaiat de text WCAG, E9 al DOM) i axe els acaba el QA.

### Redisseny P3

Porten la web de `main` ("Pisa blava") a "La carta" (dis. versió 2) en totes les pàgines (portada, avís legal i 404) i en tots dos idiomes. S'han de fer en ordre, sobre `main`.

- La maqueta `src/propostes/p3.css` de la branca `propostes-disseny` és una referència i se'n pot copiar el que dis. dona per bo, però **cap fitxer de `src/propostes/` ni de `src/pages/propostes/` passa a la web final**.
- Les tasques F-26, F-33 i F-42 depenen de D-19 a `docs/dubtes.md`. Mentrestant s'aplica el que diu el disseny.
- Els criteris V-xx són els de dis. §10 versió 2. Els tests de `tests/qa/` que comproven valors de "Pisa blava" els ha d'actualitzar el QA, no el programador.

- [x] **F-24** · Preparar la feina sobre `main`, sense portar res de `src/propostes/` ni de `src/pages/propostes/`. Si es fusiona la branca `propostes-disseny`, esborrar aquestes dues carpetes i les famílies tipogràfiques de les propostes P1, P2, P4 i P5 a `astro.config.mjs` (dis. §11, supòsit 7). Verificació: V-32 (després de `npm run build`, no existeix `dist/propostes/`).
  - Nota: Fet: treballat sobre `main`, que mai ha tingut `src/propostes/`, `src/pages/propostes/` ni les famílies de les maquetes (només es va copiar el que dona per bo el disseny). `dist/propostes/` no existeix (V-32).
- [x] **F-25** · Reescriure `src/styles/tokens.css` amb els tokens de dis. §5:
  - colors (§5.1);
  - escala tipogràfica i interlineats (§5.2);
  - espaiat, mides, filets i radis (§5.3);
  - breakpoints (§5.5).

  Treure tots els tokens de "Pisa blava" i l'ombra de la barra. Verificació: cada token de dis. §5 hi és amb el valor exacte; cap altre fitxer CSS conté colors en hex; la cerca de `--cobalt`, `--porcellana`, `--aigualit`, `--acer` i `--ombra-barra` a `src/` no troba res.
- [x] **F-26** · Tipografies (dis. §5.2; D-19, punt 2):
  - a `astro.config.mjs`, EB Garamond 400 `normal` i `italic` i Jost 500, en lloc d'Alegreya i Alegreya Sans;
  - `preload` només de l'EB Garamond 400 normal;
  - reserves Georgia / `system-ui`;
  - `font-synthesis: none`;
  - xifres de caixa alta a l'adreça d'"On som".

  Verificació: V-15 i V-16.
  - Nota: Fet: 3 fitxers WOFF2, 59,7 KB en total (≤ 120 KB). `preload` només de l'EB Garamond 400 normal; `font-synthesis: none`.
- [x] **F-27** · Estils base a `src/styles/global.css` (dis. §5.1, §7):
  - fons paper i text tinta;
  - centrat per defecte a la portada i a la 404, però no a l'avís legal;
  - enllaços vi subratllats;
  - anell de focus vi de 3 px a 3 px;
  - selecció vi/paper;
  - marges de desplaçament (16/88 px a < 900, 88/16 px a ≥ 900);
  - `prefers-reduced-motion`.

  Verificació: V-18 i V-21; la cerca de la classe `sobre-cobalt` a `src/` no troba res.
- [x] **F-28** · `BarraInferior.astro` (dis. §3.1): fons paper, filet doble or a dalt, sense ombra, botons de 48 px amb radi 0, "Com arribar" secundari a l'esquerra i "Trucar" principal a la dreta. Es mantenen el comportament amb alçada < 480 px i l'espai reservat al peu. Verificació: V-02, V-22 i V-31 (barra).
- [x] **F-29** · `BarraSuperior.astro` (dis. §3.1, §3.7):
  - fons paper de 64 px amb filet doble or a baix i contenidor de 68rem;
  - "Plats" i "On som" sense subratllar;
  - selector, "Com arribar" i "Trucar al 936 27 35 36" a 44 px;
  - a les pàgines legals, "Bistrot 1954" en cursiva a l'esquerra, i a < 900 px, la franja de 56 px no fixa amb filet doble.

  Verificació: V-03 i V-31 (barra superior); a `/avis-legal/` a 375 px es veu la franja amb el nom i "Castellano".
- [x] **F-30** · `Obertura.astro` (dis. §3.2):
  - ordre selector → `h1` → filet doble → cuina → presentació → horari → adreça → filet doble;
  - mides de dis. §5.2;
  - a ≥ 900 px, horari i adreça en una línia amb filet vertical doble i la coma visible només aquí.

  Verificació: V-05, V-06 (obertura), V-07, V-30 i V-29 (ordre de l'obertura).
- [x] **F-31** · Capçalera de `#plats` (dis. §3.3): `h2` en cursiva vi amb filets senzills or de 48 px a cada costat, i la frase d'introducció en Jost fum. Verificació: els textos coincideixen amb dis. §9.2 a `/` i `/es/`; els filets del `h2` fan 1 px (V-31).
- [x] **F-32** · `Plat.astro` amb foto (dis. §4.1, §4.2):
  - ordre visual foto → nom → història → enllaç, sense canviar l'ordre del DOM;
  - tot centrat, amb els estils de nom, història (0,6 em entre paràgrafs) i enllaç;
  - al mòbil, separadors de 56 + 1 + 56 px;
  - a ≥ 900 px, graella de 2 columnes de 480 px amb filet vertical doble a l'esquerra dels plats parells;
  - marge de l'àncora de 16/88 px, **traient l'ajust de −72 px de D-18, punt 1**.

  Verificació: V-08, V-09 i V-14.
  - Nota: Fet: s'ha tret l'ajust de −72 px de D-18 (punt 1); el nom de plat-05 queda visible a 375×667 sense cap ajust (V-09).
- [x] **F-33** · Finestra rodona de la foto (dis. §6.2, §6.3; D-19, punt 1):
  - cercle de 260/300 px amb fons vi clar;
  - `img` al 112,5 % amb un marge superior del −25 %;
  - `sizes` = `(min-width: 900px) 338px, 293px`;
  - `widths` sense canvis.

  Verificació: V-10, V-11 i V-12; R-08 d'arq. §11 continua complint-se.
- [x] **F-34** · Variants sense foto i sense història (dis. §4.3, §4.4): sense cap cercle buit, amb el nom sense marge superior i "Veure la foto a Instagram". Verificació: V-24 i V-25, amb un build temporal que no es versiona.
- [x] **F-35** · Història llarga (dis. §4.5): alineada a l'esquerra quan fa més de 500 caràcters (classe decidida pel component a partir del text), sense cap retall i amb `overflow-wrap: anywhere`. Treure la foto fixa de la versió 1. Verificació: V-26 amb E9, i un test unitari en què 500 caràcters donen una història centrada i 501, alineada a l'esquerra.
  - Nota: Fet: `src/lib/historia.ts` (`historiaEsLlarga`, llindar de 500 caràcters, sumant totes les línies) amb test unitari (500 → centrada, 501 → esquerra). Amb E9 comprovat en un build temporal (revertit).
- [x] **F-36** · `OnSom.astro` (dis. §3.4):
  - fons vi clar;
  - una columna centrada de 36rem;
  - `h2` amb filets, adreça en EB Garamond amb xifres de caixa alta, "Com arribar", `h3` "Horari" i "Telèfon", número en Jost 22 i "Trucar" / "Trucar al 936 27 35 36";
  - el `hover` del secundari amb fons paper.

  Verificació: V-04 i V-06 (on som); comprovació manual del `hover`.
- [x] **F-37** · `Peu.astro` (dis. §3.5): filet doble de 160 px, nom en cursiva vi, enllaços subratllats (un per línia a < 900 px i en una fila a ≥ 900 px) i l'espai de la barra inferior. Verificació: els tres enllaços hi són a `/` i `/es/`, fan ≥ 44 px d'alt i a 1280 px estan a la mateixa altura (±2 px).
- [x] **F-38** · Estats dels botons i enllaços (dis. §7), inclòs el secundari sobre vi clar, sense el desplaçament d'1 px en prémer. Verificació: V-18, V-20 i V-21.
- [x] **F-39** · Pàgina 404 (dis. §3.6): centrada, sense barres, amb els dos missatges, filets i enllaços absoluts. Verificació: V-28.
- [x] **F-40** · `Legal.astro` (dis. §3.7):
  - capçalera de F-29;
  - `h1` centrat amb filet doble;
  - avís de demostració amb fons vi clar i vora vi d'1 px;
  - cos de 36rem alineat a l'esquerra, amb les etiquetes en Jost fum i els valors en EB Garamond;
  - peu i barra inferior.

  Verificació: V-27, en tots dos idiomes.
- [x] **F-41** · Icones (dis. §6.5): canviar els colors de `scripts/genera-icones.mjs` (vi i paper) i regenerar `public/favicon.svg` i `public/apple-touch-icon.png`. Verificació: V-33 (icones) i P-03 d'arq. §11 (cap 404 a la consola).
- [x] **F-42** · Imatge per compartir (dis. §6.4; D-19, punt 3): adaptar la plantilla de `scripts/genera-og.mjs` (paper, EB Garamond cursiva i Jost) i regenerar `public/og.jpg`. Verificació: V-33 (`og.jpg`); `og:image` i les metadades no canvien.
- [x] **F-43** · Neteja de "Pisa blava": treure CSS, classes, comentaris i dependències que ja no es facin servir (per exemple `@fontsource/alegreya*`, si D-19 ho confirma). Verificació: la cerca de `cobalt`, `porcellana`, `aigualit` i `Alegreya` a `src/` i `scripts/` no troba res; `npm run comprova` acaba sense errors.
- [x] **F-44** · Revisió visual final de "La carta" a 320, 375, 768 i 1280 px: portada, avís legal i 404, en català i en castellà, amb captures a `tests/captures/` (dis. §10). Verificació: es compleixen V-01 a V-33; les captures coincideixen amb els wireframes de dis. §3.
  - Nota: Fet: comprovacions automàtiques amb Edge a 320, 375, 768 i 1280 px a `/`, `/es/`, `/avis-legal/`, `/es/aviso-legal/` i la 404, amb V-01 a V-10, V-14 a V-22 i V-27 a V-31 en verd, i captures a `tests/captures/` (no versionades). Les variants sense foto, sense història i història llarga (V-24 a V-26) s'han provat amb un build temporal revertit. V-12 (fletxa i punts fora dels cercles) es compleix per construcció (retall 0-88,9 % × 16,7-83,3 %) i s'ha revisat a les captures; V-23 i axe queden per al QA.

#### Canvis 2026-11-11

Canvis de l'Oriol a la secció de plats, amb la web ja publicada (dis. versió 2.1). S'han de fer en ordre. F-47 depèn de D-20 a `docs/dubtes.md`: l'arquitectura encara demana l'enllaç al post a cada plat. Mentrestant s'aplica el disseny. La història sense el nom repetit és feina de l'arquitecte i del backend (dis. §4.8): aquí només es comprova a F-49.

- [x] **F-45** · Textos de la secció de plats a `src/i18n/textos.ts` (dis. §9.2):
  - títol: "Els nostres plats" / "Nuestros platos";
  - subtítol: "Un recull de l'experiència que et trobaràs." / "Una muestra de la experiencia que te encontrarás.";
  - treure les claus `enllacPlat` i `enllacPlatSenseFoto`;
  - l'enllaç de la barra superior continua dient "Plats" / "Platos".

  Verificació: V-35 (textos), i la cerca de `enllacPlat` a `src/` no troba res.
  - Nota: Fet: textos a `src/i18n/textos.ts`, sense les claus `enllacPlat` i `enllacPlatSenseFoto`; la barra superior continua dient Plats / Platos. Test unitari (V-35, textos).
- [x] **F-46** · Filet dels `h2` a < 600 px (dis. §3.3, §3.4): a "Els nostres plats" i "On som", el filet senzill de 48 px va a sota del títol (12 px), centrat, en lloc dels costats; a ≥ 600 px no canvia. Verificació: V-35 (filet i cap scroll horitzontal a 320 i 375 px), V-01 i V-31.
  - Nota: Fet: `.titol-filets` a `global.css`. A < 600 px, el filet va sota el títol (12 px per sota de la línia de text) i, a ≥ 600 px, als costats. Comprovat a 320 i 375 px: sense scroll horitzontal.
- [x] **F-47** · Treure l'enllaç al post de `Plat.astro`, en totes les variants (amb foto, sense foto, sense història i sense res), amb el text per a lectors de pantalla inclòs. L'article acaba en la història o en el nom, sense cap espai buit a sota (dis. §4.1, §4.3, §4.4). L'enllaç al perfil del peu no es toca. Verificació: V-34, V-24 i V-25 (les dues últimes amb un build temporal que no es versiona).
  - Nota: Fet: `Plat.astro` ja no renderitza cap enllaç (`urlPost` es conserva al model i a `getPlats()`). Les variants sense foto i sense història (V-24, V-25) es proven amb tests de `renderToString`, no amb un build temporal.
- [x] **F-48** · Revisar el `README.md` i els comentaris de `src/` que diguin que cada plat enllaça al seu post, i deixar-los d'acord amb el disseny. Verificació: la cerca de "Veure la publicació" i "Ver la publicación" a `src/` i `README.md` no troba res.
  - Nota: Fet: `README.md` (els plats no enllacen al post; regla N8). A `src/` ni al README ja no queda cap "Veure la publicació" ni "Ver la publicación".
- [x] **F-49** · Revisió visual de la secció de plats a 320, 375, 768 i 1280 px, a `/` i `/es/`, amb captures a `tests/captures/`. Quan l'arquitecte hagi publicat la neteja nova, comprovar que les històries de plat-01, 06 i 08 ja no comencen pel nom (dis. §4.8). Verificació: V-08, V-34 i V-35 en verd; la història de plat-01 a `/` comença per "Pasta que s'acaba a la paella".
  - Nota: Fet: comprovació automàtica amb Edge a 320, 375, 768 i 1280 px a `/` i `/es/` (182 comprovacions en verd: V-01 a V-10, V-14 a V-22, V-27 a V-31, V-34 i V-35) i captures a `tests/captures/` (no versionades). La història de plat-01 a `/` comença per "Pasta que s'acaba a la paella, amb el color del safrà i la tonyina per sobre."; plat-01, 02, 06 i 08 ja no comencen pel nom.