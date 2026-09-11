import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, ArrowRight, Trophy, SkipForward, Users, SpellCheck, Lock } from 'lucide-react';
import { GameQuestion, PartyDoc, Player } from '../types';
import { WorldMap } from './WorldMap';
import { showLeaderboard, nextRoundOrEnd } from '../services/gameService';
import { sounds } from '../utils/soundEffects';
import { FlagImage } from './FlagImage';
import { CashSpellingFeedback } from './CashSpellingFeedback';

interface RoundReviewProps {
  party: PartyDoc;
  question: GameQuestion;
  currentPlayerId: string;
  onOpenLeaderboard?: () => void;
  onLeave?: () => void;
}

export const RoundReview: React.FC<RoundReviewProps> = ({
  party,
  question,
  currentPlayerId,
  onOpenLeaderboard,
  onLeave,
}) => {
  const isHost = party.hostId === currentPlayerId || Boolean(party.isLocal);
  const currentPlayer = party.players?.[currentPlayerId];
  const roundAnswer = currentPlayer?.currentAnswer;
  const isEndOfRound = Boolean(party.isLocal && party.playerOrder && ((party.localTurnIndex || 0) + 1) % party.playerOrder.length === 0);
  const playersList: Player[] = Object.values(party.players || {});
  const isMultiplayer = playersList.length > 1;
  const isOnlineMultiplayer = !party.isLocal && isMultiplayer;
  const answeredCount = playersList.filter((p) => Boolean(p.currentAnswer)).length;
  const allPlayersAnswered = answeredCount >= playersList.length;

  const [showSpellingDetail, setShowSpellingDetail] = useState(false);
  const [selectedTypoPlayerId, setSelectedTypoPlayerId] = useState<string | null>(null);

  // Tous les joueurs ayant fait une faute d'orthographe en mode Cash
  const playersWithCashTypo = playersList.filter((p) => {
    const a = p.currentAnswer;
    return Boolean(
      a?.mode === 'cash' &&
      ((a.levenshteinDistance !== undefined && a.levenshteinDistance > 0) ||
        a.spellingAnalysis?.hasTypo ||
        (a.isCorrect && a.scoreFactor < 1))
    );
  });

  const activeTypoPlayer = selectedTypoPlayerId
    ? party.players?.[selectedTypoPlayerId]
    : (playersWithCashTypo.find((p) => p.id === currentPlayerId) || playersWithCashTypo[0]);
  const activeTypoAnswer = activeTypoPlayer?.currentAnswer;

  const handleNext = () => {
    if (isOnlineMultiplayer && !allPlayersAnswered) return;
    sounds.playClick();
    showLeaderboard(party.code);
  };

  const handleSkip = () => {
    if (isOnlineMultiplayer && !allPlayersAnswered) return;
    sounds.playClick();
    nextRoundOrEnd(party.code);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start gap-2.5 px-2 sm:px-4 py-2 select-none h-full">
      {/* Sleek, Single-line Compact Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-[#1e174b]/90 backdrop-blur-xl border border-white/15 rounded-2xl px-3 sm:px-5 py-2 sm:py-2.5 shadow-2xl flex items-center justify-between gap-3 shrink-0"
      >
        {/* Left: Country flag, name, capital & status */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg overflow-hidden border border-white/25 shadow-md shrink-0 bg-white/5 flex items-center justify-center">
            <FlagImage
              countryId={question.countryId}
              countryName={question.country}
              className="w-full h-full object-cover"
              fallbackEmoji={question.flag}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-black text-sm sm:text-base uppercase tracking-tight truncate">
                {question.country}
              </span>

              {roundAnswer && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md border shrink-0 ${
                    roundAnswer.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {roundAnswer.isCorrect ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>+{roundAnswer.pointsEarned} pts</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>0 pt</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-white/50 text-[10px] sm:text-xs uppercase font-semibold">
                  Capitale :
                </span>
                <span className="text-[#FB923C] font-extrabold tracking-wide">
                  {question.capital}
                </span>
              </div>

              {playersWithCashTypo.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (!showSpellingDetail) {
                      const defaultId =
                        playersWithCashTypo.find((p) => p.id === currentPlayerId)?.id ||
                        playersWithCashTypo[0]?.id;
                      setSelectedTypoPlayerId(defaultId);
                      setShowSpellingDetail(true);
                    } else {
                      setShowSpellingDetail(false);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm shrink-0"
                  title="Voir les erreurs d'orthographe en mode Cash"
                >
                  <SpellCheck className="w-3 h-3 text-amber-400" />
                  <span>
                    {showSpellingDetail
                      ? 'Masquer fautes'
                      : `Fautes Cash (${playersWithCashTypo.length})`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isHost ? (
            isOnlineMultiplayer && !allPlayersAnswered ? (
              <div className="bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>En attente ({answeredCount}/{playersList.length})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-white/15 transition-all cursor-pointer text-xs sm:text-sm"
                  title="Afficher le classement"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Classement</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="flex items-center gap-1.5 bg-[#FB923C] hover:brightness-110 active:scale-95 text-[#1A1443] font-black uppercase tracking-wider px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-xl shadow-lg shadow-[#FB923C]/20 transition-all cursor-pointer text-xs sm:text-sm hover:scale-[1.02]"
                  title="Passer à la suite"
                >
                  <span>{party.isLocal ? (isEndOfRound ? 'Classement' : 'Joueur suivant') : 'Suivant'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )
          ) : (
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-white/70 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FB923C] animate-ping" />
              <span className="hidden sm:inline">En attente de l'hôte...</span>
              <span className="sm:hidden">En attente...</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cash Spelling Feedback Expanded */}
      <AnimatePresence>
        {showSpellingDetail && activeTypoAnswer && activeTypoPlayer && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full shrink-0 flex flex-col gap-1.5"
          >
            {/* Si plusieurs joueurs ont fait des fautes, onglets de sélection rapides */}
            {playersWithCashTypo.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 px-1">
                <span className="text-white/60 text-[10px] font-extrabold uppercase shrink-0">
                  Joueur :
                </span>
                {playersWithCashTypo.map((p) => {
                  const isSelected = p.id === activeTypoPlayer.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedTypoPlayerId(p.id)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-[#FB923C] text-[#1A1443] border-[#FB923C] shadow-sm'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/10'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>{p.id === currentPlayerId ? `${p.nickname} (Vous)` : p.nickname}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <CashSpellingFeedback
              userInput={activeTypoAnswer.answer}
              correctAnswer={question.capital}
              analysis={activeTypoAnswer.spellingAnalysis}
              status={
                activeTypoAnswer.isCorrect
                  ? activeTypoAnswer.scoreFactor < 1
                    ? 'minor_error'
                    : 'correct'
                  : 'wrong'
              }
              pointsEarned={activeTypoAnswer.pointsEarned}
              playerName={
                activeTypoPlayer.id === currentPlayerId ? undefined : activeTypoPlayer.nickname
              }
              onClose={() => setShowSpellingDetail(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiplayer Answers Strip: In multiplayer, show who got it right or wrong with their answer and mode */}
      {isMultiplayer && (
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full bg-[#1e174b]/85 backdrop-blur-md border border-white/15 rounded-xl px-3 py-1.5 sm:py-2 flex items-center gap-2 overflow-x-auto shadow-md shrink-0 scrollbar-none"
        >
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase text-white/60 shrink-0 tracking-wider">
            <Users className="w-3.5 h-3.5 text-[#FB923C]" />
            <span>Réponses :</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {playersList.map((p) => {
              const ans = p.currentAnswer;
              const hasAns = Boolean(ans);
              const isCorrect = ans?.isCorrect ?? false;
              const points = ans?.pointsEarned ?? 0;
              const isCurrent = p.id === currentPlayerId;
              const hasTypo = Boolean(
                ans?.mode === 'cash' &&
                ((ans.levenshteinDistance !== undefined && ans.levenshteinDistance > 0) ||
                  ans.spellingAnalysis?.hasTypo ||
                  (ans.isCorrect && ans.scoreFactor < 1))
              );

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (hasTypo) {
                      setSelectedTypoPlayerId(p.id);
                      setShowSpellingDetail(true);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all shrink-0 shadow-sm ${
                    hasTypo ? 'cursor-pointer hover:scale-[1.02]' : ''
                  } ${
                    hasAns
                      ? isCorrect
                        ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-300'
                        : 'bg-rose-950/70 border-rose-400/50 text-rose-300'
                      : 'bg-white/5 border-white/10 text-white/60'
                  } ${isCurrent ? 'ring-1 ring-white/50' : ''}`}
                  title={hasTypo ? "Cliquer pour voir la correction d'orthographe" : undefined}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black border border-[#1A1443] shrink-0 uppercase"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.nickname.charAt(0)}
                  </div>
                  <span className="text-white text-[11px] sm:text-xs font-bold truncate max-w-[90px]">
                    {p.nickname}
                  </span>
                  {hasAns ? (
                    isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        <span>+{points} pts</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          ({ans.mode === 'cash' ? '⚡' : '🔲'})
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-black text-rose-400">
                        <XCircle className="w-3 h-3" />
                        <span>0 pt</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          ({ans.mode === 'cash' ? '⚡' : '🔲'})
                        </span>
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] text-white/50 italic">Temps écoulé</span>
                  )}

                  {hasTypo && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 border border-amber-500/40 uppercase font-black shrink-0">
                      <SpellCheck className="w-2.5 h-2.5 text-amber-300" />
                      <span>Faute</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Hero Interactive World Map — Large, Immersive, Full-Height */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full flex-1 flex flex-col min-h-0"
      >
        <WorldMap
          countryId={question.countryId}
          countryName={question.country}
          capitalName={question.capital}
          flag={question.flag}
          difficulty={question.difficulty}
          coordinates={question.coordinates}
        />
      </motion.div>
    </div>
  );
};
