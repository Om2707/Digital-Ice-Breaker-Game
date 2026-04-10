import React from 'react';

export default function TeamList({ teams, currentTeamIndex }) {
  if (!teams || teams.length === 0) {
    return <div className="text-gray-400">No teams yet</div>;
  }

  const teamColors = [
    'bg-red-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-orange-600',
    'bg-purple-600',
    'bg-pink-600',
  ];

  return (
    <div className="space-y-2">
      {teams.map((team, idx) => {
        const isActive = idx === currentTeamIndex;
        return (
          <div
            key={team.id}
            className={`p-3 rounded-lg transition-all transform ${
              isActive
                ? 'ring-2 ring-yellow-400 scale-105 shadow-lg'
                : 'ring-1 ring-gray-600'
            } ${teamColors[idx % teamColors.length]}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{team.name}</p>
                <p className="text-xs opacity-75">
                  {team.players?.length || 0} players
                </p>
              </div>
              {isActive && <span className="text-lg">→</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
