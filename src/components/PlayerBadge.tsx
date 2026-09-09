import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { PartyDoc, Player } from '../types';

interface PlayerBadgeProps {
  party: PartyDoc;
  currentPlayerId: string;
  onClick: () => void;
  className?: string;
}

export const PlayerBadge: React.FC<PlayerBadgeProps> = ({
  party,
  currentPlayerId,
  onClick,
  className = '',
}) => {
  const currentPlayer = party.players?.[currentPlayerId];
  if (!currentPlayer) return null;

  // Calculate rank
  const sortedPlayers: Player[] = (Object.values(party.players || {}) as Player[]).sort(
    (a, b) => b.totalScore - a.totalScore
  );
  const rankIndex = sortedPlayers.findIndex((p) => p.id === currentPlayerId);
  const rank = rankIndex !== -1 ? rankIndex + 1 : 1;
  const isFirst = rank === 1 && currentPlayer.totalScore > 0;

  return (
    <button
      onClick={onClick}
      type="button"
      className={`group relative flex items-center gap-2 sm:gap-2.5 bg-[#1F1854]/90 hover:bg-[#28206C] border border-white/20 hover:border-[#FB923C]/70 shadow-lg px-2.5 sm:px-3.5 py-1.5 rounded-2xl transition-all cursor-pointer hover:scale-[1.03] active:scale-95 text-left ${className}`}
      title="Mon badge — Cliquez pour voir le classement"
    >
      {/* Avatar with rank badge indicator */}
      <div className="relative shrink-0">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs uppercase text-white shadow-md border border-white/30 transition-transform group-hover:scale-105"
          style={{ backgroundColor: currentPlayer.color }}
        >
          {currentPlayer.nickname.charAt(0)}
        </div>
        {isFirst ? (
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FB923C] flex items-center justify-center shadow-md">
            <Crown className="w-2.5 h-2.5 text-[#1A1443] fill-current" />
          </div>
        ) : (
          <div className="absolute -bottom-1 -right-1 px-1 rounded-md bg-white/20 backdrop-blur-md text-[8px] font-black text-white border border-white/30">
            #{rank}
          </div>
        )}
      </div>

      {/* Nickname & Score */}
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-white font-black text-xs sm:text-sm truncate max-w-[85px] sm:max-w-[120px]">
            {currentPlayer.nickname}
          </span>
          <span className="hidden sm:inline-flex text-[9px] font-black uppercase tracking-wider text-[#FB923C] bg-[#FB923C]/20 px-1.5 py-0.5 rounded">
            #{rank}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] sm:text-xs font-black text-amber-300">
            {currentPlayer.totalScore.toLocaleString()} pts
          </span>
          <span className="text-[9px] text-white/50 hidden md:inline">·</span>
          <span className="text-[9px] text-white/60 font-semibold hidden md:inline group-hover:text-[#FB923C] transition-colors flex items-center gap-0.5">
            <Trophy className="w-2.5 h-2.5" />
            Classement
          </span>
        </div>
      </div>
    </button>
  );
};
