import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { ImageMetadata } from 'astro';
import {
  construeixPlats,
  construeixRestaurant,
  ContingutError,
  getPlats,
  getRestaurant,
  nomEsFragmentDelCaption,
  parsePlats,
  parseRestaurant,
  parseSeleccio,
  resolImatge,
  type ImatgesGlob,
} from '../../src/lib/contingut';
import { historiaEsperada, posts, presentacioEsperada } from './ajuda';

const llegeix = (ruta: string) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8');
const platsText = llegeix('contingut/plats.json');
const seleccioText = llegeix('contingut/seleccio.yaml');
const restaurantText = llegeix('contingut/restaurant.yaml');

const meta = (width: number): { default: ImageMetadata } => ({
  default: { src: '/x.jpg', width, height: Math.round(width * 1.33), format: 'jpg' },
});

/** Glob simulat amb les 8 fotos. */
const globReal = (ample = 450): ImatgesGlob =>
  Object.fromEntries(
    Array.from({ length: 8 }, (_, i) => [`/contingut/imatges/plat-0${i + 1}.jpeg`, meta(ample)]),
  );

describe('parsePlats (B-07)', () => {
  it('el plats.json real és vàlid', () => {
    const { posts: llegits, avisos } = parsePlats(platsText);
    expect(llegits).toHaveLength(8);
    expect(avisos).toEqual([]);
  });

  it('un JSON trencat dona un error amb el nom del fitxer', () => {
    expect(() => parsePlats('[{"id": "plat-01",')).toThrow(/contingut\/plats\.json/);
  });

  it('un id repetit és un error', () => {
    const llista = JSON.parse(platsText);
    llista.push({ ...llista[0] });
    expect(() => parsePlats(JSON.stringify(llista))).toThrow(/plat-01.*repetit/);
  });

  it("una URL que no és d'Instagram és un error que diu l'id", () => {
    const llista = JSON.parse(platsText);
    llista[1].url_post = 'https://exemple.com/p/abc/';
    expect(() => parsePlats(JSON.stringify(llista))).toThrow(/plat-02/);
  });

  it('un camp desconegut dona un avís i s\'ignora', () => {
    const llista = JSON.parse(platsText);
    llista[0].extra = 'x';
    const { avisos } = parsePlats(JSON.stringify(llista));
    expect(avisos).toEqual([`[contingut] plat-01: camp desconegut "extra" a plats.json (s'ignora)`]);
  });
});

describe('parseRestaurant (B-07)', () => {
  it('el restaurant.yaml real és vàlid', () => {
    const dades = parseRestaurant(restaurantText);
    expect(dades.nom).toBe('Bistrot 1954');
    expect(dades.avis_legal.demostracio).toBe(true);
    expect(dades.estadistiques?.goatcounter).toBeNull();
  });

  it('amb demostracio: true i un NIF que no és de zeros, error', () => {
    const text = restaurantText.replace('B00000000', 'B12345678');
    expect(() => parseRestaurant(text)).toThrow(/NIF/);
  });

  it("amb demostracio: true i un correu que no és d'example.com, error", () => {
    const text = restaurantText.replace('avis-legal@example.com', 'info@restaurant.cat');
    expect(() => parseRestaurant(text)).toThrow(/example\.com/);
  });

  it('amb demostracio: false, un NIF real és acceptat', () => {
    const text = restaurantText.replace('B00000000', 'B12345678').replace('demostracio: true', 'demostracio: false');
    expect(parseRestaurant(text).avis_legal.nif).toBe('B12345678');
  });

  it('un telèfon amb format incorrecte és un error', () => {
    expect(() => parseRestaurant(restaurantText.replace('+34 936 27 35 36', '936273536'))).toThrow(/telefon/);
  });

  it('un codi de GoatCounter amb majúscules és un error', () => {
    expect(() => parseRestaurant(restaurantText.replace('goatcounter: null', 'goatcounter: Prova'))).toThrow(
      /goatcounter/,
    );
  });

  it('un YAML trencat dona un error amb el nom del fitxer', () => {
    expect(() => parseRestaurant('nom: [')).toThrow(/contingut\/restaurant\.yaml/);
  });
});

describe('parseSeleccio', () => {
  it('la selecció real és vàlida i cada id existeix a plats.json', () => {
    expect(parseSeleccio(seleccioText, posts).plats).toHaveLength(8);
  });

  it('un id que no existeix a plats.json és un error', () => {
    expect(() => parseSeleccio('plats:\n  - id: plat-99\n    nom: { ca: "X" }\n', posts)).toThrow(/plat-99/);
  });

  it('un nom buit és un error', () => {
    expect(() => parseSeleccio('plats:\n  - id: plat-01\n    nom: { ca: "" }\n', posts)).toThrow(/nom/);
  });
});

describe('nom com a fragment del caption (B-11)', () => {
  it('és un fragment sense distingir majúscules, emojis ni apòstrofs tipogràfics', () => {
    expect(nomEsFragmentDelCaption('Pastís de formatge', posts[2]!.caption)).toBe(true);
    expect(nomEsFragmentDelCaption("Calamars a l’andalusa", posts[3]!.caption)).toBe(true);
  });

  it("un nom que no és al caption fa fallar la construcció amb un missatge que diu l'id", () => {
    const seleccio = parseSeleccio('plats:\n  - id: plat-02\n    nom: { ca: "Gelat de vainilla" }\n', posts);
    expect(() => construeixPlats(posts, seleccio, globReal())).toThrow(ContingutError);
    expect(() => construeixPlats(posts, seleccio, globReal())).toThrow(/plat-02.*Gelat de vainilla/);
  });

  it("amb nom_confirmat: true, el nom no cal que sigui al caption", () => {
    const seleccio = parseSeleccio(
      'plats:\n  - id: plat-02\n    nom: { ca: "Gelat de vainilla" }\n    nom_confirmat: true\n',
      posts,
    );
    expect(construeixPlats(posts, seleccio, globReal()).plats[0]!.nom.ca.text).toBe('Gelat de vainilla');
  });

  it("un idiomes de longitud incorrecta fa fallar la construcció amb l'id", () => {
    const seleccio = parseSeleccio(
      'plats:\n  - id: plat-02\n    nom: { ca: "Figues i foie" }\n    idiomes: [ca]\n',
      posts,
    );
    expect(() => construeixPlats(posts, seleccio, globReal())).toThrow(/plat-02.*idiomes/);
  });
});

describe('imatges (B-12)', () => {
  const seleccio = parseSeleccio(seleccioText, posts);

  it('amb les 8 fotos no hi ha cap avís', () => {
    expect(construeixPlats(posts, seleccio, globReal()).avisos).toEqual([]);
  });

  it('amb un glob buit, exactament 8 avisos "sense imatge" i imatge null', () => {
    const { plats, avisos } = construeixPlats(posts, seleccio, {});
    expect(avisos.filter((a) => a.includes('sense imatge'))).toHaveLength(8);
    expect(avisos).toHaveLength(8);
    expect(avisos[0]).toBe('[contingut] plat-01 sense imatge: es mostra sense foto');
    expect(plats.every((p) => p.imatge === null)).toBe(true);
  });

  it('una imatge de 300 px dona l\'avís de mida', () => {
    const glob = globReal();
    glob['/contingut/imatges/plat-03.jpeg'] = meta(300);
    expect(construeixPlats(posts, seleccio, glob).avisos).toEqual([
      "[contingut] plat-03: la foto fa 300 px d'ample (mínim 400): es veurà ampliada",
    ]);
  });

  it('una foto de 446 px no dona cap avís', () => {
    expect(construeixPlats(posts, seleccio, globReal(446)).avisos).toEqual([]);
  });

  it("un fitxer d'imatge que no correspon a cap id dona un avís", () => {
    const glob = globReal();
    glob['/contingut/imatges/plat-99.jpeg'] = meta(450);
    expect(construeixPlats(posts, seleccio, glob).avisos).toHaveLength(1);
  });

  it('resolImatge accepta jpg, jpeg, png i webp, i la ruta de post.imatge', () => {
    const post = posts[0]!;
    expect(resolImatge(post, { '/contingut/imatges/plat-01.webp': meta(450) })).not.toBeNull();
    expect(resolImatge(post, { '/contingut/imatges/plat-01.png': meta(450) })).not.toBeNull();
    expect(resolImatge(post, { '/contingut/imatges/plat-02.png': meta(450) })).toBeNull();
    expect(
      resolImatge({ ...post, imatge: 'contingut/imatges/foto-especial.jpg' }, { '/contingut/imatges/foto-especial.jpg': meta(500) })
        ?.width,
    ).toBe(500);
  });

  it('un post de la selecció amb amagat: true no surt', () => {
    const amagat = parseSeleccio('plats:\n  - id: plat-02\n    nom: { ca: "Figues i foie" }\n    amagat: true\n', posts);
    expect(construeixPlats(posts, amagat, globReal()).plats).toEqual([]);
  });

  it('els posts que no són a la selecció donen l\'avís "pendent de classificar"', () => {
    const una = parseSeleccio('plats:\n  - id: plat-02\n    nom: { ca: "Figues i foie" }\n', posts);
    const { avisos } = construeixPlats(posts, una, globReal());
    expect(avisos.filter((a) => a.includes('pendent de classificar'))).toHaveLength(7);
  });
});

describe('plats i restaurant reals (B-13)', () => {
  const plats = getPlats();
  const restaurant = getRestaurant();

  it('8 plats, en l\'ordre de seleccio.yaml, tots amb foto', () => {
    expect(plats.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map((n) => `plat-0${n}`));
    expect(plats.every((p) => p.imatge !== null)).toBe(true);
    expect(plats.map((p) => p.ordre)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('plat-03: la història catalana comença pel pastís i la castellana té lang es', () => {
    const plat = plats.find((p) => p.id === 'plat-03')!;
    expect(plat.historia.ca?.paragrafs[0]?.[0]).toMatch(/^El pastís de formatge/);
    expect(plat.historia.ca?.lang).toBe('ca');
    expect(plat.historia.es?.lang).toBe('es');
    expect(plat.historia.es?.paragrafs[0]?.[0]).toMatch(/^El pastel de queso/);
  });

  it('les històries de tots els plats coincideixen amb la fixture', () => {
    for (const plat of plats) {
      for (const idioma of ['ca', 'es'] as const) {
        const text = plat.historia[idioma]!.paragrafs.map((p) => p.join('\n')).join('\n\n');
        expect(text).toBe(historiaEsperada[plat.id]![idioma]);
      }
    }
  });

  it('els noms són els de la selecció i són en el seu idioma', () => {
    const plat = plats.find((p) => p.id === 'plat-04')!;
    expect(plat.nom.ca).toEqual({ text: "Calamars a l'andalusa", lang: 'ca' });
    expect(plat.nom.es).toEqual({ text: 'Calamares a la andaluza', lang: 'es' });
  });

  it('cada plat enllaça al seu post original i guarda el caption literal', () => {
    for (const plat of plats) {
      const post = posts.find((p) => p.id === plat.id)!;
      expect(plat.urlPost).toBe(post.url_post);
      expect(plat.captionOriginal).toBe(post.caption);
    }
  });

  it('telèfon visible i enllaç', () => {
    expect(restaurant.telefonVisible).toBe('936 27 35 36');
    expect(restaurant.telefonEnllac).toBe('tel:+34936273536');
  });

  it('mapa: la fitxa de Google Maps', () => {
    expect(restaurant.mapaUrl).toBe('https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA');
  });

  it('la presentació neta coincideix amb la fixture, en tots dos idiomes', () => {
    for (const idioma of ['ca', 'es'] as const) {
      const historia = restaurant.presentacio[idioma]!;
      expect(historia.lang).toBe(idioma);
      expect(historia.paragrafs).toHaveLength(1);
      expect(historia.paragrafs[0]!.join('\n')).toBe(presentacioEsperada[idioma]);
    }
  });

  it('en local no hi ha estadístiques', () => {
    expect(restaurant.estadistiques).toBeNull();
  });
});

describe('construeixRestaurant', () => {
  const dades = parseRestaurant(restaurantText);

  it('estadístiques només amb build de publicació i codi', () => {
    const amb = parseRestaurant(restaurantText.replace('goatcounter: null', 'goatcounter: prova'));
    expect(construeixRestaurant(amb, { publicacio: true }).restaurant.estadistiques).toEqual({
      endpoint: 'https://prova.goatcounter.com/count',
    });
    expect(construeixRestaurant(amb, { publicacio: false }).restaurant.estadistiques).toBeNull();
    expect(construeixRestaurant(dades, { publicacio: true }).restaurant.estadistiques).toBeNull();
  });

  it("un build de publicació amb demostracio: true avisa de l'avís legal", () => {
    expect(construeixRestaurant(dades, { publicacio: true }).avisos).toEqual([
      "[contingut] l'avís legal porta dades de demostració",
    ]);
    expect(construeixRestaurant(dades, { publicacio: false }).avisos).toEqual([]);
  });

  it('sense presentació en un idioma, es mostra la de l\'altre amb el seu lang (P2)', () => {
    const nomesCa = { ...dades, presentacio: { ca: 'Hola, món.', es: null } };
    const { restaurant } = construeixRestaurant(nomesCa, { publicacio: false });
    expect(restaurant.presentacio.es).toEqual({ lang: 'ca', paragrafs: [['Hola, món.']] });
  });

  it('una presentació que queda buida després de la neteja és null i avisa', () => {
    const buida = { ...dades, presentacio: { ca: '🔥🍽️', es: null } };
    const { restaurant, avisos } = construeixRestaurant(buida, { publicacio: false });
    expect(restaurant.presentacio.ca).toBeNull();
    expect(avisos).toHaveLength(1);
  });

  it('sense telèfon no hi ha enllaç tel:', () => {
    const sense = { ...dades, telefon: null };
    const { restaurant } = construeixRestaurant(sense, { publicacio: false });
    expect(restaurant.telefonEnllac).toBeNull();
    expect(restaurant.telefonVisible).toBeNull();
  });
});

describe('plat sense història (P1) i fallback de nom i història (P2)', () => {
  it('un caption amb només hashtags dona un plat sense història', () => {
    const post = { ...posts[0]!, id: 'plat-90', caption: '#Bistrot1954 #tapes' };
    const seleccio = parseSeleccio('plats:\n  - id: plat-90\n    nom: { ca: "Sopa" }\n    nom_confirmat: true\n', [post]);
    const { plats } = construeixPlats([post], seleccio, {});
    expect(plats[0]!.historia).toEqual({ ca: null, es: null });
    expect(plats[0]!.nom.es).toEqual({ text: 'Sopa', lang: 'ca' });
  });

  it('un caption només en castellà es mostra a la pàgina catalana amb lang es', () => {
    const post = {
      ...posts[0]!,
      id: 'plat-91',
      caption: 'Nuestro steak tartar es histórico. Hay cosas que no hay que tocar. 🥩',
    };
    const seleccio = parseSeleccio('plats:\n  - id: plat-91\n    nom: { ca: "Steak tartar" }\n', [post]);
    const { plats } = construeixPlats([post], seleccio, {});
    expect(plats[0]!.historia.ca?.lang).toBe('es');
    expect(plats[0]!.historia.es?.lang).toBe('es');
  });
});
