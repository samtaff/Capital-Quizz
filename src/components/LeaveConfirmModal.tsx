import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LeaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
}

export const LeaveConfirmModal: React.FC<LeaveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmLeave,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.25, bounce: 0.15 }}
          className="relative z-10 w-full max-w-md bg-[#1F1854] border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 text-center"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              Quitter la partie ?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 font-medium mt-1">
              Vous retournerez au menu d'accueil. Votre partie en cours et vos points actuels seront perdus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3 rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              Continuer à jouer
            </button>
            <button
              onClick={onConfirmLeave}
              className="w-full sm:flex-1 bg-gradient-to-r from-rose-600 to-red-500 hover:brightness-110 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-3 rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Oui, quitter</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
