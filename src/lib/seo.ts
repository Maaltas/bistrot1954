/**
 * Metadades i dades estructurades (arq. §7). Només fan servir dades confirmades de restaurant.yaml.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { Restaurant } from './contingut';
import type { Idioma } from './idioma';
import { altreIdioma } from '../i18n/textos';

export interface MetaPagina {
  title: string;
  description: string;
}

/** "Cuina mediterrània" → "cuina mediterrània" (el fragment va enmig de la frase). */
const minuscula = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** Cuina en l'idioma de la pàgina o, si falta, en l'altre. */
export function cuinaDe(restaurant: Pick<Restaurant, 'cuina'>, idioma: Idioma): string | null {
  return restaurant.cuina?.[idioma] ?? restaurant.cuina?.[altreIdioma(idioma)] ?? null;
}

/** Title i description de la portada (arq. §7.1). Si `cuina` és null, se'n treu el fragment. */
export function metaPortada(restaurant: Restaurant, idioma: Idioma): MetaPagina {
  const cuina = cuinaDe(restaurant, idioma);
  const { nom, adreca } = restaurant;
  if (idioma === 'ca') {
    return {
      title: `${nom} · Restaurant a ${adreca.municipi}${cuina ? `, ${minuscula(cuina)}` : ''}`,
      description:
        `${nom}:${cuina ? ` ${minuscula(cuina)}` : ''} al ${adreca.carrer}, de ${adreca.municipi}. ` +
        'Descobreix els nostres plats i la història de cadascun.',
    };
  }
  return {
    title: `${nom} · Restaurante en ${adreca.municipi}${cuina ? `, ${minuscula(cuina)}` : ''}`,
    description:
      `${nom}:${cuina ? ` ${minuscula(cuina)}` : ''} en el ${adreca.carrer}, de ${adreca.municipi}. ` +
      'Descubre nuestros platos y la historia de cada uno.',
  };
}

/** Title i description de les pàgines legals (arq. §7.1). */
export function metaLegal(restaurant: Restaurant, idioma: Idioma): MetaPagina {
  const { nom, adreca } = restaurant;
  return idioma === 'ca'
    ? {
        title: `Avís legal i privacitat · ${nom}`,
        description: `Avís legal i privacitat del web de ${nom}, al ${adreca.carrer}, de ${adreca.municipi}.`,
      }
    : {
        title: `Aviso legal y privacidad · ${nom}`,
        description: `Aviso legal y privacidad del sitio web de ${nom}, en el ${adreca.carrer}, de ${adreca.municipi}.`,
      };
}

const DIES_SCHEMA = {
  dl: 'Monday',
  dt: 'Tuesday',
  dc: 'Wednesday',
  dj: 'Thursday',
  dv: 'Friday',
  ds: 'Saturday',
  dg: 'Sunday',
} as const;

/** Treu les claus amb valor null, undefined o buit, recursivament. Mai s'escriuen claus buides. */
function senseNuls<T>(valor: T): T {
  if (Array.isArray(valor)) {
    return valor.map(senseNuls).filter((v) => v !== undefined) as unknown as T;
  }
  if (valor && typeof valor === 'object') {
    const resultat: Record<string, unknown> = {};
    for (const [clau, v] of Object.entries(valor)) {
      if (v === null || v === undefined || v === '') continue;
      resultat[clau] = senseNuls(v);
    }
    return resultat as T;
  }
  return valor;
}

export interface OpcionsJsonLd {
  /** URL pública de la portada amb barra final (`<web>`). */
  web: string;
  /** URL absoluta d'og.jpg, o null si el fitxer no existeix. */
  imatge: string | null;
}

/** Dades estructurades `Restaurant` (arq. §7.3). */
export function jsonLdRestaurant(restaurant: Restaurant, idioma: Idioma, opcions: OpcionsJsonLd) {
  const presentacio = restaurant.presentacio[idioma];
  const descripcio = presentacio ? presentacio.paragrafs.flat().join(' ') : null;

  return senseNuls({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${opcions.web}#restaurant`,
    name: restaurant.nom,
    url: opcions.web,
    description: descripcio,
    image: opcions.imatge,
    telephone: restaurant.telefon ?? null,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.adreca.carrer,
      postalCode: restaurant.adreca.codi_postal,
      addressLocality: restaurant.adreca.municipi,
      addressRegion: restaurant.adreca.provincia,
      addressCountry: restaurant.adreca.pais,
    },
    servesCuisine: cuinaDe(restaurant, idioma),
    openingHoursSpecification: restaurant.horari?.length
      ? restaurant.horari.map((franja) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: franja.dies.map((dia) => DIES_SCHEMA[dia]),
          opens: franja.obre,
          closes: franja.tanca,
        }))
      : null,
    hasMap: restaurant.google_maps_url ?? null,
    sameAs: [restaurant.instagram],
  });
}

/** Serialitza el JSON-LD escapant `<` perquè no es pugui tancar l'etiqueta <script>. */
export function serialitzaJsonLd(dades: unknown): string {
  return JSON.stringify(dades, null, 2).replace(/</g, '\\u003c');
}

/** Existeix `public/og.jpg`? (el build sempre s'executa des de l'arrel del projecte). */
export function existeixOg(): boolean {
  return existsSync(join(process.cwd(), 'public', 'og.jpg'));
}
