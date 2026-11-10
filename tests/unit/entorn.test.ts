import { describe, expect, it } from 'vitest';
import {
  BASE_PER_DEFECTE,
  SITE_PER_DEFECTE,
  calculaEntorn,
  esPublicacio,
  ruta,
  urlAbsoluta,
  urlWeb,
} from '../../src/lib/entorn';

describe('calculaEntorn (B-06)', () => {
  it('per defecte: https://maaltas.github.io + /bistrot1954', () => {
    const e = calculaEntorn({}, null);
    expect(e).toEqual({ publicacio: false, site: SITE_PER_DEFECTE, base: BASE_PER_DEFECTE, avisos: [] });
  });

  it('build de publicació amb Maaltas/bistrot1954: els mateixos valors i sense avís', () => {
    const e = calculaEntorn(
      { CI: 'true', GITHUB_REPOSITORY_OWNER: 'Maaltas', GITHUB_REPOSITORY: 'Maaltas/bistrot1954' },
      null,
    );
    expect(e.publicacio).toBe(true);
    expect(e.site).toBe('https://maaltas.github.io');
    expect(e.base).toBe('/bistrot1954');
    expect(e.avisos).toEqual([]);
  });

  it('un altre propietari i repositori: es deriven, amb avís [entorn]', () => {
    const e = calculaEntorn({ CI: 'true', GITHUB_REPOSITORY_OWNER: 'Altre', GITHUB_REPOSITORY: 'Altre/prova' }, null);
    expect(e.site).toBe('https://altre.github.io');
    expect(e.base).toBe('/prova');
    expect(e.avisos).toHaveLength(1);
    expect(e.avisos[0]).toMatch(/^\[entorn\] la URL derivada/);
  });

  it("sense CI, les variables de GitHub s'ignoren", () => {
    const e = calculaEntorn({ GITHUB_REPOSITORY_OWNER: 'Altre', GITHUB_REPOSITORY: 'Altre/prova' }, null);
    expect(e.site).toBe(SITE_PER_DEFECTE);
    expect(e.base).toBe(BASE_PER_DEFECTE);
  });

  it('amb web_url (domini propi): site = web_url i base = /', () => {
    const e = calculaEntorn({ CI: 'true' }, 'https://bistrot1954.cat/');
    expect(e.site).toBe('https://bistrot1954.cat');
    expect(e.base).toBe('/');
  });

  it('esPublicacio depèn de CI', () => {
    expect(esPublicacio({ CI: 'true' })).toBe(true);
    expect(esPublicacio({})).toBe(false);
    expect(esPublicacio({ CI: '' })).toBe(false);
  });
});

describe('ruta() i URL absolutes', () => {
  it('afegeix la base i deixa una sola barra', () => {
    expect(ruta('/es/', '/bistrot1954')).toBe('/bistrot1954/es/');
    expect(ruta('es/', '/bistrot1954/')).toBe('/bistrot1954/es/');
    expect(ruta('/og.jpg', '/bistrot1954')).toBe('/bistrot1954/og.jpg');
    expect(ruta('/', '/bistrot1954')).toBe('/bistrot1954/');
  });

  it('amb base / no afegeix res', () => {
    expect(ruta('/es/', '/')).toBe('/es/');
  });

  it('urlWeb i urlAbsoluta', () => {
    expect(urlWeb(SITE_PER_DEFECTE, BASE_PER_DEFECTE)).toBe('https://maaltas.github.io/bistrot1954/');
    expect(urlAbsoluta('/es/', SITE_PER_DEFECTE, BASE_PER_DEFECTE)).toBe('https://maaltas.github.io/bistrot1954/es/');
    expect(urlWeb('https://bistrot1954.cat', '/')).toBe('https://bistrot1954.cat/');
  });
});
