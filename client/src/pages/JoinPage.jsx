import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function JoinPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    console.log('[JoinPage] Mounted with sessionId:', sessionId);
    console.log('[JoinPage] Socket connected:', socket.connected);

    // Set up socket listeners
    const handleSessionUpdated = (data) => {
      console.log('[JoinPage] Session updated:', data);
      if (data.sessionId === sessionId) {
        setSession(data);
        setLoading(false);
        setConnectionStatus('connected');
        if (!selectedTeam && data.teams.length > 0) {
          setSelectedTeam(data.teams[0].name);
        }
      }
    };

    const handleError = (err) => {
      console.error('[JoinPage] Socket error:', err);
      setError(err.message || 'Connection error');
      setLoading(false);
      setConnectionStatus('error');
    };

    const handleConnect = () => {
      console.log('[JoinPage] Socket connected');
      setConnectionStatus('connected');
      // Don't set loading to false yet - wait for session data
    };

    const handleConnectError = (error) => {
      console.error('[JoinPage] Socket connection error:', error);
      setConnectionStatus('error');
      setError('Failed to connect to server. Make sure the backend is running.');
      setLoading(false);
    };

    const handleDisconnect = (reason) => {
      console.log('[JoinPage] Socket disconnected:', reason);
      setConnectionStatus('disconnected');
    };

    socket.on('session_updated', handleSessionUpdated);
    socket.on('error', handleError);
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    // If already connected, try to get session info immediately
    if (socket.connected) {
      console.log('[JoinPage] Socket already connected, requesting session...');
      handleConnect();
    }

    // Set timeout for fallback
    const timeoutId = setTimeout(() => {
      if (loading && connectionStatus === 'connecting') {
        console.warn('[JoinPage] Connection timeout, showing fallback UI');
        setLoading(false);
      }
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      socket.off('session_updated', handleSessionUpdated);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
    };
  }, [sessionId]);

  const handleJoin = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }

    socket.emit('join_session', {
      sessionId,
      teamName: selectedTeam,
      playerName,
    });

    setJoined(true);
    // Navigate to player page after a short delay
    setTimeout(() => {
      navigate(`/player/${sessionId}/${selectedTeam}`, { state: { playerName } });
    }, 1000);
  };

  if (joined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-2">Joined Successfully!</h1>
          <p className="text-gray-400">Redirecting to game...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  // Fallback UI when we don't get session data
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          🎮 Join Game
        </h1>
        <p className="text-gray-400 text-center mb-2">
          Session: {sessionId}
        </p>
        <p className="text-xs text-center mb-6">
          Connection: <span className={connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}>{connectionStatus}</span>
        </p>

        {error && (
          <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4 text-sm">
            <p className="font-bold mb-1">⚠️ Connection Error</p>
            <p>{error}</p>
            <p className="text-xs mt-2">
              <strong>Site URL:</strong> {window.location.origin}
            </p>
            <p className="text-xs mt-1">
              <strong>Hostname:</strong> {window.location.hostname}:{window.location.port}
            </p>
            {connectionStatus === 'error' && (
              <p className="text-xs mt-2 bg-red-950 p-2 rounded">
                Make sure both devices are on the same WiFi network and the desktop server is running.
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Select Team</label>
            {session && session.teams && session.teams.length > 0 ? (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Choose a team...</option>
                {session.teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                placeholder="Team name (e.g., Alpha)"
                className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              />
            )}
            {!session && (
              <p className="text-xs text-yellow-400 mt-2">
                Waiting for session data... You can still join with a team name.
              </p>
            )}
          </div>

          <button
            onClick={handleJoin}
            className="btn-primary w-full mt-6"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}
