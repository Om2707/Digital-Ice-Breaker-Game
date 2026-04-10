import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import GameBoard from '../components/GameBoard';
import PromptCard from '../components/PromptCard';
import QRDisplay from '../components/QRDisplay';
import TeamList from '../components/TeamList';
import DiceRoller from '../components/DiceRoller';

export default function HostPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [teamCount, setTeamCount] = useState(3);
  const [teamNames, setTeamNames] = useState(['Team A', 'Team B', 'Team C']);
  const [gameStarted, setGameStarted] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);

  useEffect(() => {
    socket.on('session_created', (data) => {
      setSession(data);
      setGameStarted(false);
    });

    socket.on('session_updated', (data) => {
      setSession(data);
    });

    socket.on('game_started', (data) => {
      setSession(data);
      setGameStarted(true);
    });

    socket.on('game_ended', (data) => {
      setGameStarted(false);
      alert("Game ended! You're ready to ideate!");
    });

    socket.on('turn_advanced', (data) => {
      setWaitingForAction(false);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.off('session_created');
      socket.off('session_updated');
      socket.off('game_started');
      socket.off('game_ended');
      socket.off('turn_advanced');
      socket.off('error');
    };
  }, []);

  const createSession = () => {
    socket.emit('create_session', { teamCount, teamNames });
  };

  const updateTeamName = (index, name) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const startGame = () => {
    if (session) {
      socket.emit('start_game', { sessionId: session.sessionId });
    }
  };

  const endTurn = () => {
    if (session) {
      setWaitingForAction(false);
      socket.emit('end_turn', { sessionId: session.sessionId });
    }
  };

  const endGame = () => {
    if (session) {
      socket.emit('end_game', { sessionId: session.sessionId });
    }
  };

  const handleWildcardChoice = (type) => {
    if (session) {
      socket.emit('wildcard_choice', {
        sessionId: session.sessionId,
        selectedType: type,
      });
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            🎮 Innovation Board Game
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">
                Number of Teams
              </label>
              <input
                type="number"
                min="2"
                max="6"
                value={teamCount}
                onChange={(e) => setTeamCount(Math.min(6, Math.max(2, parseInt(e.target.value))))}
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
              />
            </div>

            {Array.from({ length: teamCount }).map((_, idx) => (
              <div key={idx}>
                <label className="block text-sm font-bold mb-2">
                  Team {idx + 1} Name
                </label>
                <input
                  type="text"
                  value={teamNames[idx] || ''}
                  onChange={(e) => updateTeamName(idx, e.target.value)}
                  placeholder={`Team ${String.fromCharCode(65 + idx)}`}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
                />
              </div>
            ))}

            <button
              onClick={createSession}
              className="btn-primary w-full mt-6"
            >
              Create Game Session
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary w-full text-sm"
            >
              Manage Prompts (Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎮 Host Control</h1>
          <div className="text-right">
            <p className="text-sm text-gray-400">Session ID</p>
            <p className="text-2xl font-bold text-blue-400">
              {session.sessionId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main board - Left side */}
          <div className="lg:col-span-2">
            <GameBoard
              board={session.board}
              teams={session.teams}
              currentTeamIndex={session.currentTeamIndex}
            />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <QRDisplay sessionId={session.sessionId} />

            {/* Team List */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Teams</h3>
              <TeamList
                teams={session.teams}
                currentTeamIndex={session.currentTeamIndex}
              />
            </div>

            {/* Game Controls */}
            <div className="bg-slate-800 rounded-xl p-6 space-y-3">
              {!gameStarted ? (
                <button onClick={startGame} className="btn-primary w-full">
                  Start Game
                </button>
              ) : (
                <>
                  <button
                    onClick={endTurn}
                    className="btn-secondary w-full"
                    disabled={waitingForAction}
                  >
                    Next Turn
                  </button>
                  <button
                    onClick={endGame}
                    className="btn-danger w-full"
                  >
                    End Game
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Prompt Card - Full width bottom */}
        {gameStarted && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Current Prompt</h2>
            <PromptCard
              prompt={session.currentPrompt}
              onWildcardChoice={handleWildcardChoice}
            />
          </div>
        )}

        {/* Status */}
        <div className="mt-8 text-center text-gray-400">
          <p>Status: {session.status.toUpperCase()}</p>
          {gameStarted && (
            <p className="text-blue-400 font-bold">
              {session.teams[session.currentTeamIndex]?.name}'s Turn' - Round {session.round}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
