export type Difficulty = 'facile' | 'moyen' | 'difficile';
export type DifficultySelection = Difficulty | 'mix';

export type ResponseMode = 'cash' | 'carre';

export type GameMode = 'classic' | 'wheel';

export type GameStatus = 'lobby' | 'wheel' | 'question' | 'round_map' | 'leaderboard' | 'game_over';

export type WheelSectorId =
  | 'europe'
  | 'afrique'
  | 'asie'
  | 'ameriques'
  | 'oceanie'
  | 'double_points'
  | 'cash_boost'
  | 'joker_fifty';

export interface WheelSector {
  id: WheelSectorId;
  label: string;
  icon: string;
  color: string;
  badgeColor: string;
  description: string;
  type: 'continent' | 'modifier';
  multiplier?: number;
  bonusCash?: number;
}

export interface WheelState {
  spinning: boolean;
  targetSectorId?: WheelSectorId | string;
  targetPlayerId?: string;
  targetPlayerName?: string;
  targetAngle?: number;
  spunAt?: number;
  hasLanded?: boolean;
  activeSector?: WheelSector | null;
}

export interface CapitalCoordinates {
  lat: number;
  lng: number;
}

export interface CountryItem {
  id: string; // ISO 2-letter
  country: string; // Nom en français
  capital: string; // Nom en français
  flag: string; // Emoji
  difficulty: Difficulty;
  distractors: [string, string, string]; // 3 fausses propositions réalistes
  coordinates: CapitalCoordinates;
  acceptableAnswers?: string[]; // Variantes acceptables
}

export interface SpellingCharDiff {
  char: string;
  type: 'correct' | 'wrong' | 'extra' | 'missing' | 'corrected';
}

export interface SpellingAnalysis {
  hasTypo: boolean;
  userInput: string;
  correctAnswer: string;
  distance: number;
  inputChars: SpellingCharDiff[];
  targetChars: SpellingCharDiff[];
  missingChars: string[];
  extraChars: string[];
  substitutedChars: Array<{ from: string; to: string }>;
  summaryMessage: string;
}

export interface PlayerRoundAnswer {
  mode: ResponseMode;
  answer: string;
  isCorrect: boolean;
  scoreFactor: number; // 1.0 (exact cash), 0.5 (faute cash ou carre), 0 (rate)
  pointsEarned: number;
  levenshteinDistance?: number;
  spellingAnalysis?: SpellingAnalysis;
  punchline?: string;
  answeredAt: number; // timestamp
  timeTaken: number; // in seconds
}

export interface Player {
  id: string; // uid
  nickname: string;
  color: string; // hex code
  isHost: boolean;
  totalScore: number;
  lastRoundDelta: number;
  currentAnswer?: PlayerRoundAnswer | null;
  selectedMode?: ResponseMode | null;
  joinedAt: number;
}

export interface GameQuestion {
  countryId: string;
  country: string;
  capital: string;
  flag: string;
  difficulty: Difficulty;
  options: string[]; // 4 options for Carré
  coordinates: CapitalCoordinates;
  acceptableAnswers?: string[];
}

export interface PartyDoc {
  id?: string;
  code: string;
  status: GameStatus;
  createdAt: number;
  hostId: string;
  difficultySetting: DifficultySelection;
  totalRounds: number;
  currentRoundIndex: number;
  roundStartTime: number;
  roundDuration: number; // Durée en secondes (15, 20, 30) ou 0 pour temps illimité
  questions: GameQuestion[];
  players: Record<string, Player>;
  phaseEndTime?: number; // for automated transitions
  isLocal?: boolean; // True for local Pass & Play parties (single device)
  activePlayerId?: string; // ID of the player currently taking their turn in local mode
  localTurnIndex?: number; // Zero-based index of current turn across the entire local match
  playerOrder?: string[]; // Array of player IDs representing turn order
  waitingForNextPlayer?: boolean; // True when showing handoff prompt between players
  gameMode?: GameMode; // 'classic' | 'wheel' (default: 'classic')
  wheelState?: WheelState | null;
  activeWheelSector?: WheelSector | null;
}

export interface LevenshteinEvaluation {
  distance: number;
  isAccepted: boolean;
  pointsPercentage: number; // 0, 50, or 100
  normalizedTarget: string;
  normalizedInput: string;
  note: 'exact' | 'minor_error' | 'incorrect';
  spellingAnalysis?: SpellingAnalysis;
}
