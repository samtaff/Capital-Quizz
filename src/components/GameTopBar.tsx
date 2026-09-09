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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {party.isLocal ? (
            <div className="flex items-center gap-1 bg-white/10 px-2 sm:px-3 py-1 rounded-xl border border-white/15">
              <Smartphone className="w-3.5 h-3.5 text-[#FB923C]" />
              <span className="text-[10px] sm:text-xs uppercase font-bold text-white/90">
                Locale
              </span>
            </div>
          ) : party.status !== 'question' ? (
            <div className="flex items-center gap-1 bg-white/10 px-2 sm:px-3 py-1 rounded-xl border border-white/15">
              <span className="text-[9px] sm:text-xs uppercase font-bold text-white/60">
                Salon
              </span>
              <span className="font-mono font-black text-[11px] sm:text-sm text-[#FB923C] tracking-wider">
                {party.code}
              </span>
            </div>
          ) : null}

          {party.status !== 'lobby' && (
            <div className="flex items-center gap-1 bg-white/10 px-2 sm:px-2.5 py-1 rounded-xl border border-white/15 text-white/80 text-[10px] sm:text-[11px] font-bold">
              <span className="hidden xs:inline">Manche</span>
              <span className="xs:hidden">M.</span>
              <span className="text-white font-black">
                {formattedRound}/{formattedTotal}
              </span>
            </div>
          )}
        </div>

        {/* Center / Right: Badge joueur cliquable, Son, Quitter */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Player Badge - Clickable to open Leaderboard */}
          <PlayerBadge
            party={party}
            currentPlayerId={currentPlayerId}
            onClick={onOpenLeaderboard}
          />

          {/* Sound Mute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleMute}
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white flex items-center justify-center border border-white/15 transition-all cursor-pointer shrink-0"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            )}
          </button>

          {/* Leave/Quit Party Button (Always visible on mobile & desktop with text) */}
          <button
            id="btn-leave-party"
            onClick={onOpenLeaveModal}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 bg-rose-500/20 hover:bg-rose-500/35 active:scale-95 text-rose-200 hover:text-white border border-rose-500/40 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
            title="Quitter la partie"
            aria-label="Quitter la partie"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-bold">Quitter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
