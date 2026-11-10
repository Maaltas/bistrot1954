/** Mides de les imatges dels plats (arq. §6.3). */

/** Amples candidats per al `srcset`. */
export const AMPLES_BASE = [360, 450, 720, 900] as const;
/** Ample màxim útil: 450 px CSS a densitat 2×. */
export const AMPLE_MAXIM = 900;

/**
 * Amples del `srcset`: els de `AMPLES_BASE` més petits que l'ample de la font, més `min(ample, 900)`.
 * Mai en té cap de més ample que la font (Astro no amplia).
 */
export function calculaWidths(ampleFont: number): number[] {
  const amples = new Set<number>(AMPLES_BASE.filter((ample) => ample < ampleFont));
  amples.add(Math.min(ampleFont, AMPLE_MAXIM));
  return [...amples].sort((a, b) => a - b);
}
