import React from 'react';

export default function GameBoard({ board, teams, currentTeamIndex }) {
  const getSpaceColor = (type) => {
    const colors = {
      move: 'bg-blue-500',
      talk: 'bg-yellow-500',
      create: 'bg-green-500',
      wildcard: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-600';
  };

  const getSpaceIcon = (type) => {
    const icons = {
      move: '🏃',
      talk: '💬',
      create: '✏️',
      wildcard: '🃏',
    };
    return icons[type] || '◆';
  };

  // Calculate positions in a circular layout
  const getTokenPosition = (position, radius = 150) => {
    const angle = (position / board.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Game Board</h2>

      {/* Circular Board */}
      <div className="relative w-96 h-96 mx-auto">
        {/* Board spaces in a circle */}
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />

          {/* Draw board spaces */}
          {board.map((space, index) => {
            const angle = (index / board.length) * Math.PI * 2 - Math.PI / 2;
            const x = 200 + Math.cos(angle) * 150;
            const y = 200 + Math.sin(angle) * 150;
            const colorClass = getSpaceColor(space.type);

            return (
              <g key={space.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  className={`${colorClass} transition-all`}
                  opacity="0.8"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-xs font-bold text-white pointer-events-none"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

          {/* Draw team tokens */}
          {teams.map((team) => {
            const pos = getTokenPosition(team.position, 150);
            const isActive = teams[currentTeamIndex]?.id === team.id;

            return (
              <g key={team.id}>
                <circle
                  cx={200 + pos.x}
                  cy={200 + pos.y}
                  r="18"
                  fill={
                    team.id === teams[0]?.id
                      ? '#dc2626'
                      : team.id === teams[1]?.id
                        ? '#2563eb'
                        : team.id === teams[2]?.id
                          ? '#16a34a'
                          : team.id === teams[3]?.id
                            ? '#ea580c'
                            : team.id === teams[4]?.id
                              ? '#7c3aed'
                              : '#f97316'
                  }
                  stroke={isActive ? '#fbbf24' : 'white'}
                  strokeWidth={isActive ? '4' : '2'}
                  className={isActive ? 'animate-pulse-glow' : ''}
                />
                <text
                  x={200 + pos.x}
                  y={200 + pos.y}
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-xs font-bold text-white pointer-events-none"
                >
                  {team.name.charAt(0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span>Move</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
          <span>Talk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Create</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-500 rounded"></div>
          <span>Wildcard</span>
        </div>
      </div>
    </div>
  );
}
