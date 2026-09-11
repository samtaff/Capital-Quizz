import React from 'react';
import { Minus, Plus, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface RoundSliderSelectorProps {
  value: number;
  onChange: (rounds: number) => void;
  min?: number;
  max?: number;
  label?: string;
  playersCount?: number;
  quickPresets?: number[];
  theme?: 'dark' | 'glass';
}

export const RoundSliderSelector: React.FC<RoundSliderSelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 30,
  label = 'Nombre de manches',
  playersCount = 1,
  quickPresets = [3, 5, 10, 15, 20, 25],
}) => {
  const handleDecrement = () => {
    if (value > min) {
      sounds.playClick();
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      sounds.playClick();
      onChange(value + 1);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    if (!isNaN(newVal) && newVal >= min && newVal <= max) {
      onChange(newVal);
    }
  };

  const handlePreset = (preset: number) => {
    sounds.playClick();
    onChange(preset);
  };

  // Calcul du pourcentage pour la barre de progression
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // Estimation du temps de jeu (environ 25 à 30 secondes par question)
  const totalQuestions = playersCount * value;
  const estimatedMinutes = Math.max(1, Math.round(totalQuestions * 0.45));

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* En-tête : Label & Affichage en direct de la valeur */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs uppercase tracking-widest text-white/70 font-bold flex items-center gap-1.5">
          <span>{label}</span>
          {value >= 20 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-300 font-extrabold bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5" /> Marathon
            </span>
          )}
        </label>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-white/50 font-medium hidden xs:inline">
            ~{estimatedMinutes} min
          </span>
          <div className="bg-[#FB923C] text-slate-950 px-2.5 py-0.5 rounded-lg font-black text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/30">
            {value} {value > 1 ? 'manches' : 'manche'}
          </div>
        </div>
      </div>

      {/* Curseur & Boutons pas-à-pas (- / +) */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2.5 backdrop-blur-sm shadow-inner">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bouton décrémenter (-) */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            aria-label="Diminuer d'une manche"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shrink-0 active:scale-95 ${
              value <= min
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white shadow-sm'
            }`}
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Curseur interactif libre (Range Slider) */}
          <div className="flex-1 flex flex-col justify-center relative py-1">
            <input
              type="range"
              min={min}
              max={max}
              step={1}
              value={value}
              onChange={handleSliderChange}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[#FB923C] focus:outline-none transition-all"
              style={{
                background: `linear-gradient(to right, #FB923C 0%, #FB923C ${percentage}%, rgba(255,255,255,0.15) ${percentage}%, rgba(255,255,255,0.15) 100%)`,
              }}
            />
            {/* Bornes min / max sous le curseur */}
            <div className="flex justify-between text-[10px] text-white/40 font-bold mt-1.5 px-0.5">
              <span>{min} min</span>
              <span className="text-[#FB923C] font-black">{value}</span>
              <span>{max} max</span>
            </div>
          </div>

          {/* Bouton incrémenter (+) */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            aria-label="Augmenter d'une manche"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all cursor-pointer shrink-0 active:scale-95 ${
              value >= max
                ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white shadow-sm'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Préréglages rapides (Chips) */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-white/5">
          <span className="text-[10px] uppercase font-bold text-white/40 mr-1 shrink-0">
            Rapide :
          </span>
          {quickPresets.map((preset) => {
            const isSelected = value === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className={`text-[11px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#1A1443] border-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note contextuelle multi-joueurs / solo */}
      <p className="text-[11px] text-white/50 text-center font-medium">
        {playersCount > 1 ? (
          <>
            <span className="text-white/80 font-bold">{playersCount} joueurs</span> ×{' '}
            <span className="text-[#FB923C] font-bold">{value} manches</span> ={' '}
            <span className="text-white font-extrabold">{totalQuestions} questions au total</span>{' '}
            (chacun son tour)
          </>
        ) : (
          <>
            Partie de <span className="text-white font-bold">{value} questions</span> au total
          </>
        )}
      </p>
    </div>
  );
};
