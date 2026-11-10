import { describe, expect, it } from 'vitest';
import { netejaCaption } from '../../src/lib/neteja';
import { esSubsequencia, historiaDe, historiaEsperada, paraules, posts } from './ajuda';

describe('captions reals de plats.json (fixture de arq. §3.4.3)', () => {
  it('hi ha 8 posts', () => {
    expect(posts).toHaveLength(8);
  });

  for (const post of posts) {
    it(`${post.id}: la història neta coincideix amb la fixture, en català i en castellà`, () => {
      const historia = historiaDe(post.caption);
      expect(historia.ca).toBe(historiaEsperada[post.id]?.ca);
      expect(historia.es).toBe(historiaEsperada[post.id]?.es);
      expect(historia.avisos).toEqual([]);
    });

    it(`${post.id}: invariant de paraules (la història és una subseqüència del caption)`, () => {
      const historia = historiaDe(post.caption);
      const original = paraules(post.caption);
      for (const text of [historia.ca, historia.es]) {
        expect(text).not.toBeNull();
        expect(esSubsequencia(paraules(text as string), original)).toBe(true);
      }
    });

    it(`${post.id}: no queda cap hashtag, menció ni emoji`, () => {
      const historia = historiaDe(post.caption);
      for (const text of [historia.ca, historia.es]) {
        expect(text).not.toMatch(/[#@]/);
        expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
      }
    });
  }

  it('plat-01 (pas a pas): signatura i hashtag fora, emoji enmig = salt de línia', () => {
    const paragrafs = netejaCaption(posts[0]!.caption);
    expect(paragrafs).toEqual([
      [
        'Tagliatelle amb safrà, mantega i tonyina',
        "Pasta que s'acaba a la paella, amb el color del safrà i la tonyina per sobre.",
        'Una explosió de tardor a la taula de Bistrot 1954',
      ],
      [
        'Tagliatelle con azafrán, mantequilla y atún',
        'Pasta que se termina en la sartén, con el color del azafrán y el atún por encima.',
        'Una explosión de otoño en la mesa de Bistrot 1954',
      ],
    ]);
  });
});

describe("casos límit (entrades sintètiques d'arq. §3.4.4)", () => {
  it('E1 · caption buit', () => {
    expect(netejaCaption('')).toEqual([]);
    expect(historiaDe('')).toMatchObject({ ca: null, es: null });
  });

  it('E2 · només hashtags', () => {
    expect(historiaDe('#Bistrot1954 #tapes #badalona')).toMatchObject({ ca: null, es: null });
  });

  it('E3 · només signatura i hashtag', () => {
    const caption = '🍽️ Bistrot 1954\n🍷 Cuina mediterrània\n📍 Carrer Sant Bru 48, Badalona\n\n#Bistrot1954';
    expect(historiaDe(caption)).toMatchObject({ ca: null, es: null });
  });

  it('E4 · només emojis', () => {
    expect(historiaDe('🍝🍂🧡')).toMatchObject({ ca: null, es: null });
  });

  it('E5 · hashtag enmig, promoció i mencions al final', () => {
    const historia = historiaDe(
      'Croqueta de #sípia en la seva tinta 🖤. Reserva ja la teva taula! Link a la bio 👆 @bistrot1954 #tapes',
    );
    expect(historia.ca).toBe('Croqueta de sípia en la seva tinta.');
    expect(historia.es).toBeNull();
    expect(historia.avisos).toHaveLength(1);
  });

  it('E6 · emoji enmig seguit de minúscula = un espai', () => {
    expect(historiaDe("Fet a casa 🍅 amb tomàquet de l'hort.").ca).toBe("Fet a casa amb tomàquet de l'hort.");
  });

  it('E7 · dos idiomes sense línia en blanc', () => {
    const historia = historiaDe('Pa amb tomàquet i oli.\nPan con tomate y aceite.');
    expect(historia.ca).toBe('Pa amb tomàquet i oli.');
    expect(historia.es).toBe('Pan con tomate y aceite.');
  });

  it('E8 · només castellà: el català és null', () => {
    const historia = historiaDe('Nuestro steak tartar es histórico. Hay cosas que no hay que tocar. 🥩');
    expect(historia.ca).toBeNull();
    expect(historia.es).toBe('Nuestro steak tartar es histórico. Hay cosas que no hay que tocar.');
  });

  it('E9 · caption molt llarg (~2.050 caràcters): cap truncament', () => {
    const original = posts[2]!.caption.split('\n\n')[1]!.replace(' 🍰', '');
    const caption = Array.from({ length: 8 }, () => original).join('\n\n');
    expect(caption.length).toBeGreaterThan(2000);
    const historia = historiaDe(caption);
    expect(historia.es).toBeNull();
    expect(historia.ca).toBe(Array.from({ length: 8 }, () => original).join('\n\n'));
    expect(netejaCaption(caption)).toHaveLength(8);
  });

  it("E10 · '#1' no és un hashtag", () => {
    expect(historiaDe('Plat #1 de la casa').ca).toBe('Plat #1 de la casa');
  });

  it("E11 · emoji de tecla (keycap) a l'inici", () => {
    expect(historiaDe('1️⃣ Primer plat').ca).toBe('Primer plat');
  });

  it('E12 · salts de línia Windows, NBSP i espais múltiples', () => {
    const entrada = 'Línia u\r\n\r\n\r\nLínia dos  amb   espais';
    expect(netejaCaption(entrada)).toEqual([['Línia u'], ['Línia dos amb espais']]);
    const historia = historiaDe(entrada);
    expect(historia.ca).toBe('Línia u\n\nLínia dos amb espais');
    expect(historia.es).toBeNull();
    expect(historia.avisos).toHaveLength(2);
  });

  it("E13 · HTML al caption: la neteja manté el text tal qual (el component l'escapa)", () => {
    expect(historiaDe('Pa amb <script>alert(1)</script> i oli.').ca).toBe('Pa amb <script>alert(1)</script> i oli.');
  });
});

describe('regles de detall', () => {
  it('els correus no es tracten com a mencions', () => {
    expect(historiaDe('Escriu a hola@exemple.cat per tot').ca).toBe('Escriu a hola@exemple.cat per tot');
  });

  it("una menció enmig només perd l'arroba", () => {
    expect(historiaDe('Cuinat per @maria amb amor').ca).toBe('Cuinat per maria amb amor');
  });

  it('©, ® i ™ es mantenen', () => {
    expect(historiaDe('Marca® registrada').ca).toBe('Marca® registrada');
  });

  it("la signatura només s'elimina si la línia sencera coincideix", () => {
    const historia = historiaDe('Una explosió de tardor a la taula de Bistrot 1954 🧡🍂');
    expect(historia.ca).toBe('Una explosió de tardor a la taula de Bistrot 1954');
  });

  it('frases promocionals: es treuen senceres i la resta es manté', () => {
    const historia = historiaDe("Plat de temporada amb molt de gust. Us esperem! Truca'ns per reservar. Enlace en la bio.");
    expect(historia.ca).toBe('Plat de temporada amb molt de gust.');
  });

  it("emoji seguit de signe d'obertura = salt de línia", () => {
    expect(netejaCaption('Primer 🍷 ¿Vamos?')).toEqual([['Primer', '¿Vamos?']]);
  });

  it('els espais abans de la puntuació desapareixen', () => {
    expect(netejaCaption('Hola , món !')).toEqual([['Hola, món!']]);
  });
});
