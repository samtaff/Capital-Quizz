import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { ThemeId, THEMES } from '../utils/theme';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-[#131B2E] border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl leading-tight">
                    Thèmes Visuels
                  </h3>
                  <p className="text-xs text-white/70 font-medium">
                    Choisissez l’ambiance qui vous plaît
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/80 hover:text-white"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme cards */}
            <div className="grid grid-cols-1 gap-3">
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      onSelectTheme(theme.id);
                    }}
                    className={`relative p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'ring-2 ring-amber-500 border-amber-500 shadow-md scale-[1.01] bg-amber-500/15'
                        : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Emoji Icon */}
                      <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-white/5 flex items-center justify-center">
                        {theme.emoji}
                      </span>

                      {/* Name & Subtitle */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-white">
                            {theme.name}
                          </span>
                        </div>
                        <span className="text-xs text-white/70 font-medium truncate">
                          {theme.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Color Swatch & Check */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex items-center -space-x-1.5">
                        {theme.previewColors.map((col, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-black/30 shadow-xs"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'border border-white/20 opacity-30 group-hover:opacity-60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer tip */}
            <div className="flex items-center gap-2 text-xs opacity-70 px-1 pt-1">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Le thème est sauvegardé pour vos prochaines parties.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
