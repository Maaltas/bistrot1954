import { describe, expect, it } from 'vitest';
import { LLINDAR_HISTORIA_LLARGA, historiaEsLlarga } from '../../src/lib/historia';
import { getPlats } from '../../src/lib/contingut';

describe('història llarga (F-35, dis. §4.5)', () => {
  it('500 caràcters donen una història centrada i 501, alineada a l\'esquerra', () => {
    expect(LLINDAR_HISTORIA_LLARGA).toBe(500);
    expect(historiaEsLlarga([['a'.repeat(500)]])).toBe(false);
    expect(historiaEsLlarga([['a'.repeat(501)]])).toBe(true);
  });

  it('suma totes les línies de tots els paràgrafs', () => {
    expect(historiaEsLlarga([['a'.repeat(250), 'b'.repeat(250)]])).toBe(false);
    expect(historiaEsLlarga([['a'.repeat(250)], ['b'.repeat(251)]])).toBe(true);
  });

  it('cap història real passa del límit (avui totes van centrades)', () => {
    for (const plat of getPlats()) {
      for (const idioma of ['ca', 'es'] as const) {
        expect(historiaEsLlarga(plat.historia[idioma]!.paragrafs)).toBe(false);
      }
    }
  });
});
