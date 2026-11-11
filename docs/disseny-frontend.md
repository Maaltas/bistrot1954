# Disseny frontend · Web del Bistrot 1954

Versió 2.1 · 2026-11-11 · autor: dissenyador-frontend

> **Canvis de l'Oriol a la secció de plats (versió 2.1, 2026-11-11), amb la web ja publicada:**
> - el títol passa a ser "Els nostres plats" / "Nuestros platos";
> - el subtítol passa a ser "Un recull de l'experiència que et trobaràs." / "Una muestra de la experiencia que te encontrarás.";
> - els plats ja no enllacen al post d'Instagram (§4.1, §4.3, §4.4, §8);
> - la història ja no repeteix el nom del plat (§4.8, canvi de la neteja que fa l'arquitecte).
>
> En conseqüència, a < 600 px el filet dels `h2` va a sota del títol (§3.3). Criteris nous: V-34 i V-35. Tasques: F-45 en endavant.

> **Aquest document substitueix "Pisa blava" (versió 1) per "La carta" (proposta P3 de `docs/propostes-disseny.md`), per decisió de l'Oriol del 2026-11-11.** És el disseny vigent i mana sobre l'aspecte i la distribució de totes les pàgines, dins del marc tècnic de `docs/arquitectura.md` (abreujat "arq."). No conté codi: conté especificacions, tokens i wireframes. Les tasques per passar de "Pisa blava" a "La carta" són a `docs/tasques.md`, subsecció "Redisseny P3" (F-24 en endavant). Els canvis d'arquitectura que necessita són a `docs/dubtes.md` (D-19).
>
> **Es manté de la versió 1:**
> - la regla de contingut i els ganxos d'HTML;
> - l'ordre del DOM del plat;
> - les accions ("Trucar" i "Com arribar") sempre a mà, amb la barra inferior < 900 px i la superior ≥ 900 px;
> - els textos d'interfície;
> - les regles d'accessibilitat;
> - la zona prohibida de les captures (fletxa i punts d'Instagram);
> - la presentació dins de l'obertura (D-15; l'ordre canvia, vegeu §3.2);
> - la 404 bilingüe i l'avís legal de demostració.
>
> **Canvia:** concepte, paleta, tipografies, composició, forma de la foto (cercle), icones i imatge per compartir.
>
> **Maqueta de referència:** `src/pages/propostes/p3.astro` i `src/propostes/p3.css`, a la branca `propostes-disseny`. Els detalls que la maqueta va resoldre i que aquest document dona per bons hi són incorporats. Els que es corregeixen estan marcats amb **(corregeix la maqueta)**. Les pàgines `/propostes/` **no** formen part de la web final.
>
> **Dades confirmades que fa servir el disseny** (`docs/dubtes.md`):
> - web bilingüe: ca a `/` i es a `/es/` (D-01);
> - "Trucar" al 936 27 35 36 com a única crida de reserva (D-02);
> - horari de dilluns a dissabte, de 20:00 a 23:00 (D-03);
> - avís legal de demostració (D-05);
> - "Cuina mediterrània" (D-06);
> - noms dels plats (D-07);
> - fotos: captures de ~450×600 (D-09);
> - fitxa de Google Maps (D-10);
> - presentació literal de l'Oriol (D-12);
> - publicació a `https://maaltas.github.io/bistrot1954/` (D-13).

---

## 1. Concepte visual

**"La carta".** La web és la carta que hi ha damunt de la taula: paper blanc, tinta de color vi negre, tot centrat, i cada plat amb el nom en cursiva i la seva història com a descripció, igual que en una carta impresa. Les fotos es veuen **en rodó, com plats servits**: un cercle que retalla el plat i deixa fora tota la interfície d'Instagram de les captures. Uns filets de color or vell separen les parts, com els filets d'impremta d'una carta. El to és de bistrot de barri cuidat, no de restaurant de mantell blanc: la tipografia és clàssica, però la composició és senzilla i propera, sense ornaments a més dels filets.

### 1.1 D'on surt

| Què hi ha | Com passa al disseny |
|---|---|
| Un bistrot amb carta: noms de plat curts i un text breu per a cadascun (els captions) | Cada plat és una entrada de carta: nom en cursiva, descripció a sota i un filet entre plats. |
| Fotos verticals de plats sobre fusta i acer, amb mans i context; captures de 450×600 amb la fletxa i els punts d'Instagram | Finestra rodona de 260-300 px que agafa el centre del plat i deixa fora la interfície (§6). La mida petita també dissimula la resolució baixa. |
| Vaixella de pisa i safates treballades (plat-02, 07 i 08) | El plat rodó com a forma de la foto, i el color or vell dels filets, com les vores daurades d'una safata. |
| Menjar càlid (safrà, rovell, tàrtar, fregits) | Un sol color fort a la interfície, el vi negre, que no competeix amb els taronges de les fotos. El fons és blanc pur. |

### 1.2 Principis

1. **La carta mana:** composició centrada i simètrica, una columna al mòbil i dues "pàgines" de carta a l'escriptori.
2. **El plat és la foto:** les fotos són rodones i no porten res a sobre (ni text, ni marc, ni ombra, ni filtre).
3. **Una sola gosadia:** la tipografia clàssica en cursiva per als noms, acompanyada de filets or. Res més decora.
4. **Trucar i arribar a un toc:** "Trucar" (principal, vi ple) i "Com arribar" (secundari, vora vi) sempre a la vista.
5. **Res inventat:** cap eslògan ni dada que no surti de `contingut/restaurant.yaml` o d'un caption.
6. **Propera, no formal:** sense versaletes, sense majúscules espaiades, sense "Menú degustació", sense marcs ornamentals. Un filet d'or i prou.

---

## 2. Mapa del lloc i ordre de les seccions

Una sola pàgina per idioma: `/` en català i `/es/` en castellà, amb el `base` `/bistrot1954` (arq. §5.2). No hi ha pàgina de detall ni modal (§4.6).

| Ordre | Secció (àncora) | Contingut | Propòsit |
|---|---|---|---|
| 0 | Enllaç per saltar | "Vés als plats" (visible només amb el focus) | Accés directe als plats amb el teclat. |
| 1 | Barra superior (només ≥ 900 px) | "Plats", "On som", selector d'idioma, "Com arribar", "Trucar al 936 27 35 36" | Tenir trucar i arribar sempre a mà a l'escriptori. |
| 2 | Obertura (`#inici`) | Selector d'idioma (< 900 px), `h1` "Bistrot 1954", filet doble, cuina, presentació (`div[data-presentacio]`), horari i adreça, filet doble | La capçalera de la carta: qui som, com som, quan obrim i on som. |
| 3 | Els nostres plats (`#plats`) | `h2` amb filets, subtítol i un article per plat (`#plat-NN`) | La carta: foto rodona, nom i història. Sense enllaç al post (canvi del 2026-11-11). |
| 4 | On som (`#on-som`) | `h2`, adreça, "Com arribar", `h3` "Horari", `h3` "Telèfon", número i "Trucar" | Convertir la visita en una trucada o en una visita al local. Fons vi clar. |
| 5 | Peu | filet doble, nom, Instagram, "Avís legal i privacitat", selector d'idioma | Tancament i enllaços secundaris. |
| fix | Barra d'accions inferior (només < 900 px) | "Com arribar" (secundari) + "Trucar" (principal) | Les dues accions sempre a la vista al mòbil. |

Pàgines secundàries:

| Pàgina | Contingut |
|---|---|
| `/404.html` | Bilingüe, centrada, sense barres ni fotos (§3.6). GitHub Pages la serveix per a qualsevol ruta inexistent dins de `/bistrot1954/`, i per això els seus enllaços són absoluts. |
| `/avis-legal/`, `/es/aviso-legal/` | Avís legal i privacitat de demostració, amb l'avís de dades fictícies ben visible (§3.7). |

Encapçalaments: un sol `h1` per pàgina (a la portada, el nom del restaurant). `h2` per a "Els nostres plats" i "On som"; `h3` per a cada plat i per a "Horari" i "Telèfon". Regions: `header` (barra superior i obertura), `main` (plats i on som), `footer` (peu), i la barra inferior com a `nav` amb el nom accessible "Accions".

---

## 3. Wireframes

Convencions:
- Les mides són en px CSS.
- "Paper", "vi", "vi fosc", "tinta", "fum", "vi clar" i "or" són els colors de §5.1.
- "Filet doble" és una línia or de 3 px d'estil doble: 1 px de línia, 1 px d'aire i 1 px de línia. "Filet senzill" és una línia or d'1 px.
- Els textos entre cometes són literals (§9). Els textos d'exemple dels plats són els de plat-01 (arq. §3.4.3).
- Marges laterals (`--marge`): 24 px (< 600), 32 px (600-899) i 48 px (≥ 900).
- **Tot va centrat**, excepte la barra superior, el text de l'avís legal i les històries llargues (§4.5).

### 3.1 Barres d'acció

**Mòbil i tauleta (< 900 px): barra inferior fixa**

```
375 px
═══════════════════════════════════════   filet doble or a tot l'ample (vora superior de la barra)
┌───────────────────────────────────────┐  fons paper, sense ombra
│  ┌───────────────┐  ┌───────────────┐ │  farciment: 12 px a dalt i a baix, 20 px als costats
│  │  Com arribar  │  │    Trucar     │ │  dos botons de 48 px d'alt i el mateix ample, 12 px entre ells
│  └───────────────┘  └───────────────┘ │  esquerra: secundari (vora vi d'1 px, text vi)
└───────────────────────────────────────┘  dreta: principal (fons vi, text paper). Radi 0. + àrea segura
```

- Alçada: 72 px + l'àrea segura inferior. El peu reserva aquest espai a baix, perquè la barra no el tapi.
- Si l'alçada de la finestra és < 480 px, la barra deixa de ser fixa i va al final de la pàgina, després del peu.
- Si algun dia `telefon` fos `null`, només hi hauria "Com arribar", a tot l'ample i amb l'estil principal.

**Escriptori (≥ 900 px): barra superior fixa**

```
1280 px
┌──────────────────────────────────────────────────────────────────────────────────────────────┐ fons paper, 64 px
│    Plats   On som                         Castellano   [ Com arribar ]  [ Trucar al 936 27 35 36 ]    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
══════════════════════════════════════════════════════════════════════════════════════════════════ filet doble or
     └ Jost 500 16 vi, sense subratllar        └ subratllat   └ secundari       └ principal, 44 px d'alt
       (subratllat amb hover i focus)
```

- Contingut dins d'un contenidor de 68rem (1088 px) centrat, alineat a l'esquerra i a la dreta, no al centre. Entre enllaços hi ha 24 px, i entre accions, 16 px.
- **Pàgines legals:** a l'esquerra, en lloc de "Plats" i "On som", hi ha "Bistrot 1954" (EB Garamond cursiva 24 px vi, enllaç a l'inici del mateix idioma). A < 900 px, les pàgines legals tenen una franja no fixa de 56 px amb el nom a l'esquerra i el selector a la dreta, i un filet doble a sota.

### 3.2 Obertura (`#inici`)

```
375 px
┌───────────────────────────────────────┐  fons paper
│                          Castellano   │  selector Jost 500 16 vi, subratllat, zona de 44 px (8 px de marge a dalt)
│ 16                                    │
│             Bistrot 1954              │  h1 EB Garamond cursiva 56/1 vi, centrat
│ 12                                    │
│          ═══════════════════          │  filet doble or de 160 px
│ 12                                    │
│           Cuina mediterrània          │  Jost 500 16 fum
│ 24                                    │
│   Aquí prima el confort, el menjar    │  div[data-presentacio]: EB Garamond 400 20/1,55 tinta,
│  sense presses i el gust pel que és   │  centrada, amplada màxima 28em; salt de línia original = br
│                d’aquí.                │
│ Des dels entrants fins als postres, a │
│   Bistrot 1954 tenim una missió: que  │
│  surtis per la porta pensant en quan  │
│              tornaràs.                │
│ 24                                    │
│         De dilluns a dissabte,        │  horari: Jost 500 16/1,5 tinta (una línia per franja)
│           de 20:00 a 23:00            │
│ 4                                     │
│          Carrer Sant Bru, 48          │  adreça (element address): carrer i "08911 Badalona"
│            08911 Badalona             │  en dues línies
│ 24                                    │
│          ═══════════════════          │  filet doble or de 160 px
│ 32                                    │
└───────────────────────────────────────┘
```

- **Ordre:** selector → nom → filet → cuina → presentació → horari → adreça → filet. A la versió 1 (D-15) la presentació anava després de les dades. Aquí va abans, per composició de carta: el nom, el to i, al peu de la capçalera, les dades pràctiques. L'horari continua visible sense scroll a 375×667: l'estimació el situa entre y ≈ 440 i 490, per sobre de la barra (V-06).
- Alçada aproximada a 375 px: 590 px. La primera foto apareix amb el primer gest de scroll (V-05).

```
1280 px
┌─ barra superior 64 px ───────────────────────────────────────────────────────────────────────┐
════════════════════════════════════════════════════════════════════════════════════════════════
│  64                                                                                          │
│                                      Bistrot 1954                                            │  h1 EB Garamond cursiva 96/1 vi
│  12                                                                                          │
│                                 ══════════════════════                                       │  filet doble or de 220 px
│  12                                                                                          │
│                                   Cuina mediterrània                                         │  Jost 500 16 fum
│  24                                                                                          │
│             Aquí prima el confort, el menjar sense presses i el gust pel que és d’aquí.      │  presentació EB Garamond 22/1,55,
│        Des dels entrants fins als postres, a Bistrot 1954 tenim una missió: que surtis       │  centrada, ≤ 36em
│                          per la porta pensant en quan tornaràs.                              │
│  32                                                                                          │
│     De dilluns a dissabte, de 20:00 a 23:00   ║   Carrer Sant Bru, 48, 08911 Badalona        │  Jost 500 18 tinta, en una línia;
│  32                                                                                          │  filet vertical doble or, 32 px a cada costat
│                                 ══════════════════════                                       │
│  48                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

- A ≥ 900 px, l'adreça es mostra en una línia: "Carrer Sant Bru, 48, 08911 Badalona" (la coma entre carrer i codi postal només es veu aquí).
- Entre 600 i 899 px, igual que al mòbil, amb marges de 32 px.
- Alçada aproximada a 1280 px: 540 px, barra inclosa.

### 3.3 Els nostres plats (`#plats`)

**Capçalera de la secció**

```
375 px                                           1280 px
│ 40                                    │        │ 40                                                     │
│           Els nostres plats           │        │            ─────  Els nostres plats  ─────             │
│ 12                                    │        │ 12                                                     │
│                ─────                  │        │       Un recull de l'experiència que et trobaràs.      │
│ 12                                    │        │ 40                                                     │
│  Un recull de l'experiència que et    │          h2 a 48 px amb un filet senzill or de 48 px a cada
│              trobaràs.                │          costat (16 px de separació); subtítol Jost 500 16 fum
│ 40                                    │
  h2 EB Garamond cursiva 36/1,1 vi; a < 600 px, el filet senzill or de 48 px va SOTA el títol
  (12 px), no als costats; subtítol Jost 500 16 fum
```

- **Filets dels `h2` (canvi del 2026-11-11):** a < 600 px, "Els nostres plats" (o "Nuestros platos") amb un filet a cada costat no hi cap a 375 px: farien uns 385 px, i n'hi ha 327. Per això, **a < 600 px tots els `h2` (també "On som") porten el filet senzill de 48 px a sota**, centrat i 12 px per sota del text. A ≥ 600 px van als costats, com abans. El títol pot ocupar dues línies (`text-wrap: balance`) i mai provoca scroll horitzontal.

**Plat amb foto i història** (la història d'exemple ja no repeteix el nom: vegeu §4.8)

```
375 px                                          1280 px: carta oberta, 2 columnes de 480 px (960 px centrats)
│               ╭──────────╮            │       ┌──────────────────────────────┬╥─────────────────────────────┐
│             ╭─╯          ╰─╮          │       │          ╭────────╮          ║          ╭────────╮         │
│             │   FOTO en    │          │       │        ╭─╯ cercle ╰─╮        ║        ╭─╯        ╰─╮       │
│             │   cercle de  │          │       │        │   300 px   │        ║        │            │       │
│             │   260 px     │          │       │        ╰─╮        ╭─╯        ║        ╰─╮        ╭─╯       │
│             ╰─╮          ╭─╯          │       │          ╰────────╯          ║          ╰────────╯         │
│               ╰──────────╯            │       │  20                          ║                             │
│ 20                                    │       │    Tagliatelle amb safrà,    ║        Figues i foie        │ h3 30
│       Tagliatelle amb safrà,          │       │      mantega i tonyina       ║                             │
│         mantega i tonyina             │       │  12                          ║   (història de plat-02,     │
│ 12                                    │       │  Pasta que s'acaba a la      ║   centrada)                 │ història 21/1,55
│ Pasta que s'acaba a la paella, amb el │       │  paella, amb el color del    ║                             │ centrada
│ color del safrà i la tonyina per sobre│       │  safrà i la tonyina per …    ║                             │
│ Una explosió de tardor a la taula de  │       │                              ║                             │
│            Bistrot 1954               │       └──────────────────────────────┴╨─────────────────────────────┘
│ 56                                    │         farciment lateral de cada article: 40 px (text de 400 px com a màxim);
│                ─────                  │         filet vertical doble or a l'esquerra de cada plat parell;
│ 56                                    │         plats en ordre per files (1 | 2, 3 | 4…), 96 px entre files,
│               ╭──────────╮            │         i cap filet horitzontal
│               │ plat-02… │            │
                                                  h3: EB Garamond cursiva 26/1,2 vi (mòbil), 30 (≥ 900)
```

- **Sense enllaç al post (canvi del 2026-11-11):** els plats ja no porten "Veure la publicació a Instagram". L'article acaba en la història, o en el nom si no n'hi ha. L'únic enllaç a Instagram de la pàgina és el del perfil, al peu (§3.5).

- Al mòbil, entre plat i plat hi ha 56 px, un filet senzill or de 48 px centrat i 56 px més. Després de l'últim plat no hi ha filet.
- Entre 600 i 899 px, igual que al mòbil, amb marges de 32 px.
- **Filet vertical (corregeix la maqueta):** el filet doble va a la **vora esquerra de cada plat parell** (2, 4, 6…), no a la dreta dels senars. Així, si el nombre de plats és senar, l'últim no porta cap filet que no separi res.
- Les variants (sense foto, sense història, història llarga) són a §4.3-§4.5.

### 3.4 On som (`#on-som`)

```
375 px                                          1280 px
┌───────────────────────────────────────┐       ┌──────────────────────────────────────────────────────┐
│ fons vi clar, a sang                  │       │ fons vi clar, a sang; 80 px a dalt i a baix          │
│ 56                                    │       │                 ─────  On som  ─────                 │ h2 48
│                On som                 │       │ 16                                                   │
│                ─────                  │       │                                                      │
│ 16                                    │       │                 Carrer Sant Bru, 48                  │ adreça EB Garamond 30/1,3
│          Carrer Sant Bru, 48          │       │                   08911 Badalona                     │
│            08911 Badalona             │       │ 20                                                   │
│ 20                                    │       │                  [ Com arribar ]                     │
│          [ Com arribar ]              │       │ 32                                                   │
│ 32                                    │       │                       Horari                         │ h3 24
│               Horari                  │       │       De dilluns a dissabte, de 20:00 a 23:00        │ EB Garamond 21
│         De dilluns a dissabte,        │       │ 32                                                   │
│           de 20:00 a 23:00            │       │                      Telèfon                         │
│ 32                                    │       │                    936 27 35 36                      │ Jost 500 22
│              Telèfon                  │       │ 12                                                   │
│            936 27 35 36               │       │            [ Trucar al 936 27 35 36 ]                │ principal
│ 12                                    │       │                                                      │
│             [ Trucar ]                │       └──────────────────────────────────────────────────────┘
│ 56                                    │
└───────────────────────────────────────┘
```

- `h2` com el de "Els nostres plats": cursiva vi, amb el filet senzill a sota a < 600 px i als costats a ≥ 600 px (§3.3). Adreça en EB Garamond 400, 24 px (mòbil) / 30 px (≥ 900), interlineat 1,3, tinta, xifres de caixa alta, en dues línies. `h3` en EB Garamond cursiva 24 px vi. Horari en EB Garamond 400, 20/21 px, tinta. Telèfon en Jost 500 de 22 px, tinta, amb xifres de caixa alta.
- Els botons mantenen la seva amplada natural (farciment de 24 px), centrats; no ocupen tota l'amplada.
- **`hover` del botó secundari sobre vi clar (corregeix la maqueta):** el fons passa a paper, no a vi clar, que seria invisible.
- A l'escriptori, la secció continua sent una sola columna centrada (com a la maqueta), amb una amplada màxima de 36rem.

### 3.5 Peu

```
375 px                                          1280 px
│ 8                                     │       │                 ══════════════════                   │ filet doble or 160 px
│          ══════════════════           │       │ 20                                                   │
│ 20                                    │       │                    Bistrot 1954                      │ EB Garamond cursiva 22 vi
│             Bistrot 1954              │       │  @bistrot1954 a Instagram   Avís legal i privacitat   Castellano │ en una fila,
│       @bistrot1954 a Instagram        │       │                                                      │ 24 px entre enllaços
│        Avís legal i privacitat        │       │ 32                                                   │
│              Castellano               │       └──────────────────────────────────────────────────────┘
│ 72 + 16 + àrea segura (barra)         │
```

- Enllaços en Jost 500 de 16 px, vi i subratllats, cadascun amb una zona tàctil de 44 px d'alt. Al mòbil, un per línia.
- **(Completa la maqueta)** A ≥ 900 px, els tres enllaços van en una sola fila, centrats i separats 24 px.

### 3.6 Pàgina 404 (bilingüe)

```
375 px                                          1280 px (la mateixa composició, més gran)
┌───────────────────────────────────────┐       ┌──────────────────────────────────────────────────────┐
│ 48                                    │       │ 96                                                   │
│             Bistrot 1954              │       │                    Bistrot 1954                      │ p, EB Garamond cursiva 40 / 56 vi
│ 12                                    │       │                 ══════════════════                   │ (text, no enllaç)
│          ══════════════════           │       │ 40                                                   │
│ 32                                    │       │             Aquesta pàgina no existeix.              │ h1 lang="ca", EB Garamond 26 / 30 tinta
│      Aquesta pàgina no existeix.      │       │                   Anar a l'inici                     │ Jost 500 16 vi, subratllat
│            Anar a l'inici             │       │ 32                                                   │
│ 32                                    │       │                       ─────                          │ filet senzill de 48 px
│                ─────                  │       │ 32                                                   │
│ 32                                    │       │               Esta página no existe.                 │ p lang="es", mateix estil
│        Esta página no existe.         │       │                    Ir al inicio                      │
│             Ir al inicio              │       │ 96                                                   │
│ 48                                    │       └──────────────────────────────────────────────────────┘
└───────────────────────────────────────┘
```

- Sense barres, sense fotos i sense peu. Els enllaços porten a `/bistrot1954/` i `/bistrot1954/es/` (absoluts, amb `ruta()`), perquè la pàgina es pot servir des de qualsevol ruta.

### 3.7 Avís legal i privacitat (demostració)

```
375 px
┌───────────────────────────────────────┐  franja de 56 px, no fixa, fons paper
│ Bistrot 1954             Castellano   │  "Bistrot 1954": EB Garamond cursiva 24 vi, enllaç a l'inici
└───────────────────────────────────────┘
═══════════════════════════════════════════  filet doble or
│ 32                                    │
│        Avís legal i privacitat        │  h1 EB Garamond cursiva 32/1,1 vi, centrat
│ 12                                    │
│          ══════════════════           │  filet doble or de 160 px
│ 24                                    │
│ ┌───────────────────────────────────┐ │  avís de demostració: fons vi clar, vora vi d'1 px,
│ │ Pàgina de demostració. Les dades  │ │  farciment 16/20, Jost 500 16/1,5 tinta, centrat
│ │ del titular són fictícies i no    │ │
│ │ corresponen a cap persona ni      │ │
│ │ empresa real.                     │ │
│ └───────────────────────────────────┘ │
│ 48                                    │
│ Titular                               │  h2 EB Garamond cursiva 26 vi, ALINEAT A L'ESQUERRA
│ Titular                               │  dt: Jost 500 16 fum
│ Empresa Fictícia de Demostració, S.L. │  dd: EB Garamond 20 tinta + " (dada fictícia)" Jost 500 16 fum
│ (dada fictícia)                       │
│ …                                     │
│ Privacitat …                          │  paràgrafs EB Garamond 20/1,55 tinta, a l'esquerra
└───────────────────────────────────────┘  + peu i barra inferior com a la portada
```

```
1280 px
┌─ barra superior 64 px: "Bistrot 1954" (enllaç) a l'esquerra · Castellano · Com arribar · Trucar al … ┐
══════════════════════════════════════════════════════════════════════════════════════════════════════
│ 64                                                                                                   │
│                                    Avís legal i privacitat                                           │  h1 40
│                                      ══════════════════                                              │
│                  ┌──────────── avís de demostració (36rem) ─────────────┐                            │
│                  └──────────────────────────────────────────────────────┘                            │
│                  Titular                                                  ← columna de 36rem centrada; │
│                  …                                                          text a l'esquerra, 21/1,55 │
```

- **El text de l'avís legal va alineat a l'esquerra:** és text llarg i de consulta. Només el títol i l'avís de demostració van centrats. La maqueta no tenia pàgina legal i centrava tota la pàgina, de manera que aquest centrat general no s'hi ha d'aplicar.

---

## 4. Component "plat"

### 4.1 Anatomia

Cada plat és un `article` amb els ganxos d'arq. §4.5, **excepte l'enllaç al post, que des del 2026-11-11 no es renderitza** (decisió de l'Oriol; vegeu D-20). **Ordre al DOM (no es canvia): nom (`h3`) → finestra de la foto (`picture`) → història.** L'ordre visual és foto → nom → història, i es fa amb l'ordre de flex o de graella, sense alterar l'ordre de lectura. L'article no té cap element enfocable.

| Part | Element | Estil | Present |
|---|---|---|---|
| Foto | `picture` dins d'una finestra rodona | §6: cercle de 260 px (< 900) o 300 px (≥ 900), centrat | només si `imatge` ≠ `null` |
| Nom | `h3`, amb `lang` si difereix de la pàgina | EB Garamond cursiva 400, 26 px / 1,2 (< 900) o 30 px (≥ 900), vi, centrat, `text-wrap: balance`, `overflow-wrap: anywhere`; 20 px per sobre (0 si no hi ha foto) | sempre |
| Història | `div[data-historia]`, amb `lang` si difereix; un `p` per paràgraf i `br` entre línies | EB Garamond 400, 20 px / 1,55 (< 900) o 21 px / 1,55 (≥ 900), tinta, centrada, `text-wrap: pretty`, `overflow-wrap: anywhere`; amplada màxima 28em (< 900) i 400 px (la columna, ≥ 900); 0,6 em entre paràgrafs; 12 px per sobre | només si hi ha història |
- **Sense enllaç al post:** no hi ha "Veure la publicació a Instagram" ni "Veure la foto a Instagram", tampoc a les variants. `urlPost` continua al model de dades, però no es mostra. El perfil d'Instagram s'enllaça des del peu.
- **Espai entre paràgrafs (corregeix la maqueta):** 0,6 em, no 0,4 em. En un text centrat, 0,4 em no deixa veure on comença un paràgraf nou.
- Sense cap altre element: ni preu, ni etiquetes, ni icones, ni data (arq. P5), ni número d'ordre.

### 4.2 Distribució per breakpoint

| Amplada | Distribució | Separació entre plats |
|---|---|---|
| < 600 px | Una columna centrada amb marges de 24 px | 56 px + filet senzill or de 48 px + 56 px |
| 600-899 px | Igual, amb marges de 32 px | ídem |
| ≥ 900 px | Graella de 2 columnes de 480 px, centrada (960 px). Cada article té 40 px de farciment lateral i la seva columna de text és de 400 px. Filet vertical doble or a l'esquerra dels plats parells. Les files s'alineen a dalt. | 96 px entre files, sense filet horitzontal |

- **Desplaçament a l'àncora `#plat-NN`:** 16 px de marge superior a < 900 px i 88 px a ≥ 900 px (barra de 64 + 24). Amb la foto rodona a dalt de l'article, el nom queda visible a 375×667 (a y ≈ 300) sense cap ajust especial. **L'ajust de −72 px que la versió 1 necessitava al mòbil (D-18, punt 1) s'ha de treure.**

### 4.3 Plat sense foto

Avui tots els plats tenen foto, però els futurs podrien no tenir-ne (arq. §6.2).

- **És una entrada de carta sense imatge:** el nom (sense marge superior) i la història a sota. **No hi ha cap cercle buit**, cap requadre ni cap icona.
- Fins ara, aquesta variant enviava a la foto real amb "Veure la foto a Instagram". Sense l'enllaç, es queda com una línia de la carta sense foto, i ja està bé: no se substitueix per cap altre element ni cap text.
- A l'escriptori, l'entrada ocupa la seva columna com qualsevol altra i comença a dalt de la fila. Si l'altre plat de la fila té foto, aquesta columna té menys alçada; no s'omple.
- No hi ha `img` dins de l'article (arq. C-08).

### 4.4 Plat sense història

- No es renderitza `div[data-historia]` ni cap text en el seu lloc (arq. P1): la foto i el nom, i l'article acaba aquí.
- Sense foto ni història: només el nom, com una línia de la carta. No s'omple res.

### 4.5 Història llarga

Avui les històries fan entre 100 i 350 caràcters. El màxim realista és d'uns 1.100, i el cas de prova E9 en té uns 2.050.

- **Es mostra sencera, sempre:** sense "Llegir-ne més", sense degradat i sense límit de línies (arq. P3).
- **Alineació (corregeix la maqueta):** si la història fa **més de 500 caràcters** (suma de totes les línies, en l'idioma mostrat), el `div[data-historia]` passa a estar **alineat a l'esquerra**, dins de la mateixa columna centrada. El text centrat és agradable en descripcions curtes, però costa de llegir en textos llargs. El component ho decideix a partir del text (és presentació, no canvia el model de dades). Avui cap història arriba al límit, i totes van centrades.
- A l'escriptori, la fila creix fins on calgui; l'altre plat de la fila queda alineat a dalt.
- Les paraules o les URL molt llargues es parteixen per qualsevol punt (`overflow-wrap: anywhere`), sense scroll horitzontal.

### 4.6 Vista de detall

**No n'hi ha**, ni pàgina pròpia ni modal (arq. §5.2). Les històries es llegeixen senceres a la carta. Cada plat té la seva àncora estable (`/bistrot1954/#plat-05`, `/bistrot1954/es/#plat-05`) per compartir-lo. Des del 2026-11-11 no hi ha enllaç a la publicació original de cada plat.

### 4.7 Idioma del nom i de la història

A `/` es mostren el nom i la història en català, i a `/es/`, en castellà. Si en falta un, es mostra el de l'altre idioma tal qual, amb `lang` al `h3` o al `div[data-historia]` (arq. P2). No es marca de cap altra manera.

### 4.8 La història no repeteix el nom

L'arquitecte està canviant la neteja (canvi del 2026-11-11, decisió de l'Oriol) perquè la història d'un plat no comenci repetint el nom. Per exemple, la de plat-01 començarà per "Pasta que s'acaba a la paella…". El disseny no depèn d'aquest canvi: el nom en cursiva vi i la història en rodona tinta es llegeixen igual en tots dos casos. Els wireframes ja mostren la història sense el nom. El text exacte de cada història el fixa la fixture d'arq. §3.4.3, no aquest document.

---

## 5. Tokens de disseny

Els noms de la primera columna són els de les custom properties de `src/styles/tokens.css`. Substitueixen tots els de la versió 1.

### 5.1 Colors

| Token | Hex | Nom | Rol |
|---|---|---|---|
| `--paper` | `#FFFFFF` | Paper | Fons de la pàgina, de les barres i de l'avís legal. Text del botó principal. |
| `--vi` | `#6E1F2B` | Vi negre | `h1`, `h2`, `h3`, enllaços, selector, botó principal, vora del secundari, anell de focus. |
| `--vi-fosc` | `#4F1520` | Vi fosc | `hover` i `active` del botó principal. |
| `--tinta` | `#2B2422` | Tinta | Històries, presentació, horari, adreça, telèfon, text legal. |
| `--fum` | `#6B5F5A` | Fum | Text secundari: cuina, introducció dels plats, etiquetes de l'avís legal, "(dada fictícia)". |
| `--vi-clar` | `#F5E9EA` | Vi clar | Fons d'"On som" i de l'avís de demostració; fons del cercle mentre carrega la foto; `hover` del botó secundari sobre paper. |
| `--or` | `#A88A4A` | Or vell | Només filets (dobles i senzills). **Mai text ni vora de cap control.** |

Derivats: selecció de text amb fons vi i text paper. `color-scheme: light`; no hi ha mode fosc.

**Contrast de text** (WCAG 2.2, luminància relativa, arrodonit a la baixa):

| Text | Fons | Ràtio | On | Nivell |
|---|---|---|---|---|
| Tinta `#2B2422` | Paper `#FFFFFF` | 15,2:1 | històries, presentació, dades, avís legal | AAA |
| Vi `#6E1F2B` | Paper | 11,0:1 | títols, noms, enllaços, botó secundari | AAA |
| Fum `#6B5F5A` | Paper | 6,1:1 | cuina, introducció, etiquetes, "(dada fictícia)" | AA |
| Paper | Vi | 11,0:1 | botó principal | AAA |
| Paper | Vi fosc `#4F1520` | 14,3:1 | `hover` i `active` del botó principal | AAA |
| Vi | Vi clar `#F5E9EA` | 9,3:1 | `h2` i `h3` d'"On som"; `hover` del botó secundari sobre paper | AAA |
| Tinta | Vi clar | 12,8:1 | adreça, horari i telèfon d'"On som"; avís de demostració | AAA |

**Contrast no textual** (WCAG 1.4.11, mínim 3:1):
- botó principal vi sobre paper: 11,0:1;
- vora vi d'1 px del secundari: 11,0:1 sobre paper i 9,3:1 sobre vi clar;
- anell de focus vi: 11,0:1 sobre paper i 9,3:1 sobre vi clar.

Els filets or (3,2:1 sobre paper) són decoratius i no transmeten informació. El fons vi clar del cercle tampoc. Cap informació depèn només del color: els enllaços dins de text i els del peu van subratllats.

### 5.2 Tipografia

Dues famílies de Google Fonts, autoallotjades amb l'API de tipografies d'Astro (vegeu D-19 per al canvi a arq. §6.7):

| Família | Pesos i estils | Rol | Per què |
|---|---|---|---|
| **EB Garamond** | 400 normal i 400 cursiva (2 fitxers) | `h1`, `h2`, `h3` i nom del peu (cursiva); històries, presentació, adreça d'"On som", horari d'"On som", text legal i missatges de la 404 (rodona) | La Garamond de llibre de sempre: és la lletra d'una carta impresa i es llegeix bé a 20-21 px. La cursiva dona als noms dels plats la veu de la carta. Cobreix à, ç, l·l, ñ, ¿ i ¡. |
| **Jost** | 500 normal (1 fitxer) | Botons, navegació, selector, enllaços, cuina, introducció, horari i adreça de l'obertura, telèfon, etiquetes legals, peu | Geomètrica clara, del mateix esperit que les cartes impreses del segle XX. És clarament diferent de la Garamond. |

- **Pressupost:** 3 fitxers WOFF2, el màxim d'arq. §6.7, subconjunt `latin` i ≤ 120 KB en total (V-15). `font-display: swap`. Només es fa `preload` de l'EB Garamond 400 normal.
- **Reserves:** Georgia i `serif` per a l'EB Garamond; `system-ui` i `sans-serif` per a la Jost, amb l'ajust de mètriques automàtic d'Astro.
- **Sense negretes ni cursives sintètiques:** no hi ha cap pes 700. Els títols són cursiva 400, i `font-synthesis: none` evita que el navegador en fabriqui.
- **Xifres:** les de per defecte de l'EB Garamond (d'estil antic) al nom "Bistrot 1954" i a les històries. Xifres de caixa alta (`lining-nums`) a l'adreça d'"On som". La Jost ja les té de caixa alta (horari, telèfon, adreça de l'obertura).
- Sense majúscules forçades enlloc (`text-transform: none`), sense versaletes i sense espaiat ampliat.

**Escala**

| Token | < 900 px | ≥ 900 px | Interlineat | Ús |
|---|---|---|---|---|
| `--mida-marca` | 3.5rem (56 px) | 6rem (96 px) | 1 | `h1` "Bistrot 1954", EB Garamond cursiva |
| `--mida-titol` | 2.25rem (36 px) | 3rem (48 px) | 1,1 | `h2` "Els nostres plats" i "On som" |
| `--mida-plat` | 1.625rem (26 px) | 1.875rem (30 px) | 1,2 | `h3` nom del plat |
| `--mida-subtitol` | 1.5rem (24 px) | 1.5rem (24 px) | 1,2 | `h3` "Horari" i "Telèfon"; "Bistrot 1954" a la franja i a la barra de les pàgines legals |
| `--mida-adreca` | 1.5rem (24 px) | 1.875rem (30 px) | 1,3 | adreça d'"On som" |
| `--mida-text` | 1.25rem (20 px) | 1.3125rem (21 px) | 1,55 | històries, horari d'"On som", text legal |
| `--mida-presentacio` | 1.25rem (20 px) | 1.375rem (22 px) | 1,55 | presentació de l'obertura |
| `--mida-telefon` | 1.375rem (22 px) | 1.375rem (22 px) | 1,3 | número de telèfon (Jost) |
| `--mida-ui` | 1rem (16 px) | 1rem (16 px); 1.125rem (18 px) a les dades de l'obertura | 1,4-1,5 | Jost: botons, enllaços, dades, introducció, peu |
| `--mida-peu-nom` | 1.375rem (22 px) | 1.375rem (22 px) | 1,3 | "Bistrot 1954" del peu |
| `--mida-legal-titol` | 2rem (32 px) | 2.5rem (40 px) | 1,1 | `h1` de l'avís legal |
| `--mida-legal-h2` | 1.625rem (26 px) | 1.625rem (26 px) | 1,2 | `h2` de l'avís legal |
| `--mida-404-marca` | 2.5rem (40 px) | 3.5rem (56 px) | 1,1 | "Bistrot 1954" a la 404 |
| `--mida-404-missatge` | 1.625rem (26 px) | 1.875rem (30 px) | 1,3 | missatges de la 404 |

Cap text visible fa menys de 16 px.

### 5.3 Espaiat, mides, filets i radis

**Escala d'espaiat** (`--espai-1` a `--espai-11`): 4, 8, 12, 16, 20, 24, 32, 48, 64, 96 i 128 px, la mateixa de la versió 1. Els espais de 40, 56 i 80 px dels wireframes són sumes de dos graons (16 + 24, 24 + 32 i 32 + 48).

| Token | Valor | Ús |
|---|---|---|
| `--marge` | 24 px (< 600), 32 px (600-899), 48 px (≥ 900) | marge lateral |
| `--contenidor` | 68rem (1088 px) | contingut de la barra superior |
| `--carta` | 60rem (960 px) | les dues columnes de plats a ≥ 900 px |
| `--columna-plat` | 480 px, amb 40 px de farciment lateral (text de 400 px) | cada plat a ≥ 900 px |
| `--mesura-curta` | 28em | presentació (< 900) i històries (< 900) |
| `--mesura` | 36rem | presentació (≥ 900), "On som", avís legal |
| `--cercle` | 260 px (< 900), 300 px (≥ 900) | diàmetre de la foto |
| `--barra-inf-alt` / `--barra-sup-alt` | 72 px / 64 px | barres fixes |
| `--filet-doble` | 3 px, estil doble (1 + 1 + 1 px), or | sota l'`h1` (160 px; 220 px a ≥ 900), vora superior de la barra inferior, vora inferior de la barra superior, a dalt del peu (160 px), entre columnes de plats (vertical), a les dades de l'obertura (vertical, ≥ 900), a la 404 i a l'avís legal |
| `--filet-senzill` | 1 px, sòlid, or | als `h2` (48 px; a sota a < 600 px, als costats a ≥ 600 px), entre plats al mòbil (48 px), a la 404 (48 px) |
| `--radi` | 0 | botons, avís de demostració, tot |
| `--radi-foto` | 50 % | només la finestra de la foto |
| `--focus` | contorn de 3 px vi, separat 3 px de l'element, seguint-ne la forma | anell de focus |

**Filets (corregeix la maqueta):** la maqueta dibuixava els filets "dobles" com una caixa de 2 px d'alt amb dues vores d'1 px que, amb `box-sizing: border-box`, quedaven enganxades i es veien com una sola línia de 2 px. El filet doble ha de ser de **3 px amb estil doble** (es veuen dues línies d'1 px separades per 1 px d'aire), com ja feia el filet vertical entre columnes. El filet senzill és d'**1 px**.

### 5.4 Ombres

Cap. Les barres se separen del contingut amb el filet doble, no amb una ombra.

### 5.5 Breakpoints

| Token | Valor | Què canvia |
|---|---|---|
| (base) | < 600 px | mòbil: una columna, marges de 24 px, barra inferior |
| `--bp-tauleta` | 600 px | marges de 32 px |
| `--bp-escriptori` | 900 px | barra superior en lloc de la inferior, carta de dues columnes, cercle de 300 px, mides grans, dades de l'obertura en una línia, peu en una fila |
| (alçada) | < 480 px d'alçada | la barra inferior deixa de ser fixa |

El breakpoint de 1200 px de la versió 1 desapareix. Les media queries són d'amplada mínima (mobile-first).

---

## 6. Tractament d'imatge

### 6.1 Les fonts reals

Les 8 fotos (`contingut/imatges/plat-01.jpeg` … `plat-08.jpeg`) són captures d'Instagram d'uns 450×600 px (plat-02 en fa 453 d'ample), i no n'hi haurà de més grans (D-09). La majoria porten la **fletxa del carrusel** a la dreta, a partir del 91,8 % de l'amplada, i els **punts de paginació** a baix, a partir del 96 % de l'alçada. Zona permesa: fins al **88,9 %** de l'amplada i fins al **93,3 %** de l'alçada. Cap foto es mostra més gran que la seva mida real.

### 6.2 Finestra rodona

La foto es veu dins d'una **finestra circular** (proporció 1:1, cantonades del 50 %, `overflow: hidden`, fons vi clar mentre carrega), centrada a l'article.

- **Part visible de la captura:** el quadrat que va del 0 % al 88,9 % de l'amplada i del 16,7 % a l'83,3 % de l'alçada. En una captura de 450×600 són els píxels de x = 0 a 400 i de y = 100 a 500, on sempre hi ha el plat. La fletxa (a partir del 91,8 %) i els punts (a partir del 96 %) queden fora, i les cantonades del quadrat les talla el cercle.
- **Com es fa (CSS, sense retall en el build):**
  - la imatge es genera sencera, com ara;
  - dins de la finestra es mostra al **112,5 %** de l'amplada de la finestra, amb alçada automàtica, sense `object-fit`, ancorada a l'esquerra;
  - es desplaça cap amunt amb un **marge superior del −25 %**, que es calcula sobre l'amplada de la finestra. Equival a 100 px de la captura.

  Respecte d'arq. §6.3 canvien la proporció (1:1 en lloc de 5:7), la forma (cercle), l'ancoratge vertical i el `sizes`. Està apuntat com a conflicte a D-19.
- **Per què centrat en vertical i no ancorat a dalt:** ancorat a dalt, el quadrat seria de y = 0 a 400 i deixaria fora el centre del plat en diverses fotos (plat-04, 06 i 07, amb el menjar entre y ≈ 160 i 530).
- Funciona igual per a captures de mida lleugerament diferent, perquè tot és en percentatges.
- Sense marcs, ombres, filtres, superposicions ni text a sobre, i sense efectes en passar-hi el ratolí.

### 6.3 Mides

| Amplada de la pantalla | Diàmetre del cercle | Imatge renderitzada (112,5 %) | Variant que fa servir el navegador |
|---|---|---|---|
| < 900 px | 260 px | 293 × 390 px | 360 (densitat 1×) o 450 (2× o més) |
| ≥ 900 px | 300 px | 338 × 450 px | 360 o 450 |

- `sizes` = `(min-width: 900px) 338px, 293px` (el que fa servir la maqueta, que es dona per bo).
- `widths` sense canvis respecte d'arq. §6.3: `[360, ample real]`. La imatge renderitzada (338 px com a màxim) sempre és més petita que la font: mai s'amplia.
- `width` i `height` de l'`img` són les mides reals de la font. La finestra reserva l'espai amb la proporció 1:1 i no hi ha salts de maquetació.
- La primera foto de la pàgina (plat-01) és prioritària i la resta es carreguen en diferit (arq. §6.5).
- `alt` = nom del plat en l'idioma de la pàgina (arq. §4.5).

### 6.4 Imatge per compartir (`public/og.jpg`)

Tipogràfica, 1200×630 px, JPEG de ≤ 150 KB, sense cap foto:

- fons paper;
- tot centrat horitzontalment i el bloc centrat verticalment;
- "Bistrot 1954" en EB Garamond cursiva 400 de 140 px, vi;
- 24 px més avall, un filet doble or de 240 px (de 6 px: 2 + 2 + 2);
- 32 px més avall, "Cuina mediterrània" (Jost 500 de 36 px, fum) i "Carrer Sant Bru, 48, Badalona" (Jost 500 de 36 px, tinta), una dada per línia.

`og:image:alt` no canvia. Es genera amb `npm run og`, i l'script ha de carregar l'EB Garamond i la Jost (D-19).

### 6.5 Icones del lloc

La mateixa geometria de la versió 1 (un plat vist des de dalt), amb els colors nous:

- `favicon.svg`: cercle ple vi de 32×32 amb un anell paper a dins (diàmetre exterior 20, gruix 2,5), centrat.
- `apple-touch-icon.png`: 180×180, fons vi sencer, amb l'anell paper centrat (diàmetre 104, gruix 8).

---

## 7. Interaccions i animacions

La web és estàtica i **no necessita JavaScript** per a res del que es descriu aquí.

| Element | Repòs | `hover` (només amb `hover: hover`) | `focus-visible` | `active` |
|---|---|---|---|---|
| Botó principal | fons vi, vora vi d'1 px, text paper | fons i vora vi fosc | anell vi de 3 px a 3 px | fons vi fosc |
| Botó secundari sobre paper | transparent, vora vi d'1 px, text vi | fons vi clar | anell vi | fons vi clar |
| Botó secundari sobre vi clar ("On som") | transparent, vora vi, text vi | **fons paper** | anell vi | fons paper |
| Enllaç dins de text, peu, selector | vi, subratllat d'1 px separat 0,2 em | subratllat de 2 px | anell vi | — |
| Enllaços de navegació de la barra superior | vi, sense subratllar | subratllat d'1 px | anell vi i subratllat | — |
| Enllaç per saltar ("Vés als plats") | fora de la vista | — | apareix a dalt a l'esquerra, fons paper, text vi, anell vi | — |

- **Transicions:** només de color, fons, vora i gruix del subratllat, 150 ms, `ease-out`. No hi ha el desplaçament d'1 px en prémer de la versió 1: la carta és tranquil·la.
- **Desplaçament a les àncores:** suau només amb `prefers-reduced-motion: no-preference`. Marges de desplaçament: a < 900 px, 16 px a dalt i 88 px a baix; a ≥ 900 px, 88 px a dalt i 16 px a baix. Els mateixos marges eviten que una barra tapi l'element enfocat (WCAG 2.4.11).
- **No hi ha:** animacions d'entrada, aparicions en fer scroll, parallax, carrusels, *lightbox*, zoom de fotos, vídeos ni comptadors.
- **`prefers-reduced-motion: reduce`:** transicions de 0 s i desplaçament instantani.

---

## 8. Crides a l'acció

**"Trucar" és l'única crida de reserva** (D-02). "Com arribar" és un enllaç d'informació amb l'estil secundari. No hi ha WhatsApp, plataforma de reserves ni correu.

| Crida | Text visible | On és | Destí | Estil |
|---|---|---|---|---|
| **Trucar** | "Trucar" (barra inferior; "On som" a < 900); "Trucar al 936 27 35 36" (barra superior; "On som" a ≥ 900) | barra inferior, barra superior, "On som" | `tel:+34936273536` | principal |
| **Com arribar** | "Com arribar" | barra inferior, barra superior, "On som" | `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`, a la mateixa pestanya | secundari |
| Compte d'Instagram | "@bistrot1954 a Instagram" | peu | `https://www.instagram.com/bistrot1954/` | enllaç |
| Idioma | "Castellano" (pàgines ca) / "Català" (pàgines es), amb `lang` i `hreflang` | obertura (< 900), barra superior (≥ 900), peu, franja o barra de les pàgines legals | pàgina equivalent de l'altre idioma (`/` ↔ `/es/`, `/avis-legal/` ↔ `/es/aviso-legal/`, amb `base`) | enllaç |
| Seccions | "Plats", "On som" | barra superior de la portada | `#plats`, `#on-som` | enllaç de navegació |
| Inici (pàgines legals) | "Bistrot 1954" | franja (< 900) o barra superior (≥ 900) | portada del mateix idioma | enllaç |
| Avís legal | "Avís legal i privacitat" | peu | `/avis-legal/` (ca), `/es/aviso-legal/` (es) | enllaç |
| Saltar | "Vés als plats" | primer element enfocable de la portada | `#plats` | enllaç |
| 404 | "Anar a l'inici" / "Ir al inicio" | 404 | `/bistrot1954/` i `/bistrot1954/es/` | enllaç |

Regles:

- **"Trucar" i "Com arribar" són visibles sense fer scroll** a la portada i a les pàgines legals, a qualsevol amplada, i continuen visibles mentre es fa scroll.
- El número es mostra com a text a "On som" i a la barra superior: "936 27 35 36", sense prefix. L'enllaç porta el prefix (`tel:+34936273536`).
- Com a màxim dos botons junts, i el principal sempre és "Trucar".
- Cap text de botó porta fletxes, emojis ni signes d'exclamació.

---

## 9. Textos d'interfície i idiomes

### 9.1 Idiomes

La web és **bilingüe: català a `/` (per defecte) i castellà a `/es/`**, amb selector d'idioma (D-01). Cada pàgina mostra la història del caption en el seu idioma, mai traduïda (arq. §3.3). Els textos d'interfície es tradueixen i viuen a `src/i18n/textos.ts`; els de l'avís legal, a `src/i18n/legal.ts`.

### 9.2 Textos

Són els de la versió 1, excepte el títol i el subtítol de la secció de plats, que canvien, i els dos textos de l'enllaç del plat, que desapareixen. Tots tres canvis són del 2026-11-11.

| Clau | Català | Castellà |
|---|---|---|
| Saltar | Vés als plats | Ir a los platos |
| Navegació: nom accessible | Seccions | Secciones |
| Navegació: plats | Plats | Platos (es manté curt: és l'etiqueta de la barra, i porta al títol "Els nostres plats" / "Nuestros platos") |
| Navegació: on som | On som | Dónde estamos |
| Barra inferior: nom accessible | Accions | Acciones |
| Selector d'idioma | Castellano (amb `lang="es"`) | Català (amb `lang="ca"`) |
| Títol de la secció de plats (canvi del 2026-11-11) | Els nostres plats | Nuestros platos |
| Subtítol de la secció de plats (canvi del 2026-11-11; text de l'Oriol) | Un recull de l'experiència que et trobaràs. | Una muestra de la experiencia que te encontrarás. |
| ~~Enllaç del plat~~ (eliminat el 2026-11-11) | — | — |
| ~~Enllaç del plat sense foto~~ (eliminat el 2026-11-11) | — | — |
| Com arribar | Com arribar | Cómo llegar |
| Trucar (curt) | Trucar | Llamar |
| Trucar (llarg) | Trucar al 936 27 35 36 | Llamar al 936 27 35 36 |
| Títol d'"On som" | On som | Dónde estamos |
| Subtítol d'horari | Horari | Horario |
| Subtítol de telèfon | Telèfon | Teléfono |
| Compte d'Instagram | @bistrot1954 a Instagram | @bistrot1954 en Instagram |
| Avís legal | Avís legal i privacitat | Aviso legal y privacidad |
| Avís de demostració | Pàgina de demostració. Les dades del titular són fictícies i no corresponen a cap persona ni empresa real. | Página de demostración. Los datos del titular son ficticios y no corresponden a ninguna persona ni empresa real. |
| Marca de dada fictícia | (dada fictícia) | (dato ficticio) |
| 404 | Aquesta pàgina no existeix. / Anar a l'inici | Esta página no existe. / Ir al inicio |

Els textos següents surten de `contingut/restaurant.yaml` i no s'escriuen a mà: nom, tipus de cuina, adreça, telèfon, horari i presentació (literal de l'Oriol, sense emojis; arq. §4.3.2). El títol i la descripció de la pàgina són els d'arq. §7.1.

### 9.3 Format de l'horari

Una línia per franja, amb el format ja implementat (`formataHorari`): "De dilluns a dissabte, de 20:00 a 23:00" / "De lunes a sábado, de 20:00 a 23:00". No s'hi afegeix "Diumenge tancat" ni cap frase que no surti de les dades. A l'obertura, a < 900 px, el text es parteix on calgui per amplada (`text-wrap: balance`); no es reformula.

### 9.4 To

Frases curtes, verbs en infinitiu als botons ("Trucar"), sense majúscules forçades ni exclamacions. La interfície no parla del menjar ni del restaurant: això ho fan les històries i la presentació.

---

## 10. Criteris d'acceptació visuals per al QA

Es comproven sobre `npm run preview` (`http://localhost:4321/bistrot1954/` i `/bistrot1954/es/`) amb Playwright i `deviceScaleFactor: 1`, a 320×568, 375×667, 768×1024 i 1280×800, si no es diu una altra cosa. Complementen els criteris tècnics d'arq. §11. Els valors substitueixen els de la versió 1.

### Distribució i accions

| ID | Criteri |
|---|---|
| V-01 | A 320, 375, 768 i 1280 px no hi ha scroll horitzontal (`scrollWidth` ≤ amplada de la finestra) a la portada, a l'avís legal i a la 404, en tots dos idiomes. |
| V-02 | A 320×568 i 375×667, "Trucar" i "Com arribar" són visibles sense scroll i continuen visibles a la meitat i al final de la pàgina, tant a la portada com a l'avís legal. |
| V-03 | A 1280×800, la barra superior amb "Trucar al 936 27 35 36" i "Com arribar" és visible en carregar i després de fer scroll fins al final. |
| V-04 | Els botons "Trucar" enllacen a `tel:+34936273536` i els de "Com arribar", a `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`. No hi ha cap enllaç `wa.me`, `mailto:` ni de plataforma de reserves. |
| V-05 | A 375×667, sense scroll i per sobre de la barra inferior (y < 595), es veuen sencers l'`h1`, la cuina, el bloc `[data-presentacio]`, l'horari i l'adreça. La vora superior de la primera foto és a y < 900. A 1280×800, es veuen sense scroll l'`h1`, la presentació, l'horari i l'adreça, i la vora superior de la primera foto és a y < 800. |
| V-06 | L'horari "De dilluns a dissabte, de 20:00 a 23:00" (a `/es/`: "De lunes a sábado, de 20:00 a 23:00") es veu a l'obertura sense scroll a 375×667, i també a "On som". |
| V-07 | A 375×667, el selector d'idioma és visible sense scroll: a `/` diu "Castellano" (`lang="es"`, porta a `/bistrot1954/es/`); a `/es/`, "Català" (`lang="ca"`, porta a `/bistrot1954/`). |
| V-08 | A < 900 px, el centre horitzontal del cercle, del nom i de la història de cada plat coincideix amb el centre de la finestra (±2 px). A 1280 px, els plats formen dues columnes de 480 px (±2) centrades: el plat 1 a l'esquerra, el 2 a la dreta, el 3 a l'esquerra… Els plats parells tenen un filet vertical doble or a l'esquerra i els senars no en tenen cap. |
| V-09 | En obrir `/bistrot1954/#plat-05`, el nom de plat-05 és visible: a 1280×800, la seva vora superior és a ≥ 64 px; a 375×667, és a y < 595. |

### Fotos

| ID | Criteri |
|---|---|
| V-10 | La finestra de cada foto és un cercle: amplada = alçada = 260 px (±1) a < 900 px i 300 px (±1) a ≥ 900 px, amb `border-radius` del 50 % i `overflow: hidden`. |
| V-11 | Cap foto es mostra més gran que la seva font: l'amplada renderitzada de cada `img` (293 o 338 px) és ≤ l'ample real del fitxer de `currentSrc`. No es compara amb `naturalWidth` (D-18, punt 4). |
| V-12 | Revisió visual (captura de cada plat a 375 i a 1280 px): cap cercle mostra la fletxa del carrusel ni els punts d'Instagram, i a tots es veu el plat. |
| V-13 | Cap element se superposa a una foto (excepte les barres fixes quan hi passen per sobre en fer scroll). Les fotos no tenen ombra, vora ni filtre. |

### Tipografia, color i filets

| ID | Criteri |
|---|---|
| V-14 | El text de `[data-historia]` és EB Garamond 400 normal, de 20 px a 375 px i 21 px a 1280 px, amb interlineat ≥ 1,5 vegades la mida i `text-align: center` (excepte les històries de > 500 caràcters, V-26). Amplada: ≤ 28em a 375 px i ≤ 400 px a 1280 px. |
| V-15 | Només es carreguen EB Garamond (normal i cursiva) i Jost: ≤ 3 fitxers WOFF2 i ≤ 120 KB en total. |
| V-16 | Cap text visible fa menys de 16 px; cap element té `text-transform: uppercase`; els `h1`, `h2` i `h3` tenen `font-weight` 400 i `font-style` italic, i `font-synthesis` és `none`. |
| V-17 | axe a 375 i 1280 px: 0 violacions de `color-contrast`. Els colors calculats coincideixen amb §5.1: fons `rgb(255, 255, 255)`, `h1` `rgb(110, 31, 43)`, història `rgb(43, 36, 34)`, fons d'"On som" `rgb(245, 233, 234)`. |
| V-31 | Els filets dobles (sota l'`h1`, a dalt de la barra inferior, a baix de la barra superior, a dalt del peu, entre columnes i entre les dades de l'obertura) tenen 3 px d'estil `double` de color `rgb(168, 138, 74)`. Els senzills (als `h2`, a sota a < 600 px i als costats a ≥ 600 px; entre plats al mòbil; a la 404) són d'1 px. Cap filet or té cap funció interactiva. |

### Accessibilitat d'interacció

| ID | Criteri |
|---|---|
| V-18 | Amb Tab a 375 i 1280 px, cada element enfocable mostra un anell visible (3 px vi, contrast ≥ 3:1 amb el fons) i cap queda completament tapat per una barra fixa. |
| V-19 | El primer Tab de la portada mostra "Vés als plats", que porta el focus a `#plats`. |
| V-20 | Els botons fan ≥ 44 × 44 px (48 px d'alt a la barra inferior). La resta d'enllaços tenen una zona de ≥ 44 px d'alt. |
| V-21 | Amb `prefers-reduced-motion: reduce` emulat, la `transition-duration` dels botons és `0s` i el desplaçament a les àncores és instantani. |
| V-22 | A 667×375 (mòbil apaïsat), la barra inferior no és fixa: és al final de la pàgina. |
| V-23 | Amb l'espaiat de text de WCAG 1.4.12 (interlineat 1,5, 0,12 em entre lletres, 0,16 em entre paraules, 2 em entre paràgrafs), cap text queda tallat ni superposat. |

### Variants i casos límit

Es comproven amb un build temporal que no es versiona: traient la foto d'un plat o fent servir les entrades sintètiques d'arq. §3.4.4 en un fitxer de prova.

| ID | Criteri |
|---|---|
| V-24 | Plat sense foto: l'article no té `img`, ni cap element circular buit, ni cap enllaç; el nom té 0 px de marge superior i va seguit de la història. |
| V-25 | Plat sense història (E2): no hi ha `[data-historia]` ni cap text en el seu lloc; l'article acaba en el nom. Sense foto ni història, l'article només conté el `h3`. |
| V-26 | Història llarga (E9): es veu sencera (cap retall, cap "llegir-ne més", `scrollHeight` = `clientHeight`), amb `text-align` `start`/`left` perquè té > 500 caràcters, i sense scroll horitzontal. A 1280 px, l'altre plat de la fila queda alineat a dalt. |

### Altres pàgines

| ID | Criteri |
|---|---|
| V-27 | `/avis-legal/` i `/es/aviso-legal/`: l'avís de demostració és visible sense scroll a 375×667, abans de qualsevol dada del titular. Cada dada fictícia porta "(dada fictícia)" / "(dato ficticio)". El text (`h2`, `dl` i paràgrafs) va alineat a l'esquerra, i el títol, centrat. El peu de la portada hi enllaça. |
| V-28 | 404 a `/bistrot1954/no-existeix/` i `/bistrot1954/es/no-existeix/`: es veuen el missatge en català (`h1`) i en castellà, centrats, i els enllaços porten a `/bistrot1954/` i `/bistrot1954/es/`. No hi ha barres ni fotos. |
| V-34 | (2026-11-11) Cap `article[data-plat-id]` conté cap element `a`. A `/` i `/es/` no hi ha cap enllaç a `instagram.com/p/` ni a `instagram.com/reel/`. L'únic enllaç a Instagram és el del perfil al peu (`https://www.instagram.com/bistrot1954/`), amb el text "@bistrot1954 a Instagram" / "@bistrot1954 en Instagram". |
| V-35 | (2026-11-11) L'`h2` de `#plats` diu exactament "Els nostres plats" a `/` i "Nuestros platos" a `/es/`. El subtítol diu exactament "Un recull de l'experiència que et trobaràs." / "Una muestra de la experiencia que te encontrarás.", en Jost 500 16 px fum. A 320 i 375 px, el títol no provoca scroll horitzontal i el filet senzill és a sota (la seva vora superior queda ≥ 8 px per sota de la vora inferior del text). A 1280 px, els filets són als costats. A la barra superior, l'enllaç continua dient "Plats" / "Platos". |
| V-29 | El QA desa captures de `/` i `/es/` a 375 i 1280 px (pàgina sencera), de l'avís legal i de la 404 a `tests/captures/`, i les compara amb els wireframes de §3. Ha de coincidir l'ordre de l'obertura: selector, nom, filet, cuina, presentació, horari, adreça, filet. |
| V-30 | Presentació (`[data-presentacio]`, dins de `#inici`): EB Garamond 400 normal, 20 px a 375 px i 22 px a 1280 px, interlineat 1,55, color `rgb(43, 36, 34)`, centrada, amplada ≤ 28em a 375 px i ≤ 36em a 1280 px. Al DOM i a la pantalla va després de la cuina i abans de l'horari. |
| V-32 | La web final no té pàgines `/propostes/` (cap fitxer a `dist/propostes/`), i `dist/` no conté tipografies de cap altra família que EB Garamond i Jost. |
| V-33 | `public/og.jpg` fa 1200×630 i ≤ 150 KB, i a la revisió visual coincideix amb §6.4: fons blanc, "Bistrot 1954" en cursiva vi i filet or. Les icones (pestanya i `apple-touch-icon`) són vi amb l'anell blanc. |

---

## 11. Supòsits

1. **Fotos.** Les 8 captures de ~450×600 són definitives (D-09). El cercle (x de 0 a 88,9 %, y de 16,7 a 83,3 %) amaga la interfície d'Instagram en totes i manté el plat al centre. Els plats futurs seran captures semblants.
2. **To.** "La carta" ha de semblar una carta de bistrot proper, no un restaurant formal. Per això no hi ha versaletes, ni marcs, ni ornaments a més dels filets, i els botons i els textos són directes. Era el risc principal de la proposta P3 i es controla així.
3. **Ordre de l'obertura.** La presentació va abans de les dades, per composició de carta, a diferència de la versió 1 (D-15). L'horari continua visible sense scroll a 375×667 (V-05, V-06). A 320×568 pot quedar parcialment sota la barra, i s'accepta.
4. **Història llarga.** El llindar de 500 caràcters per passar a alinear a l'esquerra és un criteri de lectura del disseny. No afecta cap història d'avui.
5. **Tipografies.** L'EB Garamond (normal i cursiva) i la Jost 500 haurien de cabre en 3 fitxers i 120 KB (subconjunt `latin`). Si no hi caben, ho ha de decidir l'arquitecte (D-19, punt 2).
6. **Sense mode fosc.** La identitat és el paper blanc i la tinta vi.
7. **Maqueta.** Els detalls de `src/propostes/p3.css` que no es corregeixen aquí es donen per bons. Les pàgines `/propostes/`, `src/propostes/` i les tipografies de les altres propostes no passen a la web final.
8. **Una sola pàgina per idioma**, sense vista de detall ni modal, i tots els textos d'interfície ja existents.
9. **Visitants.** La majoria entren amb el mòbil des del navegador intern d'Instagram, amb una àrea visible d'uns 375×600 px.
10. **"1954".** No s'explica ni s'insinua cap origen del nom. L'estètica de carta clàssica no vol suggerir antiguitat: no hi ha cap "des de" ni cap data.
11. **Sense enllaç al post (2026-11-11).** Els plats no porten enllaç a la seva publicació, per decisió de l'Oriol. L'enllaç al perfil del peu es manté. Si un plat futur no té ni foto ni història, es mostra només el nom: és una línia de carta acceptable i no s'omple amb res.
12. **Títol a la barra.** L'enllaç de la barra superior continua dient "Plats" / "Platos", perquè és una etiqueta de navegació curta i paral·lela a "On som". El títol llarg és el de la secció.
