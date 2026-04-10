import React, { useState } from 'react';

export default function PromptCard({ prompt, onWildcardChoice }) {
  const [choice, setChoice] = useState(null);

  const getPromptColor = (type) => {
    const colors = {
      move: 'from-blue-600 to-blue-800',
      talk: 'from-yellow-600 to-yellow-800',
      create: 'from-green-600 to-green-800',
      wildcard: 'from-purple-600 to-purple-800',
    };
    return colors[type] || 'from-gray-600 to-gray-800';
  };

  const getPromptIcon = (type) => {
    const icons = {
      move: '🏃',
      talk: '💬',
      create: '✏️',
      wildcard: '🃏',
    };
    return icons[type] || '◆';
  };

  if (!prompt) {
    return (
      <div className="prompt-card bg-gradient-to-b from-gray-700 to-gray-800">
        <p className="text-gray-400">Waiting for next turn...</p>
      </div>
    );
  }

  if (prompt.type === 'wildcard' && prompt.options) {
    return (
      <div className="prompt-card bg-gradient-to-b from-purple-700 to-purple-900 animate-card-flip">
        <div className="text-4xl mb-4">🃏</div>
        <h3 className="text-2xl font-bold mb-6">Choose Your Adventure</h3>

        <div className="grid grid-cols-1 gap-3 w-full">
          {prompt.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                setChoice(option.type);
                onWildcardChoice(option.type);
              }}
              disabled={choice !== null}
              className={`p-4 rounded-lg font-bold transition-all text-lg ${
                choice === option.type
                  ? 'ring-2 ring-yellow-300'
                  : ''
              } ${
                option.type === 'move'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : option.type === 'talk'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {getPromptIcon(option.type)} {option.type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`prompt-card bg-gradient-to-b ${getPromptColor(
        prompt.type
      )} animate-card-flip`}
    >
      <div className="text-5xl mb-6">{getPromptIcon(prompt.type)}</div>
      <div className="text-sm font-semibold opacity-75 mb-3">
        {prompt.type.toUpperCase()}
      </div>
      <p className="text-3xl leading-relaxed font-bold">{prompt.text}</p>
    </div>
  );
}
