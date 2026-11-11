/** Una història és "llarga" (dis. §4.5) si, sumant totes les línies, passa d'aquest nombre de caràcters. */
export const LLINDAR_HISTORIA_LLARGA = 500;

/**
 * Les històries llargues s'alineen a l'esquerra: el text centrat costa de llegir. És una decisió de presentació
 * (no canvia el model de dades): el component la pren a partir del text que mostra.
 */
export function historiaEsLlarga(paragrafs: readonly (readonly string[])[]): boolean {
  const caracters = paragrafs.reduce((total, linies) => total + linies.reduce((s, linia) => s + linia.length, 0), 0);
  return caracters > LLINDAR_HISTORIA_LLARGA;
}
