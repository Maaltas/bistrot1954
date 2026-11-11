// Genera public/apple-touch-icon.png (180x180) amb el plat geomètric del disseny (dis. §6.5).
// Ús (només quan canvia el disseny de la icona): node scripts/genera-icones.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#6E1F2B"/>
  <circle cx="90" cy="90" r="48" fill="none" stroke="#FFFFFF" stroke-width="8"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('public/apple-touch-icon.png generat');
