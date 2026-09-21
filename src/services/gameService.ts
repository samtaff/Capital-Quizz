import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteField,
} from 'firebase/firestore';
import { db, ensureAnonymousAuth } from '../firebase';
import {
  DifficultySelection,
  GameMode,
  GameStatus,
  PartyDoc,
  Player,
  PlayerRoundAnswer,
  ResponseMode,
  WheelSector,
} from '../types';
import { generateQuestions, getQuestionForContinent } from '../data/countries';
import { DIFFICULTY_BASE_POINTS, getRankMultiplier } from '../utils/levenshtein';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Sans 'I' et 'O' pour éviter toute confusion

export function generatePartyCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

export const AVATAR_COLORS = [
  { id: 'red', hex: '#EF4444', label: 'Rouge' },
  { id: 'orange', hex: '#F97316', label: 'Orange' },
  { id: 'amber', hex: '#F59E0B', label: 'Ambre' },
  { id: 'green', hex: '#10B981', label: 'Vert' },
  { id: 'teal', hex: '#14B8A6', label: 'Turquoise' },
  { id: 'blue', hex: '#3B82F6', label: 'Bleu Roi' },
  { id: 'indigo', hex: '#6366F1', label: 'Indigo' },
  { id: 'purple', hex: '#8B5CF6', label: 'Violet' },
  { id: 'pink', hex: '#EC4899', label: 'Rose' },
  { id: 'rose', hex: '#F43F5E', label: 'Framboise' },
];

export interface LocalPlayerInput {
  name: string;
  color: string;
}

// Local party storage and subscription dispatcher
let activeLocalParty: PartyDoc | null = null;
const localSubscribers = new Set<(party: PartyDoc | null) => void>();

try {
  const saved = sessionStorage.getItem('local_party_doc');
  if (saved) {
    activeLocalParty = JSON.parse(saved);
  }
} catch (e) {
  console.error('Error loading saved local party:', e);
}

function notifyLocalSubscribers() {
  if (activeLocalParty) {
    try {
      sessionStorage.setItem('local_party_doc', JSON.stringify(activeLocalParty));
    } catch {}
  } else {
    try {
      sessionStorage.removeItem('local_party_doc');
    } catch {}
  }
  const snapshot = activeLocalParty ? { ...activeLocalParty } : null;
  localSubscribers.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (err) {
      console.error('Local party subscriber error:', err);
    }
  });
}

/**
 * Crée et démarre une partie locale (Pass & Play sur 1 seul appareil)
 */
export function createLocalParty(
  playersInput: LocalPlayerInput[],
  difficultySetting: DifficultySelection = 'mix',
  totalRounds: number = 5,
  roundDuration: number = 0, // 0 = Temps illimité (recommandé pour Pass & Play)
  gameMode: GameMode = 'classic'
): { code: string; hostId: string } {
  const code = 'LOCAL';
  const playersCount = Math.max(1, playersInput.length);
  // Questions nécessaires : totalRounds manches * nombre de joueurs
  const totalQuestionsNeeded = totalRounds * playersCount;
  const questions = generateQuestions(difficultySetting, totalQuestionsNeeded, gameMode);

  const playersRecord: Record<string, Player> = {};
  const playerOrder: string[] = [];

  playersInput.forEach((p, idx) => {
    const id = `local_player_${idx + 1}`;
    playerOrder.push(id);
    playersRecord[id] = {
      id,
      nickname: p.name.trim() || `Joueur ${idx + 1}`,
      color: p.color || AVATAR_COLORS[idx % AVATAR_COLORS.length].hex,
      isHost: idx === 0,
      totalScore: 0,
      lastRoundDelta: 0,
      currentAnswer: null,
      selectedMode: null,
      wheelTurnsCount: 0,
      joinedAt: Date.now(),
    };
  });

  const firstPlayerId = playerOrder[0];
  const initialStatus: GameStatus = gameMode === 'wheel' ? 'wheel' : 'question';

  activeLocalParty = {
    id: 'local_party',
    code,
    status: initialStatus,
    createdAt: Date.now(),
    hostId: firstPlayerId,
    difficultySetting,
    totalRounds,
    currentRoundIndex: 0,
    roundStartTime: Date.now(),
    roundDuration,
    questions,
    players: playersRecord,
    isLocal: true,
    activePlayerId: firstPlayerId,
    localTurnIndex: 0,
    playerOrder,
    waitingForNextPlayer: playersInput.length > 1,
    gameMode,
    activeWheelSector: null,
    wheelState: null,
  };

  notifyLocalSubscribers();
  return { code, hostId: firstPlayerId };
}

/**
 * Masque l'écran de transmission de téléphone et lance la question pour le joueur
 */
export function dismissWaitingForNextPlayer(code: string): void {
  if (code === 'LOCAL' && activeLocalParty) {
    activeLocalParty.waitingForNextPlayer = false;
    activeLocalParty.roundStartTime = Date.now();
    notifyLocalSubscribers();
  }
}

/**
 * Crée une nouvelle partie Firestore
 */
export async function createParty(
  hostNickname: string,
  hostColor: string,
  difficultySetting: DifficultySelection = 'mix',
  totalRounds: number = 5,
  roundDuration: number = 20,
  gameMode: GameMode = 'classic'
): Promise<{ code: string; hostId: string }> {
  const hostId = await ensureAnonymousAuth();
  const code = generatePartyCode();

  const questions = generateQuestions(difficultySetting, totalRounds, gameMode);

  const hostPlayer: Player = {
    id: hostId,
    nickname: hostNickname.trim() || 'Hôte',
    color: hostColor || AVATAR_COLORS[0].hex,
    isHost: true,
    totalScore: 0,
    lastRoundDelta: 0,
    currentAnswer: null,
    selectedMode: null,
    wheelTurnsCount: 0,
    joinedAt: Date.now(),
  };

  const partyData: PartyDoc = {
    code,
    status: 'lobby',
    createdAt: Date.now(),
    hostId,
    difficultySetting,
    totalRounds,
    currentRoundIndex: 0,
    roundStartTime: 0,
    roundDuration,
    questions,
    players: {
      [hostId]: hostPlayer,
    },
    gameMode,
    activeWheelSector: null,
    wheelState: null,
  };

  const partyRef = doc(db, 'parties', code);
  await setDoc(partyRef, partyData);

  return { code, hostId };
}

/**
 * Rejoint une partie existante avec un code
 */
export async function joinParty(
  code: string,
  nickname: string,
  color: string
): Promise<{ success: boolean; error?: string; playerId?: string }> {
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode.length !== 4) {
    return { success: false, error: 'Le code doit comporter 4 lettres.' };
  }

  const playerId = await ensureAnonymousAuth();
  const partyRef = doc(db, 'parties', cleanCode);
  const partySnap = await getDoc(partyRef);

  if (!partySnap.exists()) {
    return { success: false, error: 'Partie introuvable. Vérifiez le code.' };
  }

  const party = partySnap.data() as PartyDoc;

  if (party.status !== 'lobby') {
    // Si le joueur faisait déjà partie de la partie, autoriser la reconnexion
    if (party.players && party.players[playerId]) {
      return { success: true, playerId };
    }
    return { success: false, error: 'Cette partie a déjà commencé.' };
  }

  const player: Player = {
    id: playerId,
    nickname: nickname.trim() || `Joueur ${Object.keys(party.players || {}).length + 1}`,
    color: color || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].hex,
    isHost: party.hostId === playerId,
    totalScore: 0,
    lastRoundDelta: 0,
    currentAnswer: null,
    selectedMode: null,
    wheelTurnsCount: 0,
    joinedAt: Date.now(),
  };

  await updateDoc(partyRef, {
    [`players.${playerId}`]: player,
  });

  return { success: true, playerId };
}

/**
 * Met à jour les paramètres de la partie (par l'hôte)
 */
export async function updatePartySettings(
  code: string,
  difficultySetting: DifficultySelection,
  totalRounds: number,
  roundDuration?: number,
  gameMode?: GameMode
): Promise<void> {
  const partyRef = doc(db, 'parties', code);
  const questions = generateQuestions(difficultySetting, totalRounds, gameMode);

  const updates: Record<string, any> = {
    difficultySetting,
    totalRounds,
    questions,
  };
  if (roundDuration !== undefined) {
    updates.roundDuration = roundDuration;
  }
  if (gameMode !== undefined) {
    updates.gameMode = gameMode;
  }

  await updateDoc(partyRef, updates);
}

/**
 * Lance la partie (passage du lobby à la 1re question ou à la roue)
 */
export async function startPartyGame(code: string): Promise<void> {
  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;

  const party = snap.data() as PartyDoc;
  const resetPlayers: Record<string, any> = {};

  Object.keys(party.players || {}).forEach((pId) => {
    resetPlayers[`players.${pId}.totalScore`] = 0;
    resetPlayers[`players.${pId}.lastRoundDelta`] = 0;
    resetPlayers[`players.${pId}.currentAnswer`] = null;
    resetPlayers[`players.${pId}.selectedMode`] = null;
    resetPlayers[`players.${pId}.wheelTurnsCount`] = 0;
  });

  const nextStatus: GameStatus = party.gameMode === 'wheel' ? 'wheel' : 'question';

  await updateDoc(partyRef, {
    status: nextStatus,
    currentRoundIndex: 0,
    roundStartTime: nextStatus === 'question' ? Date.now() : 0,
    roundDuration: party.roundDuration !== undefined ? party.roundDuration : 20,
    activeWheelSector: null,
    activePlayerId: null,
    wheelState: null,
    ...resetPlayers,
  });
}

/**
 * Lance la rotation de la roue en temps réel (synchronisé pour tous les joueurs dans Firestore)
 */
export async function spinPartyWheel(
  code: string,
  targetPlayerId: string,
  targetAngle: number
): Promise<void> {
  const spunAt = Date.now();
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    const targetPlayer = activeLocalParty.players?.[targetPlayerId];
    activeLocalParty.wheelState = {
      spinning: true,
      targetPlayerId,
      targetPlayerName: targetPlayer?.nickname || 'Joueur',
      targetAngle,
      spunAt,
      hasLanded: false,
    };
    activeLocalParty.activePlayerId = targetPlayerId;
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;
  const party = snap.data() as PartyDoc;
  const targetPlayer = party.players?.[targetPlayerId];

  await updateDoc(partyRef, {
    wheelState: {
      spinning: true,
      targetPlayerId,
      targetPlayerName: targetPlayer?.nickname || 'Joueur',
      targetAngle,
      spunAt,
      hasLanded: false,
    },
    activePlayerId: targetPlayerId,
  });
}

/**
 * Applique le joueur désigné par la roue et démarre la question
 */
export async function applyWheelPlayerAndStartQuestion(
  code: string,
  targetPlayerId: string
): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    activeLocalParty.activePlayerId = targetPlayerId;
    if (activeLocalParty.players?.[targetPlayerId]) {
      activeLocalParty.players[targetPlayerId].wheelTurnsCount =
        (activeLocalParty.players[targetPlayerId].wheelTurnsCount || 0) + 1;
    }
    activeLocalParty.status = 'question';
    activeLocalParty.roundStartTime = Date.now();
    activeLocalParty.wheelState = null;
    activeLocalParty.waitingForNextPlayer = false;
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;
  const party = snap.data() as PartyDoc;
  const currentTurns = party.players?.[targetPlayerId]?.wheelTurnsCount || 0;

  await updateDoc(partyRef, {
    activePlayerId: targetPlayerId,
    [`players.${targetPlayerId}.wheelTurnsCount`]: currentTurns + 1,
    status: 'question',
    roundStartTime: Date.now(),
    wheelState: null,
  });
}

/**
 * Applique le résultat du tirage de la roue et bascule vers la question
 */
export async function applyWheelSectorAndStartQuestion(
  code: string,
  sector: WheelSector
): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    activeLocalParty.activeWheelSector = sector;
    if (sector.type === 'continent') {
      const targetedQ = getQuestionForContinent(sector.id);
      if (targetedQ && activeLocalParty.questions[activeLocalParty.currentRoundIndex]) {
        activeLocalParty.questions[activeLocalParty.currentRoundIndex] = targetedQ;
      }
    }
    activeLocalParty.status = 'question';
    activeLocalParty.roundStartTime = Date.now();
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;
  const party = snap.data() as PartyDoc;

  const updates: Record<string, any> = {
    status: 'question',
    roundStartTime: Date.now(),
    activeWheelSector: sector,
    wheelState: null,
  };

  if (sector.type === 'continent') {
    const targetedQ = getQuestionForContinent(sector.id);
    if (targetedQ && party.questions[party.currentRoundIndex]) {
      const updatedQuestions = [...party.questions];
      updatedQuestions[party.currentRoundIndex] = targetedQ;
      updates.questions = updatedQuestions;
    }
  }

  await updateDoc(partyRef, updates);
}

/**
 * Sélectionne le mode individuel (Cash ou Carré) pour le joueur
 */
export async function setPlayerMode(
  code: string,
  playerId: string,
  mode: ResponseMode
): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    if (activeLocalParty.players?.[playerId]) {
      activeLocalParty.players[playerId].selectedMode = mode;
    }
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  await updateDoc(partyRef, {
    [`players.${playerId}.selectedMode`]: mode,
  });
}

function sanitizeFirestoreObject<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => (value === undefined ? null : value))
  );
}

/**
 * Soumet la réponse d'un joueur
 */
export async function submitPlayerAnswer(
  code: string,
  playerId: string,
  answer: PlayerRoundAnswer
): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    const currentTotal = activeLocalParty.players?.[playerId]?.totalScore || 0;
    if (activeLocalParty.players?.[playerId]) {
      activeLocalParty.players[playerId].currentAnswer = answer;
      activeLocalParty.players[playerId].totalScore = currentTotal + answer.pointsEarned;
      activeLocalParty.players[playerId].lastRoundDelta = answer.pointsEarned;
    }
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;

  const party = snap.data() as PartyDoc;
  const currentTotal = party.players?.[playerId]?.totalScore || 0;
  const finalAnswer = { ...answer };

  // Mode Top Chrono : déterminer le rang exact parmi les bonnes réponses déjà enregistrées
  if (party.gameMode === 'chrono' && answer.isCorrect) {
    const otherCorrectCount = Object.values(party.players || {}).filter(
      (p) => p.id !== playerId && p.currentAnswer && p.currentAnswer.isCorrect
    ).length;
    const officialRank = otherCorrectCount + 1;
    finalAnswer.speedRank = officialRank;

    const question = party.questions[party.currentRoundIndex];
    if (question) {
      const modeMultiplier = answer.mode === 'cash' ? (answer.scoreFactor || 1.0) : 0.5;
      const basePoints = DIFFICULTY_BASE_POINTS[question.difficulty];
      const maxAvailable = Math.round(basePoints * modeMultiplier);
      const rankMult = getRankMultiplier(officialRank);
      let calculatedPoints = Math.round(maxAvailable * rankMult);

      if (party.activeWheelSector?.id === 'double_points') {
        calculatedPoints = Math.round(calculatedPoints * 2);
      } else if (party.activeWheelSector?.id === 'cash_boost' && answer.mode === 'cash') {
        calculatedPoints += 500;
      }

      finalAnswer.pointsEarned = calculatedPoints;
      finalAnswer.speedBonus = calculatedPoints - maxAvailable;
    }
  }

  const sanitizedAnswer = sanitizeFirestoreObject(finalAnswer);

  await updateDoc(partyRef, {
    [`players.${playerId}.currentAnswer`]: sanitizedAnswer,
    [`players.${playerId}.totalScore`]: currentTotal + finalAnswer.pointsEarned,
    [`players.${playerId}.lastRoundDelta`]: finalAnswer.pointsEarned,
  });
}

/**
 * Enregistre un timeout (0 point) pour un joueur qui n'a pas répondu
 */
export async function submitTimeoutAnswer(
  code: string,
  playerId: string
): Promise<void> {
  const timeoutAnswer: PlayerRoundAnswer = {
    mode: 'carre',
    answer: 'Temps écoulé',
    isCorrect: false,
    scoreFactor: 0,
    pointsEarned: 0,
    answeredAt: Date.now(),
    timeTaken: 20,
  };

  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    await submitPlayerAnswer(code, playerId, timeoutAnswer);
    return;
  }

  const partyRef = doc(db, 'parties', code);
  await updateDoc(partyRef, {
    [`players.${playerId}.currentAnswer`]: timeoutAnswer,
    [`players.${playerId}.lastRoundDelta`]: 0,
  });
}

/**
 * Transitionne vers l'affichage de la carte du monde (2-3 secondes)
 */
export async function showRoundMap(code: string): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    activeLocalParty.status = 'round_map';
    activeLocalParty.phaseEndTime = Date.now() + 3000;
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  await updateDoc(partyRef, {
    status: 'round_map',
    phaseEndTime: Date.now() + 3000,
  });
}

/**
 * Transitionne vers l'écran de classement intermédiaire
 */
export async function showLeaderboard(code: string): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    activeLocalParty.status = 'leaderboard';
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  await updateDoc(partyRef, {
    status: 'leaderboard',
  });
}

/**
 * Passe à la manche suivante ou termine la partie
 */
export async function nextRoundOrEnd(code: string): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    const playerOrder = activeLocalParty.playerOrder || Object.keys(activeLocalParty.players || {});
    const playersCount = Math.max(1, playerOrder.length);
    const totalTurns = activeLocalParty.totalRounds * playersCount;
    const currentTurn = activeLocalParty.localTurnIndex ?? 0;

    // Transition depuis le classement intermédiaire (Leaderboard)
    if (activeLocalParty.status === 'leaderboard') {
      const nextTurn = currentTurn + 1;
      if (nextTurn >= totalTurns) {
        activeLocalParty.status = 'game_over';
        notifyLocalSubscribers();
        return;
      }
      const nextPlayerId = playerOrder[nextTurn % playersCount];
      activeLocalParty.localTurnIndex = nextTurn;
      activeLocalParty.currentRoundIndex = nextTurn;
      activeLocalParty.activePlayerId = nextPlayerId;
      const nextStatusLocal: GameStatus = activeLocalParty.gameMode === 'wheel' ? 'wheel' : 'question';
      activeLocalParty.status = nextStatusLocal;
      activeLocalParty.activeWheelSector = null;
      activeLocalParty.wheelState = null;
      activeLocalParty.waitingForNextPlayer = nextStatusLocal === 'wheel' ? false : (playersCount > 1);
      activeLocalParty.roundStartTime = nextStatusLocal === 'question' ? Date.now() : 0;
      // Réinitialiser les réponses courantes de tous les joueurs pour la nouvelle manche
      Object.keys(activeLocalParty.players || {}).forEach((pId) => {
        activeLocalParty!.players[pId].currentAnswer = null;
        activeLocalParty!.players[pId].selectedMode = null;
        activeLocalParty!.players[pId].lastRoundDelta = 0;
      });
      notifyLocalSubscribers();
      return;
    }

    // Transition depuis Question ou Carte (RoundMap)
    const isEndOfRound = (currentTurn + 1) % playersCount === 0;
    if (isEndOfRound) {
      // Tous les joueurs ont joué leur question de cette manche -> Affichage du classement
      activeLocalParty.status = 'leaderboard';
      notifyLocalSubscribers();
    } else {
      // Joueur suivant dans la même manche
      const nextTurn = currentTurn + 1;
      const nextPlayerId = playerOrder[nextTurn % playersCount];
      activeLocalParty.localTurnIndex = nextTurn;
      activeLocalParty.currentRoundIndex = nextTurn;
      activeLocalParty.activePlayerId = nextPlayerId;
      const nextStatusLocal: GameStatus = activeLocalParty.gameMode === 'wheel' ? 'wheel' : 'question';
      activeLocalParty.status = nextStatusLocal;
      activeLocalParty.activeWheelSector = null;
      activeLocalParty.wheelState = null;
      activeLocalParty.waitingForNextPlayer = nextStatusLocal === 'wheel' ? false : (playersCount > 1);
      activeLocalParty.roundStartTime = nextStatusLocal === 'question' ? Date.now() : 0;
      if (activeLocalParty.players[nextPlayerId]) {
        activeLocalParty.players[nextPlayerId].currentAnswer = null;
        activeLocalParty.players[nextPlayerId].selectedMode = null;
      }
      notifyLocalSubscribers();
    }
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;

  const party = snap.data() as PartyDoc;
  const nextRoundIndex = party.currentRoundIndex + 1;

  if (nextRoundIndex >= party.questions.length) {
    // Fin de partie
    await updateDoc(partyRef, {
      status: 'game_over',
    });
  } else {
    // Manche suivante
    const resetPlayers: Record<string, any> = {};
    Object.keys(party.players || {}).forEach((pId) => {
      resetPlayers[`players.${pId}.currentAnswer`] = null;
      resetPlayers[`players.${pId}.selectedMode`] = null;
    });

    const nextStatus: GameStatus = party.gameMode === 'wheel' ? 'wheel' : 'question';

    await updateDoc(partyRef, {
      status: nextStatus,
      currentRoundIndex: nextRoundIndex,
      roundStartTime: nextStatus === 'question' ? Date.now() : 0,
      roundDuration: party.roundDuration !== undefined ? party.roundDuration : 20,
      activeWheelSector: null,
      activePlayerId: null,
      wheelState: null,
      ...resetPlayers,
    });
  }
}

/**
 * Recommence une nouvelle partie dans le même salon
 */
export async function restartParty(code: string): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    if (!activeLocalParty) return;
    const playerOrder = activeLocalParty.playerOrder || Object.keys(activeLocalParty.players || {});
    const playersCount = Math.max(1, playerOrder.length);
    const questions = generateQuestions(
      activeLocalParty.difficultySetting,
      activeLocalParty.totalRounds * playersCount,
      activeLocalParty.gameMode
    );

    Object.keys(activeLocalParty.players || {}).forEach((pId) => {
      activeLocalParty!.players[pId].totalScore = 0;
      activeLocalParty!.players[pId].lastRoundDelta = 0;
      activeLocalParty!.players[pId].currentAnswer = null;
      activeLocalParty!.players[pId].selectedMode = null;
      activeLocalParty!.players[pId].wheelTurnsCount = 0;
    });

    const initialStatus: GameStatus = activeLocalParty.gameMode === 'wheel' ? 'wheel' : 'question';
    activeLocalParty.status = initialStatus;
    activeLocalParty.localTurnIndex = 0;
    activeLocalParty.currentRoundIndex = 0;
    activeLocalParty.questions = questions;
    activeLocalParty.activePlayerId = playerOrder[0];
    activeLocalParty.waitingForNextPlayer = initialStatus === 'wheel' ? false : (playersCount > 1);
    activeLocalParty.roundStartTime = initialStatus === 'question' ? Date.now() : 0;
    notifyLocalSubscribers();
    return;
  }

  const partyRef = doc(db, 'parties', code);
  const snap = await getDoc(partyRef);
  if (!snap.exists()) return;

  const party = snap.data() as PartyDoc;
  const questions = generateQuestions(party.difficultySetting, party.totalRounds, party.gameMode);

  const resetPlayers: Record<string, any> = {};
  Object.keys(party.players || {}).forEach((pId) => {
    resetPlayers[`players.${pId}.totalScore`] = 0;
    resetPlayers[`players.${pId}.lastRoundDelta`] = 0;
    resetPlayers[`players.${pId}.currentAnswer`] = null;
    resetPlayers[`players.${pId}.selectedMode`] = null;
    resetPlayers[`players.${pId}.wheelTurnsCount`] = 0;
  });

  await updateDoc(partyRef, {
    status: 'lobby',
    currentRoundIndex: 0,
    roundStartTime: 0,
    activePlayerId: null,
    questions,
    ...resetPlayers,
  });
}

/**
 * Permet à l'hôte d'exclure un joueur
 */
export async function kickPlayer(code: string, playerId: string): Promise<void> {
  const partyRef = doc(db, 'parties', code);
  await updateDoc(partyRef, {
    [`players.${playerId}`]: deleteField(),
  });
}

/**
 * Permet à un joueur de quitter la partie
 */
export async function leaveParty(code: string, playerId: string): Promise<void> {
  if (code === 'LOCAL' || code.startsWith('LOCAL')) {
    activeLocalParty = null;
    notifyLocalSubscribers();
    return;
  }

  try {
    const cleanCode = code.trim().toUpperCase();
    const partyRef = doc(db, 'parties', cleanCode);
    await updateDoc(partyRef, {
      [`players.${playerId}`]: deleteField(),
    });
  } catch (err) {
    console.error('Error leaving party:', err);
  }
}

/**
 * Écoute en temps réel les changements d'une partie
 */
export function subscribeToParty(
  code: string,
  onUpdate: (party: PartyDoc | null) => void
) {
  const cleanCode = code.trim().toUpperCase();
  if (cleanCode === 'LOCAL' || cleanCode.startsWith('LOCAL')) {
    localSubscribers.add(onUpdate);
    // Émission immédiate de l'état local actuel
    onUpdate(activeLocalParty ? { ...activeLocalParty } : null);
    return () => {
      localSubscribers.delete(onUpdate);
    };
  }

  const partyRef = doc(db, 'parties', cleanCode);
  return onSnapshot(
    partyRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate({ ...(snap.data() as PartyDoc), id: snap.id });
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error('Firestore subscription error:', err);
    }
  );
}
