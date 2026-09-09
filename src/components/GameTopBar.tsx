import React from 'react';
import { LogOut, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { PartyDoc } from '../types';
import { PlayerBadge } from './PlayerBadge';

interface GameTopBarProps {
  party: PartyDoc;
  currentPlayerId: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLeaderboard: () => void;
  onOpenLeaveModal: () => void;
}

export const GameTopBar: React.FC<GameTopBarProps> = ({
  party,
  currentPlayerId,
  isMuted,
  onToggleMute,
  onOpenLeaderboard,
  onOpenLeaveModal,
}) => {
  const formattedRound = party.isLocal
    ? String(Math.floor((party.localTurnIndex || 0) / (party.playerOrder?.length || 1)) + 1).padStart(2, '0')
    : String(party.currentRoundIndex + 1).padStart(2, '0');
  const formattedTotal = party.isLocal
    ? String(party.totalRounds).padStart(2, '0')
    : String(party.questions.length).padStart(2, '0');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1A1443]/85 backdrop-blur-md border-b border-white/10 px-2.5 sm:px-6 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Code salon / Mode local & Manche status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {party.isLocal ? (
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/15">
              <Smartphone className="w-3.5 h-3.5 text-[#FB923C]" />
              <span className="text-[10px] sm:text-xs uppercase font-bold text-white/90">
                Locale
              </span>
            </div>
          ) : party.status !== 'question' ? (
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/15">
              <span className="text-[10px] sm:text-xs uppercase font-bold text-white/60">
                Salon
              </span>
              <span className="font-mono font-black text-xs sm:text-sm text-[#FB923C] tracking-wider">
                {party.code}
              </span>
            </div>
          ) : null}

          {party.status !== 'lobby' && (
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl border border-white/15 text-white/80 text-[11px] font-bold">
              <span>Manche</span>
              <span className="text-white font-black">
                {formattedRound}/{formattedTotal}
              </span>
            </div>
          )}
        </div>

        {/* Center / Right: Badge joueur cliquable, Son, Quitter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Player Badge - Clickable to open Leaderboard */}
          <PlayerBadge
            party={party}
            currentPlayerId={currentPlayerId}
            onClick={onOpenLeaderboard}
          />

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer shrink-0"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Leave/Quit Party Button */}
          <button
            onClick={onOpenLeaveModal}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 bg-rose-500/15 hover:bg-rose-500/25 active:scale-95 text-rose-300 hover:text-rose-200 border border-rose-500/30 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
            title="Quitter la partie"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
