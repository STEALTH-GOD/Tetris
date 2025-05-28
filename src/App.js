import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  User,
  Lock,
  Mail,
  Play,
  Pause,
  RotateCw,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

// Tetris pieces definitions
const PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-400" },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-400",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-purple-400",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-green-400",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-red-400",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-blue-400",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "bg-orange-400",
  },
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Game logic utilities
const createEmptyBoard = () =>
  Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));

const getRandomPiece = () => {
  const pieces = Object.keys(PIECES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    type: randomPiece,
    shape: PIECES[randomPiece].shape,
    color: PIECES[randomPiece].color,
    x:
      Math.floor(BOARD_WIDTH / 2) -
      Math.floor(PIECES[randomPiece].shape[0].length / 2),
    y: 0,
  };
};

const rotatePiece = (piece) => {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map((row) => row[i]).reverse()
  );
  return { ...piece, shape: rotated };
};

const isValidMove = (board, piece, newX, newY, newShape = piece.shape) => {
  for (let y = 0; y < newShape.length; y++) {
    for (let x = 0; x < newShape[y].length; x++) {
      if (newShape[y][x]) {
        const boardX = newX + x;
        const boardY = newY + y;

        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePiece = (board, piece) => {
  const newBoard = board.map((row) => [...row]);
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }
  return newBoard;
};

const clearLines = (board) => {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { board: newBoard, linesCleared };
};

// Authentication component
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("tetrisUsers") || "[]");
    setUsers(savedUsers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const user = users.find(
        (u) =>
          u.username === formData.username && u.password === formData.password
      );
      if (user) {
        onLogin(user);
      } else {
        alert("Invalid credentials!");
      }
    } else {
      if (users.find((u) => u.username === formData.username)) {
        alert("Username already exists!");
        return;
      }

      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        highScore: 0,
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("tetrisUsers", JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TETRIS</h1>
          <p className="text-blue-200">Classic block puzzle game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter username"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: "", email: "", password: "" });
            }}
            className="text-blue-300 hover:text-white transition-colors"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Game component
const GameScreen = ({ user, onLogout }) => {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece);
  const [nextPiece, setNextPiece] = useState(getRandomPiece);
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
        // Piece has landed
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

          // Update high score
          if (score > user.highScore) {
            const users = JSON.parse(
              localStorage.getItem("tetrisUsers") || "[]"
            );
            const updatedUsers = users.map((u) =>
              u.id === user.id ? { ...u, highScore: score } : u
            );
            localStorage.setItem("tetrisUsers", JSON.stringify(updatedUsers));
            user.highScore = score;
          }
        }

        return newPiece;
      }
    });
  }, [
    board,
    gameOver,
    isPaused,
    isPlaying,
    nextPiece,
    level,
    lines,
    score,
    user,
  ]);

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
      if (
        isValidMove(board, prevPiece, prevPiece.x, prevPiece.y, rotated.shape)
      ) {
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

  // Keyboard controls
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

  // Render the game board
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    // Add current piece to display board
    if (currentPiece && !gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-600 ${
              cell ? PIECES[cell]?.color || "bg-gray-400" : "bg-gray-900"
            }`}
          />
        ))}
      </div>
    ));
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;

    return nextPiece.shape.map((row, y) => (
      <div key={y} className="flex justify-center">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-4 h-4 border border-gray-600 ${
              cell ? nextPiece.color : "bg-transparent border-transparent"
            }`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold">TETRIS</h1>
            <p>Welcome, {user.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Game Board */}
          <div className="bg-black/50 p-4 rounded-lg border-2 border-purple-500">
            <div className="inline-block">{renderBoard()}</div>
          </div>

          {/* Game Info */}
          <div className="space-y-4">
            {/* Score Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white min-w-48">
              <h3 className="text-xl font-bold mb-4">Game Stats</h3>
              <div className="space-y-2">
                <div>
                  Score:{" "}
                  <span className="font-bold text-yellow-300">{score}</span>
                </div>
                <div>
                  Level:{" "}
                  <span className="font-bold text-green-300">{level}</span>
                </div>
                <div>
                  Lines:{" "}
                  <span className="font-bold text-blue-300">{lines}</span>
                </div>
                <div>
                  High Score:{" "}
                  <span className="font-bold text-purple-300">
                    {user.highScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Piece */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Next Piece</h3>
              <div className="bg-gray-900 p-2 rounded">{renderNextPiece()}</div>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Controls</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Move Left</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  <span>Move Right</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-4 h-4" />
                  <span>Soft Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate (↑/Space)</span>
                </div>
                <div className="col-span-2 text-xs text-gray-300 mt-2">
                  <div>Enter: Hard Drop</div>
                  <div>P: Pause/Resume</div>
                </div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-2">
              {!isPlaying ? (
                <button
                  onClick={startGame}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  {gameOver ? "Play Again" : "Start Game"}
                </button>
              ) : (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden grid grid-cols-3 gap-2">
              <button
                onClick={() => movePiece(-1, 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                disabled={!isPlaying || isPaused || gameOver}
              >
                <ArrowLeft className="w-6 h-6 mx-auto" />
              </button>
              <button
                onClick={rotatePieceHandler}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg"
                disabled={!isPlaying || isPaused || gameOver}
              >
                <RotateCw className="w-6 h-6 mx-auto" />
              </button>
              <button
                onClick={() => movePiece(1, 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                disabled={!isPlaying || isPaused || gameOver}
              >
                <ArrowRight className="w-6 h-6 mx-auto" />
              </button>
              <button
                onClick={() => movePiece(0, 1)}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
                disabled={!isPlaying || isPaused || gameOver}
              >
                <ArrowDown className="w-6 h-6 mx-auto" />
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
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-2">Final Score: {score}</p>
              <p className="text-lg mb-6">Level: {level}</p>
              {score > user.highScore && (
                <p className="text-yellow-300 font-bold mb-4">
                  New High Score! 🎉
                </p>
              )}
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && isPlaying && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Paused</h2>
              <p className="mb-6">Press P or click Resume to continue</p>
              <button
                onClick={() => setIsPaused(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold"
              >
                Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const TetrisApp = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentTetrisUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("currentTetrisUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentTetrisUser");
  };

  return (
    <div className="font-sans">
      {user ? (
        <GameScreen user={user} onLogout={handleLogout} />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </div>
  );
};

export default TetrisApp;
