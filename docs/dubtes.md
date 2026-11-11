# Dubtes per a l'Oriol i conflictes entre rols

Qualsevol agent hi pot afegir entrades. L'Oriol respon a sota de cada dubte, a la línia "Resposta de l'Oriol". Mentre no hi hagi resposta, s'aplica el que diu "Mentrestant". Quan un dubte quedi resolt, es mou a "Resolts" amb la data.

## Oberts

### D-13 · Publicació: adreça, repositori de GitHub i activació
- Obert per: arquitecte-backend · 2026-11-10
- Per a: l'Oriol
- Context: la web queda preparada per publicar-se a GitHub Pages. Cada `git push` construirà la web, però no es publicarà fins que s'activi la variable `PUBLICAR`. Els passos són a `docs/arquitectura.md` §9.4.
- Preguntes:
  1. Teniu registrat `bistrot1954.cat`?
  2. Teniu compte de GitHub, i quin és l'usuari? Per publicar gratis a GitHub Pages, el repositori ha de ser **públic**, i tot el que hi ha serà visible: codi, contingut, `docs/` (incloses aquestes respostes) i `.claude/`.
  3. Quan voleu publicar?
  4. Recordatori: l'avís legal porta dades de demostració (D-05). Si la web passa a ser la web real del restaurant, s'han de substituir per les reals abans de publicar.
- Resposta de l'Oriol (parcial, al xat, transmesa pel coordinador el 2026-11-10):
  1. **Domini: no.** No té `bistrot1954.cat` registrat i vol fer servir l'adreça per defecte de GitHub Pages.
  2. **Té compte de GitHub.** L'usuari és **`Maaltas`**. El repositori serà `bistrot1954`, públic, i la web anirà a **`https://maaltas.github.io/bistrot1954/`** (GitHub Pages posa el host en minúscules).
  3. El repositori es crearà quan l'Oriol doni el vistiplau final.
- Aplicat a `docs/arquitectura.md` (§2.4, §5.2, §9):
  - sense domini propi ni `CNAME`;
  - Astro amb `base: '/bistrot1954'`;
  - `site` i `base` per defecte = `https://maaltas.github.io` + `/bistrot1954`, derivats de `GITHUB_REPOSITORY_OWNER` / `GITHUB_REPOSITORY` al workflow;
  - en local, la web es prova a `http://localhost:4321/bistrot1954/`.

  `bistrot1954.cat` queda només com a opció futura (§9.3).
- **Pendent:** només **quan es publica**, és a dir, el vistiplau final per crear el repositori `Maaltas/bistrot1954`, fer-hi `push` i activar `PUBLICAR`.
- Mentrestant: tot en local. El workflow queda preparat però no publica; la tasca B-31 està bloquejada.

### D-14 · Estadístiques: compte de GoatCounter
- Obert per: arquitecte-backend · 2026-11-10
- Per a: l'Oriol
- Context: heu dit que voleu estadístiques (D-08). Sense Cloudflare, la proposta és GoatCounter. És gratuït per a un negoci petit, no fa servir galetes i no cal bàner. Hi veureu visites, pàgines i d'on ve la gent (per exemple, quanta arriba des d'Instagram). Detall a `docs/arquitectura.md` §10.6.
- Pregunta: us sembla bé GoatCounter? Si és que sí, cal que creeu un compte a goatcounter.com (només demana un correu), que hi trieu un codi (per exemple, `bistrot1954`) i que ens el digueu. Només té sentit quan la web estigui publicada (D-13).
- Recomanació: GoatCounter.
- Mentrestant: tot preparat i desactivat, sense cap petició a tercers. La tasca B-32 està bloquejada.
- Resposta de l'Oriol: _(pendent)_

### D-17 · Falta `public/js/count.js` (script de tercers de GoatCounter)
- Obert per: programador · 2026-11-10
- Per a: l'Oriol / coordinador
- Context: B-25 demana copiar `https://gc.zgo.at/count.js` a `public/js/count.js`. És un script de tercers que s'executaria a la web de l'Oriol, i no el baixo sense permís explícit. Tota la resta de B-25 és feta.
- Pregunta: autoritzeu baixar-lo? Un cop baixat i revisat, el README n'ha d'anotar la data i l'origen. Només té sentit quan s'activi D-14.
- Mentrestant: el component `Estadistiques.astro` no emet res en local ni amb `goatcounter: null`. **No s'ha d'activar GoatCounter mentre no existeixi el fitxer.**

### D-18 · Decisions d'implementació que s'aparten de la lletra dels documents
- Obert per: programador · 2026-11-10
- Per a: dissenyador-frontend i arquitecte-backend (informatiu; res bloqueja)
- Detalls:
  1. **Desplaçament a l'àncora `#plat-NN` en mòbil** (dis. §4.2 diu 16 px; V-09 vol el nom visible). Amb la foto de 525-560 px d'alt, 16 px deixaven el nom a sota de la barra inferior (574-603 px de 667). He posat `scroll-margin-top: -72px` a l'article a < 900 px (efecte net: la foto queda retallada uns 56 px per dalt en arribar). Si es prefereix un altre criteri, s'ajusta a `Plat.astro`.
  2. **`html-validate` (S-06):** he desactivat la regla `tel-non-breaking` a `.htmlvalidate.json`, que exigeix espais no separables al telèfon "936 27 35 36". Amb NBSP el text exacte no coincidiria amb el de `restaurant.yaml` (C-06, S-07). Els botons i telèfons ja porten `white-space: nowrap`.
  3. **Favicon i icones:** es fan amb `ruta()` (relatius a `base`), no amb URL absolutes: amb la URL absoluta de producció, la CSP (`img-src 'self'`) les bloquejava en local i donava un error a la consola (P-03, P-01).
  4. **Per al QA (V-11):** amb `srcset` de descriptors `w`, `img.naturalWidth` no és l'ample del fitxer sinó l'ample de la mida triada (p. ex. 421 a 375 px). Per comprovar "no més gran que la font", cal comparar amb l'ample real del fitxer de `currentSrc`. Les imatges `lazy` que encara no s'han carregat donen `naturalWidth` 0.
  5. **P-06:** `git grep` troba `id-token: write` al workflow (és el permís OIDC d'arq. §9.2, no un secret).
  6. **Plat 02 (453 px d'ample):** el `srcset` en porta tres (360, 450 i 453), perquè `widths` segueix la regla literal d'arq. §6.3.
- Nota del dissenyador-frontend (2026-11-11): amb "La carta" (dis. versió 2), el punt 1 desapareix. La foto rodona va a dalt de l'article i el nom queda visible amb un marge de 16 px; l'ajust de −72 px s'ha de treure (tasca F-32). Els punts 2 a 6 continuen valent.

## Resolts

### D-01 · Idiomes de la web
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: La web ha de ser en català i castellà, o només en català?
- Resposta de l'Oriol: ~~català~~ → **català i castellà** (corregit per l'Oriol al xat, 2026-11-10): català a `/`, castellà a `/es/`, amb selector d'idioma.
- **Resolt 2026-11-10:** web bilingüe confirmada, tal com ja preveia l'arquitectura (`docs/arquitectura.md` §7.5).

### D-02 · Com reserva la gent: telèfon, WhatsApp o plataforma?
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Quin telèfon s'ha de publicar? Accepteu reserves per WhatsApp (i a quin número)? Feu servir alguna plataforma de reserves? Hi ha un correu de contacte públic?
- Resposta de l'Oriol: 936 27 35 36. Ampliat al xat (2026-11-10): **només botó de trucar**. Sense WhatsApp, plataforma de reserves ni correu.
- **Resolt 2026-11-10:** `telefon: "+34 936 27 35 36"` i botó "Trucar" (`tel:+34936273536`) com a única crida de reserva. `whatsapp`, `email` i `reserves_url` surten del model (`docs/arquitectura.md` §4.3, §8).

### D-03 · Horari d'obertura i preu orientatiu
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Quins dies i hores obre el restaurant? Voleu indicar un preu orientatiu?
- Resposta de l'Oriol: posa de 20 a 23 de dilluns a dissabte
- **Resolt 2026-11-10:** `horari` de dilluns a dissabte, de 20:00 a 23:00, i `preu: null`. Surt a la web i a `openingHoursSpecification` (`docs/arquitectura.md` §4.3.1, §7.3).

### D-04 · Domini, comptes i publicació
- Obert per: arquitecte-backend · 2026-11-10
- Preguntes: Quin domini voleu? Teniu comptes a Cloudflare i GitHub? Publicació automàtica amb `git push` o manual?
- Resposta de l'Oriol: bistrot1954.cat. Ampliat al xat (2026-11-10): **que funcioni a GitHub**, és a dir, publicació a GitHub Pages amb GitHub Actions en fer `git push` (en lloc de Cloudflare). El repositori de GitHub encara no existeix: la web queda preparada per publicar-s'hi, i no es crea ni es puja res fins que l'Oriol ho digui.
- **Resolt 2026-11-10:** GitHub Pages amb el workflow `publica.yml`, preparat però amb la publicació bloquejada per la variable `PUBLICAR` (`docs/arquitectura.md` §9). Després, a D-13, l'Oriol va dir que no té el domini: la web anirà a `https://maaltas.github.io/bistrot1954/` i `web_url` queda a `null`. El que encara depèn de l'Oriol continua a D-13.

### D-05 · Dades per a l'avís legal
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Qui és el titular del restaurant, quin és el NIF, quin domicili fiscal i quin correu s'han de publicar?
- Resposta de l'Oriol: és com a demo així que inventa aquestes dades
- **Resolt 2026-11-10:** dades fictícies impossibles (NIF `B00000000`, correu `@example.com`, CP `00000`) a `restaurant.yaml` → `avis_legal`, amb `demostracio: true`. A la pàgina van marcades com a fictícies i amb `noindex` (`docs/arquitectura.md` §4.3.3, §5.4).

### D-06 · Tipus de cuina
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Podem dir "Cuina mediterrània" ("Cocina mediterránea" en castellà) al títol de la web i a les dades per a Google?
- Resposta de l'Oriol: Cuina mediterrània
- **Resolt 2026-11-10:** "Cuina mediterrània" / "Cocina mediterránea" a `restaurant.yaml` (`docs/arquitectura.md` §4.3.1).

### D-07 · Noms dels plats
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Els noms de `contingut/seleccio.yaml` són correctes?
- Resposta de l'Oriol: són correctes si
- **Resolt 2026-11-10:** es mantenen els noms literals d'`docs/arquitectura.md` §3.2, sense `nom_confirmat`.

### D-08 · Estadístiques de visites
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Voleu saber quanta gent visita la web?
- Resposta de l'Oriol: sí
- **Resolt 2026-11-10:** GoatCounter, sense galetes ni bàner, amb `count.js` autoallotjat i una única excepció a la CSP i al criteri P-01. Queda preparat i desactivat (`docs/arquitectura.md` §10.6). L'activació continua a D-14.

### D-09 · Fotos dels plats
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: Quan podreu desar les fotos dels 8 plats a `contingut/imatges/`? L'ideal és la foto original, no una captura de pantalla.
- Resposta de l'Oriol: les fotos de la carpeta són les que tinc treballa amb aquestes
- **Resolt 2026-11-10:** les captures `plat-0N.jpeg` (~450×600) són definitives. S'hi adapten la finestra 5:7, el `srcset` i els avisos (`docs/arquitectura.md` §6).

### D-10 · Fitxa de Google (Google Business Profile)
- Obert per: arquitecte-backend · 2026-11-10
- Pregunta: El restaurant té fitxa a Google Maps? Si en té, ens podeu passar l'enllaç de la fitxa?
- Resposta de l'Oriol: (https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA)
- **Resolt 2026-11-10:** `google_maps_url` = aquest enllaç, que fan servir "Com arribar" i `hasMap` (`docs/arquitectura.md` §4.3.1, §8).

### D-11 · CONFLICTE entre arquitectura i disseny (fotos, imatge per compartir) i respostes de l'Oriol que xoquen amb l'arquitectura actual
- Obert per: dissenyador-frontend · 2026-11-10
- Per a: arquitecte-backend (punts 1-8) i l'Oriol (punt 5)
- **Conflictes entre arquitectura i disseny:**
  1. **Retall de les fotos** (arq. §6.3 ↔ `docs/disseny-frontend.md` §6.2). L'arquitectura retalla en el build amb `fit: 'cover'` i `position: 'center'`. Les 8 fotos són captures d'Instagram de ~450×600 px amb la fletxa del carrusel a la dreta (plat-01, 02, 04, 05, 07) i els punts de paginació a baix. El disseny necessita una finestra 5:7 que mostri només el rectangle de dalt a l'esquerra (88,9 % de l'amplada × 93,3 % de l'alçada). `cover` no ho pot fer, perquè escala la imatge i només retalla en una direcció. Opcions: **A**, generar la imatge sencera i fer la finestra per CSS (la imatge al 112,5 % de la finestra, ancorada a dalt a l'esquerra); **B**, extreure aquest rectangle en el build (`extract` de sharp) abans de generar els formats. El resultat visual és idèntic; B no descarrega píxels amagats (un 17 % de cada foto).
  2. **Amples del `srcset`** (arq. §6.3: 360, 540, 720, 1080). Amb fonts de 450 px, Astro descarta les variants més grans que l'original i quedaria només la de 360, que a l'escriptori (450 px CSS) es veuria ampliada i borrosa. El disseny demana que el `srcset` inclogui sempre una variant a l'ample real de la font (avui 450).
  3. **Imatge per compartir** (arq. §6.6). El retall 1,91:1 de la foto de plat-01 donaria 450×236 px amb la fletxa del carrusel al mig. El disseny proposa fer servir sempre la imatge tipogràfica `public/og.jpg` de 1200×630 px (disseny §6.4) com a `og:image`, no només com a reserva.
  4. **Avisos del build** (arq. §3.1 i §11 T-02). Ara que hi ha fotos, el build donarà 8 avisos "imatge de menys de 720 px" i cap "sense imatge". Cal actualitzar T-02 perquè el QA no ho marqui com a incidència.
- **Respostes de l'Oriol que xoquen amb l'arquitectura actual** (detectades en dissenyar; no són de disseny):
  5. **D-01:** la línia "Resposta de l'Oriol" diu "català", però el coordinador ha transmès una correcció de l'Oriol: web **bilingüe** (ca a `/`, es a `/es/`, amb selector d'idioma). El disseny segueix la correcció. Convé que l'Oriol actualitzi la resposta escrita perquè no hi hagi dues versions.
  6. **D-04:** publicació a GitHub Pages amb `bistrot1954.cat`, en lloc de Cloudflare Workers (arq. §0, §2.1, §9). GitHub Pages no admet `public/_headers` (arq. §9.5, criteri P-05) ni `wrangler.jsonc`, i serveix `404.html` per a qualsevol ruta. Al disseny només li afecta la 404, que ja és bilingüe i amb enllaços absoluts.
  7. **D-08:** Cloudflare Web Analytics carrega un script d'un altre domini, que xoca amb arq. §10.3 (CSP), §10.5 i el criteri P-01 (0 peticions a tercers). No té cap impacte visual.
  8. **D-05:** l'avís legal tindrà dades fictícies; arq. §4.3 i §5.2 el preveuen amb dades reals. El disseny el marca com a demostració (disseny §3.7, criteri V-27).
- **Resolt 2026-11-10 (arquitecte), amb `docs/arquitectura.md` versió 2, que adopta el disseny en tots els punts:**
  1. Opció A: finestra CSS sense retall al build (§6.3).
  2. `widths` amb l'ample real de la font; avui `[360, 450]` (§6.3).
  3. `og:image` = `public/og.jpg` sempre, generada amb `npm run og` (§6.6).
  4. Avís de mida només per sota de 400 px i T-02 = 0 avisos (§3.1, §11).
  5. Resposta de D-01 ja corregida.
  6. GitHub Pages: CSP per meta i capçaleres no disponibles documentades (§9, §10.3).
  7. GoatCounter, amb una única excepció a la CSP i a P-01 (§10.6).
  8. Avís legal de demostració (§4.3.3, §5.4).

  Les tasques F-12, F-20 i F-22 es mantenen tal com les descriu el disseny.

### D-12 · Text de presentació del restaurant
- Obert per: dissenyador-frontend · 2026-11-10
- Pregunta: Voleu que a l'inici de la web hi hagi un text curt (dues o tres frases) sobre el restaurant? L'hauríeu d'escriure o aprovar vosaltres: no en farem servir cap de ressenyes ni l'inventarem.
- Resposta de l'Oriol: **Sí** (al xat, transmès pel coordinador el 2026-11-10). És dada confirmada. Text literal:
  - CA: "Aquí prima el confort, el menjar sense presses i el gust pel que és d’aquí. 🔥🍽️ / Des dels entrants fins als postres, a Bistrot 1954 tenim una missió: que surtis per la porta pensant en quan tornaràs."
  - ES: "Aquí prima el confort, la comida sin prisas y el gusto por lo de aquí. 🔥🍽️ / Desde los entrantes hasta los postres, en Bistrot 1954 tenemos una misión: que salgas por la puerta pensando en cuándo volverás."
  - (La barra "/" marca el salt de línia de l'original.)
- **Resolt 2026-11-10:** el text es desa literalment a `restaurant.yaml` → `presentacio.ca` / `presentacio.es`, i la web en treu només els emojis amb la mateixa neteja dels captions. Es mostra a l'obertura i és el `description` del JSON-LD (`docs/arquitectura.md` §4.3.2). La posició visual dins de l'obertura continua a D-15.

### D-15 · On va el text de presentació dins de l'obertura (per al dissenyador-frontend)
- Obert per: arquitecte-backend · 2026-11-10
- Per a: dissenyador-frontend (no depèn de l'Oriol)
- Context:
  - L'Oriol ha donat un text de presentació (D-12). L'arquitectura el desa a `restaurant.yaml` → `presentacio` i el renderitza en un `div[data-presentacio]` dins de `#inici` (`docs/arquitectura.md` §4.3.2 i §4.5).
  - `docs/disseny-frontend.md` §3.2 no el preveu: no en fixa la posició, l'estil ni l'espai.
  - Són dues frases en un paràgraf, amb un salt de línia entre elles, d'uns 190 caràcters per idioma: unes 6-7 línies a 375 px, uns 220 px d'alçada.
- Conflicte: amb aquest bloc a l'obertura, a 375×667 la primera foto començarà per sota de y = 595 px. El criteri **V-05** no es podrà complir, i la captura de V-29 no coincidirà amb el wireframe de §3.2.
- Recomanació de l'arquitecte:
  - Posició: dins de l'obertura, **després** de les dades (cuina, adreça, horari), perquè l'horari continuï visible sense scroll (V-06).
  - Estil: Alegreya 400, `--mida-text`, interlineat 1,6, porcellana sobre cobalt, amplada màxima `--mesura` i 24 px per sobre.
  - A ≥ 900 px: a sota de les tres columnes, alineat a l'esquerra.
  - V-05 hauria de passar a demanar que l'`h1`, l'horari i la presentació siguin visibles i que la primera foto aparegui després d'un scroll.
- Resolució del dissenyador: s'adopta la recomanació per a < 900 px, i a ≥ 900 px es canvia el layout (`docs/disseny-frontend.md` §3.2):
  - **Ordre i estil:** nom → dades → presentació. La presentació fa servir l'Alegreya 400, `--mida-text` (19/20 px), interlineat 1,6, porcellana sobre cobalt (8,9:1), amplada màxima `--mesura`, 24 px per sobre i 32 px per sota. No porta cap ornament i el salt de línia original és un `br`.
  - **A ≥ 900 px:** no va sota les tres columnes. Fa servir la graella dels plats: les dades van una sota l'altra a la columna de 400 px i la presentació va a la columna de text (36rem), a la mateixa altura. Així queda alineada amb les històries, i la primera foto continua per sobre de y = 720 px a 1280×800.
  - **Criteris:** V-05 reescrit (a 375×667 es veuen el nom, les dades i la presentació; la primera foto queda a y < 800 px; a 1280×800, a y < 720 px). V-29 inclou l'ordre de l'obertura. Nou criteri V-30 per a l'estil i la posició. Tasca F-09 actualitzada.
- **Resolt 2026-11-10.**

### D-16 · Astro 6 té vulnerabilitats conegudes que només es corregeixen a Astro 7 (conflicte amb P-07)
- Obert per: programador · 2026-11-10
- Per a: arquitecte-backend
- Context: `docs/arquitectura.md` fixava Astro `^6` i demana (P-07) que `npm audit --omit=dev` no tingui vulnerabilitats altes ni crítiques. La darrera 6.x (6.4.8) en té una de **crítica** (`astro <= 7.3.1`: avisos GHSA sobre XSS en transicions/JSX/atributs, execució remota en optimitzar AVIF i *bypass* del `base`), només arreglada a Astro 7.4.10. També n'hi ha una de baixa a `esbuild`, que només afecta el servidor `dev` a Windows. Mentrestant, `package.json` porta `overrides: { sharp: "^0.35.5" }`.
- Pregunta: s'accepta el risc, es passa P-07 a observació, o es migra a Astro 7?
- **Resolt 2026-11-10 (arquitecte): es migra a Astro `^7.4.10`, i P-07 es manté.** Motius:
  - la branca 6 no rebrà més correccions;
  - un dels avisos afecta el `base`, que ara sí que fem servir;
  - acceptar una crítica buidaria el criteri P-07.

  Segons la guia oficial de migració a la v7, l'impacte és petit:
  - Vite 8 (Vitest `^5`);
  - un compilador en Rust més estricte amb l'HTML mal format;
  - `compressHTML`, que passa a `'jsx'`: es fixa a `true` per conservar els espais;
  - Node ≥ 22.23.4, que el Node 26 local i el de GitHub Actions ja compleixen.

  La guia no indica canvis a les tipografies, la CSP, les imatges, `base`, i18n ni sitemap; ho confirmen els tests. La baixa d'`esbuild` s'accepta com a observació, i l'`override` de `sharp` es treu si deixa de caldre. Canvis a `docs/arquitectura.md`: §0, §2.1, §2.4, §5.3, §10.4 i P-07. La implementació és la tasca nova **B-33**, i B-30 s'ha de tornar a mesurar després.

### D-19 · CONFLICTE entre arquitectura i disseny: el redisseny "La carta" (P3)
- Obert per: dissenyador-frontend · 2026-11-11
- Per a: arquitecte-backend
- Context: l'Oriol ha triat la proposta P3, "La carta", com a disseny nou (2026-11-11). `docs/disseny-frontend.md` versió 2 la descriu sencera, i les tasques F-24 a F-44 de `docs/tasques.md` porten la web de `main` cap a aquest disseny. No canvien el model de dades, ni les rutes, ni la regla de contingut. Sí que xoquen amb aquests punts de `docs/arquitectura.md`:
  1. **Finestra de la foto** (arq. §0, §4.5, §5.1, §6.3, R-09 de §11 i annex A). Ara és una finestra 5:7 ancorada a dalt a l'esquerra, amb `sizes` = `(min-width: 400px) 450px, 112.5vw`. El disseny nou (dis. §6.2-§6.3) demana:
     - un **cercle**: proporció `1 / 1`, `border-radius: 50%`, `overflow: hidden`, de 260 px de diàmetre a < 900 px i de 300 px a ≥ 900 px;
     - la `img` al **112,5 %** de l'amplada, sense `object-fit` i desplaçada cap amunt amb **`margin-top: -25%`**. La part visible de la captura és x 0-88,9 % i y 16,7-83,3 %, i la fletxa i els punts continuen fora;
     - **`sizes` = `(min-width: 900px) 338px, 293px`**.

     `widths` no canvia (`[360, ample real]`). **Proposta:** substituir "finestra 5:7 ancorada a dalt a l'esquerra" per aquest contracte a §6.3, §4.5, §5.1 i a l'annex A, i actualitzar el `sizes` de R-09. La imatge renderitzada fa com a màxim 338 px CSS, sempre per sota de la font, i per tant desapareix l'observació sobre les fonts de 400-449 px ampliades.
  2. **Tipografies** (arq. §2.4, §6.7 i tasca B-22). El disseny nou fa servir **EB Garamond 400 `normal` i `italic`, i Jost 500**, en lloc d'Alegreya i Alegreya Sans: són 3 fitxers, el màxim actual. `preload` només de l'EB Garamond 400 normal. **Proposta:** canviar §2.4 i §6.7 i mantenir el límit de 3 fitxers i 120 KB. Si en mesurar-ho (V-15) l'EB Garamond (rodona i cursiva) i la Jost superen els 120 KB, proposo pujar el límit de tipografies a 150 KB, en lloc de treure la cursiva, que és la veu dels noms dels plats. El pes total de la pàgina (R-06) continuaria per sota de 600 KB, perquè les fotos són petites.
  3. **Imatge per compartir** (arq. §2.1 i §6.6). `scripts/genera-og.mjs` carrega `@fontsource/alegreya` i `@fontsource/alegreya-sans`. El disseny nou de l'`og.jpg` (dis. §6.4) necessita **`@fontsource/eb-garamond`** (400 cursiva) i **`@fontsource/jost`** (500) com a dependències de desenvolupament, en lloc de les d'Alegreya. **Proposta:** canviar els paquets de la taula de §2.1 i el pas 2 de §6.6. La resta de §6.6 (mida, pes, metadades i `og:image:alt`) no canvia.
  4. **Maquetes de propostes.** La branca `propostes-disseny` té `src/propostes/`, `src/pages/propostes/` i set famílies tipogràfiques més a `astro.config.mjs`. **No formen part de la web final** (decisió del coordinador). **Proposta:** que arq. §5.1 i §2.4 diguin explícitament que `astro.config.mjs` només declara les dues famílies del disseny vigent, i que no hi ha cap ruta `/propostes/`. Ho comprova V-32.
- Mentrestant: el programador aplica el disseny en els punts 1 a 4 (tasques F-24, F-26, F-33 i F-42), com es va fer amb D-11.
- **Resolt 2026-11-11 (arquitecte): s'adopten les quatre propostes a `docs/arquitectura.md`, amb un ajust al punt 2.**
  1. **Finestra rodona** (§6.3, §4.5, §5.1, §0 i annex A). És el mateix mètode CSS sobre la imatge sencera, amb `aspect-ratio: 1 / 1`, `border-radius: 50%`, `width: 112.5%` i `margin-top: -25%`. `sizes` = `(min-width: 900px) 338px, 293px` (R-09 actualitzat). `widths` no canvia. Desapareix l'observació de les fonts de 400-449 px.
  2. **Tipografies** (§2.4, §6.7, R-06b): EB Garamond 400 normal i cursiva i Jost 500, en 3 fitxers com a màxim. **Ajust:** l'objectiu és ≤ 120 KB (V-15), i el límit, ≤ 150 KB. Entre 120 i 150 KB s'accepta com a observació i no es treu la cursiva. Convé que el dissenyador hi alineï el text de V-15.
  3. **`og.jpg`** (§2.1, §6.6): `@fontsource/eb-garamond` i `@fontsource/jost` en lloc dels d'Alegreya. Feina: tasca nova **B-34**, abans de F-42 o juntament amb ella.
  4. **Propostes** (§2.4, §5.1, §5.2): `astro.config.mjs` només declara les dues famílies vigents, i a `main` no hi ha `src/propostes/`, `src/pages/propostes/` ni cap ruta `/propostes/`. Criteri nou **T-08**, equivalent a V-32.

  Les tasques F-24, F-26, F-33 i F-42 es mantenen tal com estan. **B-35** torna a verificar T-08, R-06, R-06b, R-07, R-08, R-09, P-05 i C-01 a C-10 quan s'acabi el redisseny.
