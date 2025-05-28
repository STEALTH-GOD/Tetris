// filepath: tetris-game/src/utils/gameLogic.js

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Create an empty game board
export const createEmptyBoard = () => 
  Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));

// Get a random Tetris piece
export const getRandomPiece = (PIECES) => {
  const pieces = Object.keys(PIECES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    type: randomPiece,
    shape: PIECES[randomPiece].shape,
    color: PIECES[randomPiece].color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[randomPiece].shape[0].length / 2),
    y: 0,
  };
};

// Rotate a Tetris piece
export const rotatePiece = (piece) => {
  const rotated = piece.shape[0].map((_, i) =>
    piece.shape.map((row) => row[i]).reverse()
  );
  return { ...piece, shape: rotated };
};

// Check if a move is valid
export const isValidMove = (board, piece, newX, newY, newShape = piece.shape) => {
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

// Place a piece on the board
export const placePiece = (board, piece) => {
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

// Clear completed lines from the board
export const clearLines = (board) => {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  return { board: newBoard, linesCleared };
};