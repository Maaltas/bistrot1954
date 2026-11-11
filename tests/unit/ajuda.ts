import { readFileSync } from 'node:fs';
import { assignaIdiomes, type Idioma } from '../../src/lib/idioma';
import { netejaCaption, paragrafsATextPla, treuNomInicial } from '../../src/lib/neteja';
import { parse as parseYaml } from 'yaml';
import type { Post } from '../../src/lib/contingut';

const llegeix = (ruta: string) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8');

export const posts: Post[] = JSON.parse(llegeix('contingut/plats.json'));
export const historiaEsperada: Record<string, { ca: string; es: string }> = JSON.parse(
  llegeix('tests/fixtures/historia-esperada.json'),
);
export const presentacioEsperada: { ca: string; es: string } = JSON.parse(
  llegeix('tests/fixtures/presentacio-esperada.json'),
);

export interface HistoriaText {
  ca: string | null;
  es: string | null;
  avisos: string[];
}

/** Noms de seleccio.yaml per id (ca i, si hi és, es). */
export const noms: Record<string, { ca: string; es?: string }> = Object.fromEntries(
  (parseYaml(llegeix('contingut/seleccio.yaml')).plats as { id: string; nom: { ca: string; es?: string } }[]).map((p) => [p.id, p.nom]),
);

export interface NomsPlat {
  ca: string;
  es?: string;
}

/**
 * Caption → història en text pla (paràgrafs separats per una línia en blanc, línies per un salt de línia), o null si l'idioma no té paràgrafs.
 * Sense el paràmetre nom, és la sortida de N1-N7 i I1-I5; amb nom, també s'hi aplica N8 a cada idioma.
 */
export function historiaDe(caption: string, override?: Idioma[], nom?: NomsPlat): HistoriaText {
  const r = assignaIdiomes(netejaCaption(caption), override);
  const ca = nom ? treuNomInicial(r.ca, nom.ca, 'ca') : r.ca;
  const es = nom ? treuNomInicial(r.es, nom.es ?? nom.ca, 'es') : r.es;
  return {
    ca: ca.length ? paragrafsATextPla(ca) : null,
    es: es.length ? paragrafsATextPla(es) : null,
    avisos: r.avisos,
  };
}

/** Paraules d'un text (arq. §3.5.2), sensible a majúscules. */
export function paraules(text: string): string[] {
  return text.match(/[\p{L}\p{N}]+(?:['’·-][\p{L}\p{N}]+)*/gu) ?? [];
}

/** `a` és una subseqüència ordenada de `b`? */
export function esSubsequencia(a: string[], b: string[]): boolean {
  let j = 0;
  for (const paraula of a) {
    while (j < b.length && b[j] !== paraula) j++;
    if (j === b.length) return false;
    j++;
  }
  return true;
}
