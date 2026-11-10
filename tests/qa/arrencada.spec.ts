import { expect, test } from '@playwright/test';

// Prova mínima d'arrencada (el QA hi afegeix la resta). Les rutes van sense barra inicial: baseURL conté /bistrot1954/.
for (const ruta of ['', 'es/', 'avis-legal/', 'es/aviso-legal/']) {
  test(`/${ruta} respon 200 i no té errors a la consola`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type())) errors.push(m.text());
    });
    const resposta = await page.goto(ruta);
    expect(resposta?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}
