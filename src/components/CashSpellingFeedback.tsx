import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { SpellingAnalysis } from '../types';
import { computeSpellingAnalysis } from '../utils/levenshtein';

interface CashSpellingFeedbackProps {
  userInput: string;
  correctAnswer: string;
  analysis?: SpellingAnalysis;
  status: 'minor_error' | 'wrong' | 'correct';
  pointsEarned?: number;
}

export const CashSpellingFeedback: React.FC<CashSpellingFeedbackProps> = ({
  userInput,
  correctAnswer,
  analysis: providedAnalysis,
  status,
  pointsEarned,
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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 border flex flex-col gap-1.5 shadow-md ${
        isAcceptedWithTolerance
          ? 'bg-amber-950/60 border-amber-500/40 text-amber-100'
          : 'bg-rose-950/60 border-rose-500/40 text-rose-100'
      }`}
    >
      {/* Ligne principale : Comparaison discrète Saisie ➜ Bonne orthographe + Badge points */}
      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="text-white/60 text-[11px] font-bold uppercase shrink-0">
            Votre réponse :
          </span>

          {/* Saisie joueur avec surlignage des fautes */}
          <span className="inline-flex items-center tracking-wide font-bold">
            {analysis.inputChars.map((item, idx) => (
              <span
                key={`in-${idx}`}
                className={
                  item.type === 'wrong' || item.type === 'extra'
                    ? 'bg-rose-500/40 text-rose-200 border-b border-rose-400 font-black px-0.5 rounded-sm'
                    : 'text-white/90'
                }
                title={
                  item.type === 'wrong'
                    ? 'Lettre incorrecte'
                    : item.type === 'extra'
                    ? 'Lettre en trop'
                    : undefined
                }
              >
                {item.char}
              </span>
            ))}
          </span>

          <span className="text-white/40 text-xs mx-0.5">➜</span>

          {/* Orthographe correcte avec lettres corrigées/manquantes surlignées */}
          <span className="inline-flex items-center tracking-wide text-emerald-300 font-extrabold uppercase">
            {analysis.targetChars.map((item, idx) => (
              <span
                key={`tg-${idx}`}
                className={
                  item.type === 'corrected' || item.type === 'missing'
                    ? 'bg-emerald-500/30 text-emerald-200 border-b-2 border-emerald-400 font-black px-0.5 rounded-sm'
                    : 'text-emerald-300'
                }
                title={
                  item.type === 'missing'
                    ? 'Lettre qui manquait'
                    : item.type === 'corrected'
                    ? 'Orthographe exacte'
                    : undefined
                }
              >
                {item.char}
              </span>
            ))}
          </span>
        </div>

        {/* Badge de points compact */}
        <div className="shrink-0 ml-auto">
          {isAcceptedWithTolerance ? (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              +{pointsEarned} pts
              <span className="text-[10px] font-medium opacity-80">(Tolérance)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
              0 pt
            </span>
          )}
        </div>
      </div>

      {/* Sous-ligne discrète d'explication textuelle */}
      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] opacity-80 pt-0.5 border-t border-white/5">
        {isAcceptedWithTolerance ? (
          <>
            <span className="text-amber-300 font-semibold">Faute tolérée :</span>
            <span className="text-white/80">
              {analysis.summaryMessage || 'Petite faute acceptée avec 50% des points'}
            </span>
          </>
        ) : (
          <>
            <span className="text-rose-300 font-semibold">Bonne réponse attendue :</span>
            <span className="text-emerald-300 font-bold uppercase">{correctAnswer}</span>
            {analysis.distance <= 2 && analysis.summaryMessage && (
              <span className="text-white/60 ml-1">({analysis.summaryMessage})</span>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
