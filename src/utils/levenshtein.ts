import {
  Difficulty,
  LevenshteinEvaluation,
  ResponseMode,
  SpellingAnalysis,
  SpellingCharDiff,
} from '../types';

/**
 * Normalise un caractère unique pour comparaison
 */
function normalizeChar(char: string): string {
  return char
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Compare au niveau des caractères la réponse saisie par le joueur
 * et la réponse attendue pour mettre en évidence les erreurs d'orthographe
 */
export function computeSpellingAnalysis(
  rawInput: string,
  rawTarget: string,
  distance: number
): SpellingAnalysis {
  const input = rawInput.trim();
  const target = rawTarget.trim();

  // Si distance 0, orthographe exacte
  if (distance === 0) {
    return {
      hasTypo: false,
      userInput: input,
      correctAnswer: target,
      distance: 0,
      inputChars: input.split('').map((c) => ({ char: c, type: 'correct' })),
      targetChars: target.split('').map((c) => ({ char: c, type: 'correct' })),
      missingChars: [],
      extraChars: [],
      substitutedChars: [],
      summaryMessage: 'Orthographe exacte !',
    };
  }

  const m = input.length;
  const n = target.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match =
        normalizeChar(input[i - 1]) === normalizeChar(target[j - 1]);
      if (match) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i - 1][j] + 1, // caractère en trop dans l'entrée
          dp[i][j - 1] + 1 // caractère manquant dans l'entrée
        );
      }
    }
  }

  let i = m;
  let j = n;
  const inputChars: SpellingCharDiff[] = [];
  const targetChars: SpellingCharDiff[] = [];
  const missingChars: string[] = [];
  const extraChars: string[] = [];
  const substitutedChars: Array<{ from: string; to: string }> = [];

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      normalizeChar(input[i - 1]) === normalizeChar(target[j - 1])
    ) {
      inputChars.unshift({ char: input[i - 1], type: 'correct' });
      targetChars.unshift({ char: target[j - 1], type: 'correct' });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      inputChars.unshift({ char: input[i - 1], type: 'wrong' });
      targetChars.unshift({ char: target[j - 1], type: 'corrected' });
      substitutedChars.unshift({ from: input[i - 1], to: target[j - 1] });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + 1)) {
      inputChars.unshift({ char: input[i - 1], type: 'extra' });
      extraChars.unshift(input[i - 1]);
      i--;
    } else {
      targetChars.unshift({ char: target[j - 1], type: 'missing' });
      missingChars.unshift(target[j - 1]);
      j--;
    }
  }

  // Construction d'une explication lisible en français
  const explanations: string[] = [];
  if (missingChars.length > 0) {
    const letters = missingChars
      .filter((c) => c.trim().length > 0)
      .map((c) => `« ${c} »`)
      .join(', ');
    if (letters) {
      explanations.push(
        `Lettre${missingChars.length > 1 ? 's' : ''} manquante${
          missingChars.length > 1 ? 's' : ''
        } : ${letters}`
      );
    }
  }
  if (extraChars.length > 0) {
    const letters = extraChars
      .filter((c) => c.trim().length > 0)
      .map((c) => `« ${c} »`)
      .join(', ');
    if (letters) {
      explanations.push(
        `Lettre${extraChars.length > 1 ? 's' : ''} en trop : ${letters}`
      );
    }
  }
  if (substitutedChars.length > 0) {
    const subs = substitutedChars
      .map((s) => `« ${s.from} » au lieu de « ${s.to} »`)
      .join(', ');
    if (subs) {
      explanations.push(`Remplacement : ${subs}`);
    }
  }

  const summaryMessage =
    distance <= 2
      ? explanations.length > 0
        ? explanations.join(' • ')
        : `Écrit « ${input} » au lieu de « ${target} »`
      : `La bonne réponse attendue était « ${target} ».`;

  return {
    hasTypo: true,
    userInput: input,
    correctAnswer: target,
    distance,
    inputChars,
    targetChars,
    missingChars,
    extraChars,
    substitutedChars,
    summaryMessage,
  };
}

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
  const rawTargets = [targetCapital, ...acceptableAnswers];
  const targets = rawTargets.map(normalizeString);

  let bestDistance = Infinity;
  let bestNormTarget = targets[0];
  let bestRawTarget = rawTargets[0];

  for (let idx = 0; idx < targets.length; idx++) {
    const target = targets[idx];
    const dist = getLevenshteinDistance(normInput, target);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestNormTarget = target;
      bestRawTarget = rawTargets[idx];
    }
  }

  const spellingAnalysis = computeSpellingAnalysis(
    playerInput,
    bestRawTarget,
    bestDistance
  );

  if (bestDistance === 0) {
    return {
      distance: 0,
      isAccepted: true,
      pointsPercentage: 100,
      normalizedTarget: bestNormTarget,
      normalizedInput: normInput,
      note: 'exact',
      spellingAnalysis,
    };
  }

  if (bestDistance <= 2) {
    return {
      distance: bestDistance,
      isAccepted: true,
      pointsPercentage: 50,
      normalizedTarget: bestNormTarget,
      normalizedInput: normInput,
      note: 'minor_error',
      spellingAnalysis,
    };
  }

  return {
    distance: bestDistance,
    isAccepted: false,
    pointsPercentage: 0,
    normalizedTarget: bestNormTarget,
    normalizedInput: normInput,
    note: 'incorrect',
    spellingAnalysis,
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
