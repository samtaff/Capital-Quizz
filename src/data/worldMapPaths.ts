/**
 * SVG Path data for world countries and regions (Equirectangular / Natural projection: 1000x500 viewBox)
 */

export interface CountrySvgData {
  id: string; // ISO 2
  name: string;
  d: string; // SVG path
}

// Projection coordinates helper for lat/long on 1000x500 map
export function projectCoordinates(lat: number, lng: number, width = 1000, height = 500): { x: number; y: number } {
  // Equirectangular projection with standard bounds (-180 to 180 lng, -60 to 80 lat clamped)
  const clampedLat = Math.max(-65, Math.min(80, lat));
  const x = ((lng + 180) / 360) * width;
  // Adjust latitude scaling for better visual distribution
  const y = ((85 - clampedLat) / 150) * height;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

// Background world outline (continents base) so the entire world is visible in soft slate
export const WORLD_CONTINENTS_SVG = [
  // North America
  'M 130,70 L 220,60 L 280,75 L 310,120 L 260,160 L 230,220 L 190,200 L 150,150 L 110,110 Z',
  // South America
  'M 270,250 L 340,260 L 360,330 L 320,430 L 280,440 L 270,350 L 250,290 Z',
  // Europe
  'M 470,70 L 560,70 L 550,120 L 530,160 L 470,165 L 450,130 L 440,90 Z',
  // Africa
  'M 470,175 L 560,175 L 600,230 L 590,320 L 530,390 L 480,340 L 460,240 Z',
  // Asia
  'M 560,70 L 850,70 L 890,130 L 830,220 L 750,260 L 680,240 L 600,180 L 560,120 Z',
  // Oceania / Australia
  'M 790,320 L 890,310 L 920,380 L 840,410 L 780,370 Z',
  // New Zealand
  'M 930,400 L 945,395 L 940,430 L 925,430 Z',
  // Japan
  'M 870,140 L 885,150 L 875,185 L 860,170 Z',
  // Madagascar
  'M 605,330 L 618,340 L 610,380 L 600,360 Z',
  // United Kingdom & Ireland
  'M 465,110 L 480,105 L 485,130 L 470,140 Z M 450,115 L 460,115 L 460,130 L 450,125 Z',
  // Scandinavia
  'M 500,60 L 550,50 L 560,100 L 525,100 Z',
];

// Specific country regional shapes for prominent highlight when question is active
export const COUNTRY_SHAPES: Record<string, string> = {
  FR: 'M 475,135 L 495,135 L 500,155 L 480,160 L 470,145 Z', // France
  ES: 'M 455,155 L 475,155 L 472,180 L 450,180 Z', // Espagne
  IT: 'M 500,148 L 515,152 L 522,175 L 512,182 L 505,165 Z', // Italie
  DE: 'M 495,120 L 520,120 L 520,142 L 492,142 Z', // Allemagne
  GB: 'M 465,110 L 482,108 L 482,132 L 470,140 Z', // Royaume-Uni
  US: 'M 140,110 L 260,110 L 265,170 L 160,175 L 140,145 Z', // USA
  CA: 'M 120,50 L 280,50 L 270,110 L 130,110 Z', // Canada
  BR: 'M 280,260 L 355,270 L 360,340 L 310,370 L 275,300 Z', // Brésil
  AR: 'M 285,350 L 320,350 L 305,440 L 285,430 Z', // Argentine
  JP: 'M 870,140 L 888,150 L 878,185 L 865,170 Z', // Japon
  CN: 'M 700,120 L 820,120 L 840,180 L 760,200 L 700,170 Z', // Chine
  IN: 'M 670,180 L 730,180 L 715,245 L 685,245 Z', // Inde
  RU: 'M 530,60 L 870,60 L 860,115 L 550,115 Z', // Russie
  EG: 'M 535,180 L 575,180 L 575,215 L 535,215 Z', // Égypte
  GR: 'M 525,165 L 540,165 L 538,180 L 526,178 Z', // Grèce
  PT: 'M 450,158 L 460,158 L 458,178 L 448,178 Z', // Portugal
  MX: 'M 170,170 L 225,180 L 235,220 L 195,210 Z', // Mexique
  KR: 'M 838,148 L 852,148 L 850,168 L 838,165 Z', // Corée du Sud
  AU: 'M 790,320 L 890,310 L 920,380 L 840,410 L 780,370 Z', // Australie
  TR: 'M 545,155 L 595,155 L 590,175 L 545,175 Z', // Turquie
  KZ: 'M 620,105 L 720,105 L 720,145 L 620,145 Z', // Kazakhstan
  BF: 'M 470,225 L 490,225 L 490,240 L 470,240 Z', // Burkina Faso
  CH: 'M 490,140 L 505,140 L 505,150 L 490,150 Z', // Suisse
  CI: 'M 465,235 L 485,235 L 480,255 L 465,255 Z', // Côte d'Ivoire
  NZ: 'M 930,400 L 945,395 L 940,430 L 925,430 Z', // Nouvelle-Zélande
  ZA: 'M 520,355 L 565,355 L 555,395 L 515,390 Z', // Afrique du Sud
  AE: 'M 615,195 L 635,195 L 635,210 L 615,210 Z', // Émirats arabes unis
  NG: 'M 495,225 L 525,225 L 520,255 L 495,255 Z', // Nigéria
  LA: 'M 770,195 L 795,195 L 790,225 L 770,220 Z', // Laos
  MM: 'M 740,185 L 765,185 L 760,225 L 740,220 Z', // Birmanie
  LK: 'M 710,240 L 725,240 L 722,260 L 710,258 Z', // Sri Lanka
  BO: 'M 275,320 L 315,320 L 310,365 L 275,360 Z', // Bolivie
  EC: 'M 245,265 L 265,265 L 260,290 L 245,285 Z', // Équateur
  BT: 'M 740,170 L 760,170 L 760,182 L 740,182 Z', // Bhoutan
  TZ: 'M 560,265 L 590,265 L 585,305 L 555,300 Z', // Tanzanie
  BJ: 'M 488,230 L 500,230 L 498,252 L 488,252 Z', // Bénin
  SI: 'M 515,145 L 528,145 L 526,155 L 515,153 Z', // Slovénie
  BW: 'M 525,335 L 550,335 L 545,365 L 525,360 Z', // Botswana
  UY: 'M 305,370 L 325,370 L 320,395 L 305,390 Z', // Uruguay
  MN: 'M 720,110 L 800,110 L 795,145 L 725,145 Z', // Mongolie
  FI: 'M 525,65 L 555,65 L 550,105 L 525,100 Z', // Finlande
  NO: 'M 500,60 L 530,60 L 525,110 L 505,110 Z', // Norvège
  IE: 'M 445,115 L 460,115 L 460,132 L 445,130 Z', // Irlande
  PL: 'M 520,115 L 555,115 L 550,140 L 520,138 Z', // Pologne
  CO: 'M 255,240 L 285,240 L 280,275 L 255,270 Z', // Colombie
  PE: 'M 250,275 L 280,275 L 275,325 L 250,320 Z', // Pérou
  TH: 'M 765,200 L 790,200 L 785,240 L 765,235 Z', // Thaïlande
  SN: 'M 445,215 L 465,215 L 462,235 L 445,230 Z', // Sénégal
  KE: 'M 565,240 L 595,240 L 590,275 L 565,270 Z', // Kenya
  IS: 'M 425,65 L 450,65 L 445,85 L 425,82 Z', // Islande
  SK: 'M 525,132 L 545,132 L 543,145 L 525,143 Z', // Slovaquie
  HR: 'M 515,148 L 535,148 L 530,162 L 515,158 Z', // Croatie
  CL: 'M 270,335 L 285,335 L 280,440 L 268,435 Z', // Chili
  MA: 'M 450,182 L 480,182 L 475,210 L 450,205 Z', // Maroc
};
