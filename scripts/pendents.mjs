// Què falta per publicar (arq. §3.6, §6.1). Només informa: sempre acaba amb codi 0.
//   - posts de contingut/plats.json que no són a contingut/seleccio.yaml (amb el caption i el bloc YAML per enganxar);
//   - plats seleccionats sense foto;
//   - fitxers de contingut/imatges/ mal anomenats, en HEIC o de menys de 400 px d'ample.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import sharp from 'sharp';

const arrel = new URL('../', import.meta.url);
const ruta = (relativa) => fileURLToPath(new URL(relativa, arrel));
const AMPLE_MINIM = 400;
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function llegeix(fitxer, analitza) {
  try {
    return analitza(readFileSync(ruta(fitxer), 'utf8'));
  } catch (e) {
    console.log(`No s'ha pogut llegir ${fitxer}: ${e.message}`);
    return null;
  }
}

const posts = llegeix('contingut/plats.json', JSON.parse) ?? [];
const seleccio = llegeix('contingut/seleccio.yaml', parse) ?? {};
const entrades = Array.isArray(seleccio?.plats) ? seleccio.plats : [];
const idsSeleccionats = new Set(entrades.map((e) => e.id));
const idsPosts = new Set(posts.map((p) => p.id));

let avisos = 0;

// Fitxers d'imatge
const carpeta = ruta('contingut/imatges');
const fitxers = existsSync(carpeta) ? readdirSync(carpeta).filter((f) => !f.startsWith('.')) : [];
const imatgesPerId = new Map();
const problemesImatges = [];
for (const fitxer of fitxers) {
  const punt = fitxer.lastIndexOf('.');
  const id = punt > 0 ? fitxer.slice(0, punt) : fitxer;
  const ext = punt > 0 ? fitxer.slice(punt + 1) : '';
  if (['heic', 'heif'].includes(ext.toLowerCase())) {
    problemesImatges.push(`${fitxer}: format HEIC no suportat; desa la foto en JPEG, PNG o WebP`);
    continue;
  }
  if (!EXTENSIONS.includes(ext)) {
    problemesImatges.push(`${fitxer}: extensió no vàlida (ha de ser ${EXTENSIONS.join(', ')}, en minúscules)`);
    continue;
  }
  if (!/^plat-\d{2,}$/.test(id) || !idsPosts.has(id)) {
    problemesImatges.push(`${fitxer}: no correspon a cap id de plats.json (ha de ser plat-NN.${ext}, en minúscules)`);
    continue;
  }
  imatgesPerId.set(id, fitxer);
  try {
    const { width } = await sharp(`${carpeta}/${fitxer}`).metadata();
    if ((width ?? 0) < AMPLE_MINIM) {
      problemesImatges.push(`${fitxer}: fa ${width} px d'ample (mínim ${AMPLE_MINIM}): es veurà ampliada`);
    }
  } catch (e) {
    problemesImatges.push(`${fitxer}: no es pot llegir com a imatge (${e.message})`);
  }
}

// Posts sense classificar
const senseClassificar = posts.filter((p) => !idsSeleccionats.has(p.id));
if (senseClassificar.length > 0) {
  avisos += senseClassificar.length;
  console.log(`\nPosts sense classificar (${senseClassificar.length}): no surten a la web.`);
  console.log(`Copia el bloc YAML a contingut/seleccio.yaml, a la posició on ha de sortir el plat, i omple el nom copiant-lo del caption.\n`);
  for (const post of senseClassificar) {
    console.log(`- ${post.id} · ${post.url_post}`);
    console.log(`  Caption: ${post.caption.replace(/\s*\n\s*/g, ' / ')}`);
    console.log(`  Bloc YAML:\n    - id: ${post.id}\n      nom:\n        ca: ""\n        es: ""\n`);
  }
}

// Plats seleccionats sense foto
const senseFoto = entrades.filter((e) => !e.amagat && !imatgesPerId.has(e.id));
if (senseFoto.length > 0) {
  avisos += senseFoto.length;
  console.log(`\nPlats sense foto (${senseFoto.length}): es mostren sense foto.`);
  for (const entrada of senseFoto) {
    console.log(`- ${entrada.id}: desa la foto a contingut/imatges/${entrada.id}.jpeg (JPEG, PNG o WebP, mínim ${AMPLE_MINIM} px d'ample)`);
  }
}

if (problemesImatges.length > 0) {
  avisos += problemesImatges.length;
  console.log(`\nProblemes amb fitxers d'imatge (${problemesImatges.length}):`);
  for (const problema of problemesImatges) console.log(`- ${problema}`);
}

if (avisos === 0) {
  console.log(`Tot en ordre: ${posts.length} posts, ${entrades.length} plats seleccionats i cap problema d'imatges.`);
}
process.exit(0);
