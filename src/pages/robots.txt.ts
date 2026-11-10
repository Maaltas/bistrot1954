import type { APIRoute } from 'astro';
import { urlAbsoluta } from '../lib/entorn';

/** robots.txt (arq. §7.4). La URL del sitemap surt de <web>. */
export const GET: APIRoute = () => {
  const sitemap = urlAbsoluta('/sitemap-index.xml', import.meta.env.SITE, import.meta.env.BASE_URL);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
