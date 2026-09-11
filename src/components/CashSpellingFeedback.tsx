import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, XCircle, X } from 'lucide-react';
import { SpellingAnalysis } from '../types';
import { computeSpellingAnalysis } from '../utils/levenshtein';

interface CashSpellingFeedbackProps {
  userInput: string;
  correctAnswer: string;
  analysis?: SpellingAnalysis;
  status: 'minor_error' | 'wrong' | 'correct';
  pointsEarned?: number;
  playerName?: string;
  onClose?: () => void;
}

export const CashSpellingFeedback: React.FC<CashSpellingFeedbackProps> = ({
  userInput,
  correctAnswer,
  analysis: providedAnalysis,
  status,
  pointsEarned,
  playerName,
  onClose,
}) => {
  const analysis = React.useMemo(() => {
    if (providedAnalysis) return providedAnalysis;
    return computeSpellingAnalysis(
      userInput,
      correctAnswer,
      status === 'correct' ? 0 : status === 'minor_error' ? 2 : 3
    );
  }, [providedAnalysis, userInput, correctAnswer, status]);

  if (!analysis || !analysis.hasTypo) {
    return null;
  }

  const isAcceptedWithTolerance = status === 'minor_error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -3 }}
      transition={{ duration: 0.18 }}
      className={`w-full rounded-xl p-2 sm:p-2.5 border flex flex-col gap-1.5 sm:gap-2 shadow-lg max-w-full overflow-hidden ${
        isAcceptedWithTolerance
          ? 'bg-gradient-to-br from-amber-950/80 to-[#1e174b]/90 border-amber-500/40 text-amber-100'
          : 'bg-gradient-to-br from-rose-950/80 to-[#1e174b]/90 border-rose-500/40 text-rose-100'
      }`}
    >
      {/* En-tête compact : Qui / Statut / Points / Fermeture optionnelle */}
      <div className="flex items-center justify-between gap-1.5 text-xs w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          {isAcceptedWithTolerance ? (
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          ) : (
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-extrabold uppercase tracking-wide text-[10px] sm:text-xs truncate">
            {playerName ? `Réponse de ${playerName}` : 'Correction orthographique'}
          </span>
          <span
            className={`hidden sm:inline-block text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
              isAcceptedWithTolerance
                ? 'bg-amber-500/25 text-amber-300'
                : 'bg-rose-500/25 text-rose-300'
            }`}
          >
            {isAcceptedWithTolerance ? 'Faute tolérée (50%)' : 'Réponse incorrecte'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {isAcceptedWithTolerance ? (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md font-black bg-amber-500/20 text-amber-300 border border-amber-500/35">
              +{pointsEarned ?? 0} pts
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md font-black bg-rose-500/20 text-rose-300 border border-rose-500/35">
              0 pt
            </span>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bloc de comparaison responsive : s'adapte sans déborder ni casser les mots */}
      <div className="w-full bg-black/40 rounded-lg p-1.5 sm:p-2 border border-white/10 flex flex-col xs:flex-row xs:items-center justify-between gap-1 sm:gap-1.5 text-xs sm:text-sm">
        {/* Saisie avec mise en relief des fautes */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap">
          <span className="text-white/50 text-[10px] sm:text-[11px] font-bold uppercase shrink-0">
            Saisie :
          </span>
          <div className="inline-flex flex-wrap items-center font-mono font-bold tracking-wider text-xs sm:text-sm break-all">
            {analysis.inputChars.map((item, idx) => (
              <span
                key={`in-${idx}`}
                className={
                  item.type === 'wrong' || item.type === 'extra'
                    ? 'bg-rose-500/50 text-rose-100 border-b-2 border-rose-400 font-black px-0.5 rounded-sm mx-px'
                    : 'text-white/90'
                }
                title={
                  item.type === 'wrong'
                    ? `« ${item.char} » est incorrect`
                    : item.type === 'extra'
                    ? `« ${item.char} » est en trop`
                    : undefined
                }
              >
                {item.char}
              </span>
            ))}
          </div>
        </div>

        {/* Flèche de transition */}
        <span className="text-white/40 text-xs px-1 self-center hidden xs:inline">➜</span>

        {/* Bonne orthographe attendue avec lettres corrigées */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 flex-wrap xs:justify-end">
          <span className="text-emerald-400/70 text-[10px] sm:text-[11px] font-bold uppercase shrink-0">
            Correct :
          </span>
          <div className="inline-flex flex-wrap items-center font-mono font-extrabold uppercase tracking-wider text-xs sm:text-sm break-all">
            {analysis.targetChars.map((item, idx) => (
              <span
                key={`tg-${idx}`}
                className={
                  item.type === 'corrected' || item.type === 'missing'
                    ? 'bg-emerald-500/40 text-emerald-100 border-b-2 border-emerald-400 font-black px-0.5 rounded-sm mx-px'
                    : 'text-emerald-300'
                }
                title={
                  item.type === 'missing'
                    ? `Lettre manquante : ${item.char}`
                    : item.type === 'corrected'
                    ? `Orthographe attendue : ${item.char}`
                    : undefined
                }
              >
                {item.char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explication en français simplifiée */}
      <div className="w-full flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/80 pt-0.5">
        <span
          className={`font-semibold shrink-0 ${
            isAcceptedWithTolerance ? 'text-amber-300' : 'text-rose-300'
          }`}
        >
          {isAcceptedWithTolerance ? 'Détail :' : 'Attendu :'}
        </span>
        <span className="truncate text-white/90">
          {analysis.summaryMessage ||
            (isAcceptedWithTolerance
              ? 'Petite faute acceptée avec 50% des points'
              : `La bonne réponse attendue était « ${correctAnswer} »`)}
        </span>
      </div>
    </motion.div>
  );
};
