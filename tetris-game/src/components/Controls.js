import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw } from 'lucide-react';

const Controls = ({ movePiece, rotatePiece, hardDrop, isPlaying, isPaused, gameOver }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
      <h3 className="text-lg font-bold mb-4">Controls</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <button
          onClick={() => movePiece(-1, 0)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
          disabled={!isPlaying || isPaused || gameOver}
        >
          <ArrowLeft className="w-6 h-6 mx-auto" />
          Move Left
        </button>
        <button
          onClick={() => movePiece(1, 0)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
          disabled={!isPlaying || isPaused || gameOver}
        >
          <ArrowRight className="w-6 h-6 mx-auto" />
          Move Right
        </button>
        <button
          onClick={() => rotatePiece()}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg"
          disabled={!isPlaying || isPaused || gameOver}
        >
          <RotateCw className="w-6 h-6 mx-auto" />
          Rotate
        </button>
        <button
          onClick={hardDrop}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg col-span-2"
          disabled={!isPlaying || isPaused || gameOver}
        >
          Hard Drop
        </button>
      </div>
    </div>
  );
};

export default Controls;