import { readFileSync } from 'node:fs';
import { assignaIdiomes, type Idioma } from '../../src/lib/idioma';
import { netejaCaption, paragrafsATextPla } from '../../src/lib/neteja';
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

/** Caption → història en text pla (paràgrafs amb \n\n, línies amb \n), o null si l'idioma no té paràgrafs. */
export function historiaDe(caption: string, override?: Idioma[]): HistoriaText {
  const r = assignaIdiomes(netejaCaption(caption), override);
  return {
    ca: r.ca.length ? paragrafsATextPla(r.ca) : null,
    es: r.es.length ? paragrafsATextPla(r.es) : null,
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
