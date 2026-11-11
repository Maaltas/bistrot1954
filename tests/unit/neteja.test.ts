import { describe, expect, it } from 'vitest';
import { netejaCaption, treuNomInicial } from '../../src/lib/neteja';
import { esSubsequencia, historiaDe, historiaEsperada, noms, paraules, posts } from './ajuda';

describe('captions reals de plats.json (N1-N8, fixture de arq. §3.4.3)', () => {
  it('hi ha 8 posts', () => {
    expect(posts).toHaveLength(8);
  });

  for (const post of posts) {
    it(`${post.id}: la història neta coincideix amb la fixture, en català i en castellà`, () => {
      const historia = historiaDe(post.caption, undefined, noms[post.id]);
      expect(historia.ca).toBe(historiaEsperada[post.id]?.ca);
      expect(historia.es).toBe(historiaEsperada[post.id]?.es);
      expect(historia.avisos).toEqual([]);
    });

    it(`${post.id}: invariant de paraules (la història és una subseqüència del caption)`, () => {
      const historia = historiaDe(post.caption, undefined, noms[post.id]);
      const original = paraules(post.caption);
      for (const text of [historia.ca, historia.es]) {
        expect(text).not.toBeNull();
        // Única excepció (N8): la primera paraula no distingeix la caixa de la seva primera lletra.
        const publicades = paraules(text as string);
        if (!original.includes(publicades[0]!)) publicades[0] = publicades[0]!.charAt(0).toLowerCase() + publicades[0]!.slice(1);
        expect(esSubsequencia(publicades, original)).toBe(true);
      }
    });

    it(`${post.id}: la història no comença pel nom del plat (N8, arq. §3.5.4)`, () => {
      const historia = historiaDe(post.caption, undefined, noms[post.id]);
      for (const idioma of ['ca', 'es'] as const) {
        const nom = (noms[post.id]![idioma] ?? noms[post.id]!.ca).toLowerCase().replace(/[’‘]/g, "'");
        const text = (historia[idioma] as string).toLowerCase().replace(/[’‘]/g, "'");
        if (text.startsWith(nom)) {
          const resta = text.slice(nom.length);
          expect(resta === '' || !/^(?:\s*[.:;!?…\n]|\s+[—–]\s)/.test(resta)).toBe(true);
        }
      }
    });

    it(`${post.id}: no queda cap hashtag, menció ni emoji`, () => {
      const historia = historiaDe(post.caption, undefined, noms[post.id]);
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

describe("N8 · nom del plat a l'inici de la història (casos E16-E23 d'arq. §3.4.4)", () => {
  const amb = (caption: string, nom: string) => historiaDe(caption, undefined, { ca: nom }).ca;

  it("E16 · el nom i l'emoji que el separa del text", () => {
    expect(amb("Pa amb tomàquet 🍅 Fet a casa amb tomàquet de l'hort.", 'Pa amb tomàquet')).toBe(
      "Fet a casa amb tomàquet de l'hort.",
    );
  });

  it('E17 · nom i dos punts: majúscula inicial', () => {
    expect(amb('Figues i foie: dolç i untuós.', 'Figues i foie')).toBe('Dolç i untuós.');
  });

  it('E18 · si no queda res, la història és null (P1)', () => {
    expect(amb('Figues i foie 🍂', 'Figues i foie')).toBeNull();
  });

  it('E19 · el nom va seguit d’una paraula: es deixa', () => {
    expect(amb('Croqueta de sípia en la seva tinta és la reina de la casa.', 'Croqueta de sípia en la seva tinta')).toBe(
      'Croqueta de sípia en la seva tinta és la reina de la casa.',
    );
  });

  it('E20 · no distingeix majúscules', () => {
    expect(amb('FIGUES I FOIE. Un entrant de temporada.', 'Figues i foie')).toBe('Un entrant de temporada.');
  });

  it('E21 · després del nom hi ha una lletra: es deixa', () => {
    expect(amb('Figues i foies amb mel.', 'Figues i foie')).toBe('Figues i foies amb mel.');
  });

  it('E22 · la coma no és un separador', () => {
    expect(amb('Steak tartar, tallat a ganivet.', 'Steak tartar')).toBe('Steak tartar, tallat a ganivet.');
  });

  it('E23 · el nom no és al començament', () => {
    expect(amb('El pastís de formatge és un clàssic.', 'Pastís de formatge')).toBe('El pastís de formatge és un clàssic.');
  });

  it('un guió llarg amb espais als dos costats és un separador; sense espais, no', () => {
    expect(amb('Figues i foie — dolç.', 'Figues i foie')).toBe('Dolç.');
    expect(amb('Figues i foie—dolç.', 'Figues i foie')).toBe('Figues i foie—dolç.');
  });

  it('l’apòstrof tipogràfic es compara com el recte', () => {
    expect(amb('Calamars a l’andalusa. Es demanen per compartir.', "Calamars a l'andalusa")).toBe('Es demanen per compartir.');
  });

  it('només es treu una vegada i al començament del primer paràgraf', () => {
    expect(amb('Sopa. Sopa. Bona.', 'Sopa')).toBe('Sopa. Bona.');
    expect(amb('Un plat.\n\nSopa. Bona.', 'Sopa')).toBe('Un plat.\n\nSopa. Bona.');
  });

  it('cada idioma fa servir el seu nom, i nom.ca si no en té', () => {
    const caption = 'Higos y foie: dulce y untuoso.\n\nFigues i foie: dolç i untuós.';
    expect(historiaDe(caption, undefined, { ca: 'Figues i foie', es: 'Higos y foie' })).toMatchObject({
      ca: 'Dolç i untuós.',
      es: 'Dulce y untuoso.',
    });
    expect(historiaDe(caption, undefined, { ca: 'Figues i foie' }).es).toBe('Higos y foie: dulce y untuoso.');
  });

  it('no modifica l’entrada', () => {
    const entrada = [['Sopa. Bona.']];
    treuNomInicial(entrada, 'Sopa', 'ca');
    expect(entrada).toEqual([['Sopa. Bona.']]);
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
