import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play, Trophy } from 'lucide-react';
import { PartyDoc, WheelSector } from '../types';
import { WHEEL_SECTORS, getRandomWheelSector } from '../data/wheelData';
import { sounds } from '../utils/soundEffects';

interface WheelScreenProps {
  party: PartyDoc;
  currentPlayerId: string;
  onSpinComplete: (sector: WheelSector) => Promise<void>;
  onLeave: () => void;
}

export const WheelScreen: React.FC<WheelScreenProps> = ({
  party,
  currentPlayerId,
  onSpinComplete,
}) => {
  const isHost = party.isLocal
    ? true
    : party.hostId === currentPlayerId;

  const currentPlayer = party.players?.[currentPlayerId];
  const activePlayer = party.isLocal && party.activePlayerId
    ? party.players?.[party.activePlayerId]
    : currentPlayer;

  const isLocalActiveTurn = !party.isLocal || party.activePlayerId === currentPlayerId;
  const canSpin = isHost && isLocalActiveTurn;

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [selectedSector, setSelectedSector] = useState<WheelSector | null>(null);
  const [hasLanded, setHasLanded] = useState(false);
  const [autoStartCount, setAutoStartCount] = useState<number | null>(null);

  const angleRef = useRef(0);
  const tickIntervalRef = useRef<number | null>(null);

  // Sync with Firestore wheel state in online multiplayer
  useEffect(() => {
    if (party.wheelState && !party.isLocal) {
      if (party.wheelState.spinning && !isSpinning) {
        // Remote spin started
        const targetId = party.wheelState.targetSectorId;
        const targetSector = WHEEL_SECTORS.find((s) => s.id === targetId) || WHEEL_SECTORS[0];
        const targetAngle = party.wheelState.targetAngle || (1800 + 45);
        executeSpinAnimation(targetSector, targetAngle);
      }
    }
  }, [party.wheelState]);

  // Execute wheel spin animation
  const executeSpinAnimation = (targetSector: WheelSector, finalAngle: number) => {
    setIsSpinning(true);
    setHasLanded(false);
    setSelectedSector(null);
    setAutoStartCount(null);

    // Audio clicks that slow down as wheel decelerates
    let tickDelay = 60;
    let elapsed = 0;
    const duration = 4200; // 4.2 seconds
    const start = Date.now();

    const scheduleTick = () => {
      elapsed = Date.now() - start;
      if (elapsed >= duration) return;

      sounds.playWheelTick();
      // Decelerate ticks non-linearly
      const progress = elapsed / duration;
      tickDelay = 60 + Math.pow(progress, 2.5) * 350;
      tickIntervalRef.current = window.setTimeout(scheduleTick, tickDelay);
    };

    sounds.playWheelTick();
    tickIntervalRef.current = window.setTimeout(scheduleTick, tickDelay);

    setCurrentAngle(finalAngle);
    angleRef.current = finalAngle;

    // After animation completes
    setTimeout(() => {
      if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
      setIsSpinning(false);
      setSelectedSector(targetSector);
      setHasLanded(true);
      sounds.playFanfare();

      // Countdown to auto-start question after 5 seconds
      setAutoStartCount(5);
    }, duration);
  };

  // Auto-start counter effect once landed
  useEffect(() => {
    if (autoStartCount === null || !hasLanded || !selectedSector) return;
    if (autoStartCount <= 0) {
      if (canSpin) {
        handleProceed();
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoStartCount((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoStartCount, hasLanded, selectedSector, canSpin]);

  // Spin trigger
  const handleSpinClick = () => {
    if (!canSpin || isSpinning || hasLanded) return;
    sounds.playClick();

    const targetSector = getRandomWheelSector();
    const sectorIndex = WHEEL_SECTORS.findIndex((s) => s.id === targetSector.id);
    const sectorAngle = 360 / WHEEL_SECTORS.length; // 45 degrees

    // Target center angle so it lands at top (0 deg / 12 o'clock)
    // Pointer is at 0 degrees (top). Slices are drawn starting from -90 + (i * 45).
    // Center of slice i is at: -90 + (i + 0.5) * 45.
    // To align center with top (270° or -90°):
    const currentBase = Math.floor(angleRef.current / 360) * 360;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 2)); // 5 to 6 full turns
    const targetOffset = 360 - (sectorIndex + 0.5) * sectorAngle;
    const finalAngle = currentBase + extraSpins + targetOffset;

    executeSpinAnimation(targetSector, finalAngle);
  };

  // Proceed to question
  const handleProceed = async () => {
    if (!selectedSector) return;
    sounds.playClick();
    await onSpinComplete(selectedSector);
  };

  const numSectors = WHEEL_SECTORS.length;
  const sliceAngle = 360 / numSectors;
  const radius = 150;
  const center = 160;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-3 sm:p-5 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute -inset-4 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="text-center mb-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-black text-white/80 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
          <span>
            {party.isLocal
              ? `Tour de ${activePlayer?.nickname || 'Joueur'}`
              : `Manche ${party.currentRoundIndex + 1} sur ${party.totalRounds}`}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
          <span>La Roue du Destin</span>
          <span className="text-2xl">🎡</span>
        </h2>
        <p className="text-xs text-white/60 font-semibold mt-0.5">
          Continents ciblés • Multiplicateurs x2 • Défis spéciaux
        </p>
      </div>

      {/* Wheel Stage Container */}
      <div className="relative w-[320px] h-[320px] sm:w-[340px] sm:h-[340px] flex items-center justify-center my-2">
        {/* Top Pointer Flapper */}
        <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-400" />
          <div className="w-3 h-3 bg-amber-200 rounded-full -mt-7 shadow-inner" />
        </div>

        {/* Outer Wheel Golden Rim */}
        <div className="absolute inset-0 rounded-full border-8 border-amber-400/80 shadow-[0_0_35px_rgba(251,146,60,0.4)] pointer-events-none z-10">
          {/* Decorative perimeter lights/pegs */}
          {Array.from({ length: 16 }).map((_, i) => {
            const pegAngle = (i * 360) / 16;
            const rad = (pegAngle * Math.PI) / 180;
            const px = 50 + 47 * Math.cos(rad);
            const py = 50 + 47 * Math.sin(rad);
            return (
              <span
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff]"
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
            transitionDuration: isSpinning ? '4200ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.2, 1)',
          }}
        >
          <svg viewBox="0 0 320 320" className="w-full h-full">
            <g transform={`translate(${center}, ${center})`}>
              {WHEEL_SECTORS.map((sector, i) => {
                const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);

                const x1 = radius * Math.cos(startAngle);
                const y1 = radius * Math.sin(startAngle);
                const x2 = radius * Math.cos(endAngle);
                const y2 = radius * Math.sin(endAngle);

                const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                // Text orientation
                const midAngle = (i + 0.5) * sliceAngle - 90;
                const textRad = (midAngle * Math.PI) / 180;
                const iconX = (radius * 0.72) * Math.cos(textRad);
                const iconY = (radius * 0.72) * Math.sin(textRad);
                const labelX = (radius * 0.42) * Math.cos(textRad);
                const labelY = (radius * 0.42) * Math.sin(textRad);

                return (
                  <g key={sector.id}>
                    {/* Wedge Slice */}
                    <path
                      d={pathData}
                      fill={sector.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Sector Icon */}
                    <text
                      x={iconX}
                      y={iconY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="20"
                      transform={`rotate(${midAngle + 90}, ${iconX}, ${iconY})`}
                    >
                      {sector.icon}
                    </text>

                    {/* Sector Label */}
                    <text
                      x={labelX}
                      y={labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="900"
                      letterSpacing="0.05em"
                      transform={`rotate(${midAngle + 90}, ${labelX}, ${labelY})`}
                      className="uppercase filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    >
                      {sector.label}
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
          disabled={!canSpin || isSpinning || hasLanded}
          className={`absolute z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 border-4 border-amber-600 shadow-2xl flex flex-col items-center justify-center transition-all ${
            canSpin && !isSpinning && !hasLanded
              ? 'hover:scale-110 active:scale-95 cursor-pointer animate-pulse'
              : 'cursor-default'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1443]">
            {isSpinning ? '...' : 'Tourner'}
          </span>
          <span className="text-base">⭐</span>
        </button>
      </div>

      {/* Dynamic Status / Winner Card */}
      <div className="w-full mt-2">
        <AnimatePresence mode="wait">
          {hasLanded && selectedSector ? (
            /* Landed result banner */
            <motion.div
              key="result"
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-3xl">{selectedSector.icon}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                  {selectedSector.label}
                </h3>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-white/90 max-w-sm mb-4">
                {selectedSector.description}
              </p>

              {canSpin ? (
                <button
                  onClick={handleProceed}
                  className="w-full max-w-xs bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-[#1A1443] font-black text-sm sm:text-base py-3 px-6 rounded-xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>C'est parti ! {autoStartCount !== null ? `(${autoStartCount}s)` : ''}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-white/70">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>L'hôte lance la question dans {autoStartCount || 3}s...</span>
                </div>
              )}
            </motion.div>
          ) : isSpinning ? (
            /* Spinning state */
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center py-4"
            >
              <p className="text-sm font-black text-amber-300 uppercase tracking-widest animate-pulse">
                La roue tourne... Suspense ! 🎡
              </p>
            </motion.div>
          ) : (
            /* Idle: call to action */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center text-center py-2"
            >
              {canSpin ? (
                <button
                  onClick={handleSpinClick}
                  className="w-full max-w-xs bg-gradient-to-r from-[#FB923C] to-amber-400 hover:brightness-110 text-[#1A1443] font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Faire tourner la roue !</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-full border border-white/15 text-xs text-white/80 font-bold">
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
