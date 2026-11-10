/** Rutes lògiques de cada pàgina i idioma (relatives a `base`; arq. §5.2). Es converteixen amb `ruta()`. */
import type { Idioma } from './idioma';

export type Pagina = 'portada' | 'legal';

export const RUTES: Record<Pagina, Record<Idioma, string>> = {
  portada: { ca: '/', es: '/es/' },
  legal: { ca: '/avis-legal/', es: '/es/aviso-legal/' },
};
