import React, { useState, useEffect } from 'react';
import { PartyDoc } from './types';
import { subscribeToParty, leaveParty, applyWheelSectorAndStartQuestion } from './services/gameService';
import { HomeScreen } from './components/HomeScreen';
import { Lobby } from './components/Lobby';
import { WheelScreen } from './components/WheelScreen';
import { QuestionCard } from './components/QuestionCard';
import { RoundReview } from './components/RoundReview';
import { Leaderboard } from './components/Leaderboard';
import { GameOver } from './components/GameOver';
import { GameTopBar } from './components/GameTopBar';
import { LeaderboardModal } from './components/LeaderboardModal';
import { LeaveConfirmModal } from './components/LeaveConfirmModal';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [activeCode, setActiveCode] = useState<string | null>(() => {
    return sessionStorage.getItem('active_party_code') || null;
  });
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(() => {
    return sessionStorage.getItem('current_player_id') || null;
  });

  const [party, setParty] = useState<PartyDoc | null>(null);
  const [loadingParty, setLoadingParty] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Sound toggle
  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sounds.enabled = !nextState;
  };

  // When joining or creating a party
  const handlePartyEntered = (code: string, playerId: string) => {
    setActiveCode(code);
    setCurrentPlayerId(playerId);
    sessionStorage.setItem('active_party_code', code);
    sessionStorage.setItem('current_player_id', playerId);
  };

  // Leave active party and return to home
  const handleLeaveParty = () => {
    setActiveCode(null);
    setCurrentPlayerId(null);
    setParty(null);
    setShowLeaveModal(false);
    setShowLeaderboardModal(false);
    sessionStorage.removeItem('active_party_code');
    sessionStorage.removeItem('current_player_id');
    // Clear URL search params
    if (window.history.pushState) {
      const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  const handleConfirmLeave = async () => {
    sounds.playClick();
    setShowLeaveModal(false);
    if (activeCode && currentPlayerId) {
      await leaveParty(activeCode, currentPlayerId);
    }
    handleLeaveParty();
  };

  // Subscribe in real-time to active party
  useEffect(() => {
    if (!activeCode) {
      setParty(null);
      return;
    }

    setLoadingParty(true);
    const unsubscribe = subscribeToParty(activeCode, (updatedParty) => {
      setLoadingParty(false);
      if (!updatedParty) {
        // Party deleted or not found
        handleLeaveParty();
      } else {
        setParty(updatedParty);
      }
    });

    return () => unsubscribe();
  }, [activeCode]);

  // Current question helper
  const currentQuestion =
    party && party.questions && party.questions[party.currentRoundIndex]
      ? party.questions[party.currentRoundIndex]
      : null;

  const isInGame = Boolean(activeCode && party && currentPlayerId);
  const effectivePlayerId = (party?.isLocal && party?.activePlayerId) ? party.activePlayerId : (currentPlayerId || '');

  return (
    <div className="min-h-screen bg-[#1A1443] text-white flex flex-col items-center font-['Poppins',sans-serif] selection:bg-purple-500 selection:text-white antialiased overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      {/* Global Top Bar (Quit anytime + Clickable badge to see Leaderboard) */}
      {isInGame && party && currentPlayerId && (
        <GameTopBar
          party={party}
          currentPlayerId={effectivePlayerId}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenLeaveModal={() => setShowLeaveModal(true)}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`relative z-10 w-full flex-1 flex flex-col items-center p-2 sm:p-4 ${
          party?.status === 'round_map'
            ? 'max-w-7xl justify-start'
            : 'max-w-4xl justify-center'
        }`}
      >
        {loadingParty && !party ? (
          <div className="flex flex-col items-center gap-3 text-purple-200">
            <span className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm font-semibold">Connexion à la partie...</span>
          </div>
        ) : !activeCode || !party || !currentPlayerId ? (
          /* Home Screen: Join or Create */
          <HomeScreen
            onPartyEntered={handlePartyEntered}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        ) : party.status === 'lobby' ? (
          /* Realtime Lobby Screen */
          <Lobby
            party={party}
            currentPlayerId={currentPlayerId}
            onLeave={() => setShowLeaveModal(true)}
          />
        ) : party.status === 'wheel' ? (
          /* Interactive Wheel of Continents & Bonuses */
          <WheelScreen
            party={party}
            currentPlayerId={effectivePlayerId}
            onSpinComplete={async (sector) => {
              await applyWheelSectorAndStartQuestion(party.code, sector);
            }}
            onLeave={() => setShowLeaveModal(true)}
          />
        ) : party.status === 'question' && currentQuestion ? (
          /* Question Round Screen */
          <QuestionCard
            party={party}
            question={currentQuestion}
            currentPlayerId={effectivePlayerId}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onLeave={() => setShowLeaveModal(true)}
          />
        ) : party.status === 'round_map' && currentQuestion ? (
          /* SVG / Leaflet World Map Intermission Screen */
          <RoundReview
            party={party}
            question={currentQuestion}
            currentPlayerId={effectivePlayerId}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onLeave={() => setShowLeaveModal(true)}
          />
        ) : party.status === 'leaderboard' ? (
          /* Inter-round Standings Screen */
          <Leaderboard
            party={party}
            currentPlayerId={effectivePlayerId}
            onLeave={() => setShowLeaveModal(true)}
          />
        ) : party.status === 'game_over' ? (
          /* Final Podium Screen */
          <GameOver
            party={party}
            currentPlayerId={effectivePlayerId}
            onHome={handleLeaveParty}
          />
        ) : (
          <HomeScreen
            onPartyEntered={handlePartyEntered}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        )}
      </main>

      {/* Real-time Leaderboard Modal (accessible by clicking badge anytime) */}
      {party && currentPlayerId && (
        <LeaderboardModal
          isOpen={showLeaderboardModal}
          onClose={() => setShowLeaderboardModal(false)}
          party={party}
          currentPlayerId={effectivePlayerId}
        />
      )}

      {/* Confirm Leave Party Modal (accessible anytime) */}
      <LeaveConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirmLeave={handleConfirmLeave}
      />
    </div>
  );
}
