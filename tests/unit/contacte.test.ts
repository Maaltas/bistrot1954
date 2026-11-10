import { describe, expect, it } from 'vitest';
import { construeixContacte, type DadesContacte } from '../../src/lib/contacte';

const dades: DadesContacte = {
  nom: 'Bistrot 1954',
  adreca: { carrer: 'Carrer Sant Bru, 48', codi_postal: '08911', municipi: 'Badalona' },
  instagram: 'https://www.instagram.com/bistrot1954/',
  telefon: '+34 936 27 35 36',
  google_maps_url: 'https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA',
};

describe('contacte (B-18)', () => {
  it('telèfon: enllaç tel: sense espais i text visible sense prefix', () => {
    const c = construeixContacte(dades);
    expect(c.telefonEnllac).toBe('tel:+34936273536');
    expect(c.telefonVisible).toBe('936 27 35 36');
  });

  it('el mapa és la fitxa de Google Maps', () => {
    expect(construeixContacte(dades).mapaUrl).toBe('https://maps.app.goo.gl/UHYpDrqhtGuyBX5SA');
  });

  it("amb telefon: null no surt cap tel:", () => {
    const c = construeixContacte({ ...dades, telefon: null });
    expect(c.telefonEnllac).toBeNull();
    expect(c.telefonVisible).toBeNull();
  });

  it('amb google_maps_url: null surt la cerca amb nom, adreça, CP i municipi', () => {
    const c = construeixContacte({ ...dades, google_maps_url: null });
    expect(c.mapaUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent('Bistrot 1954, Carrer Sant Bru, 48, 08911, Badalona'),
    );
  });

  it('Instagram és sempre present', () => {
    expect(construeixContacte(dades).instagramUrl).toBe('https://www.instagram.com/bistrot1954/');
  });
});
