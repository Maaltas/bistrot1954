import { describe, expect, it } from 'vitest';
import { formataHorari, textos } from '../../src/i18n/textos';
import { calculaWidths } from '../../src/lib/imatges';
import { getRestaurant } from '../../src/lib/contingut';
import { jsonLdRestaurant, metaLegal, metaPortada, serialitzaJsonLd } from '../../src/lib/seo';

const restaurant = getRestaurant();
const WEB = 'https://maaltas.github.io/bistrot1954/';

describe('horari i telèfon (F-04)', () => {
  it("l'horari d'avui en català i en castellà", () => {
    expect(formataHorari(restaurant.horari, 'ca')).toEqual(['De dilluns a dissabte, de 20:00 a 23:00']);
    expect(formataHorari(restaurant.horari, 'es')).toEqual(['De lunes a sábado, de 20:00 a 23:00']);
  });

  it('un sol dia i dies no consecutius', () => {
    expect(formataHorari([{ dies: ['dv'], obre: '13:00', tanca: '16:00' }], 'ca')).toEqual([
      'Divendres, de 13:00 a 16:00',
    ]);
    expect(formataHorari([{ dies: ['dl', 'dc', 'dv'], obre: '20:00', tanca: '23:00' }], 'es')).toEqual([
      'Lunes, miércoles y viernes, de 20:00 a 23:00',
    ]);
    expect(formataHorari(null, 'ca')).toEqual([]);
  });

  it('telèfon i textos', () => {
    expect(restaurant.telefonVisible).toBe('936 27 35 36');
    expect(restaurant.telefonEnllac).toBe('tel:+34936273536');
    expect(textos.ca.trucarLlarg('936 27 35 36')).toBe('Trucar al 936 27 35 36');
    expect(textos.es.trucarLlarg('936 27 35 36')).toBe('Llamar al 936 27 35 36');
  });
});

describe('amples del srcset (B-14)', () => {
  it('segueix la taula d\'arq. §6.3', () => {
    expect(calculaWidths(450)).toEqual([360, 450]);
    expect(calculaWidths(446)).toEqual([360, 446]);
    expect(calculaWidths(1080)).toEqual([360, 450, 720, 900]);
  });

  it('cap variant més ampla que la font', () => {
    for (const ample of [300, 360, 449, 453, 600, 2000]) {
      expect(Math.max(...calculaWidths(ample))).toBeLessThanOrEqual(Math.min(ample, 900));
    }
  });
});

describe('metadades i JSON-LD (B-19, B-20)', () => {
  it('title ≤ 60 i description de 120 a 160 caràcters, en tots dos idiomes', () => {
    for (const idioma of ['ca', 'es'] as const) {
      const m = metaPortada(restaurant, idioma);
      expect(m.title.length).toBeLessThanOrEqual(60);
      expect(m.description.length).toBeGreaterThanOrEqual(120);
      expect(m.description.length).toBeLessThanOrEqual(160);
    }
    expect(metaPortada(restaurant, 'ca').title).toBe('Bistrot 1954 · Restaurant a Badalona, cuina mediterrània');
    expect(metaPortada(restaurant, 'es').title).toBe('Bistrot 1954 · Restaurante en Badalona, cocina mediterránea');
    expect(metaPortada(restaurant, 'ca').description).toBe(
      'Bistrot 1954: cuina mediterrània al Carrer Sant Bru, 48, de Badalona. Descobreix els nostres plats i la història de cadascun.',
    );
    expect(metaPortada(restaurant, 'es').description).toBe(
      'Bistrot 1954: cocina mediterránea en el Carrer Sant Bru, 48, de Badalona. Descubre nuestros platos y la historia de cada uno.',
    );
  });

  it('meta de les pàgines legals', () => {
    expect(metaLegal(restaurant, 'ca').title).toBe('Avís legal i privacitat · Bistrot 1954');
    expect(metaLegal(restaurant, 'es').title).toBe('Aviso legal y privacidad · Bistrot 1954');
  });

  it("el JSON-LD de / és idèntic a l'exemple d'arq. §7.3", () => {
    const dades = jsonLdRestaurant(restaurant, 'ca', { web: WEB, imatge: `${WEB}og.jpg` });
    expect(dades).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      '@id': 'https://maaltas.github.io/bistrot1954/#restaurant',
      name: 'Bistrot 1954',
      url: 'https://maaltas.github.io/bistrot1954/',
      description:
        'Aquí prima el confort, el menjar sense presses i el gust pel que és d’aquí. Des dels entrants fins als postres, a Bistrot 1954 tenim una missió: que surtis per la porta pensant en quan tornaràs.',
      image: 'https://maaltas.github.io/bistrot1954/og.jpg',
      telephone: '+34 936 27 35 36',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Carrer Sant Bru, 48',
        postalCode: '08911',
        addressLocality: 'Badalona',
        addressRegion: 'Barcelona',
        addressCountry: 'ES',
      },
      servesCuisine: 'Cuina mediterrània',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '20:00',
          closes: '23:00',
        },
      ],
      hasMap: 'https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA',
      sameAs: ['https://www.instagram.com/bistrot1954/'],
    });
  });

  it('a /es/ la descripció i la cuina són en castellà; sense og.jpg no hi ha image; cap nul', () => {
    const dades = jsonLdRestaurant(restaurant, 'es', { web: WEB, imatge: null });
    expect(dades.servesCuisine).toBe('Cocina mediterránea');
    expect(dades.description).toMatch(/^Aquí prima el confort, la comida sin prisas/);
    expect('image' in dades).toBe(false);
    expect(JSON.stringify(dades)).not.toContain('null');
  });

  it("s'escapa < al JSON serialitzat", () => {
    expect(serialitzaJsonLd({ a: '</script><b>' })).not.toContain('<');
  });
});
