import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, UserCheck, Crown } from 'lucide-react';
import { PartyDoc, Player } from '../types';
import { spinPartyWheel, applyWheelPlayerAndStartQuestion } from '../services/gameService';
import { sounds } from '../utils/soundEffects';

interface WheelScreenProps {
  party: PartyDoc;
  currentPlayerId: string;
  onSpinComplete?: (sector: any) => Promise<void>;
  onProceedPlayer?: (playerId: string) => Promise<void>;
  onLeave: () => void;
}

interface PlayerSlice {
  sliceId: string;
  playerId: string;
  nickname: string;
  color: string;
  initial: string;
}

// Vibrant palette fallbacks if needed
const SLICE_PALETTE = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#FB923C', // Orange
];

export const WheelScreen: React.FC<WheelScreenProps> = ({
  party,
  currentPlayerId,
  onProceedPlayer,
  onSpinComplete,
}) => {
  const isHost = party.isLocal ? true : party.hostId === currentPlayerId;
  const currentPlayer = party.players?.[currentPlayerId];

  // List of participants sorted by joinedAt
  const playersList: Player[] = useMemo(() => {
    const list = (Object.values(party.players || {}) as Player[]).sort(
      (a, b) => a.joinedAt - b.joinedAt
    );
    return list;
  }, [party.players]);

  // Construct wheel slices based on participants
  const slices: PlayerSlice[] = useMemo(() => {
    if (playersList.length === 0) {
      return [
        {
          sliceId: 'slice-0',
          playerId: currentPlayerId,
          nickname: currentPlayer?.nickname || 'Joueur',
          color: currentPlayer?.color || '#3B82F6',
          initial: (currentPlayer?.nickname || 'J').charAt(0).toUpperCase(),
        },
      ];
    }

    if (playersList.length === 1) {
      const p = playersList[0];
      return [0, 1, 2, 3].map((idx) => ({
        sliceId: `slice-${idx}`,
        playerId: p.id,
        nickname: p.nickname,
        color: p.color || SLICE_PALETTE[idx % SLICE_PALETTE.length],
        initial: p.nickname.charAt(0).toUpperCase(),
      }));
    }

    if (playersList.length === 2) {
      // 6 alternating slices for a balanced, dynamic visual wheel
      return [0, 1, 2, 3, 4, 5].map((idx) => {
        const p = playersList[idx % 2];
        return {
          sliceId: `slice-${idx}`,
          playerId: p.id,
          nickname: p.nickname,
          color: p.color || SLICE_PALETTE[idx % 2],
          initial: p.nickname.charAt(0).toUpperCase(),
        };
      });
    }

    if (playersList.length === 3) {
      // 6 alternating slices (A, B, C, A, B, C)
      return [0, 1, 2, 3, 4, 5].map((idx) => {
        const p = playersList[idx % 3];
        return {
          sliceId: `slice-${idx}`,
          playerId: p.id,
          nickname: p.nickname,
          color: p.color || SLICE_PALETTE[idx % 3],
          initial: p.nickname.charAt(0).toUpperCase(),
        };
      });
    }

    if (playersList.length === 4) {
      // 8 slices (A, B, C, D, A, B, C, D)
      return [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
        const p = playersList[idx % 4];
        return {
          sliceId: `slice-${idx}`,
          playerId: p.id,
          nickname: p.nickname,
          color: p.color || SLICE_PALETTE[idx % 4],
          initial: p.nickname.charAt(0).toUpperCase(),
        };
      });
    }

    // 5 or more players: each player gets slice(s)
    return playersList.map((p, idx) => ({
      sliceId: `slice-${idx}`,
      playerId: p.id,
      nickname: p.nickname,
      color: p.color || SLICE_PALETTE[idx % SLICE_PALETTE.length],
      initial: p.nickname.charAt(0).toUpperCase(),
    }));
  }, [playersList, currentPlayerId, currentPlayer]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [hasLanded, setHasLanded] = useState(false);
  const [autoStartCount, setAutoStartCount] = useState<number | null>(null);
  const [animationDuration, setAnimationDuration] = useState(4200);

  const angleRef = useRef(0);
  const tickIntervalRef = useRef<number | null>(null);
  const lastSpunAtRef = useRef<number>(0);

  // Execute wheel spin animation synchronized with audio ticks
  const executeSpinAnimation = (
    targetPlayer: Player,
    finalAngle: number,
    spunAtTimestamp?: number
  ) => {
    setIsSpinning(true);
    setHasLanded(false);
    setSelectedPlayer(null);
    setAutoStartCount(null);

    const now = Date.now();
    const elapsed = spunAtTimestamp ? Math.max(0, now - spunAtTimestamp) : 0;
    const baseDuration = 4200;
    const duration = Math.max(1000, baseDuration - elapsed);

    setAnimationDuration(duration);

    // Audio clicks that slow down as wheel decelerates
    let tickDelay = 55;
    let elapsedTicks = 0;
    const start = Date.now();

    if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);

    const scheduleTick = () => {
      elapsedTicks = Date.now() - start;
      if (elapsedTicks >= duration) return;

      sounds.playWheelTick();
      const progress = elapsedTicks / duration;
      tickDelay = 55 + Math.pow(progress, 2.5) * 350;
      tickIntervalRef.current = window.setTimeout(scheduleTick, tickDelay);
    };

    sounds.playWheelTick();
    tickIntervalRef.current = window.setTimeout(scheduleTick, tickDelay);

    setCurrentAngle(finalAngle);
    angleRef.current = finalAngle;

    // After animation duration completes
    setTimeout(() => {
      if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
      setIsSpinning(false);
      setSelectedPlayer(targetPlayer);
      setHasLanded(true);
      sounds.playFanfare();

      // Countdown to auto-start question after 5 seconds
      setAutoStartCount(5);
    }, duration);
  };

  // REALTIME SYNCHRONIZATION: Listen to party.wheelState from Firestore
  useEffect(() => {
    const ws = party.wheelState;
    if (!ws) return;

    if (ws.spinning && ws.spunAt && ws.spunAt !== lastSpunAtRef.current) {
      lastSpunAtRef.current = ws.spunAt;
      const targetPlayer = party.players?.[ws.targetPlayerId || ''];
      const targetAngle = ws.targetAngle;

      if (targetPlayer && targetAngle !== undefined) {
        executeSpinAnimation(targetPlayer, targetAngle, ws.spunAt);
      }
    }
  }, [party.wheelState, party.players]);

  // Auto-start counter effect once landed
  useEffect(() => {
    if (autoStartCount === null || !hasLanded || !selectedPlayer) return;
    if (autoStartCount <= 0) {
      if (isHost) {
        handleProceed();
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoStartCount((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoStartCount, hasLanded, selectedPlayer, isHost]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
    };
  }, []);

  // Spin trigger (Called when host clicks "Tourner la roue")
  const handleSpinClick = async () => {
    if (isSpinning || hasLanded || slices.length === 0) return;
    if (!isHost && !party.isLocal) return;

    sounds.playClick();

    // 1. Pick random target player
    const availablePlayers = playersList.length > 0 ? playersList : [currentPlayer!];
    const targetPlayer =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    // 2. Find matching slice indices for this player
    const matchingIndices = slices
      .map((s, idx) => (s.playerId === targetPlayer.id ? idx : -1))
      .filter((idx) => idx !== -1);

    const targetSliceIndex =
      matchingIndices.length > 0
        ? matchingIndices[Math.floor(Math.random() * matchingIndices.length)]
        : 0;

    const sliceAngle = 360 / slices.length;

    // 3. Compute final angle: current angle base + 5 or 6 full spins + slice offset to land at top (-90 deg / 12 o'clock)
    const currentBase = Math.floor(angleRef.current / 360) * 360;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 2));
    const targetOffset = (360 - (targetSliceIndex + 0.5) * sliceAngle + 360) % 360;
    const finalAngle = currentBase + extraSpins + targetOffset;

    // 4. Update Firestore so ALL connected devices (including colleague) spin together in real-time
    await spinPartyWheel(party.code, targetPlayer.id, finalAngle);
  };

  // Proceed to question
  const handleProceed = async () => {
    if (!selectedPlayer) return;
    sounds.playClick();
    if (onProceedPlayer) {
      await onProceedPlayer(selectedPlayer.id);
    } else {
      await applyWheelPlayerAndStartQuestion(party.code, selectedPlayer.id);
    }
  };

  const numSectors = Math.max(1, slices.length);
  const sliceAngle = 360 / numSectors;
  const radius = 150;
  const center = 160;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-between min-h-[calc(100dvh-5.2rem)] max-h-[calc(100dvh-4.5rem)] px-3 py-1 sm:py-2 select-none overflow-y-auto sm:overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Header Info (Compact, responsive, zero scroll) */}
      <div className="text-center mb-1 sm:mb-2 relative z-10 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-xs font-black text-white/80 uppercase tracking-widest mb-1 shadow-xs">
          <Sparkles className="w-3 h-3 text-[#FB923C]" />
          <span>
            {party.isLocal
              ? `Partie 1 Écran • Tour ${party.currentRoundIndex + 1}/${party.totalRounds}`
              : `Manche ${party.currentRoundIndex + 1} sur ${party.totalRounds}`}
          </span>
        </div>

        <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
          <span>Roue des Participants</span>
          <span className="text-xl sm:text-2xl">🎡</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-white/70 font-semibold mt-0.5">
          Qui sera interrogé(e) sur la prochaine capitale ?
        </p>
      </div>

      {/* Wheel Stage Container (Responsive size that fits any mobile viewport) */}
      <div className="relative w-[240px] h-[240px] xs:w-[270px] xs:h-[270px] sm:w-[320px] sm:h-[320px] md:w-[350px] md:h-[350px] max-w-[85vw] max-h-[42vh] aspect-square flex items-center justify-center my-1 sm:my-2 shrink-0">
        {/* Top Pointer Flapper */}
        <div className="absolute -top-2.5 sm:-top-3.5 z-30 flex flex-col items-center pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]">
          <div className="w-0 h-0 border-l-[12px] sm:border-l-[15px] border-l-transparent border-r-[12px] sm:border-r-[15px] border-r-transparent border-t-[22px] sm:border-t-[28px] border-t-amber-400" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-100 rounded-full -mt-6 sm:-mt-7 shadow-inner" />
        </div>

        {/* Outer Wheel Golden Rim */}
        <div className="absolute inset-0 rounded-full border-6 sm:border-8 border-amber-400/90 shadow-[0_0_30px_rgba(251,146,60,0.4)] pointer-events-none z-10">
          {/* Perimeter decorative light pegs */}
          {Array.from({ length: 16 }).map((_, i) => {
            const pegAngle = (i * 360) / 16;
            const rad = (pegAngle * Math.PI) / 180;
            const px = 50 + 47.5 * Math.cos(rad);
            const py = 50 + 47.5 * Math.sin(rad);
            return (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white shadow-[0_0_6px_#fff]"
                style={{
                  left: `${px}%`,
                  top: `${py}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>

        {/* The Rotating Wheel SVG */}
        <div
          className="w-full h-full rounded-full overflow-hidden transition-transform"
          style={{
            transform: `rotate(${currentAngle}deg)`,
            transitionDuration: isSpinning ? `${animationDuration}ms` : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.2, 1)',
          }}
        >
          <svg viewBox="0 0 320 320" className="w-full h-full">
            <g transform={`translate(${center}, ${center})`}>
              {slices.map((slice, i) => {
                const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

                const x1 = radius * Math.cos(startAngle);
                const y1 = radius * Math.sin(startAngle);
                const x2 = radius * Math.cos(endAngle);
                const y2 = radius * Math.sin(endAngle);

                const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                // Mid radial angle for placing texts and avatars
                const midAngle = (i + 0.5) * sliceAngle - 90;
                const textRad = (midAngle * Math.PI) / 180;

                // Position avatar initial closer to the perimeter
                const avatarRadius = radius * 0.74;
                const avatarX = avatarRadius * Math.cos(textRad);
                const avatarY = avatarRadius * Math.sin(textRad);

                // Position nickname label closer to center
                const labelRadius = radius * 0.44;
                const labelX = labelRadius * Math.cos(textRad);
                const labelY = labelRadius * Math.sin(textRad);

                // Truncate player name if long to prevent clipping
                const displayName =
                  slice.nickname.length > 9
                    ? slice.nickname.slice(0, 8) + '…'
                    : slice.nickname;

                return (
                  <g key={slice.sliceId}>
                    {/* Wedge Slice with crisp border */}
                    <path
                      d={pathData}
                      fill={slice.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />

                    {/* Initial Circle Avatar */}
                    <g transform={`translate(${avatarX}, ${avatarY})`}>
                      <circle
                        r={numSectors > 6 ? 12 : 14}
                        fill="#ffffff"
                        stroke="#1A1443"
                        strokeWidth="2"
                        className="shadow-md"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#1A1443"
                        fontSize={numSectors > 6 ? '11' : '13'}
                        fontWeight="900"
                      >
                        {slice.initial}
                      </text>
                    </g>

                    {/* Player Nickname Label */}
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize={numSectors > 6 ? '9.5' : '11.5'}
                      fontWeight="900"
                      letterSpacing="0.05em"
                      transform={`rotate(${midAngle + 90}, ${labelX}, ${labelY})`}
                      className="uppercase filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    >
                      {displayName}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Central Shiny Hub Button */}
        <button
          onClick={handleSpinClick}
          disabled={!isHost || isSpinning || hasLanded}
          title={isHost ? 'Cliquer pour tourner la roue' : "En attente de l'hôte"}
          className={`absolute z-20 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 border-3 sm:border-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center transition-all ${
            isHost && !isSpinning && !hasLanded
              ? 'hover:scale-110 active:scale-95 cursor-pointer animate-pulse'
              : 'cursor-default opacity-95'
          }`}
        >
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1A1443]">
            {isSpinning ? '...' : 'Tourner'}
          </span>
          <span className="text-sm sm:text-base">⭐</span>
        </button>
      </div>

      {/* Dynamic Status / Winner Card (Compact, zero scroll) */}
      <div className="w-full max-w-md mt-1 sm:mt-2 shrink-0">
        <AnimatePresence mode="wait">
          {hasLanded && selectedPlayer ? (
            /* Landed result banner */
            <motion.div
              key="result"
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-[#1e174b]/95 backdrop-blur-xl border border-white/25 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Joueur désigné pour la question</span>
              </div>

              {/* Designated Player Badge */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl text-white shadow-lg border-2 border-white/40 uppercase"
                  style={{ backgroundColor: selectedPlayer.color || '#3B82F6' }}
                >
                  {selectedPlayer.nickname.charAt(0)}
                </div>

                <div className="text-left">
                  <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight">
                    {selectedPlayer.nickname}
                  </h3>
                  <span className="text-[11px] font-bold text-white/70">
                    {selectedPlayer.id === currentPlayerId
                      ? '🎯 C’est à vous de répondre !'
                      : '👀 Préparez-vous à observer sa réponse !'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isHost ? (
                <button
                  onClick={handleProceed}
                  className="w-full mt-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-[#1A1443] font-black text-xs sm:text-sm py-3 px-5 rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    Lancer la question {autoStartCount !== null ? `(${autoStartCount}s)` : ''}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full mt-1 bg-white/10 border border-white/15 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-white/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>
                    L'hôte lance la question dans {autoStartCount || 3}s...
                  </span>
                </div>
              )}
            </motion.div>
          ) : isSpinning ? (
            /* Spinning state (Both host and colleague see this in real time!) */
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-2xl"
            >
              <p className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                <span>🎡</span>
                <span>La roue tourne en direct... Suspense !</span>
                <span>🎡</span>
              </p>
            </motion.div>
          ) : (
            /* Idle: call to action */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center text-center py-1 sm:py-2"
            >
              {isHost ? (
                <button
                  onClick={handleSpinClick}
                  className="w-full max-w-xs bg-gradient-to-r from-[#FB923C] to-amber-400 hover:brightness-110 text-[#1A1443] font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Faire tourner la roue !</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 text-xs text-white/80 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>En attente : l'hôte va faire tourner la roue...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
