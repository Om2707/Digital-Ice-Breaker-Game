import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';
import PromptCard from '../components/PromptCard';
import DiceRoller from '../components/DiceRoller';

export default function PlayerPage() {
  const { sessionId, teamName } = useParams();
  const [session, setSession] = useState(null);
  const [isTeamCaptain, setIsTeamCaptain] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('session_updated', (data) => {
      if (data.sessionId === sessionId) {
        setSession(data);
        setGameStarted(data.status === 'active');

        // Check if this player is the team captain
        const team = data.teams.find((t) => t.name === teamName);
        if (team && team.captainSocketId === socket.id) {
          setIsTeamCaptain(true);
        }
      }
    });

    socket.on('game_started', (data) => {
      setSession(data);
      setGameStarted(true);
      updateMessage(data);
    });

    socket.on('game_ended', () => {
      setGameStarted(false);
      setMessage('');
    });

    socket.on('turn_advanced', (data) => {
      updateMessage(session);
    });

    return () => {
      socket.off('session_updated');
      socket.off('game_started');
      socket.off('game_ended');
      socket.off('turn_advanced');
    };
  }, [sessionId, teamName]);

  const updateMessage = (sessionData) => {
    if (!sessionData) return;
    const activeTeam = sessionData.teams[sessionData.currentTeamIndex];
    if (activeTeam.name === teamName) {
      setMessage('🎉 YOUR TEAM\'S TURN! 🎉');
    } else {
      setMessage(`⏳ Waiting for ${activeTeam.name}...`);
    }
  };

  const handleRoll = (value) => {
    socket.emit('roll_dice', { sessionId });
  };

  const handleWildcardChoice = (type) => {
    socket.emit('wildcard_choice', {
      sessionId,
      selectedType: type,
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚡</div>
          <h1 className="text-2xl font-bold">Connecting to game...</h1>
        </div>
      </div>
    );
  }

  const activeTeam = session.teams[session.currentTeamIndex];
  const isYourTurn = activeTeam.name === teamName;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">
          🎮 {teamName}
        </h1>
        <p className="text-gray-400 text-sm">
          {gameStarted ? 'Game in Progress' : 'Waiting for host to start...'}
        </p>
      </div>

      {/* Main Status Message */}
      {gameStarted && (
        <div className={`text-center py-6 px-4 rounded-xl mb-6 ${
          isYourTurn
            ? 'bg-gradient-to-r from-green-600 to-green-800 animate-pulse'
            : 'bg-gradient-to-r from-blue-600 to-blue-800'
        }`}>
          <p className="text-2xl font-bold">{message}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Prompt Card */}
        {gameStarted && session.currentPrompt && (
          <PromptCard
            prompt={session.currentPrompt}
            onWildcardChoice={handleWildcardChoice}
          />
        )}

        {/* Dice Roller - Only show if it's this team's turn and they're the captain */}
        {gameStarted && isYourTurn && isTeamCaptain && (
          <DiceRoller onRoll={handleRoll} disabled={false} />
        )}

        {/* Team Players */}
        {session.teams && (
          <div className="bg-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Team Members</h3>
            <div className="space-y-2">
              {session.teams
                .find((t) => t.name === teamName)
                ?.players?.map((player, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>{player.name}</span>
                    {player.isCapitan && (
                      <span className="text-xs bg-yellow-600 px-2 py-1 rounded">
                        Captain
                      </span>
                    )}
                  </div>
                )) || <p className="text-gray-400">No players yet</p>}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Game Status */}
      <div className="text-center text-gray-400 text-xs mt-6">
        <p>Round {session.round}</p>
        <p>Total Teams: {session.teams.length}</p>
      </div>
    </div>
  );
}
