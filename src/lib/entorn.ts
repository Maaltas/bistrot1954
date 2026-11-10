/**
 * Entorn: build local o de publicació, site, base i ruta() (arq. §2.4).
 * La decisió es pren aquí, en un sol lloc, i la fan servir astro.config.mjs i els components.
 */

export const SITE_PER_DEFECTE = 'https://maaltas.github.io';
export const BASE_PER_DEFECTE = '/bistrot1954';

export interface EntornCalculat {
  /** true si és un build de publicació (variable CI definida). */
  publicacio: boolean;
  site: string;
  /** Sense barra final; `/` si hi ha domini propi. */
  base: string;
  avisos: string[];
}

type Env = Record<string, string | undefined>;

/** Treu les barres sobrants i garanteix una barra inicial i cap de final (excepte l'arrel). */
export function normalitzaBase(base: string): string {
  const neta = '/' + base.replace(/^\/+|\/+$/g, '');
  return neta === '/' ? '/' : neta;
}

export function esPublicacio(env: Env = process.env): boolean {
  return env.CI !== undefined && env.CI !== '';
}

/**
 * Calcula `site` i `base` (arq. §2.4).
 * - Amb `webUrl` definit (domini propi): site = webUrl, base = '/'.
 * - Build de publicació amb les variables de GitHub: derivats d'elles, amb avís si no coincideixen amb els per defecte.
 * - La resta: valors per defecte.
 */
export function calculaEntorn(env: Env, webUrl: string | null): EntornCalculat {
  const publicacio = esPublicacio(env);
  const avisos: string[] = [];

  if (webUrl) {
    return { publicacio, site: webUrl.replace(/\/+$/, ''), base: '/', avisos };
  }

  let site = SITE_PER_DEFECTE;
  let base = BASE_PER_DEFECTE;

  const propietari = env.GITHUB_REPOSITORY_OWNER;
  const repositori = env.GITHUB_REPOSITORY;
  if (publicacio && propietari && repositori && repositori.includes('/')) {
    const derivatSite = `https://${propietari.toLowerCase()}.github.io`;
    const derivatBase = normalitzaBase(repositori.slice(repositori.indexOf('/') + 1));
    if (derivatSite !== SITE_PER_DEFECTE || derivatBase !== BASE_PER_DEFECTE) {
      avisos.push(
        `[entorn] la URL derivada (${derivatSite}${derivatBase}/) no coincideix amb la per defecte (${SITE_PER_DEFECTE}${BASE_PER_DEFECTE}/)`,
      );
    }
    site = derivatSite;
    base = derivatBase;
  }

  return { publicacio, site, base, avisos };
}

/** Afegeix `base` a una ruta lògica i deixa una sola barra. `ruta('/es/')` → `/bistrot1954/es/`. */
export function ruta(path: string, base: string = import.meta.env.BASE_URL): string {
  const b = normalitzaBase(base);
  const p = '/' + path.replace(/^\/+/, '');
  if (b === '/') return p;
  return b + p;
}

/** URL pública de la portada, amb barra final (`<web>` d'arq. §2.4). */
export function urlWeb(site: string, base: string): string {
  const b = normalitzaBase(base);
  return site.replace(/\/+$/, '') + (b === '/' ? '/' : b + '/');
}

/** URL absoluta d'una ruta lògica: `urlAbsoluta('/es/')` → `https://maaltas.github.io/bistrot1954/es/`. */
export function urlAbsoluta(path: string, site: string, base: string): string {
  return site.replace(/\/+$/, '') + ruta(path, base);
}
