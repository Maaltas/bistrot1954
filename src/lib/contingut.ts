/**
 * Lectura, validació i unió del contingut (arq. §3.1, §4).
 *
 * Aquest és l'ÚNIC punt d'accés a `contingut/` des de l'aplicació. Les funcions `parse*`,
 * `construeix*` i `resolImatges` són pures (reben text o dades) i es proven amb tests unitaris;
 * `getPlats()` i `getRestaurant()` hi connecten els fitxers reals.
 */
import type { ImageMetadata } from 'astro';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';
import platsRaw from '../../contingut/plats.json?raw';
import seleccioRaw from '../../contingut/seleccio.yaml?raw';
import restaurantRaw from '../../contingut/restaurant.yaml?raw';
import { assignaIdiomes, type Idioma } from './idioma';
import { netejaCaption, treuNomInicial, type Paragraf } from './neteja';
import { construeixContacte } from './contacte';
import { esPublicacio } from './entorn';

// ---------------------------------------------------------------------------
// Errors i avisos
// ---------------------------------------------------------------------------

/** Error de contingut: atura el build. El missatge és en català i diu el fitxer i què cal fer. */
export class ContingutError extends Error {
  constructor(missatge: string) {
    super(missatge);
    this.name = 'ContingutError';
  }
}

function formataIssues(fitxer: string, error: z.ZodError, id?: string): string {
  const detalls = error.issues.map((issue) => {
    const camp = issue.path.length ? issue.path.join('.') : '(arrel)';
    return `  - ${camp}: ${issue.message}`;
  });
  return `[contingut] Error a ${fitxer}${id ? ` (${id})` : ''}:\n${detalls.join('\n')}`;
}

// ---------------------------------------------------------------------------
// Esquemes (arq. §4.1-§4.3)
// ---------------------------------------------------------------------------

const DATA = /^\d{4}-\d{2}-\d{2}$/;

const postSchema = z.object({
  id: z.string().regex(/^plat-\d{2,}$/, { error: 'ha de tenir el format plat-NN (en minúscules)' }),
  url_post: z
    .string()
    .regex(/^https:\/\/www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?$/, {
      error: "ha de ser l'adreça d'un post d'Instagram (https://www.instagram.com/p/…)",
    }),
  imatge: z.string(),
  caption: z.string(),
  data_publicacio: z.string().refine((v) => v === '' || DATA.test(v), { error: 'ha de ser buit o AAAA-MM-DD' }),
  data_extraccio: z.string().regex(DATA, { error: 'ha de ser AAAA-MM-DD' }),
  nota: z.string(),
});
export type Post = z.infer<typeof postSchema>;
const CAMPS_POST = new Set(Object.keys(postSchema.shape));

const idiomaSchema = z.enum(['ca', 'es']);

const nomBuitMissatge = { error: 'no pot ser buit: copia el nom del plat del caption' };

const entradaSeleccioSchema = z.object({
  id: z.string().min(1, { error: "falta l'id del plat" }),
  nom: z.object({
    ca: z.string().trim().min(1, nomBuitMissatge),
    es: z.string().trim().min(1, nomBuitMissatge).optional(),
  }),
  nom_confirmat: z.boolean().optional(),
  amagat: z.boolean().optional(),
  idiomes: z.array(idiomaSchema).optional(),
});
const seleccioSchema = z.object({ plats: z.array(entradaSeleccioSchema) });
export type EntradaSeleccio = z.infer<typeof entradaSeleccioSchema>;
export type Seleccio = z.infer<typeof seleccioSchema>;

const DIES = ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'] as const;
export type DiaSetmana = (typeof DIES)[number];
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const franjaSchema = z.object({
  dies: z.array(z.enum(DIES)).min(1, { error: 'cal almenys un dia' }),
  obre: z.string().regex(HORA, { error: 'ha de ser HH:MM' }),
  tanca: z.string().regex(HORA, { error: 'ha de ser HH:MM' }),
});
export type Franja = z.infer<typeof franjaSchema>;

const textBilingueSchema = z.object({
  ca: z.string().nullable().optional(),
  es: z.string().nullable().optional(),
});

const restaurantSchema = z
  .object({
    nom: z.string().min(1),
    web_url: z.url().nullable(),
    adreca: z.object({
      carrer: z.string().min(1),
      codi_postal: z.string().min(1),
      municipi: z.string().min(1),
      provincia: z.string().min(1),
      pais: z.string().length(2),
    }),
    instagram: z.url(),
    presentacio: textBilingueSchema.nullable().optional(),
    cuina: textBilingueSchema.nullable().optional(),
    telefon: z
      .string()
      .regex(/^\+34 \d{3} \d{2} \d{2} \d{2}$/, { error: 'ha de ser "+34 XXX XX XX XX"' })
      .nullable()
      .optional(),
    google_maps_url: z.url().nullable().optional(),
    horari: z.array(franjaSchema).nullable().optional(),
    preu: z.string().nullable().optional(),
    estadistiques: z
      .object({
        goatcounter: z
          .string()
          .regex(/^[a-z0-9-]{2,50}$/, { error: 'ha de ser el codi del compte de GoatCounter (a-z, 0-9 i -)' })
          .nullable(),
      })
      .optional(),
    avis_legal: z.object({
      demostracio: z.boolean(),
      titular: z.string().min(1),
      nif: z.string().min(1),
      domicili: z.string().min(1),
      email: z.string().min(1),
    }),
  })
  .superRefine((dades, ctx) => {
    if (dades.avis_legal.demostracio) {
      if (!/^[A-Z]0{8}$/.test(dades.avis_legal.nif)) {
        ctx.addIssue({
          code: 'custom',
          path: ['avis_legal', 'nif'],
          message: 'amb demostracio: true, el NIF ha de ser fictici (una lletra i vuit zeros, com B00000000)',
        });
      }
      if (!/@example\.com$/i.test(dades.avis_legal.email)) {
        ctx.addIssue({
          code: 'custom',
          path: ['avis_legal', 'email'],
          message: 'amb demostracio: true, el correu ha de ser d\'example.com',
        });
      }
    }
  });
export type RestaurantDades = z.infer<typeof restaurantSchema>;

// ---------------------------------------------------------------------------
// Model de sortida (arq. §4.4)
// ---------------------------------------------------------------------------

export interface TextLocalitzat {
  text: string;
  /** Idioma real del text (pot no coincidir amb el de la pàgina: P2). */
  lang: Idioma;
}

export interface Historia {
  /** Idioma real del text. */
  lang: Idioma;
  /** Paràgrafs → línies, text pla sense HTML. */
  paragrafs: string[][];
}

export interface Plat {
  id: string;
  ordre: number;
  nom: Record<Idioma, TextLocalitzat>;
  historia: Record<Idioma, Historia | null>;
  imatge: ImageMetadata | null;
  urlPost: string;
  captionOriginal: string;
  dataPublicacio: string | null;
}

export interface Restaurant extends Omit<RestaurantDades, 'presentacio' | 'estadistiques'> {
  presentacio: Record<Idioma, Historia | null>;
  telefonVisible: string | null;
  telefonEnllac: string | null;
  mapaUrl: string;
  estadistiques: { endpoint: string } | null;
}

// ---------------------------------------------------------------------------
// Parseig i validació
// ---------------------------------------------------------------------------

/** `contingut/plats.json`: JSON vàlid, esquema correcte i ids únics. Retorna els posts i els avisos. */
export function parsePlats(text: string): { posts: Post[]; avisos: string[] } {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new ContingutError(
      `[contingut] Error a contingut/plats.json: no és JSON vàlid (${(e as Error).message}). ` +
        `No s'ha d'editar a mà: torna a llançar el recopilador-instagram.`,
    );
  }
  if (!Array.isArray(json)) {
    throw new ContingutError('[contingut] Error a contingut/plats.json: ha de ser una llista de posts.');
  }
  const avisos: string[] = [];
  const posts: Post[] = [];
  const vistos = new Set<string>();
  json.forEach((element, index) => {
    const id = typeof element?.id === 'string' ? element.id : `entrada ${index + 1}`;
    const resultat = postSchema.safeParse(element);
    if (!resultat.success) {
      throw new ContingutError(formataIssues('contingut/plats.json', resultat.error, id));
    }
    if (vistos.has(resultat.data.id)) {
      throw new ContingutError(`[contingut] Error a contingut/plats.json: l'id ${resultat.data.id} està repetit.`);
    }
    vistos.add(resultat.data.id);
    for (const clau of Object.keys(element)) {
      if (!CAMPS_POST.has(clau)) {
        avisos.push(`[contingut] ${resultat.data.id}: camp desconegut "${clau}" a plats.json (s'ignora)`);
      }
    }
    posts.push(resultat.data);
  });
  return { posts, avisos };
}

/** `contingut/seleccio.yaml`: YAML vàlid, esquema correcte, ids existents a `posts` i sense repetits. */
export function parseSeleccio(text: string, posts: readonly Post[]): Seleccio {
  let dades: unknown;
  try {
    dades = parseYaml(text);
  } catch (e) {
    throw new ContingutError(
      `[contingut] Error a contingut/seleccio.yaml: no és YAML vàlid (${(e as Error).message}).`,
    );
  }
  const resultat = seleccioSchema.safeParse(dades);
  if (!resultat.success) {
    throw new ContingutError(formataIssues('contingut/seleccio.yaml', resultat.error));
  }
  const idsPosts = new Set(posts.map((p) => p.id));
  const vistos = new Set<string>();
  for (const entrada of resultat.data.plats) {
    if (!idsPosts.has(entrada.id)) {
      throw new ContingutError(
        `[contingut] Error a contingut/seleccio.yaml: l'id ${entrada.id} no existeix a contingut/plats.json. ` +
          `Revisa l'id o recull el post amb el recopilador-instagram.`,
      );
    }
    if (vistos.has(entrada.id)) {
      throw new ContingutError(`[contingut] Error a contingut/seleccio.yaml: l'id ${entrada.id} està repetit.`);
    }
    vistos.add(entrada.id);
  }
  return resultat.data;
}

/** `contingut/restaurant.yaml`. */
export function parseRestaurant(text: string): RestaurantDades {
  let dades: unknown;
  try {
    dades = parseYaml(text);
  } catch (e) {
    throw new ContingutError(
      `[contingut] Error a contingut/restaurant.yaml: no és YAML vàlid (${(e as Error).message}).`,
    );
  }
  const resultat = restaurantSchema.safeParse(dades);
  if (!resultat.success) {
    throw new ContingutError(formataIssues('contingut/restaurant.yaml', resultat.error));
  }
  return resultat.data;
}

// ---------------------------------------------------------------------------
// Nom del plat: ha de ser un fragment literal del caption (arq. §3.2)
// ---------------------------------------------------------------------------

const RE_EMOJI_NOM = /[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}︎️‍]/gu;

/** Normalitza per comparar: sense emojis, apòstrofs tipogràfics → ', espais col·lapsats, minúscules. */
export function normalitzaPerComparar(text: string): string {
  return text
    .normalize('NFC')
    .replace(RE_EMOJI_NOM, ' ')
    .replace(/[’‘]/g, "'")
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function nomEsFragmentDelCaption(nom: string, caption: string): boolean {
  const n = normalitzaPerComparar(nom);
  return n !== '' && normalitzaPerComparar(caption).includes(n);
}

// ---------------------------------------------------------------------------
// Imatges (arq. §6.2)
// ---------------------------------------------------------------------------

export type ImatgesGlob = Record<string, { default: ImageMetadata }>;

export const AMPLE_MINIM_FOTO = 400;

function nomFitxer(ruta: string): string {
  return ruta.split('/').pop() ?? ruta;
}

function idDeFitxer(ruta: string): string {
  return nomFitxer(ruta).replace(/\.[^.]+$/, '');
}

const PRIORITAT_EXT = ['jpg', 'jpeg', 'png', 'webp'];

/**
 * Per a cada post, la imatge:
 * 1. la de `post.imatge` si no és buida i existeix al glob;
 * 2. si no, `contingut/imatges/<id>.{jpg,jpeg,png,webp}`;
 * 3. si no, null.
 */
export function resolImatge(post: Post, glob: ImatgesGlob): ImageMetadata | null {
  const entrades = Object.entries(glob);
  if (post.imatge) {
    const nom = nomFitxer(post.imatge);
    const trobada = entrades.find(([ruta]) => nomFitxer(ruta) === nom);
    if (trobada) return trobada[1].default;
  }
  for (const ext of PRIORITAT_EXT) {
    const trobada = entrades.find(([ruta]) => nomFitxer(ruta) === `${post.id}.${ext}`);
    if (trobada) return trobada[1].default;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Construcció de plats
// ---------------------------------------------------------------------------

function unirIdiomes(ca: Paragraf[], es: Paragraf[]): Record<Idioma, Historia | null> {
  const tinguda = (p: Paragraf[]) => p.length > 0;
  return {
    ca: tinguda(ca) ? { lang: 'ca', paragrafs: ca } : tinguda(es) ? { lang: 'es', paragrafs: es } : null,
    es: tinguda(es) ? { lang: 'es', paragrafs: es } : tinguda(ca) ? { lang: 'ca', paragrafs: ca } : null,
  };
}

export interface ResultatPlats {
  plats: Plat[];
  avisos: string[];
}

/** Uneix posts, selecció i imatges, aplicant la regla de contingut. Llença ContingutError si cal. */
export function construeixPlats(posts: readonly Post[], seleccio: Seleccio, imatges: ImatgesGlob): ResultatPlats {
  const avisos: string[] = [];
  const plats: Plat[] = [];
  const perId = new Map(posts.map((p) => [p.id, p]));

  const idsSeleccionats = new Set(seleccio.plats.map((e) => e.id));
  for (const post of posts) {
    if (!idsSeleccionats.has(post.id)) {
      avisos.push(`[contingut] ${post.id} pendent de classificar (no surt a la web)`);
    }
  }

  const idsPosts = new Set(posts.map((p) => p.id));
  for (const ruta of Object.keys(imatges)) {
    if (!idsPosts.has(idDeFitxer(ruta))) {
      avisos.push(`[contingut] el fitxer d'imatge ${nomFitxer(ruta)} no correspon a cap id de plats.json`);
    }
  }

  seleccio.plats.forEach((entrada, ordre) => {
    if (entrada.amagat) return;
    const post = perId.get(entrada.id) as Post;

    // Noms: fragments literals del caption (o confirmats per l'Oriol).
    if (!entrada.nom_confirmat) {
      for (const [idioma, nom] of [
        ['ca', entrada.nom.ca],
        ['es', entrada.nom.es],
      ] as const) {
        if (nom !== undefined && !nomEsFragmentDelCaption(nom, post.caption)) {
          throw new ContingutError(
            `[contingut] Error a contingut/seleccio.yaml (${entrada.id}): el nom ${idioma} "${nom}" no és un fragment del caption. ` +
              `Copia'l tal qual del caption de ${post.url_post} (només pots posar la primera lletra en majúscula).`,
          );
        }
      }
    }

    // Història: neteja + idioma.
    const netejat = netejaCaption(post.caption);
    let paragrafsCa: Paragraf[] = [];
    let paragrafsEs: Paragraf[] = [];
    try {
      const idiomes = assignaIdiomes(netejat, entrada.idiomes);
      // N8: la història no repeteix el nom del plat (cada idioma, amb el seu nom o, si no en té, nom.ca).
      paragrafsCa = treuNomInicial(idiomes.ca, entrada.nom.ca, 'ca');
      paragrafsEs = treuNomInicial(idiomes.es, entrada.nom.es ?? entrada.nom.ca, 'es');
      for (const avis of idiomes.avisos) avisos.push(`[contingut] ${entrada.id}: ${avis}`);
    } catch (e) {
      throw new ContingutError(
        `[contingut] Error a contingut/seleccio.yaml (${entrada.id}): ${(e as Error).message}. Revisa el camp idiomes.`,
      );
    }

    // Imatge.
    const imatge = resolImatge(post, imatges);
    if (!imatge) {
      avisos.push(`[contingut] ${post.id} sense imatge: es mostra sense foto`);
    } else if (imatge.width < AMPLE_MINIM_FOTO) {
      avisos.push(
        `[contingut] ${post.id}: la foto fa ${imatge.width} px d'ample (mínim ${AMPLE_MINIM_FOTO}): es veurà ampliada`,
      );
    }

    const nomCa: TextLocalitzat = { text: entrada.nom.ca, lang: 'ca' };
    const nomEs: TextLocalitzat = entrada.nom.es ? { text: entrada.nom.es, lang: 'es' } : nomCa;

    plats.push({
      id: entrada.id,
      ordre,
      nom: { ca: nomCa, es: nomEs },
      historia: unirIdiomes(paragrafsCa, paragrafsEs),
      imatge,
      urlPost: post.url_post,
      captionOriginal: post.caption,
      dataPublicacio: post.data_publicacio || null,
    });
  });

  return { plats, avisos };
}

// ---------------------------------------------------------------------------
// Construcció del restaurant
// ---------------------------------------------------------------------------

export interface OpcionsRestaurant {
  /** Build de publicació (variable CI): només aleshores es poden activar les estadístiques. */
  publicacio: boolean;
}

export function construeixRestaurant(
  dades: RestaurantDades,
  opcions: OpcionsRestaurant,
): { restaurant: Restaurant; avisos: string[] } {
  const avisos: string[] = [];

  const netejaPresentacio = (idioma: Idioma): Paragraf[] => {
    const text = dades.presentacio?.[idioma];
    if (!text) return [];
    const neta = netejaCaption(text);
    if (neta.length === 0) {
      avisos.push(`[contingut] la presentació en ${idioma} queda buida després de la neteja: es tracta com a null`);
    }
    return neta;
  };
  const presentacio = unirIdiomes(netejaPresentacio('ca'), netejaPresentacio('es'));

  const contacte = construeixContacte({
    nom: dades.nom,
    adreca: dades.adreca,
    instagram: dades.instagram,
    telefon: dades.telefon ?? null,
    google_maps_url: dades.google_maps_url ?? null,
  });

  const codi = dades.estadistiques?.goatcounter ?? null;
  const estadistiques =
    opcions.publicacio && codi ? { endpoint: `https://${codi}.goatcounter.com/count` } : null;

  if (opcions.publicacio && dades.avis_legal.demostracio) {
    avisos.push("[contingut] l'avís legal porta dades de demostració");
  }

  return {
    restaurant: {
      ...dades,
      presentacio,
      telefonVisible: contacte.telefonVisible,
      telefonEnllac: contacte.telefonEnllac,
      mapaUrl: contacte.mapaUrl,
      estadistiques,
    },
    avisos,
  };
}

// ---------------------------------------------------------------------------
// Accés als fitxers reals
// ---------------------------------------------------------------------------

const imatgesGlob = import.meta.glob<{ default: ImageMetadata }>('/contingut/imatges/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

interface Carregat {
  plats: Plat[];
  restaurant: Restaurant;
}

let memoria: Carregat | null = null;

function carrega(): Carregat {
  const { posts, avisos: avisosPosts } = parsePlats(platsRaw);
  const seleccio = parseSeleccio(seleccioRaw, posts);
  const { plats, avisos: avisosPlats } = construeixPlats(posts, seleccio, imatgesGlob as ImatgesGlob);
  const { restaurant, avisos: avisosRestaurant } = construeixRestaurant(parseRestaurant(restaurantRaw), {
    publicacio: esPublicacio(),
  });
  for (const avis of [...avisosPosts, ...avisosPlats, ...avisosRestaurant]) console.warn(avis);
  return { plats, restaurant };
}

function obte(): Carregat {
  // En mode dev no es fa servir memòria cau, perquè els canvis als YAML es vegin en recarregar.
  if (import.meta.env.DEV) return carrega();
  memoria ??= carrega();
  return memoria;
}

/** Plats visibles, en l'ordre de `seleccio.yaml`. */
export function getPlats(): Plat[] {
  return obte().plats;
}

export function getRestaurant(): Restaurant {
  return obte().restaurant;
}
