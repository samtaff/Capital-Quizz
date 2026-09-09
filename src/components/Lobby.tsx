import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Crown,
  Play,
  LogOut,
  X,
  Settings,
} from 'lucide-react';
import { DifficultySelection, GameMode, PartyDoc, Player } from '../types';
import {
  kickPlayer,
  startPartyGame,
  updatePartySettings,
} from '../services/gameService';
import { sounds } from '../utils/soundEffects';

interface LobbyProps {
  party: PartyDoc;
  currentPlayerId: string;
  onLeave: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  party,
  currentPlayerId,
  onLeave,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const isHost = party.hostId === currentPlayerId;
  const playersList: Player[] = (Object.values(party.players || {}) as Player[]).sort(
    (a, b) => a.joinedAt - b.joinedAt
  );
  const currentPlayer = party.players?.[currentPlayerId];

  const handleCopyCode = async () => {
    sounds.playClick();
    await navigator.clipboard.writeText(party.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    sounds.playClick();
    const joinUrl = `${window.location.origin}${window.location.pathname}?code=${party.code}`;
    await navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGameModeChange = async (mode: GameMode) => {
    sounds.playClick();
    await updatePartySettings(party.code, party.difficultySetting, party.totalRounds, party.roundDuration, mode);
  };

  const handleDifficultyChange = async (diff: DifficultySelection) => {
    sounds.playClick();
    await updatePartySettings(party.code, diff, party.totalRounds, party.roundDuration, party.gameMode);
  };

  const handleRoundsChange = async (rounds: number) => {
    sounds.playClick();
    await updatePartySettings(party.code, party.difficultySetting, rounds, party.roundDuration, party.gameMode);
  };

  const handleDurationChange = async (duration: number) => {
    sounds.playClick();
    await updatePartySettings(party.code, party.difficultySetting, party.totalRounds, duration, party.gameMode);
  };

  const handleStartGame = async () => {
    if (!isHost || isStarting) return;
    sounds.playClick();
    setIsStarting(true);
    try {
      await startPartyGame(party.code);
    } catch (err) {
      console.error('Erreur démarrage partie:', err);
      setIsStarting(false);
    }
  };

  const handleKick = async (targetPlayerId: string) => {
    sounds.playClick();
    await kickPlayer(party.code, targetPlayerId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 px-4 py-6 select-none">
      {/* Top Header & Actions */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={onLeave}
          className="flex items-center gap-2 text-white/70 hover:text-white px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Quitter</span>
        </button>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs text-white/80">
          <Users className="w-4 h-4 text-[#FB923C]" />
          <span className="font-black text-white">{playersList.length}</span>
          <span className="uppercase tracking-wider font-bold">
            joueur{playersList.length > 1 ? 's' : ''} connecté{playersList.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Big Code Box (Artistic Flair Style) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -inset-8 bg-[#FB923C]/20 blur-3xl rounded-full pointer-events-none" />

        <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
          Code du Salon
        </p>

        {/* 4-letter Huge Code */}
        <div className="flex items-center justify-center my-3">
          <span className="text-6xl sm:text-8xl font-black tracking-widest text-[#FB923C] drop-shadow-md font-mono">
            {party.code}
          </span>
        </div>

        <p className="text-xs uppercase tracking-wider text-white/60 mb-6 font-semibold">
          Rejoignez la partie en direct avec ce code à 4 lettres
        </p>

        {/* Share buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-[#1A1443] font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Code copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le code</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-[#1A1443]/80 hover:bg-[#1A1443] border border-white/20 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Lien copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Partager le lien direct</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Host Configuration Panel */}
      {isHost && (
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
            <Settings className="w-4 h-4 text-[#FB923C]" />
            <span className="uppercase tracking-wider font-black">Paramètres de la partie</span>
            <span className="text-[10px] font-bold text-white/60 ml-auto bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Hôte
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Game Mode selection (Classique vs Roue) */}
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Mode de jeu</span>
                {party.gameMode === 'wheel' && (
                  <span className="text-[#FB923C] font-black text-[11px] animate-pulse">🎡 Roue active</span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleGameModeChange('classic')}
                  className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                    (party.gameMode ?? 'classic') === 'classic'
                      ? 'bg-white text-[#1A1443] border-white shadow-md'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="font-black text-xs uppercase">⚡ Classique</span>
                  <span className="text-[10px] opacity-75 font-medium">Questions directes sur tous les pays</span>
                </button>
                <button
                  onClick={() => handleGameModeChange('wheel')}
                  className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                    party.gameMode === 'wheel'
                      ? 'bg-gradient-to-br from-amber-400 to-[#FB923C] text-[#1A1443] border-amber-300 shadow-md'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="font-black text-xs uppercase">🎡 La Roue</span>
                  <span className="text-[10px] opacity-80 font-medium">Tournez la roue : continents & jokers</span>
                </button>
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Difficulté
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'facile', label: 'Facile' },
                    { id: 'moyen', label: 'Moyen' },
                    { id: 'difficile', label: 'Difficile' },
                    { id: 'mix', label: 'Mix' },
                  ] as const
                ).map((d) => {
                  const isSelected = party.difficultySetting === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDifficultyChange(d.id)}
                      className={`text-xs font-black uppercase tracking-wider py-2.5 px-3 rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#1A1443] border-white shadow-md'
                          : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rounds selection */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Nombre de manches
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((rounds) => {
                  const isSelected = party.totalRounds === rounds;
                  return (
                    <button
                      key={rounds}
                      onClick={() => handleRoundsChange(rounds)}
                      className={`text-xs font-black uppercase tracking-wider py-2.5 px-3 rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#1A1443] border-white shadow-md'
                          : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {rounds} manches
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time limit per question */}
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Temps par question</span>
                {party.roundDuration === 0 && (
                  <span className="text-emerald-400 font-bold text-[11px] uppercase">∞ Temps illimité activé</span>
                )}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 15, label: '15s' },
                  { val: 20, label: '20s' },
                  { val: 30, label: '30s' },
                  { val: 0, label: '∞ Illimité' },
                ].map((t) => {
                  const isSelected = (party.roundDuration ?? 20) === t.val;
                  return (
                    <button
                      key={t.val}
                      onClick={() => handleDurationChange(t.val)}
                      className={`text-xs font-black uppercase tracking-wider py-2.5 px-2 rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#1A1443] border-white shadow-md'
                          : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest info banner when not host */}
      {!isHost && (
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4 flex items-center justify-around text-xs text-white/90">
          <div>
            <span className="text-white/60 font-semibold block text-[10px] uppercase">Mode</span>
            <strong className="text-[#FB923C] font-black uppercase">
              {party.gameMode === 'wheel' ? '🎡 La Roue' : '⚡ Classique'}
            </strong>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div>
            <span className="text-white/60 font-semibold block text-[10px] uppercase">Difficulté</span>
            <strong className="text-white font-black uppercase">{party.difficultySetting}</strong>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div>
            <span className="text-white/60 font-semibold block text-[10px] uppercase">Manches</span>
            <strong className="text-white font-black">{party.totalRounds} questions</strong>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div>
            <span className="text-white/60 font-semibold block text-[10px] uppercase">Chrono</span>
            <strong className="text-[#FB923C] font-black">
              {party.roundDuration === 0 ? '∞ Illimité' : `${party.roundDuration ?? 20}s`}
            </strong>
          </div>
        </div>
      )}

      {/* Players List Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs uppercase tracking-widest text-white/60 font-bold">
            Joueurs dans le salon ({playersList.length})
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {playersList.map((player) => {
              const isCurrent = player.id === currentPlayerId;
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-white/20 border-white/40 shadow-xl ring-2 ring-white/30'
                      : 'bg-white/10 backdrop-blur-md border-white/15'
                  }`}
                >
                  {/* Colored Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 uppercase border-2 border-[#1A1443]"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.nickname.charAt(0)}
                  </div>

                  {/* Nickname & info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm font-bold truncate">
                        {player.nickname}
                      </span>
                      {player.isHost && (
                        <Crown className="w-3.5 h-3.5 text-[#FB923C] shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold block">
                      {isCurrent ? 'Vous' : player.isHost ? 'Hôte' : 'Joueur'}
                    </span>
                  </div>

                  {/* Kick button for host (not on self) */}
                  {isHost && !player.isHost && (
                    <button
                      onClick={() => handleKick(player.id)}
                      title="Exclure ce joueur"
                      className="text-white/40 hover:text-rose-400 p-1 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Start Button or Waiting Status Banner */}
      <div className="w-full max-w-md mt-2 flex flex-col items-center">
        {isHost ? (
          <button
            onClick={handleStartGame}
            disabled={isStarting}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-[#1A1443] font-black text-base py-4 px-8 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{isStarting ? 'Lancement...' : 'Lancer la partie !'}</span>
          </button>
        ) : (
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-6 text-center text-white/80 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB923C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FB923C]"></span>
            </span>
            <span>En attente que l'hôte lance la partie...</span>
          </div>
        )}
      </div>
    </div>
  );
};
