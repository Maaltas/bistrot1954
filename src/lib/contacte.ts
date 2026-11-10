/**
 * Enllaços de contacte (arq. §8): trucar, mapa i Instagram.
 * Només es construeix el que té dada confirmada: un camp `null` no retorna res.
 */

export interface DadesContacte {
  nom: string;
  adreca: { carrer: string; codi_postal: string; municipi: string };
  instagram: string;
  telefon: string | null;
  google_maps_url: string | null;
}

export interface Contacte {
  /** "936 27 35 36" (sense el prefix +34), o null. */
  telefonVisible: string | null;
  /** "tel:+34936273536", o null. */
  telefonEnllac: string | null;
  /** Fitxa de Google Maps o, si no n'hi ha, la cerca amb l'adreça. */
  mapaUrl: string;
  instagramUrl: string;
}

/** "+34 936 27 35 36" → "936 27 35 36". */
export function telefonVisible(telefon: string | null): string | null {
  if (!telefon) return null;
  return telefon.replace(/^\+34\s*/, '');
}

/** "+34 936 27 35 36" → "tel:+34936273536". */
export function telefonEnllac(telefon: string | null): string | null {
  if (!telefon) return null;
  return 'tel:' + telefon.replace(/[^\d+]/g, '');
}

export function mapaUrl(dades: DadesContacte): string {
  if (dades.google_maps_url) return dades.google_maps_url;
  const consulta = [dades.nom, dades.adreca.carrer, dades.adreca.codi_postal, dades.adreca.municipi].join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
}

export function construeixContacte(dades: DadesContacte): Contacte {
  return {
    telefonVisible: telefonVisible(dades.telefon),
    telefonEnllac: telefonEnllac(dades.telefon),
    mapaUrl: mapaUrl(dades),
    instagramUrl: dades.instagram,
  };
}
