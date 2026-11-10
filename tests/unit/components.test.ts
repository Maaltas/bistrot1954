import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Paragrafs from '../../src/components/Paragrafs.astro';
import Plat from '../../src/components/Plat.astro';
import { historiaDe } from './ajuda';
import type { Plat as PlatDades } from '../../src/lib/contingut';

const contenidor = await AstroContainer.create();

function plat(caption: string, nomCa = 'Plat de prova'): PlatDades {
  const historia = historiaDe(caption);
  const paragrafs = (text: string | null) => (text ? text.split('\n\n').map((p) => p.split('\n')) : null);
  const ca = paragrafs(historia.ca);
  const es = paragrafs(historia.es);
  return {
    id: 'plat-90',
    ordre: 0,
    nom: { ca: { text: nomCa, lang: 'ca' }, es: { text: nomCa, lang: 'ca' } },
    historia: {
      ca: ca ? { lang: 'ca', paragrafs: ca } : es ? { lang: 'es', paragrafs: es } : null,
      es: es ? { lang: 'es', paragrafs: es } : ca ? { lang: 'ca', paragrafs: ca } : null,
    },
    imatge: null,
    urlPost: 'https://www.instagram.com/p/ABC123/',
    captionOriginal: caption,
    dataPublicacio: null,
  };
}

describe('Paragrafs i E13 (B-15)', () => {
  it('un <p> per paràgraf i <br> entre línies', async () => {
    const html = await contenidor.renderToString(Paragrafs, { props: { paragrafs: [['a', 'b'], ['c']] } });
    const net = html.replace(/\s*data-astro-[a-z-]+="[^"]*"/g, '').replace(/\s+/g, '');
    expect(net).toBe('<p>a<br>b</p><p>c</p>');
  });

  it('E13: el text amb <script> es mostra escapat i no crea cap element script', async () => {
    const html = await contenidor.renderToString(Paragrafs, {
      props: { paragrafs: [['Pa amb <script>alert(1)</script> i oli.']] },
    });
    expect(html).not.toContain('<script');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});

describe('Plat: variants (F-13, F-14, P1, P2)', () => {
  it('sense foto: cap <img>, enllaç "Veure la foto a Instagram" i classe de bloc', async () => {
    const html = await contenidor.renderToString(Plat, {
      props: { plat: plat('Pa amb tomàquet i oli.\n\nPan con tomate y aceite.'), lang: 'ca' },
    });
    expect(html).not.toContain('<img');
    expect(html).toContain('plat--sense-foto');
    expect(html).toContain('Veure la foto a Instagram');
    expect(html).toContain('data-historia');
  });

  it('sense història (E2): cap [data-historia] i l\'enllaç és present', async () => {
    const html = await contenidor.renderToString(Plat, { props: { plat: plat('#Bistrot1954 #tapes'), lang: 'ca' } });
    expect(html).not.toContain('data-historia');
    expect(html).toContain('href="https://www.instagram.com/p/ABC123/"');
  });

  it('un caption només en castellà a la pàgina catalana porta lang="es" (P2)', async () => {
    const html = await contenidor.renderToString(Plat, {
      props: { plat: plat('Nuestro steak tartar es histórico. Hay cosas que no hay que tocar. 🥩'), lang: 'ca' },
    });
    expect(html).toMatch(/data-historia[^>]*lang="es"/);
  });

  it("l'enllaç porta el nom del plat només per a lectors de pantalla", async () => {
    const html = await contenidor.renderToString(Plat, { props: { plat: plat('#x'), lang: 'es', primera: true } });
    expect(html).toMatch(/Ver la foto en Instagram<span class="nomes-lectors[^"]*"[^>]*>: Plat de prova<\/span>/);
  });
});
