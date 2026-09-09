import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  PlusCircle,
  LogIn,
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  LayoutGrid,
  Smartphone,
  Plus,
  Trash2,
  Play,
  Users,
} from 'lucide-react';
import { DifficultySelection, GameMode } from '../types';
import {
  AVATAR_COLORS,
  createParty,
  joinParty,
  createLocalParty,
  LocalPlayerInput,
} from '../services/gameService';
import { sounds } from '../utils/soundEffects';

interface HomeScreenProps {
  onPartyEntered: (code: string, playerId: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPartyEntered,
  isMuted,
  onToggleMute,
}) => {
  const [modeTab, setModeTab] = useState<'join' | 'create' | 'local'>('join');

  // Player Profile
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('quiz_capitales_nickname') || '';
  });
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[5].hex); // Default Blue

  // Join Form
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Create Online Form
  const [createDifficulty, setCreateDifficulty] = useState<DifficultySelection>('mix');
  const [createRounds, setCreateRounds] = useState(5);
  const [createTimeLimit, setCreateTimeLimit] = useState(20); // 15, 20, 30, or 0 (illimité)
  const [createGameMode, setCreateGameMode] = useState<GameMode>('classic');
  const [isCreating, setIsCreating] = useState(false);

  // Local Party Form (Pass & Play on 1 Phone)
  const [localPlayers, setLocalPlayers] = useState<LocalPlayerInput[]>(() => {
    const defaultName = localStorage.getItem('quiz_capitales_nickname') || '';
    return [
      { name: defaultName.trim() || 'Joueur 1', color: AVATAR_COLORS[5].hex },
      { name: 'Joueur 2', color: AVATAR_COLORS[1].hex },
    ];
  });
  const [localDifficulty, setLocalDifficulty] = useState<DifficultySelection>('mix');
  const [localRounds, setLocalRounds] = useState(5);
  const [localTimeLimit, setLocalTimeLimit] = useState(0); // 0 = Temps illimité par défaut pour Pass & Play
  const [localGameMode, setLocalGameMode] = useState<GameMode>('classic');

  // Show Rules modal
  const [showRules, setShowRules] = useState(false);

  // Read code from URL parameters if present (e.g. ?code=ABCD)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setJoinCode(codeParam.trim().toUpperCase());
      setModeTab('join');
    }
  }, []);

  const handleNicknameChange = (val: string) => {
    setNickname(val);
    localStorage.setItem('quiz_capitales_nickname', val);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!nickname.trim()) {
      setJoinError('Veuillez entrer un pseudo.');
      return;
    }
    if (joinCode.trim().length !== 4) {
      setJoinError('Le code de partie doit comporter 4 lettres.');
      return;
    }

    setIsJoining(true);
    sounds.playClick();

    try {
      const result = await joinParty(joinCode, nickname, selectedColor);
      if (result.success && result.playerId) {
        onPartyEntered(joinCode.trim().toUpperCase(), result.playerId);
      } else {
        setJoinError(result.error || 'Impossible de rejoindre la partie.');
      }
    } catch (err: any) {
      setJoinError(err?.message || 'Erreur de connexion à Firebase.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!nickname.trim()) {
      setJoinError('Veuillez entrer un pseudo pour créer la partie.');
      return;
    }

    setIsCreating(true);
    sounds.playClick();

    try {
      const { code, hostId } = await createParty(
        nickname,
        selectedColor,
        createDifficulty,
        createRounds,
        createTimeLimit,
        createGameMode
      );
      onPartyEntered(code, hostId);
    } catch (err: any) {
      setJoinError(err?.message || 'Erreur lors de la création de la partie.');
    } finally {
      setIsCreating(false);
    }
  };

  // Local Party Handlers
  const handleAddLocalPlayer = () => {
    if (localPlayers.length >= 8) return;
    sounds.playClick();
    const nextIdx = localPlayers.length;
    const nextColor = AVATAR_COLORS[nextIdx % AVATAR_COLORS.length].hex;
    setLocalPlayers([
      ...localPlayers,
      { name: `Joueur ${nextIdx + 1}`, color: nextColor },
    ]);
  };

  const handleRemoveLocalPlayer = (idxToRemove: number) => {
    if (localPlayers.length <= 1) return;
    sounds.playClick();
    setLocalPlayers(localPlayers.filter((_, idx) => idx !== idxToRemove));
  };

  const handleLocalPlayerNameChange = (idx: number, newName: string) => {
    setLocalPlayers(
      localPlayers.map((p, i) => (i === idx ? { ...p, name: newName } : p))
    );
  };

  const handleCycleLocalPlayerColor = (idx: number) => {
    sounds.playClick();
    const currentColor = localPlayers[idx].color;
    const colorIdx = AVATAR_COLORS.findIndex((c) => c.hex === currentColor);
    const nextColor = AVATAR_COLORS[(colorIdx + 1) % AVATAR_COLORS.length].hex;
    setLocalPlayers(
      localPlayers.map((p, i) => (i === idx ? { ...p, color: nextColor } : p))
    );
  };

  const handleStartLocalGame = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const cleanPlayers = localPlayers.map((p, idx) => ({
      name: p.name.trim() || `Joueur ${idx + 1}`,
      color: p.color,
    }));
    const { code, hostId } = createLocalParty(
      cleanPlayers,
      localDifficulty,
      localRounds,
      localTimeLimit,
      localGameMode
    );
    onPartyEntered(code, hostId);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 sm:gap-6 px-3 sm:px-4 py-3 sm:py-6 select-none">
      {/* Top Utility Bar */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => setShowRules(true)}
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-white/20 shadow-md transition-all cursor-pointer font-bold uppercase tracking-wider"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Règles du jeu</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Activer le son' : 'Couper le son'}
          className="p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-md transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Logo & Title (Artistic Flair glow and typography) */}
      <div className="text-center flex flex-col items-center relative">
        <div className="absolute -inset-6 bg-[#FB923C]/20 blur-3xl rounded-full pointer-events-none" />

        <motion.div
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center mb-3 sm:mb-4"
        >
          <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-[#FB923C]" />
        </motion.div>

        <h1 className="relative text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Quiz des Capitales
        </h1>
        <p className="relative text-[11px] sm:text-xs uppercase tracking-widest text-white/60 font-bold mt-1">
          Défiez vos amis en direct • Kahoot Style
        </p>
      </div>

      {/* Player Profile Box */}
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl">
        <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
          Profil de Joueur
        </p>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4 w-full">
          {/* Active Avatar Preview */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md uppercase shrink-0 border-2 border-white/30 transition-transform"
            style={{ backgroundColor: selectedColor }}
          >
            {nickname.trim() ? nickname.trim().charAt(0) : '?'}
          </div>

          <input
            id="player-nickname-input"
            type="text"
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder="Entrez votre pseudo..."
            maxLength={18}
            className="flex-1 min-w-0 w-full bg-[#1A1443]/80 border border-white/20 focus:border-white text-white font-bold text-sm sm:text-base px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none transition-all placeholder:text-white/30 shadow-inner"
          />
        </div>

        {/* Avatar Colors */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-white/70 font-semibold">
            Couleur de votre avatar :
          </span>
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2 w-full justify-items-center">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedColor(c.hex);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl transition-all cursor-pointer ${
                  selectedColor === c.hex
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tab Switcher (Artistic Flair style with 3 tabs) */}
      <div className="w-full bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-1">
        <button
          onClick={() => {
            sounds.playClick();
            setModeTab('join');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            modeTab === 'join'
              ? 'bg-white text-[#1A1443] shadow-lg scale-102'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Rejoindre</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setModeTab('create');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            modeTab === 'create'
              ? 'bg-white text-[#1A1443] shadow-lg scale-102'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>En ligne</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setModeTab('local');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            modeTab === 'local'
              ? 'bg-gradient-to-r from-[#FB923C] to-amber-400 text-[#1A1443] shadow-lg scale-102'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>1 Écran</span>
        </button>
      </div>

      {/* Error Message if any */}
      {joinError && (
        <div className="w-full bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-semibold px-4 py-2.5 rounded-xl text-center">
          {joinError}
        </div>
      )}

      {/* Mode Tab 1: REJOINDRE */}
      {modeTab === 'join' ? (
        <form onSubmit={handleJoin} className="w-full flex flex-col gap-4">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col items-center">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
              Code du salon
            </p>

            <input
              id="room-code-input"
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="KXJ9"
              maxLength={4}
              className="w-full max-w-[200px] text-center font-mono uppercase tracking-[0.25em] sm:tracking-[0.4em] text-2xl sm:text-4xl font-black text-[#FB923C] bg-[#1A1443]/80 border-2 border-white/20 focus:border-[#FB923C] py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl outline-none shadow-inner placeholder:text-white/20"
            />
            <span className="text-[11px] text-white/50 mt-2 font-medium">
              Code à 4 lettres fourni par l'hôte
            </span>
          </div>

          <button
            type="submit"
            disabled={isJoining || joinCode.length !== 4 || !nickname.trim()}
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-[#1A1443] font-black text-base py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40 uppercase tracking-wider"
          >
            {isJoining ? 'Connexion au salon...' : 'Rejoindre la partie'}
          </button>
        </form>
      ) : modeTab === 'create' ? (
        /* Mode Tab 2: CRÉER EN LIGNE */
        <form onSubmit={handleCreate} className="w-full flex flex-col gap-4">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            {/* Game Mode selection (Classique vs Roue) */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Mode de jeu</span>
                {createGameMode === 'wheel' && (
                  <span className="text-[#FB923C] font-black text-[11px] animate-pulse">🎡 Roue active</span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCreateGameMode('classic');
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    createGameMode === 'classic'
                      ? 'bg-white text-[#1A1443] border-white shadow-lg ring-2 ring-[#FB923C]/50'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                    <span>⚡</span>
                    <span>Classique</span>
                  </div>
                  <span className="text-[10px] leading-tight opacity-75 font-medium">
                    Questions directes sur tous les pays
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCreateGameMode('wheel');
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden ${
                    createGameMode === 'wheel'
                      ? 'bg-gradient-to-br from-amber-400 to-[#FB923C] text-[#1A1443] border-amber-300 shadow-lg ring-2 ring-white/50'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                    <span>🎡</span>
                    <span>La Roue</span>
                  </div>
                  <span className="text-[10px] leading-tight opacity-80 font-medium">
                    Tournez la roue : continents & jokers
                  </span>
                </button>
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Niveau de difficulté
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'facile', label: 'Facile' },
                    { id: 'moyen', label: 'Moyen' },
                    { id: 'difficile', label: 'Difficile' },
                    { id: 'mix', label: 'Mix aléatoire' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCreateDifficulty(d.id);
                    }}
                    className={`py-2.5 px-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      createDifficulty === d.id
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds count */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Nombre de questions
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((rounds) => (
                  <button
                    key={rounds}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCreateRounds(rounds);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      createRounds === rounds
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {rounds} manches
                  </button>
                ))}
              </div>
            </div>

            {/* Time limit per question */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Temps par question</span>
                {createTimeLimit === 0 && (
                  <span className="text-emerald-400 font-black text-[11px]">∞ Temps illimité</span>
                )}
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { val: 15, label: '15s' },
                  { val: 20, label: '20s' },
                  { val: 30, label: '30s' },
                  { val: 0, label: '∞ Illimité' },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCreateTimeLimit(t.val);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer text-center ${
                      createTimeLimit === t.val
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreating || !nickname.trim()}
            className="w-full bg-[#FB923C] hover:brightness-110 text-[#1A1443] font-black text-base py-4 rounded-2xl shadow-xl shadow-[#FB923C]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40 uppercase tracking-wider"
          >
            {isCreating ? 'Création du salon...' : 'Créer et obtenir le code'}
          </button>
        </form>
      ) : (
        /* Mode Tab 3: PARTIE LOCALE (PASS & PLAY SUR 1 TÉLÉPHONE) */
        <form onSubmit={handleStartLocalGame} className="w-full flex flex-col gap-4">
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#FB923C]" />
                  <span>Joueurs autour de l'écran</span>
                </h3>
                <p className="text-[11px] text-white/60 font-semibold mt-0.5">
                  Idéal pour jouer ensemble même sans téléphone
                </p>
              </div>
              <span className="text-xs font-black bg-white/15 px-2.5 py-1 rounded-full text-white/90">
                {localPlayers.length}/8
              </span>
            </div>

            {/* Players List with edit and color selection */}
            <div className="flex flex-col gap-2">
              {localPlayers.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-[#1A1443]/70 border border-white/15 p-2 rounded-xl"
                >
                  {/* Clickable color avatar */}
                  <button
                    type="button"
                    onClick={() => handleCycleLocalPlayerColor(idx)}
                    title="Cliquer pour changer la couleur"
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm uppercase text-white shadow cursor-pointer border border-white/30 shrink-0 hover:scale-105 active:scale-95 transition-transform"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.trim() ? player.name.trim().charAt(0) : '?'}
                  </button>

                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleLocalPlayerNameChange(idx, e.target.value)}
                    placeholder={`Joueur ${idx + 1}`}
                    maxLength={18}
                    className="flex-1 min-w-0 bg-transparent border-0 text-white font-bold text-sm px-2 py-1 outline-none placeholder:text-white/30"
                  />

                  {localPlayers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLocalPlayer(idx)}
                      className="p-1.5 text-white/40 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                      title="Supprimer ce joueur"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {localPlayers.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddLocalPlayer}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/25 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FB923C]" />
                  <span>Ajouter un joueur</span>
                </button>
              )}
            </div>

            {/* Game Mode selection (Classique vs Roue) */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Mode de jeu</span>
                {localGameMode === 'wheel' && (
                  <span className="text-[#FB923C] font-black text-[11px] animate-pulse">🎡 Roue active</span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setLocalGameMode('classic');
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    localGameMode === 'classic'
                      ? 'bg-white text-[#1A1443] border-white shadow-lg ring-2 ring-[#FB923C]/50'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                    <span>⚡</span>
                    <span>Classique</span>
                  </div>
                  <span className="text-[10px] leading-tight opacity-75 font-medium">
                    Questions directes sur tous les pays
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setLocalGameMode('wheel');
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden ${
                    localGameMode === 'wheel'
                      ? 'bg-gradient-to-br from-amber-400 to-[#FB923C] text-[#1A1443] border-amber-300 shadow-lg ring-2 ring-white/50'
                      : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wide">
                    <span>🎡</span>
                    <span>La Roue</span>
                  </div>
                  <span className="text-[10px] leading-tight opacity-80 font-medium">
                    Tournez la roue : continents & jokers
                  </span>
                </button>
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Niveau de difficulté
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'facile', label: 'Facile' },
                    { id: 'moyen', label: 'Moyen' },
                    { id: 'difficile', label: 'Difficile' },
                    { id: 'mix', label: 'Mix aléatoire' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setLocalDifficulty(d.id);
                    }}
                    className={`py-2 px-2.5 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      localDifficulty === d.id
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rounds count */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold">
                Nombre de manches par joueur
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((rounds) => (
                  <button
                    key={rounds}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setLocalRounds(rounds);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      localRounds === rounds
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {rounds} manches
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/60 mt-2 text-center font-medium">
                {localPlayers.length > 1
                  ? `${localPlayers.length} joueurs × ${localRounds} manches = ${localPlayers.length * localRounds} questions au total (chacun son tour)`
                  : `Mode Solo : ${localRounds} questions d'entraînement`}
              </p>
            </div>

            {/* Time limit per player */}
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2 font-bold flex items-center justify-between">
                <span>Temps par joueur</span>
                {localTimeLimit === 0 && (
                  <span className="text-emerald-400 font-black text-[11px]">∞ Temps illimité (détente)</span>
                )}
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { val: 0, label: '∞ Illimité' },
                  { val: 15, label: '15s' },
                  { val: 20, label: '20s' },
                  { val: 30, label: '30s' },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setLocalTimeLimit(t.val);
                    }}
                    className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer text-center ${
                      localTimeLimit === t.val
                        ? 'bg-white text-[#1A1443] border-white shadow-md'
                        : 'bg-[#1A1443]/60 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FB923C] to-amber-400 hover:brightness-110 text-[#1A1443] font-black text-base py-4 rounded-2xl shadow-xl shadow-[#FB923C]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Lancer la partie locale</span>
          </button>
        </form>
      )}

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#1A1443] border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FB923C]" />
              <span>Règles & Système de Points</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs sm:text-sm text-white/80">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-[#FB923C] font-black uppercase text-xs tracking-wider mb-1">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Mode CASH (100% des points)</span>
                </div>
                <p>
                  Tapez le nom de la capitale au clavier. Une tolérance orthographique est
                  appliquée (Levenshtein) :
                </p>
                <ul className="list-disc list-inside mt-1 text-white/60 space-y-0.5">
                  <li>0 faute : 100% des points</li>
                  <li>1 à 2 fautes : 50% des points (ex: Ouagadougo)</li>
                  <li>Plus de 2 fautes : 0 point</li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-[#1368CE] font-black uppercase text-xs tracking-wider mb-1">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Mode CARRÉ (50% des points)</span>
                </div>
                <p>
                  4 propositions de villes réalistes (autre grande ville ou capitale voisine).
                  Choisissez la bonne réponse parmi les 4 boutons géométriques !
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="font-black text-[#4ADE80] uppercase text-xs tracking-wider mb-1">
                  ⚡ Rapidité & Difficulté
                </div>
                <p>
                  Multiplicateur dégressif entre 1x et 0.5x selon votre vitesse de réponse dans les
                  20 secondes.
                </p>
                <p className="text-white/60 mt-1">
                  Points de base : Facile = 10 pts, Moyen = 25 pts, Difficile = 50 pts.
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-xl">
                <div className="font-black text-amber-300 uppercase text-xs tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🎡 Mode avec la Roue</span>
                </div>
                <p>
                  À chaque manche, tournez la grande roue ! Elle désigne le continent de la question ou déclenche un joker spécial :
                </p>
                <ul className="list-disc list-inside mt-1 text-white/70 space-y-0.5">
                  <li><strong>Continents</strong> (Europe, Afrique, Asie, Amériques, Océanie, Monde)</li>
                  <li><strong>Points Doublés (x2)</strong> : tous les points marqués sont multipliés par 2</li>
                  <li><strong>Bonus Cash (+500 pts)</strong> : 500 points bonus si vous réussissez en mode Cash</li>
                  <li><strong>Joker 50/50</strong> : élimine 2 mauvaises réponses en mode Carré</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full bg-white hover:bg-slate-100 text-[#1A1443] font-black py-3.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer mt-2 shadow-lg"
            >
              Compris, c'est parti !
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
