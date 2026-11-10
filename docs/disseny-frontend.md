# Disseny frontend · Web del Bistrot 1954

Versió 1 · 2026-11-10 · autor: dissenyador-frontend

> Aquest document decideix l'aspecte i la distribució de la web dins del marc tècnic de `docs/arquitectura.md` (abreujat "arq."). No conté codi: conté especificacions, tokens i wireframes. Les tasques que se'n deriven són a `docs/tasques.md`, secció `## Frontend`. Els conflictes amb l'arquitectura són a `docs/dubtes.md` (D-11).
>
> **Respostes de l'Oriol ja incorporades** (transmeses pel coordinador el 2026-11-10, amb la correcció posterior): web bilingüe ca (`/`) + es (`/es/`) amb selector d'idioma (D-01); l'única crida de reserva és **Trucar** al 936 27 35 36, `tel:+34936273536`, sense WhatsApp, plataforma ni correu (D-02); horari de dilluns a dissabte de 20:00 a 23:00, sense preu (D-03); domini `bistrot1954.cat` publicat a GitHub Pages (D-04); avís legal de demostració amb dades fictícies marcades com a tals (D-05); "Cuina mediterrània" confirmat (D-06); noms dels plats correctes (D-07); les fotos són les de la carpeta, de ~450×600 px, i no n'hi haurà de més grans (D-09); "Com arribar" obre la fitxa https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA (D-10).

---

## 1. Concepte visual

**"Pisa blava".** La web és com un plat de pisa del mateix restaurant: una vora blau cobalt a dalt i a baix, i al mig un fons blanc de porcellana on només hi ha el menjar i el que el restaurant n'explica. El blau és el de la vaixella que surt a les fotos, i és el color complementari dels taronges i vermells dels plats (safrà, rovell, tonyina, tàrtar), de manera que la interfície fa ressaltar la foto en lloc de competir-hi. La lletra és una serif cal·ligràfica pensada per a textos llargs, perquè les històries es llegeixin com una carta escrita a mà, amb ofici i sense floritures.

### 1.1 D'on surt (les 8 fotos reals)

| Què es veu a les fotos | Com passa al disseny |
|---|---|
| Plats de pisa blanca amb flors blau cobalt (plat-02, 04, 05, 07) | El cobalt és l'únic color de la interfície; el blanc de porcellana és el fons. |
| Menjar en tons càlids: safrà, rovell d'ou, tonyina, tàrtar, fregits daurats | No hi ha cap color càlid a la interfície: el posen les fotos. |
| Mans de cuiner treballant (plat-03, 04, 06, 07); taulell d'acer; fusta de la barra | Tipografia amb traç de ploma (Alegreya), no una lletra de revista. Un gris acer per al text secundari. |
| Paper amb "BISTROT 1954" imprès sota les croquetes (plat-06) | El nom del restaurant és l'element tipogràfic gran de la pàgina, amb xifres d'estil antic. |
| Fotos verticals, fosques al fons i amb llum càlida al plat | Finestra vertical 5:7 per a totes, sense marcs, ombres, filtres ni cantonades arrodonides. |
| Les 8 fotos són captures de 450×600 px: la majoria porten la fletxa del carrusel d'Instagram (a la dreta, a mitja alçada) i els punts de paginació (a baix) | La finestra 5:7 ancorada a dalt a l'esquerra deixa fora tots dos elements (§6.2). Cap foto es mostra més gran que la seva mida real. |

### 1.2 Revisió del pla (què he descartat i per què)

- **Fons crema amb accent terracota:** és el "bistrot genèric". El canvio per porcellana freda i cobalt, que surten de la vaixella real.
- **Mar i blanc "mediterrani" (blau cel, ones, rajoles):** seria un tòpic. El cobalt és el de la pisa, profund i lleugerament violeta, i no hi ha cap motiu decoratiu.
- **Patró de flors blaves com a decoració:** l'he tret. L'únic gest atrevit és el color de la vora i el nom gran. La resta és silenci.
- **Graella de targetes amb ombra:** no hi ha targetes. Cada plat és una fila neta, com una línia de la carta.
- **Numerar els plats (01, 02…):** no són una seqüència; no es numeren.
- **Columna lateral fixa amb les dades del restaurant a l'escriptori:** robava amplada a la història. Les accions van a una barra fixa.
- **Zig-zag foto esquerra / foto dreta:** és una plantilla. La foto sempre va a l'esquerra i el ritme el donen les mateixes fotos.

### 1.3 Principis

1. **La foto mana.** Cap element se superposa a una foto, ni text, ni icones, ni degradats.
2. **Una sola gosadia:** la vora cobalt amb el nom gran del restaurant. Tota la resta és sòbria.
3. **Llegir bé:** història a 19-20 px, interlineat 1,6, línies de 38 a 65 caràcters, alineada a l'esquerra i sense justificar.
4. **Trucar i arribar són a un toc:** "Trucar" (la crida principal) i "Com arribar" (informació) sempre a la vista, en mòbil i en escriptori.
5. **Res inventat:** cap eslògan, cap text sobre el restaurant que no sigui a `contingut/restaurant.yaml` o a un caption.

---

## 2. Mapa del lloc i ordre de les seccions

La web és una sola pàgina per idioma (arq. §5.2): `/` en català i `/es/` en castellà. No hi ha pàgina de detall ni modal (vegeu §4.6).

| Ordre | Secció (àncora) | Element | Propòsit |
|---|---|---|---|
| 0 | Enllaç per saltar | `Vés als plats` (visible només amb el focus) | Accés directe als plats amb teclat. |
| 1 | Barra superior (només ≥ 900 px) | navegació, selector d'idioma, "Com arribar", "Trucar al 936 27 35 36" | Tenir trucar i arribar sempre a mà a l'escriptori. |
| 2 | Obertura (`#inici`) | `h1` "Bistrot 1954", tipus de cuina, adreça, horari, text de presentació de l'Oriol (`div[data-presentacio]`), selector d'idioma (mòbil) | Dir què és, on és i quan obre en un cop d'ull, i com s'hi està en paraules del restaurant. Vora superior cobalt. |
| 3 | Els plats (`#plats`) | `h2`, una frase d'introducció i un article per plat (`#plat-NN`) | La peça central: foto, nom, història i enllaç al post. Fons de porcellana. |
| 4 | On som (`#on-som`) | `h2`, adreça, "Com arribar", horari, telèfon i "Trucar" | Convertir la visita en una trucada o en una visita al local. Vora inferior cobalt. |
| 5 | Peu | nom, Instagram, selector d'idioma, "Avís legal i privacitat" | Tancament i enllaços secundaris. Continua la vora cobalt. |
| fix | Barra d'accions inferior (només < 900 px) | "Com arribar" (secundari) + "Trucar" (principal) | Tenir les dues accions sempre a la vista al mòbil. |

Pàgines secundàries:

| Pàgina | Contingut |
|---|---|
| `/404.html` | Pàgina bilingüe senzilla (§3.6). GitHub Pages la serveix per a qualsevol ruta inexistent, també dins de `/es/`, i per això és bilingüe i sense cap enllaç relatiu. |
| `/avis-legal/`, `/es/aviso-legal/` | Avís legal i privacitat de demostració (D-05), amb l'avís de dades fictícies ben visible (§3.7). |

Estructura d'encapçalaments: un sol `h1` per pàgina (a la portada, el nom del restaurant), `h2` per a "Els plats" i "On som", `h3` per a cada plat i per a "Horari" i "Telèfon" dins d'"On som". Regions: `header` (barra superior i obertura), `main` (plats i on som), `footer` (peu), i la barra inferior com a `nav` amb nom accessible "Accions".

---

## 3. Wireframes

Convencions: les mides són en px CSS. "Porcellana", "cobalt", "tinta", "acer" i "aigualit" són els colors de §5.1. Els textos entre cometes són literals (§9); els textos d'exemple dels plats són els de plat-01 (arq. §3.4.3). Contenidor: amplada màxima 1120 px, marges laterals de 20 px (< 600), 32 px (600-899) i 48 px (≥ 900).

### 3.1 Barres d'acció fixes

**Mòbil i tauleta (< 900 px): barra inferior.** Sempre visible, enganxada a baix, per sobre del contingut.

```
375 px
┌───────────────────────────────────────┐  fons porcellana, línia i ombra cap amunt (§5.4)
│  ┌───────────────┐  ┌───────────────┐ │  farciment: 12 px a dalt i a baix, 20 px als costats
│  │  Com arribar  │  │    Trucar     │ │  dos botons de 48 px d'alt i el mateix ample, 12 px entre ells
│  └───────────────┘  └───────────────┘ │  esquerra: secundari (vora cobalt) · dreta: principal (cobalt ple)
└───────────────────────────────────────┘  + l'àrea segura inferior del dispositiu (iPhone)
```

- "Trucar" va a la dreta, on arriba el polze. "Com arribar" és informació i té l'estil secundari.
- Alçada total: 72 px + àrea segura. El final de la pàgina té un espai inferior igual, perquè la barra no tapi el peu.
- Si l'alçada de la finestra és < 480 px (mòbil apaïsat o zoom gran), la barra deixa de ser fixa i se situa al final de la pàgina, després del peu.
- Si algun dia `telefon` fos `null`, la barra mostraria només "Com arribar", a tot l'ample i amb l'estil principal.

**Escriptori (≥ 900 px): barra superior.** Fixa a dalt, 64 px d'alt, fons cobalt (continua la vora de l'obertura).

```
1280 px
┌────────────────────────────────────────────────────────────────────────────────────────┐
│      Plats   On som                         Castellano   ( Com arribar )  ( Trucar al 936 27 35 36 )      │
└────────────────────────────────────────────────────────────────────────────────────────┘
       └ enllaços d'àncora, porcellana       └ idioma      └ secundari         └ principal (porcellana ple,
                                                             (vora porcellana)    text cobalt)
```

- No hi ha marca a la barra: el nom gran ja és just a sota, i la barra cobalt ja és la identitat.
- Botons de 44 px d'alt dins de la barra.

### 3.2 Obertura (`#inici`)

**Mòbil (375 px)**

```
┌───────────────────────────────────────┐  fons cobalt, a sang
│                          Castellano   │  selector d'idioma, a la dreta, zona tàctil de 44 px
│                                       │
│  Bistrot                              │  h1, Alegreya 700, 72 px, porcellana
│  1954                                 │  xifres d'estil antic
│                                       │  16 px
│  Cuina mediterrània                   │  Alegreya Sans 500, 18 px, porcellana
│  Carrer Sant Bru, 48, 08911 Badalona  │  una línia per dada
│  De dilluns a dissabte, de 20:00 a    │
│  23:00                                │
│                                       │  24 px (--espai-6)
│  Aquí prima el confort, el menjar     │  div[data-presentacio]: Alegreya 400,
│  sense presses i el gust pel que és   │  --mida-text (19 px), interlineat 1,6,
│  d’aquí.                              │  porcellana; amplada màxima --mesura
│  Des dels entrants fins als postres,  │  (salt de línia original = br, sense
│  a Bistrot 1954 tenim una missió: que │  espai extra entre les dues frases)
│  surtis per la porta pensant en quan  │
│  tornaràs.                            │
│                                       │  32 px
└───────────────────────────────────────┘
```

- **Ordre:** nom → dades (cuina, adreça, horari) → presentació. Les dades van primer perquè l'horari continuï visible sense scroll també a 320 px; la presentació, que és la veu del restaurant, tanca l'obertura i porta cap als plats.
- **Estil de la presentació:** el mateix que les històries (és text del restaurant, no d'interfície), però en porcellana sobre cobalt (8,9:1). Sense cometes, cursiva, filet, signatura ni cap altre ornament. Alineada a l'esquerra, `text-wrap: pretty`.
- Alçada aproximada: 540-560 px a 375 px. A 375×667 es veuen sencers el nom, les dades i la presentació sense fer scroll; la primera foto apareix amb el primer gest de scroll (§10, V-05).
- Si un dia `presentacio` és `null`, el bloc no surt i l'obertura acaba després de l'horari, amb els mateixos 32 px.
- Alineació a l'esquerra. Res centrat.

**Escriptori (1280 px)**

```
┌──────────────────────────────── barra superior (64 px) ────────────────────────────────┐
│ fons cobalt, a sang                                                                     │
│      Bistrot 1954                                                                       │  h1, 128 px, una línia
│                                                                                         │  32 px
│      Cuina mediterrània               │  Aquí prima el confort, el menjar sense presses i el │  presentació: Alegreya 400,
│      Carrer Sant Bru, 48              │  gust pel que és d’aquí.                             │  --mida-text (20 px) / 1,6,
│      08911 Badalona                   │  Des dels entrants fins als postres, a Bistrot 1954  │  porcellana, ≤ 36rem
│      De dilluns a dissabte,           │  tenim una missió: que surtis per la porta pensant   │
│      de 20:00 a 23:00                 │  en quan tornaràs.                                   │
│      └ dades: Alegreya Sans 500,      └ 64 px                                                │
│        20 px, columna de 400 px                                                             │  48 px
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

- A ≥ 900 px, sota el nom, l'obertura fa servir **la mateixa graella que els plats**: columna esquerra de 400 px amb les dades una sota l'altra, 64 px d'espai i columna dreta de 36rem com a màxim amb la presentació. Així la presentació queda alineada amb les històries dels plats que venen a sota. Les dues columnes comencen a la mateixa altura.
- Alçada aproximada de l'obertura a 1280 px: 440 px (barra inclosa); la primera foto comença per sobre de y = 720 px (V-05).
- Entre 600 i 899 px el nom es parteix en dues línies (Bistrot / 1954) i les dades i la presentació van una sota l'altra, com al mòbil.

### 3.3 Els plats (`#plats`)

**Mòbil (375 px), plat amb foto i història**

```
│  28 px                                │  fons porcellana
│  Els plats                            │  h2, Alegreya 700, 32 px, cobalt
│  Cada plat, amb la foto i el text que │  Alegreya Sans 500, 18 px, acer
│  en vam publicar a Instagram.         │
│  24 px                                │
┌───────────────────────────────────────┐
│                                       │  finestra 5:7 a sang: 375 × 525
│                                       │  fons aigualit mentre carrega
│            FOTO plat-01               │
│                                       │
│                                       │
└───────────────────────────────────────┘
│  20 px                                │
│  Tagliatelle amb safrà, mantega i     │  h3, Alegreya 700, 24 px, cobalt
│  tonyina                              │
│  12 px                                │
│  Tagliatelle amb safrà, mantega i     │  història, Alegreya 400, 19 px / 1,6, tinta
│  tonyina                              │
│  Pasta que s'acaba a la paella, amb   │
│  el color del safrà i la tonyina per  │
│  sobre.                               │
│  Una explosió de tardor a la taula de │
│  Bistrot 1954                         │
│  16 px                                │
│  Veure la publicació a Instagram      │  Alegreya Sans 500, 18 px, cobalt, subratllat
│  56 px                                │
┌───────────────────────────────────────┐
│            FOTO plat-02 …             │
```

**Escriptori (1280 px), plat amb foto i història**

```
        ← contenidor de 1120 px →
        64 px
        Els plats                                                   h2, 40 px
        Cada plat, amb la foto i el text que en vam publicar a Instagram.   20 px, acer
        48 px
        ┌────────────────────┐
        │                    │  64 px  Tagliatelle amb safrà, mantega i tonyina            h3, 28 px
        │                    │
        │     FOTO           │         Tagliatelle amb safrà, mantega i tonyina            història, 20 px / 1,6
        │     400 × 560      │         Pasta que s'acaba a la paella, amb el color del
        │     (5:7)          │         safrà i la tonyina per sobre.
        │                    │         Una explosió de tardor a la taula de Bistrot 1954
        │                    │
        │                    │         Veure la publicació a Instagram
        │                    │
        └────────────────────┘         └─ columna de text: 36rem (576 px) com a màxim
        128 px
        ┌────────────────────┐
        │  FOTO plat-02 …    │
```

- La foto sempre a l'esquerra; la columna de text comença a dalt, alineada amb la vora superior de la foto.
- Entre 600 i 899 px: com al mòbil (foto a dalt, text a sota), però la foto fa 400 × 560 i s'alinea amb el marge esquerre del text en lloc d'anar a sang.

**Variant sense foto** (avui cap plat; necessària per als plats futurs)

```
Mòbil                                       Escriptori
┌───────────────────────────────────────┐   ┌────────────────────┐
│  fons cobalt, a sang                  │   │ fons cobalt        │  Història…
│                                       │   │ 400 × 560 (5:7)    │  …
│                                       │   │                    │
│  Croqueta de sípia en                 │   │                    │  Veure la foto a Instagram
│  la seva tinta                        │   │ Croqueta de sípia  │
│                                       │   │ en la seva tinta   │
└───────────────────────────────────────┘   └────────────────────┘
│  Història… (igual que amb foto)       │      el nom (h3) és el bloc: 40 px, porcellana,
│  Veure la foto a Instagram            │      alineat a baix a l'esquerra, 32 px de farciment
   el nom (h3) és el bloc: 32 px, porcellana, alçada mínima 192 px, text alineat a baix
```

**Variant sense història**: igual que el plat amb foto, però després del nom ve directament l'enllaç (16 px de separació). No hi ha cap text en el lloc de la història.

### 3.4 On som (`#on-som`)

**Mòbil (375 px)**

```
┌───────────────────────────────────────┐  fons cobalt, a sang (vora inferior)
│  56 px                                │
│  On som                               │  h2, 32 px, porcellana
│  16 px                                │
│  Carrer Sant Bru, 48                  │  Alegreya 400, 24 px / 1,3, porcellana
│  08911 Badalona                       │
│  20 px                                │
│  ┌─────────────────────────────────┐  │
│  │          Com arribar            │  │  botó secundari sobre cobalt, a tot l'ample
│  └─────────────────────────────────┘  │
│  40 px                                │
│  Horari                               │  h3, Alegreya 700, 24 px
│  De dilluns a dissabte,               │  Alegreya 400, 19 px
│  de 20:00 a 23:00                     │
│  32 px                                │
│  Telèfon                              │  h3
│  936 27 35 36                         │  Alegreya 400, 24 px, xifres de caixa alta
│  ┌─────────────────────────────────┐  │
│  │            Trucar               │  │  botó principal sobre cobalt (porcellana ple)
│  └─────────────────────────────────┘  │
│  56 px                                │
```

**Escriptori (1280 px)**

```
┌──────────────────────────────────────────────────────────────────────────────────────┐ cobalt
│      On som                                         Horari                               │
│                                                     De dilluns a dissabte,               │
│      Carrer Sant Bru, 48                            de 20:00 a 23:00                     │
│      08911 Badalona                                                                      │
│                                                     Telèfon                              │
│      ( Com arribar )                                936 27 35 36                         │
│                                                     ( Trucar al 936 27 35 36 )           │
└──────────────────────────────────────────────────────────────────────────────────────┘
        columna esquerra: h2 40 px + adreça 36 px      columna dreta (comença a la meitat)
```

### 3.5 Peu

```
Mòbil                                          Escriptori
├───────────────────────────────────────┤      ├──────────────────────────────────────────────────────────────┤
│  línia d'1 px, porcellana al 30 %     │      │  Bistrot 1954     @bistrot1954 a Instagram    Castellano      │
│  Bistrot 1954          (Alegreya 700) │      │                   Avís legal i privacitat                     │
│  @bistrot1954 a Instagram             │      └──────────────────────────────────────────────────────────────┘
│  Avís legal i privacitat              │        fons cobalt, Alegreya Sans 500, 16 px, porcellana
│  Castellano                           │
│  + espai de la barra inferior         │
└───────────────────────────────────────┘
```

- Una dada per línia, enllaços amb zona tàctil de 44 px d'alt al mòbil.

### 3.6 Pàgina 404 (bilingüe)

```
┌───────────────────────────────────────┐  fons porcellana; franja cobalt de 16 px a dalt (sense barra ni obertura)
│  Bistrot 1954                         │  Alegreya 700, 32 px, cobalt (text, no enllaç)
│                                       │
│  Aquesta pàgina no existeix.          │  h1, Alegreya 700, 24 px, tinta, lang="ca"
│  Anar a l'inici                       │  enllaç a /
│                                       │
│  Esta página no existe.               │  p, Alegreya 700, 24 px, tinta, lang="es"
│  Ir al inicio                         │  enllaç a /es/
└───────────────────────────────────────┘
```

- Enllaços absoluts (`/` i `/es/`), perquè la pàgina es pot servir des de qualsevol ruta. Sense barra inferior ni imatges.

### 3.7 Avís legal i privacitat (demostració)

```
┌───────────────────────────────────────┐  barra superior (≥ 900) o franja cobalt de 56 px (mòbil) amb
│  Bistrot 1954            Castellano   │  "Bistrot 1954" (enllaç a l'inici) i selector d'idioma
├───────────────────────────────────────┤
│  Avís legal i privacitat              │  h1, Alegreya 700, 32 / 40 px, cobalt
│  ┌─────────────────────────────────┐  │
│  ┃ Pàgina de demostració. Les      │  │  avís de demostració: fons aigualit, vora esquerra
│  ┃ dades del titular són fictícies │  │  de 4 px cobalt, Alegreya Sans 500, 18 px, tinta
│  ┃ i no corresponen a cap persona  │  │
│  ┃ ni empresa real.                │  │
│  └─────────────────────────────────┘  │
│  Titular                              │  h2, 24 px
│  Nom: … (dada fictícia)               │  cada dada fictícia porta "(dada fictícia)" al costat
│  …                                    │  text: Alegreya 400, 19 / 20 px, columna de 36rem
└───────────────────────────────────────┘  + peu i barra inferior com a la portada
```

---

## 4. Component "plat"

### 4.1 Anatomia

Cada plat és un `article` amb els ganxos d'arq. §4.5. Ordre al DOM (no es canvia): **nom (`h3`) → foto → història → enllaç**. L'ordre visual el canvia la graella, sense alterar l'ordre de lectura ni el del focus (l'únic element enfocable és l'enllaç).

| Part | Element | Estil | Present |
|---|---|---|---|
| Nom | `h3` (amb `lang` si difereix de la pàgina) | Alegreya 700, 24 px (mòbil) / 28 px (≥ 900), interlineat 1,2, cobalt, `text-wrap: balance` | sempre |
| Foto | `picture` dins d'una finestra 5:7 | §6 | només si `imatge` ≠ `null` |
| Història | `div[data-historia]` (amb `lang` si difereix), un `p` per paràgraf i `br` entre línies | Alegreya 400, 19 px (mòbil) / 20 px (≥ 900), interlineat 1,6, tinta; 0,75 em entre paràgrafs; `text-wrap: pretty`; alineada a l'esquerra, sense justificar ni partir paraules | només si hi ha història |
| Enllaç | `a` al `urlPost`, `rel="noopener"`, sense `target` (al mòbil obre l'app d'Instagram) | Alegreya Sans 500, 18 px, cobalt, subratllat; zona tàctil ≥ 44 px d'alt | sempre |

- **Text de l'enllaç:** "Veure la publicació a Instagram" (amb foto) o "Veure la foto a Instagram" (sense foto). Porta, en text només per a lectors de pantalla, el nom del plat al darrere ("Veure la publicació a Instagram: Steak tartar"), perquè els 8 enllaços no tinguin el mateix nom accessible.
- **Sense cap altre element:** ni preu, ni etiquetes, ni icones, ni data (arq. §3.3 P5), ni número d'ordre.

### 4.2 Distribució per breakpoint

| Amplada | Graella de l'article | Separació entre plats |
|---|---|---|
| < 600 px | Una columna: foto (a sang si la pantalla fa ≤ 400 px; si en fa més, 400 px alineada amb el marge esquerre del text) → nom (20 px per sobre) → història (12 px) → enllaç (16 px) | 56 px |
| 600-899 px | Una columna, foto de 400 × 560 alineada amb el marge esquerre del text | 80 px |
| ≥ 900 px | Dues columnes: foto de 400 px a l'esquerra (ocupa totes les files) + 64 px + columna de text de 36rem com a màxim (nom, història, enllaç) | 96 px (900-1199) / 128 px (≥ 1200) |

- **Per què no una graella de 2 o 3 columnes:** les fotos no aguanten més de 450 px i les històries necessiten una mesura de lectura còmoda; una fila per plat, com una línia de la carta, compleix totes dues coses.
- A escriptori, la columna de text s'alinea a dalt amb la foto.
- Desplaçament a l'àncora (`#plat-NN`): el nom ha de quedar visible, no tapat per la barra superior: marge de desplaçament de 88 px a ≥ 900 px i de 16 px a < 900 px.

### 4.3 Plat sense foto

Avui tots 8 plats tenen foto, però els futurs podrien no tenir-ne (arq. §6.2). Mai s'hi posa una imatge de farciment, una icona de "foto absent" ni un requadre gris buit.

- El **nom es converteix en el bloc visual**: el mateix `h3` pren fons cobalt i text porcellana, Alegreya 700, 32 px (mòbil) / 40 px (≥ 900), interlineat 1,1, alineat a baix a l'esquerra.
  - Mòbil: a sang, farciment de 32 px (dalt i baix) i 20 px (costats), alçada mínima 192 px.
  - ≥ 600 px: 400 px d'ample; a ≥ 900 px ocupa la columna de la foto amb proporció 5:7 (400 × 560) i farciment de 32 px. Si el nom fos molt llarg, el bloc creix; el text mai es talla.
- La història i l'enllaç van on anirien amb foto (a sota al mòbil, a la columna de text a l'escriptori).
- L'enllaç diu "Veure la foto a Instagram", perquè la foto real hi és.
- No hi ha `img` dins de l'article (arq. C-08).

### 4.4 Plat sense història

- No es renderitza el `div[data-historia]` ni cap text en el seu lloc (arq. P1). El nom va seguit de l'enllaç.
- Si un plat no té ni foto ni història, es mostra el bloc del nom (§4.3) i l'enllaç. És l'article més petit possible i no s'omple res.

### 4.5 Història molt llarga

Avui les històries fan entre 100 i 350 caràcters; el màxim realista és d'uns 1.100 per idioma, i el cas de prova E9 en té uns 2.050.

- **Es mostra sencera, sempre.** No hi ha "Llegir-ne més", ni retall amb degradat, ni línies limitades. La història és el contingut, i arq. P3 vol el text sencer al DOM; amagar-lo afegiria JavaScript i un pas més des del mòbil.
- La mesura no canvia (36rem com a màxim), i els paràgrafs se separen 0,75 em.
- **A ≥ 900 px la foto es queda fixa** (enganxada a 96 px del cap de la finestra) mentre la columna de text continua, de manera que el lector no perd de vista el plat. Quan s'acaba l'article, la foto se'n va amb ell. Si la història és més curta que la foto (el cas d'avui), no passa res.
- Paraules molt llargues o URL dins del caption: es parteixen per qualsevol punt si no hi caben (`overflow-wrap: anywhere`), per no provocar scroll horitzontal.

### 4.6 Vista de detall

**No n'hi ha**: ni pàgina pròpia ni modal. Motius: les històries són curtes i es llegeixen senceres a la llista; l'arquitectura no té rutes de detall (arq. §5.2) i un modal necessitaria JavaScript i gestió del focus per mostrar el mateix text. Cada plat té la seva àncora estable (`/#plat-05`, `/es/#plat-05`) i es pot compartir; en obrir-la, la pàgina hi baixa directament i el nom queda visible (§4.2). L'únic "detall" és la publicació original a Instagram, a la qual porta l'enllaç de cada plat.

### 4.7 Idioma del nom i de la història

- A `/` es mostren el nom i la història en català; a `/es/`, en castellà (arq. §3.3).
- Si un plat futur no té la versió de l'idioma de la pàgina, es mostra la de l'altre idioma tal qual, amb `lang` al `h3` o al `div[data-historia]` (arq. P2). Visualment no es marca de cap altra manera: no hi ha banderes ni etiquetes "en català".

### 4.8 Nom repetit a l'inici de la història

A plat-01, plat-06 i plat-08 la història comença amb el mateix text que el nom (arq. §3.4.1). No es treu, perquè és text del caption. El disseny ho fa llegir com en una carta: el nom en negreta i en cobalt, a una mida només un graó per sobre del text, i la història en tinta i pes normal a sota. Per això el nom del plat no és un títol enorme.

---

## 5. Tokens de disseny

Els noms de la primera columna són els de les custom properties de `src/styles/tokens.css` (arq. §2.1).

### 5.1 Colors

| Token | Hex | Nom | Rol |
|---|---|---|---|
| `--porcellana` | `#F3F5F7` | Porcellana | Fons de la pàgina i de la barra inferior; text i botó principal sobre cobalt. |
| `--cobalt` | `#1F3C99` | Cobalt | Vores (obertura, barra superior, on som, peu), títols, enllaços, botó principal sobre porcellana, bloc del plat sense foto, anell de focus sobre porcellana. |
| `--cobalt-fosc` | `#162C73` | Cobalt fosc | Estat `hover`/`active` del botó principal sobre porcellana i del secundari sobre cobalt. |
| `--tinta` | `#18213F` | Tinta | Text de les històries i text llarg. |
| `--acer` | `#4F5868` | Acer | Text secundari (frase d'introducció dels plats). |
| `--aigualit` | `#DCE2F0` | Blau aigualit | Fons de la finestra de la foto mentre carrega; `hover` del secundari sobre porcellana i del principal sobre cobalt; fons de l'avís de demostració. |

Derivats (no són colors nous): línia del peu = porcellana al 30 % sobre cobalt; línia superior de la barra inferior = tinta al 12 % sobre porcellana. Selecció de text: fons cobalt, text porcellana. `color-scheme: light`; no hi ha mode fosc (§11).

**Contrast de text** (WCAG 2.2, calculat amb la luminància relativa):

| Text | Fons | Ràtio | On | Nivell |
|---|---|---|---|---|
| Tinta `#18213F` | Porcellana `#F3F5F7` | 14,5:1 | històries, avís legal | AAA |
| Cobalt `#1F3C99` | Porcellana | 8,9:1 | h2, h3, enllaços, botó secundari | AAA |
| Acer `#4F5868` | Porcellana | 6,6:1 | introducció dels plats | AA |
| Porcellana | Cobalt | 8,9:1 | h1, obertura, on som, peu, barra superior, botó principal sobre porcellana, nom en la variant sense foto | AAA |
| Porcellana | Cobalt fosc `#162C73` | 11,7:1 | `hover` del botó principal; `hover` del secundari sobre cobalt | AAA |
| Cobalt | Aigualit `#DCE2F0` | 7,5:1 | `hover` del botó secundari sobre porcellana; `hover` del principal sobre cobalt | AAA |
| Tinta | Aigualit | 12,2:1 | avís de demostració | AAA |

**Contrast no textual** (WCAG 1.4.11, mínim 3:1): botó principal cobalt sobre porcellana 8,9:1; vora del botó secundari (cobalt sobre porcellana, o porcellana sobre cobalt) 8,9:1; anell de focus cobalt sobre porcellana i porcellana sobre cobalt 8,9:1. El fons aigualit de la foto (1,2:1 sobre porcellana) és decoratiu i no transmet informació.

Cap informació depèn només del color: els enllaços dins de text van sempre subratllats.

### 5.2 Tipografia

Dues famílies de Google Fonts, autoallotjades amb l'API de tipografies d'Astro (arq. §6.7, tasca B-22):

| Família | Pesos | Estil | Rol | Per què |
|---|---|---|---|---|
| **Alegreya** (serif) | 400, 700 | normal (sense cursiva) | Nom del restaurant, títols, noms dels plats, històries, adreça gran | Serif de traç cal·ligràfic dissenyada per a textos literaris llargs: es llegeix bé a mida de text i, a mida gran, té el caràcter manual de la pisa pintada. Xifres d'estil antic per defecte. Cobreix à, ç, l·l, ñ, ¿, ¡. |
| **Alegreya Sans** (sans humanista) | 500 | normal | Botons, navegació, selector d'idioma, enllaços d'Instagram, dades de l'obertura, peu, introducció | Mateixa estructura que l'Alegreya però sense traços: clarament diferent i alhora de la mateixa mà. |

- Pressupost: 3 fitxers WOFF2 (2 si l'Alegreya arriba com a font variable), subconjunt `latin`, ≤ 120 KB en total (arq. R-06b). `font-display: swap`; només es fa `preload` de l'Alegreya 400.
- Reserves mentre carreguen: Georgia i `serif` per a l'Alegreya; `system-ui` i `sans-serif` per a l'Alegreya Sans, amb l'ajust de mètriques automàtic d'Astro.
- **Xifres:** al nom del restaurant, xifres d'estil antic (`oldstyle-nums`, és el que fa "1954" característic). A l'adreça, el codi postal, l'horari i el telèfon, xifres de caixa alta i tabulars (`lining-nums tabular-nums`). A les històries, les de per defecte.
- Sense majúscules forçades enlloc (`text-transform: none`), sense espaiat ampliat a les etiquetes i sense subratllats decoratius.

**Escala de mides** (base 16 px = 1rem; graons de l'escala tipogràfica clàssica)

| Token | Mòbil | ≥ 900 px | Interlineat | Ús |
|---|---|---|---|---|
| `--mida-marca` | `clamp(4rem, 17vw + 0.5rem, 8rem)`: 64 px a 320, 72 px a 375, 128 px a ≥ 900 | (el mateix clamp) | 0,9 | `h1` "Bistrot 1954", Alegreya 700, espaiat −0,01 em, `text-wrap: balance` |
| `--mida-titol` | 2rem (32 px) | 2.5rem (40 px) | 1,1 | `h2`; nom en la variant sense foto |
| `--mida-adreca` | 1.5rem (24 px) | 2.25rem (36 px) | 1,3 | adreça d'"On som", Alegreya 400 |
| `--mida-plat` | 1.5rem (24 px) | 1.75rem (28 px) | 1,2 | `h3` nom del plat; `h3` d'"On som" |
| `--mida-text` | 1.1875rem (19 px) | 1.25rem (20 px) | 1,6 | història, presentació de l'obertura, horari, text de l'avís legal |
| `--mida-ui` | 1.125rem (18 px) | 1.125rem (18 px); 1.25rem (20 px) a l'obertura | 1,4 | Alegreya Sans: botons, enllaços, dades, introducció |
| `--mida-petita` | 1rem (16 px) | 1rem (16 px) | 1,5 | peu |

Cap text de la web és més petit de 16 px. La mesura de les històries és de 36rem com a màxim (uns 60-65 caràcters per línia a 20 px); al mòbil, uns 38-40.

### 5.3 Espaiat, mides i radis

**Escala d'espaiat** (`--espai-N`): 4, 8, 12, 16, 20, 24, 32, 48, 64, 96 i 128 px (`--espai-1` a `--espai-11`). Tots els espais dels wireframes en surten.

| Token | Valor | Ús |
|---|---|---|
| `--contenidor` | 70rem (1120 px) | amplada màxima del contingut |
| `--marge` | 20 px (< 600), 32 px (600-899), 48 px (≥ 900) | marge lateral |
| `--mesura` | 36rem | amplada màxima de les històries i dels textos llargs |
| `--foto` | 25rem (400 px) | amplada màxima de la finestra de la foto |
| `--barra-alt` | 72 px (inferior) / 64 px (superior) | alçada de les barres fixes |
| `--radi-cap` | 0 | fotos, bloc sense foto, vores, avís de demostració |
| `--radi-boto` | 999 px | botons (forma de càpsula, com la vora d'un plat) |
| `--focus` | contorn de 3 px, separat 3 px de l'element, seguint-ne la forma | anell de focus |

Només hi ha dos radis: res és "una mica arrodonit".

### 5.4 Ombres

Una sola: `--ombra-barra` = línia d'1 px de tinta al 12 % a dalt + ombra de 0 −6 px 20 px de tinta al 10 %, només a la barra inferior del mòbil, per separar-la del contingut que passa per sota. La barra superior no en porta (és cobalt sòlid). Fotos, botons i blocs, cap.

### 5.5 Breakpoints

| Token | Valor | Què canvia |
|---|---|---|
| (base) | < 600 px | mòbil: una columna, foto a sang (≤ 400 px), barra inferior |
| `--bp-tauleta` | 600 px | marges de 32 px; foto de 400 px alineada amb el text |
| `--bp-escriptori` | 900 px | barra superior en lloc de la inferior; plats en dues columnes; obertura en tres columnes; on som en dues columnes |
| `--bp-ample` | 1200 px | més espai entre plats (128 px) |
| (alçada) | < 480 px d'alçada | la barra inferior deixa de ser fixa |

Les media queries es basen en l'amplada mínima (mobile-first).

---

## 6. Tractament d'imatge

### 6.1 Les fonts reals

Les 8 fotos (`contingut/imatges/plat-01.jpeg` … `plat-08.jpeg`) són captures de pantalla d'Instagram d'uns 450×600 px (3:4). L'Oriol ha confirmat que no n'hi haurà de més grans (D-09). Dues conseqüències:

1. **Porten restes de la interfície d'Instagram:** la fletxa "›" del carrusel, en un cercle a la dreta i a mitja alçada (plat-01, 02, 04, 05 i 07; entre el 92 % i el 97 % de l'amplada), i els punts de paginació, centrats a baix (entre el 96 % i el 97 % de l'alçada). No es poden mostrar: semblen un control que no funciona.
2. **No aguanten més de 450 px.** Cap foto es mostra més gran que la seva mida real (1 px de la imatge = 1 px CSS com a màxim). En pantalles de densitat 2× o 3× es veuran una mica toves; és el límit de la font i s'accepta.

### 6.2 Finestra 5:7 ancorada a dalt a l'esquerra

Cada foto es veu a través d'una **finestra de proporció 5:7** que mostra el rectangle de la captura que va de la cantonada superior esquerra fins al **88,9 % de l'amplada i el 93,3 % de l'alçada** (en una captura de 450×600, els 400×560 px de dalt a l'esquerra). Així queden fora la fletxa (comença al 92 %) i els punts (comencen al 96 %), sense ampliar la imatge.

- Es retalla en percentatges de la mateixa imatge, de manera que funciona igual si una captura fa 446×595 o 452×603.
- No es pot fer amb un retall `cover` d'una sola passada (arq. §6.3), perquè `cover` escala i només retalla en una direcció: amb 400×560 quedaria part de la fletxa. Hi ha dues maneres d'obtenir el mateix resultat; la decisió tècnica és de l'arquitecte (D-11):
  - **A (mentrestant):** la imatge es genera sencera (sense retall en el build) i es mostra al 112,5 % de l'amplada de la finestra, ancorada a dalt a l'esquerra; la finestra té proporció 5:7 i amaga el que en sobresurt. El fons de la finestra és aigualit.
  - **B (si l'arquitecte la prefereix):** en el build s'extreu el rectangle de dalt a l'esquerra (88,9 % × 93,3 %) abans de generar els formats, i la imatge resultant (400×560) es mostra al 100 % de la finestra.
- Totes les fotos tenen la mateixa finestra, també les que no porten fletxa (plat-03, 06 i 08), per mantenir el ritme.
- Sense marcs, cantonades arrodonides, ombres, filtres, superposicions, degradats ni text a sobre. Cap efecte en passar-hi el ratolí.

### 6.3 Mides per breakpoint

| Amplada de la pantalla | Finestra (CSS) | Imatge dins la finestra (opció A) | Píxels de la font que es fan servir |
|---|---|---|---|
| 320 px | 320 × 448, a sang | 360 px d'ample | variant de 360 o 450 |
| 375 px | 375 × 525, a sang | 422 px | variant de 450 |
| 400 px | 400 × 560, a sang | 450 px | 450 (1:1) |
| 401-599 px | 400 × 560, alineada amb el marge | 450 px | 450 (1:1) |
| 600-899 px | 400 × 560, alineada amb el marge | 450 px | 450 (1:1) |
| ≥ 900 px | 400 × 560, columna esquerra | 450 px | 450 (1:1) |

- `sizes` (opció A): `(min-width: 400px) 450px, 112.5vw`. Amb l'opció B: `(min-width: 400px) 400px, 100vw`.
- `srcset`: ha d'incloure **una variant a l'ample real de la font** (avui 450 px) i la de 360 px. Les variants més grans que la font no existeixen (Astro no amplia). Si la llista d'arq. §6.3 (360, 540, 720, 1080) deixés només la de 360, la foto es veuria ampliada i borrosa a l'escriptori: és part de D-11.
- `width` i `height` de l'`img` = mides reals de la font (o del retall, amb l'opció B). La finestra reserva l'espai amb la seva proporció i no hi ha salts de maquetació.
- Càrrega: la primera foto de la pàgina (plat-01) és prioritària; la resta, diferides (arq. §6.5). Mentre carreguen, la finestra mostra el fons aigualit. Sense LQIP ni fos d'entrada.
- `alt` = nom del plat en l'idioma de la pàgina (arq. §4.5).

### 6.4 Imatge per compartir (Open Graph)

La regla d'arq. §6.6 (retall 1,91:1 centrat de la primera foto) donaria una imatge de 450×236 px amb la fletxa del carrusel al mig. Proposta de disseny (part de D-11), aplicada mentrestant:

- **`public/og.jpg`, tipogràfica, 1200×630 px:** fons cobalt; "Bistrot 1954" en Alegreya 700 de 160 px, color porcellana, alineat a l'esquerra amb un marge de 96 px i centrat verticalment; a sota, a 32 px, "Cuina mediterrània" i "Carrer Sant Bru, 48, Badalona" en Alegreya Sans 500 de 40 px, una dada per línia. Text convertit a traços (no depèn de cap font instal·lada). Cap foto ni il·lustració.
- `og:image:alt`: "Bistrot 1954, Carrer Sant Bru, 48, Badalona" (ca) / el mateix text (es).

### 6.5 Icones del lloc

Sense logotip confirmat, les icones són geomètriques i no porten text: **un plat vist des de dalt**.

- `favicon.svg`: cercle ple cobalt de 32×32 amb un anell porcellana a dins (diàmetre exterior 20, gruix 2,5), centrat.
- `apple-touch-icon.png`: 180×180, fons cobalt sencer (iOS n'arrodoneix les cantonades) amb l'anell porcellana centrat (diàmetre 104, gruix 8).

---

## 7. Interaccions i animacions

La web és estàtica i **no necessita JavaScript** per a res del que es descriu aquí (0 KB de JS propi).

| Element | Repòs | `hover` (només dispositius amb ratolí) | `focus-visible` | `active` |
|---|---|---|---|---|
| Botó principal sobre porcellana | cobalt, text porcellana | cobalt fosc | anell cobalt de 3 px a 3 px de distància | baixa 1 px |
| Botó secundari sobre porcellana | transparent, vora cobalt de 2 px, text cobalt | fons aigualit | anell cobalt | baixa 1 px |
| Botó principal sobre cobalt | porcellana, text cobalt | aigualit | anell porcellana | baixa 1 px |
| Botó secundari sobre cobalt | transparent, vora porcellana de 2 px, text porcellana | cobalt fosc | anell porcellana | baixa 1 px |
| Enllaç | subratllat d'1 px, separat 0,2 em | subratllat de 2 px | anell del color de l'enllaç | — |
| Enllaç per saltar ("Vés als plats") | fora de la vista | — | apareix a dalt a l'esquerra, fons porcellana, text cobalt, anell cobalt | — |

- **Transicions:** només de color, fons, vora i gruix del subratllat, 150 ms, `ease-out`.
- **Desplaçament a les àncores** (navegació de la barra superior, enllaç per saltar, `#plat-NN`): suau només amb `prefers-reduced-motion: no-preference`; el destí no queda sota cap barra (marges de desplaçament: 88 px a dalt a ≥ 900 px; 16 px a dalt i 88 px a baix a < 900 px). Els mateixos marges eviten que una barra tapi l'element enfocat quan es navega amb el teclat (WCAG 2.4.11).
- **Foto fixa a l'escriptori** quan la història és més llarga que la foto (§4.5). No és una animació.
- **No hi ha:** animacions d'entrada, aparicions en fer scroll, parallax, carrusels, galeries, *lightbox*, zoom de fotos, vídeos automàtics ni comptadors. L'únic moment visual deliberat és estàtic: la vora cobalt amb el nom gran en obrir la pàgina.
- **`prefers-reduced-motion: reduce`:** sense transicions (durada 0), sense el desplaçament d'1 px en prémer i amb desplaçament instantani a les àncores.
- En pantalles tàctils no hi ha estats `hover` enganxats: els `hover` només s'apliquen amb `hover: hover`.

---

## 8. Crides a l'acció

Per decisió de l'Oriol (D-02), **l'única crida de reserva és "Trucar"**. "Com arribar" és un enllaç d'informació (estil secundari). No es dissenya ni es mostra WhatsApp, plataforma de reserves ni correu.

| Crida | Text visible | On és | Destí | Estil |
|---|---|---|---|---|
| **Trucar** | "Trucar" (barra inferior; on som, al mòbil); "Trucar al 936 27 35 36" (barra superior; on som, a ≥ 900 px) | barra inferior (< 900), barra superior (≥ 900), on som | `tel:+34936273536` | principal |
| **Com arribar** | "Com arribar" | barra inferior, barra superior, on som | fitxa de Google Maps (`google_maps_url` = `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`), a la mateixa pestanya (al mòbil obre l'app de mapes) | secundari |
| Publicació del plat | "Veure la publicació a Instagram" / "Veure la foto a Instagram" (+ nom del plat per a lectors de pantalla) | cada plat | `urlPost` | enllaç |
| Compte d'Instagram | "@bistrot1954 a Instagram" | peu | `https://www.instagram.com/bistrot1954/` | enllaç |
| Idioma | "Castellano" (a `/`) / "Català" (a `/es/`) | obertura (mòbil), barra superior (≥ 900), peu, avís legal | l'altra versió de la mateixa pàgina (`/` ↔ `/es/`, `/avis-legal/` ↔ `/es/aviso-legal/`), amb `hreflang` i `lang` | enllaç |
| Seccions | "Plats", "On som" | barra superior (≥ 900) | `#plats`, `#on-som` | enllaç |
| Avís legal | "Avís legal i privacitat" | peu | `/avis-legal/` (ca), `/es/aviso-legal/` (es) | enllaç |
| Saltar | "Vés als plats" | primer element enfocable | `#plats` | enllaç (visible amb el focus) |

Regles:

- **"Trucar" és visible sense fer scroll** a qualsevol pàgina de contingut i a qualsevol amplada (barra inferior o superior), i continua visible mentre es fa scroll.
- El número es mostra sempre com a text en algun lloc visible (on som; barra superior a l'escriptori), perquè qui mira la web des de l'ordinador el pugui marcar des del mòbil.
- Format del número: "936 27 35 36" (sense prefix, agrupat com l'ha donat l'Oriol). L'enllaç porta el prefix: `tel:+34936273536`.
- Màxim dos botons junts. El principal sempre és "Trucar".
- Cap text de botó porta fletxes, emojis ni signes d'exclamació.

---

## 9. Textos d'interfície i idiomes

### 9.1 Idiomes

La web és **bilingüe: català a `/` (per defecte) i castellà a `/es/`**, amb selector d'idioma (D-01, segons la correcció de l'Oriol transmesa pel coordinador; vegeu D-11 sobre la resposta escrita). Cada pàgina mostra la història del caption en el seu idioma, mai traduïda (arq. §3.3). Els textos d'interfície de sota sí que es tradueixen; van a `src/i18n/textos.ts`.

### 9.2 Textos

| Clau | Català | Castellà |
|---|---|---|
| Saltar | Vés als plats | Ir a los platos |
| Navegació: nom accessible | Seccions | Secciones |
| Navegació: plats | Plats | Platos |
| Navegació: on som | On som | Dónde estamos |
| Barra inferior: nom accessible | Accions | Acciones |
| Selector d'idioma | Castellano (amb `lang="es"`) | Català (amb `lang="ca"`) |
| Títol de la secció de plats | Els plats | Los platos |
| Introducció dels plats | Cada plat, amb la foto i el text que en vam publicar a Instagram. | Cada plato, con la foto y el texto que publicamos en Instagram. |
| Enllaç del plat | Veure la publicació a Instagram | Ver la publicación en Instagram |
| Enllaç del plat sense foto | Veure la foto a Instagram | Ver la foto en Instagram |
| Com arribar | Com arribar | Cómo llegar |
| Trucar (curt) | Trucar | Llamar |
| Trucar (llarg) | Trucar al 936 27 35 36 | Llamar al 936 27 35 36 |
| Títol d'on som | On som | Dónde estamos |
| Subtítol d'horari | Horari | Horario |
| Subtítol de telèfon | Telèfon | Teléfono |
| Compte d'Instagram | @bistrot1954 a Instagram | @bistrot1954 en Instagram |
| Avís legal | Avís legal i privacitat | Aviso legal y privacidad |
| Avís de demostració | Pàgina de demostració. Les dades del titular són fictícies i no corresponen a cap persona ni empresa real. | Página de demostración. Los datos del titular son ficticios y no corresponden a ninguna persona ni empresa real. |
| Marca de dada fictícia | (dada fictícia) | (dato ficticio) |
| 404 | Aquesta pàgina no existeix. / Anar a l'inici | Esta página no existe. / Ir al inicio |

Textos que surten de `contingut/restaurant.yaml` i no s'escriuen a mà: nom, tipus de cuina ("Cuina mediterrània" / "Cocina mediterránea"), adreça, telèfon, horari i text de presentació (literal de l'Oriol, sense emojis; arq. §4.3.2). El títol i la descripció de la pàgina són els d'arq. §7.1.

### 9.3 Format de l'horari

A partir de `horari` (arq. §4.3), una línia per franja:

- Dies consecutius: "De {primer dia} a {últim dia}"; un sol dia: "{Dia}"; dies no consecutius: llista amb comes i "i" / "y".
- Hores en format de 24 h amb dos punts: "de 20:00 a 23:00".
- Resultat d'avui: **"De dilluns a dissabte, de 20:00 a 23:00"** / **"De lunes a sábado, de 20:00 a 23:00"**.
- Dies: dilluns, dimarts, dimecres, dijous, divendres, dissabte, diumenge / lunes, martes, miércoles, jueves, viernes, sábado, domingo.
- No s'afegeix "Diumenge tancat" ni cap altra frase que no surti de les dades.

### 9.4 To

Frases curtes, verbs en infinitiu als botons ("Trucar", "Com arribar"), sense majúscules forçades ni exclamacions. La interfície no parla del menjar ni del restaurant: això ho fan les històries.

---

## 10. Criteris d'acceptació visuals per al QA

Es comproven sobre `npm run preview`, a `/` i `/es/` (i a les pàgines indicades), amb Playwright i `deviceScaleFactor: 1`, a 320×568, 375×667, 768×1024 i 1280×800. Complementen els criteris tècnics d'arq. §11.

### Distribució i accions

| ID | Criteri |
|---|---|
| V-01 | A 320, 375, 768 i 1280 px no hi ha scroll horitzontal (`scrollWidth` ≤ amplada de la finestra) a `/`, `/es/`, `/avis-legal/`, `/es/aviso-legal/` i la 404. |
| V-02 | A 320×568 i 375×667, els botons "Trucar" i "Com arribar" són visibles sense fer scroll, i continuen visibles a la meitat i al final de la pàgina. |
| V-03 | A 1280×800, la barra superior amb "Trucar al 936 27 35 36" i "Com arribar" és visible en carregar i després de fer scroll fins al final. |
| V-04 | "Trucar" enllaça a `tel:+34936273536`; "Com arribar", a `https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA`. No hi ha cap enllaç `wa.me`, `mailto:` ni de plataforma de reserves. |
| V-05 | A 375×667, sense fer scroll i per sobre de la barra inferior (y < 595 px), es veuen sencers l'`h1` "Bistrot 1954", les tres dades (cuina, adreça, horari) i el bloc `[data-presentacio]`. La primera foto apareix amb el primer gest de scroll: la seva vora superior és a y < 800 px. A 1280×800, el nom, les dades i la presentació es veuen sense scroll i la vora superior de la primera foto és a y < 720 px. |
| V-06 | L'horari "De dilluns a dissabte, de 20:00 a 23:00" (a `/es/`: "De lunes a sábado, de 20:00 a 23:00") es veu a l'obertura sense scroll a 375×667 i també a "On som". |
| V-07 | A 375×667 el selector d'idioma és visible sense scroll: a `/` diu "Castellano" (`lang="es"`, porta a `/es/`); a `/es/` diu "Català" (`lang="ca"`, porta a `/`). |
| V-08 | A 1280 px, en tots els plats amb foto, la foto és a l'esquerra del text (vora dreta de la foto + 64 px ≈ vora esquerra del text, ±4 px) i la vora superior del nom està alineada amb la de la foto (±4 px). Mai hi ha una foto a la dreta. |
| V-09 | En obrir `/#plat-05` a 1280×800, la vora superior del nom de plat-05 és ≥ 64 px (no queda sota la barra); a 375×667, el nom és visible. |

### Fotos

| ID | Criteri |
|---|---|
| V-10 | La finestra de cada foto té proporció 5:7 (±1 %): 375 × 525 a 375 px i 400 × 560 a 600 px o més (±1 px). |
| V-11 | Cap foto es mostra més gran que la seva mida real: per a cada `img`, l'amplada renderitzada ≤ `naturalWidth` de la variant carregada, a totes les amplades. |
| V-12 | Revisió visual (captura de cada plat a 375 i a 1280 px): no es veu la fletxa del carrusel ni els punts de paginació d'Instagram en cap foto. |
| V-13 | Cap element (text, botó, barra en repòs) se superposa a una foto, excepte les barres fixes quan la foto hi passa per sota en fer scroll. Les fotos no tenen cantonades arrodonides, ombra ni filtre. |

### Tipografia i color

| ID | Criteri |
|---|---|
| V-14 | El text de `[data-historia]` és en Alegreya, a ≥ 19 px a 375 px i a 20 px a 1280 px, amb interlineat ≥ 1,5 vegades la mida. A 1280 px, `[data-historia]` fa ≤ 576 px d'ample. |
| V-15 | Només es carreguen les famílies Alegreya i Alegreya Sans (≤ 3 fitxers WOFF2, ≤ 120 KB). |
| V-16 | Cap text visible fa menys de 16 px i cap element té `text-transform: uppercase`. |
| V-17 | axe a 375 i 1280 px: 0 violacions de `color-contrast`. Els colors calculats coincideixen amb els tokens de §5.1 (per exemple, el fons de l'obertura és `rgb(31, 60, 153)`). |

### Accessibilitat d'interacció

| ID | Criteri |
|---|---|
| V-18 | En recórrer la pàgina amb Tab a 375 i 1280 px, cada element enfocable mostra un anell visible (≥ 2 px, contrast ≥ 3:1 amb el fons) i cap queda completament tapat per una barra fixa. |
| V-19 | El primer Tab mostra "Vés als plats", que porta el focus a `#plats`. |
| V-20 | Els botons fan ≥ 44 × 44 px; la resta d'enllaços, ≥ 24 × 24 px o amb prou separació (WCAG 2.5.8). |
| V-21 | Amb `prefers-reduced-motion: reduce` emulat, la `transition-duration` dels botons és `0s` i el desplaçament a les àncores és instantani. |
| V-22 | A 667×375 (mòbil apaïsat), la barra inferior no és fixa: és al final de la pàgina. |
| V-23 | Aplicant l'espaiat de text de WCAG 1.4.12 (interlineat 1,5, espaiat entre lletres 0,12 em, entre paraules 0,16 em, entre paràgrafs 2 em), cap text queda tallat ni superposat. |

### Variants i casos límit

Aquests es comproven amb un build temporal (que no es versiona), traient la foto d'un plat o fent servir les entrades sintètiques d'arq. §3.4.4 en un fitxer de prova.

| ID | Criteri |
|---|---|
| V-24 | Plat sense foto: l'article no té `img`; el `h3` té fons cobalt i text porcellana; a 1280 px el bloc fa 400 × 560 i el text del nom és a baix a l'esquerra; l'enllaç diu "Veure la foto a Instagram". |
| V-25 | Plat sense història (E2): no hi ha `[data-historia]` ni cap text en el seu lloc; l'enllaç ve just després del nom. |
| V-26 | Història llarga (E9): es veu sencera (cap retall, cap "llegir-ne més", `scrollHeight` = `clientHeight`), sense scroll horitzontal; a 1280 px, en fer scroll dins de l'article, la foto es queda a 96 px (±2) del cap de la finestra. |

### Altres pàgines

| ID | Criteri |
|---|---|
| V-27 | `/avis-legal/` i `/es/aviso-legal/`: l'avís de demostració és visible sense scroll a 375×667, abans de qualsevol dada del titular, i cada dada fictícia porta "(dada fictícia)" / "(dato ficticio)". El peu de `/` i `/es/` hi enllaça. |
| V-28 | 404 a `/no-existeix/` i a `/es/no-existeix/`: es veu el missatge en català i en castellà, i els enllaços porten a `/` i a `/es/`. |
| V-29 | El QA desa captures de `/` i `/es/` a 375 i 1280 px (pàgina sencera) a `tests/captures/` i les compara amb els wireframes de §3: ordre de seccions, colors de les vores, posició de les accions i, a l'obertura, l'ordre nom → dades → presentació (§3.2). |
| V-30 | Presentació (`[data-presentacio]`, dins de `#inici`): Alegreya 400, 19 px a 375 px i 20 px a 1280 px, interlineat 1,6, color porcellana `rgb(243, 245, 247)` sobre cobalt, amplada ≤ 576 px, alineada a l'esquerra i sense cursiva. A < 900 px, la seva vora superior és 24 px (±2) per sota de la línia de l'horari. A 1280 px, la seva vora esquerra coincideix (±4 px) amb la vora esquerra de la columna de text dels plats, i la seva vora superior, amb la de la línia "Cuina mediterrània". |

---

## 11. Supòsits

1. **Fotos.** Les 8 captures de ~450×600 px són definitives (D-09). La finestra 5:7 ancorada a dalt a l'esquerra (§6.2) amaga la interfície d'Instagram en totes. Que es vegin una mica toves en pantalles d'alta densitat s'accepta. Els plats futurs seran captures semblants; si alguna no ho fos, la mateixa finestra no la malmet (només en retalla un 11 % a la dreta i un 7 % a baix).
2. **Idiomes.** Bilingüe ca + es, segons la correcció de l'Oriol que m'ha transmès el coordinador. A `docs/dubtes.md`, la resposta escrita de D-01 encara diu "català" (vegeu D-11).
3. **Reserves.** Només telèfon (936 27 35 36). No hi ha cap estat de disseny per a WhatsApp, plataformes ni correu.
4. **Horari.** Es mostra literalment el que ha dit l'Oriol. No s'hi afegeix "Diumenge tancat", encara que se'n dedueixi.
5. **Avís legal.** Les dades fictícies les escriu qui implementi la pàgina; el disseny només en fixa el layout i com es marquen com a fictícies.
6. **GitHub Pages.** No canvia res visual, excepte que la 404 es pot servir des de qualsevol ruta i per això usa enllaços absoluts.
7. **Estadístiques (D-08).** Cloudflare Web Analytics no té cap element visual ni fa servir galetes: no hi ha bàner.
8. **Text de presentació.** L'únic text sobre el restaurant és el que ha donat l'Oriol (D-12), literal i sense emojis; va a l'obertura, després de les dades (D-15, §3.2). La interfície no n'afegeix cap altre.
9. **"1954".** No s'explica ni s'insinua cap origen del nom.
10. **Una sola pàgina per idioma**, sense vista de detall ni modal; les històries es llegeixen senceres (§4.6).
11. **Sense mode fosc.** La identitat és la porcellana i el cobalt; un mode fosc la desfaria i no aporta res a l'objectiu.
12. **Visitants.** La majoria entren amb el mòbil des del navegador intern d'Instagram, amb una àrea visible d'uns 375×600 px; per això l'obertura és compacta i les accions van a baix.
13. **Tipografies.** Alegreya i Alegreya Sans cobreixen el català i el castellà en el subconjunt `latin` i caben en el pressupost d'arq. §6.7.
14. **Icones i imatge per compartir.** Sense logotip confirmat, són geomètriques (favicon) i tipogràfiques (`og.jpg`).
15. **Frase d'introducció dels plats.** Descriu d'on surt el contingut i no afirma res del restaurant.
