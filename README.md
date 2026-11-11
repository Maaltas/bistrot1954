# Web del Bistrot 1954

Web de presentació del Bistrot 1954 (Carrer Sant Bru, 48, Badalona). Cada plat surt amb la seva foto, el seu nom i la història que en va publicar el restaurant a Instagram, **sense retocar-la**. Els plats no enllacen al seu post; només hi ha l'enllaç al compte d'Instagram, al peu.

- **En local:** `http://localhost:4321/bistrot1954/` (català) i `http://localhost:4321/bistrot1954/es/` (castellà). `http://localhost:4321/` sense `/bistrot1954/` no és la web.
- **Publicada (quan l'Oriol ho activi):** `https://maaltas.github.io/bistrot1954/`.

És una web estàtica feta amb [Astro](https://astro.build) 7. La decisió de cada peça és a `docs/arquitectura.md` i l'aspecte, a `docs/disseny-frontend.md`.

## Requisits i Node a Windows

- Node.js 22.23.4 o més nou (`.node-version` fixa la 26.13.0).
- Si la terminal no troba `node`:
  - Git Bash: `export PATH="/c/Program Files/nodejs:$PATH"`
  - PowerShell: `$env:Path = "C:\Program Files\nodejs;" + $env:Path`
- No calen Docker ni Python.

## Arrencar en local

```
npm ci
npm run dev
```

Obre `http://localhost:4321/bistrot1954/`. Per veure exactament el que es publicaria:

```
npm run build
npm run preview
```

Altres ordres:

| Ordre | Què fa |
|---|---|
| `npm test` | Tests unitaris (neteja de captions, idioma, contingut, SEO) |
| `npm run pendents` | Llista posts sense classificar, plats sense foto i fitxers d'imatge mal anomenats |
| `npm run comprova` | `pendents` + tests + `astro check` + build (el que fa GitHub Actions) |
| `npm run og` | Regenera `public/og.jpg` (només si canvien el nom, la cuina o l'adreça) |

Per al QA: `npx playwright install chromium` (una vegada) i `npx playwright test`. Lighthouse s'executa amb `npx lighthouse`; si no troba Chrome, s'indica amb la variable `CHROME_PATH`.

## Com s'afegeix un plat

No cal tocar codi.

1. **Recollir el post.** Es llança l'agent `recopilador-instagram`, que afegeix el post a `contingut/plats.json` amb l'`id` següent (`plat-09`…). Aquest fitxer no s'edita mai a mà.
2. **Desar la foto** a `contingut/imatges/plat-09.jpeg` (o `.jpg`, `.png`, `.webp`; no HEIC):
   - nom exacte i en minúscules;
   - com a mínim 400 px d'ample;
   - pot ser una captura de pantalla del post, però **només de la foto**, sense la capçalera amb el nom del compte ni els botons de sota. La web amaga sola la franja dreta i la inferior, on Instagram posa la fletxa i els punts del carrusel.
3. **Veure què falta:** `npm run pendents`. Mostra el caption i un bloc YAML a punt per enganxar.
4. **Seleccionar:** enganxar el bloc a `contingut/seleccio.yaml`, a la posició on ha de sortir el plat, i copiar el nom **tal qual del caption** (en català i, si es vol, en castellà). Només es pot posar en majúscula la primera lletra. Si el nom és buit o no és al caption, el build falla amb un missatge que diu quin plat és.
5. **Comprovar:** `npm run comprova`.
6. **Publicar:** `git add contingut`, `git commit -m "Plat nou: …"` i `git push` (quan la publicació estigui activada, vegeu més avall).

Altres operacions: per **amagar** un plat, `amagat: true`; per **canviar l'ordre**, moure el bloc a `seleccio.yaml`; per **canviar la foto**, substituir el fitxer.

### La regla de contingut

La història de cada plat surt **exclusivament** del caption. La neteja (`src/lib/neteja.ts`) només treu hashtags, @mencions, emojis, espais sobrants, frases purament promocionals, el bloc fix de signatura i el nom del plat quan encapçala la història (pas N8, regla de l'Oriol: la història no repeteix el nom, que ja surt com a títol; si el nom queda a mitja frase, es deixa). Mai reescriu, resumeix, tradueix ni afegeix res. Cada història es mostra en l'idioma original; la pàgina catalana mostra la part catalana del caption i la castellana, la castellana.

## Imatge per compartir (`npm run og`)

`public/og.jpg` (1200×630) és una imatge tipogràfica, no una foto. `npm run og` la regenera amb el navegador de Playwright (o Chrome / Edge si no el té) i les tipografies dels paquets `@fontsource`. El fitxer es versiona; no es regenera a cada build.

## Publicar (BLOQUEJAT fins que l'Oriol doni el vistiplau final)

La web queda preparada per publicar-se a GitHub Pages, però **no s'ha creat cap repositori remot ni s'ha fet cap `push`** (D-13 a `docs/dubtes.md`). Quan l'Oriol ho digui (passos de `docs/arquitectura.md` §9.4):

1. Crear el repositori públic `bistrot1954` al compte `Maaltas`, buit.
2. `git remote add origin https://github.com/Maaltas/bistrot1954.git` i `git push -u origin main`. El workflow `.github/workflows/publica.yml` només comprova i construeix.
3. Al repositori: Settings → Pages → Source = **GitHub Actions**.
4. Crear la variable de repositori `PUBLICAR` = `si` i tornar a executar el workflow.

Si el build falla a GitHub (per exemple, per un nom mal copiat), la versió anterior continua en línia.

## Tornar enrere

`git revert <commit>` i `git push`: el workflow torna a construir i publicar la versió anterior.

## Activar les estadístiques (GoatCounter; pendent de D-14)

Estan preparades i desactivades: sense galetes i sense cap petició a tercers fins que s'activin. Quan l'Oriol tingui el compte a goatcounter.com:

1. Baixar el script i desar-lo com a `public/js/count.js`: `curl -o public/js/count.js https://gc.zgo.at/count.js`. Anotar aquí la data de la baixada i l'origen. Cal revisar-lo abans de versionar-lo. **Encara no s'ha baixat** (és un script de tercers; vegeu `docs/dubtes.md`).
2. Posar el codi a `contingut/restaurant.yaml`: `estadistiques: { goatcounter: <codi> }`.
3. `git push`.

L'script i l'excepció de la CSP només surten en un build de publicació (variable `CI` definida) i amb codi. Per simular un build de publicació a PowerShell: `$env:CI="true"; npm run build; Remove-Item Env:CI`.

## Seguretat i privadesa

Sense secrets al repositori. Sense galetes, sense `localStorage` i sense peticions a tercers (tipografies autoallotjades; mapa, Instagram i telèfon són enllaços). La CSP va en una etiqueta `<meta>` perquè GitHub Pages no permet capçaleres pròpies.
