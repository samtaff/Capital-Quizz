import { WheelSector, WheelSectorId } from '../types';

export const WHEEL_SECTORS: WheelSector[] = [
  {
    id: 'europe',
    label: 'Europe',
    icon: '🌍',
    color: '#3B82F6', // Blue
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    description: 'Capitale garantie sur le continent européen !',
    type: 'continent',
  },
  {
    id: 'double_points',
    label: 'Points x2',
    icon: '🌟',
    color: '#8B5CF6', // Purple
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Jackpot ! Tous les points sont doublés sur cette manche !',
    type: 'modifier',
    multiplier: 2,
  },
  {
    id: 'afrique',
    label: 'Afrique',
    icon: '🦁',
    color: '#F59E0B', // Amber
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Capitale garantie sur le continent africain !',
    type: 'continent',
  },
  {
    id: 'cash_boost',
    label: 'Super Cash',
    icon: '⚡',
    color: '#EAB308', // Yellow
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    description: 'Bonus Cash : +500 points supplémentaires en saisie libre !',
    type: 'modifier',
    bonusCash: 500,
  },
  {
    id: 'asie',
    label: 'Asie',
    icon: '⛩️',
    color: '#10B981', // Emerald
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Capitale garantie sur le continent asiatique !',
    type: 'continent',
  },
  {
    id: 'joker_fifty',
    label: 'Joker 50/50',
    icon: '🎯',
    color: '#EC4899', // Pink
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    description: 'Deux fausses réponses éliminées si vous choisissez Carré !',
    type: 'modifier',
  },
  {
    id: 'ameriques',
    label: 'Amériques',
    icon: '🗽',
    color: '#EF4444', // Red
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    description: 'Capitale garantie sur le continent américain !',
    type: 'continent',
  },
  {
    id: 'oceanie',
    label: 'Océanie',
    icon: '🦘',
    color: '#06B6D4', // Cyan
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    description: 'Capitale garantie en Océanie et îles du Pacifique !',
    type: 'continent',
  },
];

export const COUNTRY_CONTINENTS: Record<string, string> = {
  // Europe
  FR: 'europe',
  ES: 'europe',
  IT: 'europe',
  DE: 'europe',
  GB: 'europe',
  RU: 'europe',
  GR: 'europe',
  PT: 'europe',
  SI: 'europe',
  FI: 'europe',
  NO: 'europe',
  IE: 'europe',
  PL: 'europe',
  SK: 'europe',
  HR: 'europe',
  IS: 'europe',
  CH: 'europe',

  // Asie
  JP: 'asie',
  CN: 'asie',
  IN: 'asie',
  KR: 'asie',
  MN: 'asie',
  TH: 'asie',
  TR: 'asie',
  KZ: 'asie',
  AE: 'asie',
  LA: 'asie',
  MM: 'asie',
  LK: 'asie',
  BT: 'asie',

  // Afrique
  EG: 'afrique',
  BW: 'afrique',
  SN: 'afrique',
  KE: 'afrique',
  MA: 'afrique',
  BF: 'afrique',
  CI: 'afrique',
  ZA: 'afrique',
  NG: 'afrique',
  TZ: 'afrique',
  BJ: 'afrique',

  // Amériques
  US: 'ameriques',
  BR: 'ameriques',
  CA: 'ameriques',
  MX: 'ameriques',
  AR: 'ameriques',
  UY: 'ameriques',
  CO: 'ameriques',
  PE: 'ameriques',
  CL: 'ameriques',
  BO: 'ameriques',
  EC: 'ameriques',

  // Océanie
  AU: 'oceanie',
  NZ: 'oceanie',
};

export function getRandomWheelSector(): WheelSector {
  const index = Math.floor(Math.random() * WHEEL_SECTORS.length);
  return WHEEL_SECTORS[index];
}
