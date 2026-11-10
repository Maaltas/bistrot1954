/**
 * Assignació d'idioma als paràgrafs nets (arq. §3.3, passos I1-I5).
 *
 * Els captions són bilingües (un bloc en català i el mateix en castellà, en ordre variable).
 * Mai es tradueix res: només es decideix a quin idioma pertany cada paràgraf.
 */
import type { Paragraf } from './neteja';

export type Idioma = 'ca' | 'es';

export interface ResultatIdiomes {
  ca: Paragraf[];
  es: Paragraf[];
  avisos: string[];
}

const PARAULES_CA = new Set(
  (
    'amb als aquell aquella aquelles aquells aquest aquesta aquestes aquests això allò ara avui ' +
    'bé ben cap com dels des els ens és fet feta fins hi ho i mai més molt molta moltes molts ' +
    'nostra nostre nostres per però perquè quan sempre sense seu seus seva seves són també ' +
    'tothom totes tots'
  ).split(' '),
);

const PARAULES_ES = new Set(
  (
    'bien como con cuando desde esa ese eso esta este esto hasta hay hecho las lo los más muy ' +
    'nuestra nuestras nuestro nuestros otra otro para pero por porque siempre sin su sus ' +
    'también toda todas todo todos y ya'
  ).split(' '),
);

type Determinat = Idioma | null;

/** I1 · puntuació d'una línia (o d'un paràgraf sencer). */
function puntua(text: string): { ca: number; es: number } {
  const minuscules = text.toLowerCase();
  const paraules = minuscules.match(/[\p{L}·]+/gu) ?? [];
  let ca = 0;
  let es = 0;
  for (const paraula of paraules) {
    if (PARAULES_CA.has(paraula)) ca++;
    if (PARAULES_ES.has(paraula)) es++;
  }
  ca += (minuscules.match(/[àèòçï]/gu) ?? []).length;
  ca += (minuscules.match(/l·l/gu) ?? []).length;
  es += (minuscules.match(/[áñ¿¡]/gu) ?? []).length;
  return { ca, es };
}

function decideix(punts: { ca: number; es: number }): Determinat {
  if (punts.ca >= 2 && punts.ca >= 2 * punts.es) return 'ca';
  if (punts.es >= 2 && punts.es >= 2 * punts.ca) return 'es';
  return null;
}

/** I2 · parteix un paràgraf mixt en subparàgrafs a cada canvi d'idioma. */
function partiParagraf(paragraf: Paragraf): Array<{ linies: Paragraf; llengua: Determinat }> {
  const idiomesLinies = paragraf.map((linia) => decideix(puntua(linia)));
  const determinats = new Set(idiomesLinies.filter((i): i is Idioma => i !== null));

  if (determinats.size < 2) {
    // I3 · totes les línies determinades són del mateix idioma (o cap): un sol paràgraf.
    if (determinats.size === 1) {
      return [{ linies: paragraf, llengua: [...determinats][0] as Idioma }];
    }
    return [{ linies: paragraf, llengua: decideix(puntua(paragraf.join(' '))) }];
  }

  // Les línies indeterminades s'enganxen a la determinada anterior; les inicials, a la primera determinada.
  const primera = idiomesLinies.find((i): i is Idioma => i !== null) as Idioma;
  let actual: Idioma = primera;
  const assignades: Idioma[] = idiomesLinies.map((idioma) => {
    if (idioma !== null) actual = idioma;
    return actual;
  });

  const parts: Array<{ linies: Paragraf; llengua: Determinat }> = [];
  paragraf.forEach((linia, i) => {
    const llengua = assignades[i] as Idioma;
    const ultima = parts[parts.length - 1];
    if (ultima && ultima.llengua === llengua) {
      ultima.linies.push(linia);
    } else {
      parts.push({ linies: [linia], llengua });
    }
  });
  return parts;
}

/**
 * Assigna un idioma a cada paràgraf net.
 * `override` (I5): un idioma per paràgraf net, en ordre; se salten I1-I4. Si el nombre no quadra, llença un error.
 */
export function assignaIdiomes(paragrafs: Paragraf[], override?: readonly Idioma[]): ResultatIdiomes {
  const resultat: ResultatIdiomes = { ca: [], es: [], avisos: [] };

  if (override) {
    if (override.length !== paragrafs.length) {
      throw new Error(
        `idiomes té ${override.length} elements, però el caption net té ${paragrafs.length} paràgrafs`,
      );
    }
    paragrafs.forEach((paragraf, i) => {
      resultat[override[i] as Idioma].push(paragraf);
    });
    return resultat;
  }

  // I2 + I3 · cada paràgraf net pot ser un o més subparàgrafs amb idioma
  const unitats = paragrafs.flatMap((p) => partiParagraf(p));

  // I4 · descart per als paràgrafs encara indeterminats
  const assignats: Idioma[] = [];
  unitats.forEach((unitat, i) => {
    if (unitat.llengua !== null) {
      assignats[i] = unitat.llengua;
      return;
    }
    let idioma: Idioma | null = null;
    let motiu = '';
    if (paragrafs.length === 2 && unitats.length === 2) {
      const altre = unitats[1 - i]?.llengua ?? null;
      if (altre !== null) {
        idioma = altre === 'ca' ? 'es' : 'ca';
        motiu = "l'idioma contrari de l'altre paràgraf";
      }
    }
    if (idioma === null && i > 0 && assignats[i - 1]) {
      idioma = assignats[i - 1] as Idioma;
      motiu = "l'idioma del paràgraf anterior";
    }
    if (idioma === null) {
      const seguent = unitats.slice(i + 1).find((u) => u.llengua !== null);
      if (seguent) {
        idioma = seguent.llengua as Idioma;
        motiu = "l'idioma del paràgraf següent";
      }
    }
    if (idioma === null) {
      idioma = 'ca';
      motiu = "l'idioma per defecte (ca)";
    }
    assignats[i] = idioma;
    resultat.avisos.push(
      `paràgraf ${i + 1} d'idioma indeterminat ("${unitat.linies.join(' ').slice(0, 40)}"): s'assigna ${idioma} per descart (${motiu})`,
    );
  });

  unitats.forEach((unitat, i) => {
    resultat[assignats[i] as Idioma].push(unitat.linies);
  });
  return resultat;
}
