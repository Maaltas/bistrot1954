/**
 * Textos d'interfície en català i castellà (docs/disseny-frontend.md §9.2) i formats de l'horari i del telèfon.
 * Els textos del restaurant (nom, cuina, adreça, telèfon, horari, presentació) no s'escriuen aquí:
 * surten de contingut/restaurant.yaml.
 */
import type { Idioma } from '../lib/idioma';
import type { DiaSetmana, Franja } from '../lib/contingut';

export interface Textos {
  saltar: string;
  navegacioNom: string;
  navPlats: string;
  navOnSom: string;
  accionsNom: string;
  /** Text de l'enllaç per canviar a l'altre idioma. */
  idiomaAlternatiu: string;
  titolPlats: string;
  introPlats: string;
  comArribar: string;
  trucarCurt: string;
  trucarLlarg: (telefon: string) => string;
  titolOnSom: string;
  subtitolHorari: string;
  subtitolTelefon: string;
  instagram: string;
  avisLegal: string;
  avisDemostracio: string;
  dadaFicticia: string;
}

export const textos: Record<Idioma, Textos> = {
  ca: {
    saltar: 'Vés als plats',
    navegacioNom: 'Seccions',
    navPlats: 'Plats',
    navOnSom: 'On som',
    accionsNom: 'Accions',
    idiomaAlternatiu: 'Castellano',
    titolPlats: 'Els nostres plats',
    introPlats: "Un recull de l'experiència que et trobaràs.",
    comArribar: 'Com arribar',
    trucarCurt: 'Trucar',
    trucarLlarg: (telefon) => `Trucar al ${telefon}`,
    titolOnSom: 'On som',
    subtitolHorari: 'Horari',
    subtitolTelefon: 'Telèfon',
    instagram: '@bistrot1954 a Instagram',
    avisLegal: 'Avís legal i privacitat',
    avisDemostracio:
      'Pàgina de demostració. Les dades del titular són fictícies i no corresponen a cap persona ni empresa real.',
    dadaFicticia: '(dada fictícia)',
  },
  es: {
    saltar: 'Ir a los platos',
    navegacioNom: 'Secciones',
    navPlats: 'Platos',
    navOnSom: 'Dónde estamos',
    accionsNom: 'Acciones',
    idiomaAlternatiu: 'Català',
    titolPlats: 'Nuestros platos',
    introPlats: 'Una muestra de la experiencia que te encontrarás.',
    comArribar: 'Cómo llegar',
    trucarCurt: 'Llamar',
    trucarLlarg: (telefon) => `Llamar al ${telefon}`,
    titolOnSom: 'Dónde estamos',
    subtitolHorari: 'Horario',
    subtitolTelefon: 'Teléfono',
    instagram: '@bistrot1954 en Instagram',
    avisLegal: 'Aviso legal y privacidad',
    avisDemostracio:
      'Página de demostración. Los datos del titular son ficticios y no corresponden a ninguna persona ni empresa real.',
    dadaFicticia: '(dato ficticio)',
  },
};

/** Idioma contrari. */
export function altreIdioma(idioma: Idioma): Idioma {
  return idioma === 'ca' ? 'es' : 'ca';
}

/** Textos de la pàgina 404 (bilingüe). */
export const textos404 = {
  ca: { missatge: 'Aquesta pàgina no existeix.', enllac: "Anar a l'inici" },
  es: { missatge: 'Esta página no existe.', enllac: 'Ir al inicio' },
} as const;

// ---------------------------------------------------------------------------
// Horari (dis. §9.3)
// ---------------------------------------------------------------------------

const ORDRE_DIES: readonly DiaSetmana[] = ['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'];

const NOMS_DIES: Record<Idioma, Record<DiaSetmana, string>> = {
  ca: {
    dl: 'dilluns',
    dt: 'dimarts',
    dc: 'dimecres',
    dj: 'dijous',
    dv: 'divendres',
    ds: 'dissabte',
    dg: 'diumenge',
  },
  es: {
    dl: 'lunes',
    dt: 'martes',
    dc: 'miércoles',
    dj: 'jueves',
    dv: 'viernes',
    ds: 'sábado',
    dg: 'domingo',
  },
};

const capitalitza = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function descriuDies(dies: readonly DiaSetmana[], idioma: Idioma): string {
  const indexos = [...new Set(dies.map((dia) => ORDRE_DIES.indexOf(dia)))].sort((a, b) => a - b);
  const nom = (i: number) => NOMS_DIES[idioma][ORDRE_DIES[i] as DiaSetmana];
  const primer = indexos[0] as number;
  const ultim = indexos[indexos.length - 1] as number;

  if (indexos.length === 1) return capitalitza(nom(primer));
  const consecutius = indexos.every((valor, posicio) => posicio === 0 || valor === (indexos[posicio - 1] as number) + 1);
  if (consecutius) return `De ${nom(primer)} a ${nom(ultim)}`;

  const conjuncio = idioma === 'ca' ? 'i' : 'y';
  const noms = indexos.map(nom);
  return capitalitza(`${noms.slice(0, -1).join(', ')} ${conjuncio} ${noms[noms.length - 1]}`);
}

/** Una línia per franja: "De dilluns a dissabte, de 20:00 a 23:00". */
export function formataHorari(franges: readonly Franja[] | null | undefined, idioma: Idioma): string[] {
  if (!franges) return [];
  return franges.map((franja) => `${descriuDies(franja.dies, idioma)}, de ${franja.obre} a ${franja.tanca}`);
}
