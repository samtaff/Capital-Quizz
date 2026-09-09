import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Crown, Sparkles } from 'lucide-react';
import { PartyDoc, Player } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: PartyDoc;
  currentPlayerId: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  party,
  currentPlayerId,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sortedPlayers: Player[] = (Object.values(party.players || {}) as Player[]).sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const formattedRound = String(party.currentRoundIndex + 1).padStart(2, '0');
  const formattedTotal = String(party.questions.length).padStart(2, '0');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
          className="relative z-10 w-full max-w-lg bg-[#1F1854] border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FB923C]/20 border border-[#FB923C]/40 flex items-center justify-center text-[#FB923C] shadow-inner">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <span>Classement</span>
                  <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full font-bold text-white/80 normal-case">
                    Manche {formattedRound}/{formattedTotal}
                  </span>
                </h3>
                <p className="text-xs text-white/60 font-medium">
                  Points et positions des joueurs en direct
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
            {sortedPlayers.map((player, index) => {
              const isLeader = index === 0 && player.totalScore > 0;
              const isCurrent = player.id === currentPlayerId;
              const delta = player.lastRoundDelta || 0;

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all ${
                    isLeader
                      ? 'bg-gradient-to-r from-[#FB923C]/20 to-amber-500/10 border-[#FB923C]/60 shadow-lg'
                      : isCurrent
                      ? 'bg-white/15 border-white/40 ring-1 ring-white/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Left: Rank, Avatar, Nickname */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Rank */}
                    <div className="w-7 flex items-center justify-center font-black text-base text-white/80 shrink-0">
                      {isLeader ? (
                        <Crown className="w-5 h-5 text-[#FB923C] fill-[#FB923C] drop-shadow" />
                      ) : (
                        <span>#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm uppercase shadow border border-white/20 shrink-0"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.nickname.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-white truncate">
                          {player.nickname}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            Vous
                          </span>
                        )}
                        {player.isHost && (
                          <span className="text-[9px] bg-purple-500/30 text-purple-200 border border-purple-400/30 font-semibold px-1.5 py-0.5 rounded-md">
                            Hôte
                          </span>
                        )}
                      </div>
                      {delta > 0 && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3" />+{delta} au dernier tour
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="text-right shrink-0 pl-2">
                    <p
                      className={`text-base sm:text-xl font-black ${
                        isLeader ? 'text-[#FB923C]' : 'text-white'
                      }`}
                    >
                      {player.totalScore.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
                      pts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="bg-white/15 hover:bg-white/25 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
