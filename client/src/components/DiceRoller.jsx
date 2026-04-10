import React, { useState } from 'react';

export default function DiceRoller({ onRoll, disabled }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  const handleRoll = () => {
    if (disabled || rolling) return;

    setRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;

    // Simulate dice rolling animation
    let displayValue = 1;
    const interval = setInterval(() => {
      displayValue = Math.floor(Math.random() * 6) + 1;
      setResult(displayValue);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setResult(value);
      setRolling(false);
      onRoll(value);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl">
      <h3 className="text-xl font-bold">Dice Roller</h3>

      {/* Dice display */}
      <div className="relative w-32 h-32 perspective">
        <div
          className={`w-full h-full bg-gradient-to-br from-white to-gray-200 rounded-xl shadow-2xl flex items-center justify-center text-6xl font-bold text-gray-900 ${
            rolling ? 'animate-dice-roll' : ''
          }`}
        >
          {result || '?'}
        </div>
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={disabled || rolling}
        className={`text-lg font-bold py-4 px-8 rounded-lg transition-all transform ${
          disabled || rolling
            ? 'btn-disabled'
            : 'btn-primary animate-pulse-glow'
        }`}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>

      {result && !rolling && (
        <div className="text-center">
          <p className="text-sm text-gray-400">Moved {result} spaces!</p>
        </div>
      )}
    </div>
  );
}
