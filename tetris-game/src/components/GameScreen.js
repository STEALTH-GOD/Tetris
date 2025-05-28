// filepath: c:\Users\samya\OneDrive\Desktop\tetris\tetris-game\src\components\GameScreen.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  RotateCw,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { createEmptyBoard, getRandomPiece, isValidMove, placePiece, clearLines, rotatePiece } from "../utils/gameLogic";
import { BOARD_WIDTH, BOARD_HEIGHT, PIECES } from "../utils/constants";

const GameScreen = ({ user, onLogout }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece());
  const [nextPiece, setNextPiece] = useState(getRandomPiece());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef();

  const dropInterval = Math.max(100, 1000 - (level - 1) * 100);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const gameLoop = useCallback(() => {
    if (gameOver || isPaused || !isPlaying) return;

    setCurrentPiece((prevPiece) => {
      const newY = prevPiece.y + 1;

      if (isValidMove(board, prevPiece, prevPiece.x, newY)) {
        return { ...prevPiece, y: newY };
      } else {
        const newBoard = placePiece(board, prevPiece);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);

        setBoard(clearedBoard);
        setLines((prev) => prev + linesCleared);
        setScore((prev) => prev + linesCleared * 100 * level + 10);
        setLevel((prev) => Math.floor((lines + linesCleared) / 10) + 1);

        const newPiece = nextPiece;
        setNextPiece(getRandomPiece());

        if (!isValidMove(clearedBoard, newPiece, newPiece.x, newPiece.y)) {
          setGameOver(true);
          setIsPlaying(false);
        }

        return newPiece;
      }
    });
  }, [board, gameOver, isPaused, isPlaying, nextPiece, level, lines]);

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, dropInterval);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameLoop, dropInterval, isPlaying, isPaused, gameOver]);

  const movePiece = (deltaX, deltaY) => {
    if (gameOver || isPaused || !isPlaying) return;

    setCurrentPiece((prevPiece) => {
      const newX = prevPiece.x + deltaX;
      const newY = prevPiece.y + deltaY;

      if (isValidMove(board, prevPiece, newX, newY)) {
        return { ...prevPiece, x: newX, y: newY };
      }
      return prevPiece;
    });
  };

  const rotatePieceHandler = () => {
    if (gameOver || isPaused || !isPlaying) return;

    setCurrentPiece((prevPiece) => {
      const rotated = rotatePiece(prevPiece);
      if (isValidMove(board, prevPiece, prevPiece.x, prevPiece.y, rotated.shape)) {
        return rotated;
      }
      return prevPiece;
    });
  };

  const hardDrop = () => {
    if (gameOver || isPaused || !isPlaying) return;

    setCurrentPiece((prevPiece) => {
      let newY = prevPiece.y;
      while (isValidMove(board, prevPiece, prevPiece.x, newY + 1)) {
        newY++;
      }
      return { ...prevPiece, y: newY };
    });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          movePiece(0, 1);
          break;
        case "ArrowUp":
        case " ":
          e.preventDefault();
          rotatePieceHandler();
          break;
        case "Enter":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
        case "P":
          e.preventDefault();
          if (isPlaying) setIsPaused(!isPaused);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, isPaused, gameOver]);

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div key={x} className={`w-6 h-6 border border-gray-600 ${cell ? PIECES[cell]?.color || "bg-gray-400" : "bg-gray-900"}`} />
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">TETRIS</h1>
            <p>Welcome, {user.username}!</p>
          </div>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="bg-black/50 p-4 rounded-lg border-2 border-purple-500">
            <div className="inline-block">{renderBoard()}</div>
          </div>
          {/* Additional UI components can be added here */}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;