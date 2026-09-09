import { Difficulty, LevenshteinEvaluation, ResponseMode } from '../types';

/**
 * Normalise une chaîne de caractères :
 * - minuscules
 * - suppression des accents (diacritiques)
 * - suppression des tirets, points, virgules et espaces superflus
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime accents
    .replace(/[^a-z0-9\s]/g, ' ') // Remplace ponctuation par espace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes normalisées
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];

  for (let i = 0; i <= bn; ++i) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; ++j) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // suppression
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Évalue la réponse d'un joueur en mode Cash
 */
export function evaluateCashAnswer(
  playerInput: string,
  targetCapital: string,
  acceptableAnswers: string[] = []
): LevenshteinEvaluation {
  const normInput = normalizeString(playerInput);
  const targets = [targetCapital, ...acceptableAnswers].map(normalizeString);

  let bestDistance = Infinity;
  let bestTarget = targets[0];

  for (const target of targets) {
    const dist = getLevenshteinDistance(normInput, target);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestTarget = target;
    }
  }

  if (bestDistance === 0) {
    return {
      distance: 0,
      isAccepted: true,
      pointsPercentage: 100,
      normalizedTarget: bestTarget,
      normalizedInput: normInput,
      note: 'exact',
    };
  }

  if (bestDistance <= 2) {
    return {
      distance: bestDistance,
      isAccepted: true,
      pointsPercentage: 50,
      normalizedTarget: bestTarget,
      normalizedInput: normInput,
      note: 'minor_error',
    };
  }

  return {
    distance: bestDistance,
    isAccepted: false,
    pointsPercentage: 0,
    normalizedTarget: bestTarget,
    normalizedInput: normInput,
    note: 'incorrect',
  };
}

/**
 * Points de base par niveau de difficulté
 */
export const DIFFICULTY_BASE_POINTS: Record<Difficulty, number> = {
  facile: 10,
  moyen: 25,
  difficile: 50,
};

/**
 * Calcule le score final de la manche selon la formule :
 * score = points de base × multiplicateur de mode × multiplicateur de vitesse
 */
export function calculateRoundScore(
  difficulty: Difficulty,
  mode: ResponseMode,
  isCorrectOrAccepted: boolean,
  pointsPercentage: number, // 0, 50, or 100
  timeTaken: number = 0,
  totalTime: number = 0
): { points: number; speedMultiplier: number; basePoints: number } {
  const basePoints = DIFFICULTY_BASE_POINTS[difficulty];

  if (!isCorrectOrAccepted || pointsPercentage === 0) {
    return { points: 0, speedMultiplier: 1, basePoints };
  }

  // Pas de chrono : calcul direct basé sur le mode et la précision
  const modeMultiplier = pointsPercentage / 100; // 1.0 (Cash exact) ou 0.5 (Cash toléré ou Carré)
  const points = Math.round(basePoints * modeMultiplier);

  return {
    points,
    speedMultiplier: 1,
    basePoints,
  };
}
