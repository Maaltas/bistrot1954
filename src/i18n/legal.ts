/**
 * Textos de l'avís legal i privacitat (arq. §5.4). Només descriuen fets tècnics certs d'aquesta web.
 * Les dades del titular surten de contingut/restaurant.yaml → avis_legal.
 */
import type { Idioma } from '../lib/idioma';

export interface TextosLegals {
  titol: string;
  titularTitol: string;
  etiquetes: {
    titular: string;
    nif: string;
    domicili: string;
    email: string;
    nomComercial: string;
    establiment: string;
  };
  privacitatTitol: string;
  privacitatSenseGaletes: string;
  privacitatHosting: string;
  /** Només si hi ha estadístiques (GoatCounter). */
  privacitatEstadistiques: string;
  privacitatEnllacos: string;
  contingutTitol: string;
  contingutText: string;
}

export const legal: Record<Idioma, TextosLegals> = {
  ca: {
    titol: 'Avís legal i privacitat',
    titularTitol: 'Titular del web',
    etiquetes: {
      titular: 'Titular',
      nif: 'NIF',
      domicili: 'Domicili',
      email: 'Correu electrònic',
      nomComercial: 'Nom comercial',
      establiment: 'Establiment',
    },
    privacitatTitol: 'Privacitat',
    privacitatSenseGaletes:
      'Aquest web no fa servir galetes (cookies), no desa res al vostre dispositiu i no té formularis: no us demana cap dada personal.',
    privacitatHosting:
      "El web està allotjat a GitHub Pages (GitHub, Inc.), que pot registrar l'adreça IP de les visites per motius tècnics i de seguretat.",
    privacitatEstadistiques:
      "Per comptar les visites fem servir GoatCounter, un servei d'estadístiques que no fa servir galetes ni identifica les persones: només en guarda dades agregades (pàgina visitada, web de procedència, navegador, sistema operatiu, mida de pantalla i país).",
    privacitatEnllacos:
      'Els enllaços a Instagram i a Google Maps, i el botó de trucar, porten a serveis externs, que tenen les seves pròpies condicions.',
    contingutTitol: 'Contingut',
    contingutText:
      "Les fotos i els textos dels plats provenen de les publicacions del compte d'Instagram @bistrot1954.",
  },
  es: {
    titol: 'Aviso legal y privacidad',
    titularTitol: 'Titular del sitio web',
    etiquetes: {
      titular: 'Titular',
      nif: 'NIF',
      domicili: 'Domicilio',
      email: 'Correo electrónico',
      nomComercial: 'Nombre comercial',
      establiment: 'Establecimiento',
    },
    privacitatTitol: 'Privacidad',
    privacitatSenseGaletes:
      'Este sitio web no utiliza cookies, no guarda nada en su dispositivo y no tiene formularios: no le pide ningún dato personal.',
    privacitatHosting:
      'El sitio web está alojado en GitHub Pages (GitHub, Inc.), que puede registrar la dirección IP de las visitas por motivos técnicos y de seguridad.',
    privacitatEstadistiques:
      'Para contar las visitas usamos GoatCounter, un servicio de estadísticas que no utiliza cookies ni identifica a las personas: solo guarda datos agregados (página visitada, web de procedencia, navegador, sistema operativo, tamaño de pantalla y país).',
    privacitatEnllacos:
      'Los enlaces a Instagram y a Google Maps, y el botón de llamar, llevan a servicios externos, que tienen sus propias condiciones.',
    contingutTitol: 'Contenido',
    contingutText:
      'Las fotos y los textos de los platos provienen de las publicaciones de la cuenta de Instagram @bistrot1954.',
  },
};
