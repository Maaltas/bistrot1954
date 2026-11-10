import { describe, expect, it } from 'vitest';
import { assignaIdiomes } from '../../src/lib/idioma';
import { netejaCaption } from '../../src/lib/neteja';
import { historiaDe, posts } from './ajuda';

/** Ordre dels idiomes detectat als captions reals (arq. §3.4.2). */
const ORDRE_ESPERAT: Record<string, ['ca' | 'es', 'ca' | 'es']> = {
  'plat-01': ['ca', 'es'],
  'plat-02': ['ca', 'es'],
  'plat-03': ['es', 'ca'],
  'plat-04': ['ca', 'es'],
  'plat-05': ['ca', 'es'],
  'plat-06': ['ca', 'es'],
  'plat-07': ['es', 'ca'],
  'plat-08': ['ca', 'es'],
};

/** Idioma d'un paràgraf sol (sense context). */
function idiomaDe(paragraf: string[]): 'ca' | 'es' {
  const r = assignaIdiomes([paragraf]);
  expect(r.avisos).toEqual([]);
  return r.ca.length === 1 ? 'ca' : 'es';
}

describe('assignaIdiomes: captions reals', () => {
  for (const post of posts) {
    it(`${post.id}: ordre ${ORDRE_ESPERAT[post.id]?.join(' → ')}`, () => {
      const paragrafs = netejaCaption(post.caption);
      expect(paragrafs).toHaveLength(2);
      expect([idiomaDe(paragrafs[0]!), idiomaDe(paragrafs[1]!)]).toEqual(ORDRE_ESPERAT[post.id]);
    });

    it(`${post.id}: dona un paràgraf per idioma i cap avís de descart`, () => {
      const r = assignaIdiomes(netejaCaption(post.caption));
      expect(r.ca).toHaveLength(1);
      expect(r.es).toHaveLength(1);
      expect(r.avisos).toEqual([]);
    });
  }
});

describe('assignaIdiomes: override (I5)', () => {
  it("E14 · l'override mana sobre la detecció", () => {
    const historia = historiaDe('Pa amb tomàquet i oli.\n\nPan con tomate y aceite.', ['es', 'ca']);
    expect(historia.ca).toBe('Pan con tomate y aceite.');
    expect(historia.es).toBe('Pa amb tomàquet i oli.');
    expect(historia.avisos).toEqual([]);
  });

  it('E15 · override amb una longitud que no quadra: error', () => {
    const paragrafs = netejaCaption('Pa amb tomàquet i oli.\n\nPan con tomate y aceite.');
    expect(() => assignaIdiomes(paragrafs, ['ca'])).toThrow(/2 paràgrafs/);
  });
});

describe('assignaIdiomes: descart (I4)', () => {
  it("amb dos paràgrafs, un d'indeterminat agafa l'idioma contrari de l'altre", () => {
    const r = assignaIdiomes([['Pa amb tomàquet i oli per a tothom.'], ['Cal Tomàs 48']]);
    expect(r.ca).toHaveLength(1);
    expect(r.es).toHaveLength(1);
    expect(r.avisos).toHaveLength(1);
  });

  it('sense cap paràgraf determinat, tot és català i amb avís', () => {
    const r = assignaIdiomes([['Hola'], ['Món']]);
    expect(r.ca).toHaveLength(2);
    expect(r.es).toHaveLength(0);
    expect(r.avisos).toHaveLength(2);
  });

  it('sense paràgrafs no hi ha res', () => {
    expect(assignaIdiomes([])).toEqual({ ca: [], es: [], avisos: [] });
  });
});
