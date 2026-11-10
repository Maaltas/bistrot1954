/**
 * Neteja dels captions (arq. §3.3, passos N1-N7).
 *
 * Funció pura: només TREU coses de les categories permeses (hashtags, @mencions, emojis decoratius,
 * espais i salts de línia sobrants, frases promocionals i la signatura fixa). Mai afegeix, reordena,
 * corregeix, tradueix ni resumeix cap text.
 */

/** Un paràgraf és una llista de línies. */
export type Paragraf = string[];

/** Claus (minúscules, sense emojis ni diacrítics, només lletres, xifres i espais) de la signatura fixa. */
export const SIGNATURA: ReadonlySet<string> = new Set([
  'bistrot 1954',
  'cuina mediterrania',
  'cocina mediterranea',
  'carrer sant bru 48 badalona',
  'calle sant bru 48 badalona',
  'c sant bru 48 badalona',
]);

/**
 * Patrons de frases purament promocionals (llista tancada, arq. §3.3 N5).
 * S'apliquen a la frase en minúscules, sense diacrítics i sense emojis.
 */
export const PATRONS_PROMOCIONALS: readonly RegExp[] = [
  /(link|enllac|enlace) (a|en|in) (la )?bio/,
  /^reserv(a|eu|ad|au) (ja|ya|ara|ahora|la teva taula|tu mesa|taula|mesa)/,
  /^(us|os|te|t') ?esper(em|amos)/,
  /truca'?ns|truqueu-nos|llamanos|llamadnos/,
];

// Un emoji és un caràcter d'aquests (arq. §3.3 N6). No es fa servir \p{Emoji}: inclou les xifres i el #.
// ©, ® i ™ es mantenen.
const EMOJI =
  '(?:(?![©®™])\\p{Extended_Pictographic}|\\p{Emoji_Modifier}|\\p{Regional_Indicator}|[\\uFE0E\\uFE0F\\u200D]|[0-9#*]\\uFE0F?\\u20E3)';
const GRUP_EMOJI = `${EMOJI}(?:[ \\t]*${EMOJI})*`;
const RE_EMOJI = new RegExp(EMOJI, 'gu');
const RE_GRUP_EMOJI_AMB_ESPAIS = new RegExp(`([ \\t]*)(${GRUP_EMOJI})([ \\t]*)`, 'gu');

const HASHTAG = '(?<![\\p{L}\\p{N}&])#(?=[\\p{L}\\p{N}_]*\\p{L})[\\p{L}\\p{N}_]+';
const MENCIO = '(?<![\\p{L}\\p{N}_.])@[\\p{L}\\p{N}_]+(?:\\.[\\p{L}\\p{N}_]+)*';
const ELEMENT = `(?:${HASHTAG}|${MENCIO})`;
const RE_TIRALLONGA = new RegExp(`${ELEMENT}(?:(?:\\s|${EMOJI})*${ELEMENT})*`, 'gu');
const RE_ELEMENT = new RegExp(ELEMENT, 'gu');

const RE_LLETRA_O_XIFRA = /[\p{L}\p{N}]/u;

/** Clau de comparació d'una línia (N3): minúscules, sense emojis ni diacrítics, només lletres, xifres i espais. */
function clauSignatura(linia: string): string {
  return linia
    .toLowerCase()
    .replace(RE_EMOJI, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Clau d'una frase (N5): minúscules, sense diacrítics ni emojis; la puntuació es manté. */
function clauFrase(frase: string): string {
  return frase
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(RE_EMOJI, ' ')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** N4 · hashtags i @mencions d'una línia. */
function treuHashtagsIMencions(linia: string): string {
  return linia.replace(RE_TIRALLONGA, (tirallonga: string, offset: number, tot: string) => {
    const resta = tot.slice(offset + tirallonga.length);
    if (!RE_LLETRA_O_XIFRA.test(resta)) {
      // Al final de la línia (o només hi ha això): s'elimina sencera.
      return '';
    }
    // Enmig del text: només es treu el signe, es manté la paraula.
    return tirallonga.replace(RE_ELEMENT, (token) => token.slice(1));
  });
}

/** N5 · frases promocionals d'una línia. */
function treuFrasesPromocionals(linia: string): string {
  const frases = linia.split(/(?<=[.!?…])\s+/u);
  const mantingudes = frases.filter((frase) => {
    const clau = clauFrase(frase);
    return !PATRONS_PROMOCIONALS.some((patro) => patro.test(clau));
  });
  return mantingudes.join(' ');
}

/** N6 · emojis d'una línia. Pot retornar una cadena amb `\n` (substitució per salt de línia). */
function treuEmojis(linia: string): string {
  return linia.replace(
    RE_GRUP_EMOJI_AMB_ESPAIS,
    (coincidencia: string, _davant: string, _grup: string, _darrere: string, offset: number, tot: string) => {
      const abans = tot.slice(0, offset);
      const despres = tot.slice(offset + coincidencia.length);
      if (abans.trim() === '') return ''; // a l'inici
      if (despres.trim() === '') return ''; // al final
      const primer = despres[0] ?? '';
      if (/[.,;:!?…)\]»"']/u.test(primer)) return ''; // seguit de puntuació de tancament
      if (/[\p{Lu}¿¡«"(]/u.test(primer)) return '\n'; // seguit de majúscula o d'obertura
      return ' '; // qualsevol altre cas
    },
  );
}

/** N7 · espais d'una línia. */
function netejaEspais(linia: string): string {
  return linia
    .replace(/[ \t]+/g, ' ')
    .replace(/ +([.,;:!?…])/g, '$1')
    .trim();
}

/**
 * Neteja un caption i el retorna com a llista de paràgrafs (cadascun, una llista de línies).
 * Si no queda cap text, retorna una llista buida.
 */
export function netejaCaption(caption: string): Paragraf[] {
  // N1 · normalització
  const text = caption
    .replace(/\r\n?/g, '\n')
    .normalize('NFC')
    .replace(/ /g, ' ')
    .replace(/[​﻿]/g, '');

  // N2 · paràgrafs
  const paragrafsBruts = text.split(/\n(?:[ \t]*\n)+/).map((p) => p.split('\n'));

  const resultat: Paragraf[] = [];
  for (const liniesBrutes of paragrafsBruts) {
    const linies: string[] = [];
    for (const liniaBruta of liniesBrutes) {
      // N3 · signatura
      if (SIGNATURA.has(clauSignatura(liniaBruta))) continue;
      // N4 · hashtags i mencions
      let linia = treuHashtagsIMencions(liniaBruta);
      // N5 · frases promocionals
      linia = treuFrasesPromocionals(linia);
      // N6 · emojis (pot partir la línia en dues)
      linia = treuEmojis(linia);
      // N7 · espais; les línies buides s'eliminen
      for (const part of linia.split('\n')) {
        const neta = netejaEspais(part);
        if (neta !== '') linies.push(neta);
      }
    }
    if (linies.length > 0) resultat.push(linies);
  }
  return resultat;
}

/** Text pla d'una llista de paràgrafs: línies unides amb `\n` i paràgrafs amb `\n\n`. */
export function paragrafsATextPla(paragrafs: readonly Paragraf[]): string {
  return paragrafs.map((p) => p.join('\n')).join('\n\n');
}
