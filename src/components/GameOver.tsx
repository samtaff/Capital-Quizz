import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, RotateCcw, Home, Sparkles, Medal } from 'lucide-react';
import { PartyDoc, Player } from '../types';
import { restartParty } from '../services/gameService';
import { sounds } from '../utils/soundEffects';
import { getPodiumPunchline } from '../utils/humorMessages';

interface GameOverProps {
  party: PartyDoc;
  currentPlayerId: string;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  party,
  currentPlayerId,
  onHome,
}) => {
  const isHost = party.hostId === currentPlayerId || Boolean(party.isLocal);

  // Sorted players by total score
  const rankedPlayers: Player[] = (Object.values(party.players || {}) as Player[]).sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const winner = rankedPlayers[0];
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];

  const winnerPunchline = winner ? getPodiumPunchline(winner.id, 1, winner.totalScore, party.code) : '';
  const secondPunchline = second ? getPodiumPunchline(second.id, 2, second.totalScore, party.code) : '';
  const thirdPunchline = third ? getPodiumPunchline(third.id, 3, third.totalScore, party.code) : '';

  const handleRestart = async () => {
    sounds.playClick();
    await restartParty(party.code);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 px-3 py-6 select-none">
      {/* Top Banner (Artistic Flair) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center relative"
      >
        <div className="absolute -inset-8 bg-[#FB923C]/20 blur-3xl rounded-full pointer-events-none" />

        <p className="text-xs uppercase tracking-widest text-[#FB923C] mb-1 font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Partie terminée !</span>
          <Sparkles className="w-4 h-4" />
        </p>
        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          Le Podium Final
        </h2>
      </motion.div>

      {/* 3D-styled Kahoot Podium for Top 3 */}
      <div className="w-full max-w-xl grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-2">
        {/* 2nd Place */}
        {second ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-slate-300 relative mb-2"
              style={{ backgroundColor: second.color }}
            >
              {second?.nickname?.charAt(0) || '?'}
              <div className="absolute -top-1.5 -right-1.5 bg-slate-300 text-slate-900 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                2
              </div>
            </div>
            <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[90px] text-center">
              {second?.nickname || 'Joueur'}
            </span>
            <span className="text-white/60 text-xs font-semibold mb-2">
              {second.totalScore} pts
            </span>
            <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-slate-300/30 to-[#1A1443] rounded-t-2xl border-t-2 border-slate-300/60 flex flex-col items-center justify-between p-2">
              <Medal className="w-7 h-7 text-slate-300 shrink-0 mt-1" />
              <div className="bg-black/40 border border-slate-300/30 rounded-lg px-1.5 py-1 text-center w-full mb-1">
                <p className="text-[9px] sm:text-[10px] font-semibold italic text-slate-200 line-clamp-2 leading-tight">
                  « {secondPunchline} »
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div />
        )}

        {/* 1st Place (Champion) */}
        {winner ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-2">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#FB923C]"
              >
                <Crown className="w-8 h-8 fill-[#FB923C] filter drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
              </motion.div>
              <div
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl border-3 border-[#FB923C]"
                style={{ backgroundColor: winner.color }}
              >
                {winner?.nickname?.charAt(0) || '?'}
              </div>
            </div>
            <span className="text-white font-black text-sm sm:text-base truncate max-w-[110px] text-center">
              {winner?.nickname || 'Joueur'}
            </span>
            <span className="text-[#FB923C] text-xs sm:text-sm font-black mb-2">
              {winner.totalScore} pts
            </span>
            <div className="w-full h-40 sm:h-48 bg-gradient-to-b from-[#FB923C]/40 to-[#1A1443] rounded-t-2xl border-t-3 border-[#FB923C] flex flex-col items-center justify-between p-2 shadow-lg shadow-[#FB923C]/20">
              <Trophy className="w-9 h-9 text-[#FB923C] drop-shadow shrink-0 mt-2" />
              <div className="bg-black/50 border border-[#FB923C]/50 rounded-lg px-2 py-1 text-center w-full mb-1 shadow-sm">
                <p className="text-[10px] sm:text-[11px] font-black italic text-amber-200 line-clamp-3 leading-tight">
                  « {winnerPunchline} »
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* 3rd Place */}
        {third ? (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg border-2 border-amber-700 relative mb-2"
              style={{ backgroundColor: third.color }}
            >
              {third?.nickname?.charAt(0) || '?'}
              <div className="absolute -top-1.5 -right-1.5 bg-amber-700 text-amber-100 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                3
              </div>
            </div>
            <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[80px] text-center">
              {third?.nickname || 'Joueur'}
            </span>
            <span className="text-white/60 text-xs font-semibold mb-2">
              {third.totalScore} pts
            </span>
            <div className="w-full h-22 sm:h-30 bg-gradient-to-b from-amber-700/30 to-[#1A1443] rounded-t-2xl border-t-2 border-amber-700/60 flex flex-col items-center justify-between p-1.5 sm:p-2">
              <Medal className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="bg-black/40 border border-amber-700/30 rounded-lg px-1 py-1 text-center w-full mb-1">
                <p className="text-[8px] sm:text-[9px] font-semibold italic text-amber-200/90 line-clamp-2 leading-tight">
                  « {thirdPunchline} »
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div />
        )}
      </div>

      {/* Full Scoreboard list */}
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl">
        <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-3 px-1">
          Tous les scores & verdicts
        </p>

        <div className="flex flex-col gap-2.5">
          {rankedPlayers.map((player, idx) => {
            const punchline = getPodiumPunchline(player.id, idx + 1, player.totalScore, party.code);
            return (
              <div
                key={player.id}
                className={`flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-white/15 border-[#FB923C]/50 shadow-md ring-1 ring-[#FB923C]/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="w-5 sm:w-6 font-black text-xs text-white/60 shrink-0">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs border border-[#1A1443] shrink-0 uppercase"
                      style={{ backgroundColor: player.color }}
                    >
                      {player?.nickname?.charAt(0) || '?'}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-white font-bold text-sm sm:text-base truncate">
                        {player?.nickname || 'Joueur'}
                      </span>
                      {player.id === currentPlayerId && (
                        <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                          Vous
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-white font-black text-sm sm:text-base shrink-0 ml-2">
                    {player.totalScore} pts
                  </span>
                </div>

                {/* Phrase personnalisée pour chaque joueur, visible par tous */}
                <div className="pl-7 sm:pl-9 pr-1">
                  <p className="text-xs sm:text-sm text-amber-200/90 italic font-medium leading-snug">
                    💬 « {punchline} »
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap mt-2">
        {isHost && (
          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-[#FB923C] hover:brightness-110 text-[#1A1443] font-black text-xs sm:text-sm uppercase tracking-wider py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl shadow-xl shadow-[#FB923C]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Rejouer ensemble<span className="hidden sm:inline"> (même salon)</span></span>
          </button>
        )}

        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 px-5 sm:py-3.5 sm:px-6 rounded-2xl transition-all active:scale-95 cursor-pointer"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Accueil</span>
        </button>
      </div>
    </div>
  );
};
