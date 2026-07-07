import React, { useState, useEffect } from 'react';
import ChessBoard from './ChessBoard.jsx';
import GameStatus from './GameStatus.jsx';
import {
  initializeBoard,
  isValidMove,
  getValidMoves,
  applyMove,
  isInCheck,
  isCheckmate,
  isStalemate,
  getPieceColor,
  PIECES
} from '@/utils/chessLogic.js';

const ChessGame = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [gameStatus, setGameStatus] = useState('playing');
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [kingInCheckPos, setKingInCheckPos] = useState(null);
  const [castlingRights, setCastlingRights] = useState({
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true }
  });
  
  // Check game status after each move
  useEffect(() => {
    if (isCheckmate(board, currentTurn, lastMove, castlingRights)) {
      setGameStatus('checkmate');
    } else if (isStalemate(board, currentTurn, lastMove, castlingRights)) {
      setGameStatus('stalemate');
    } else if (isInCheck(board, currentTurn)) {
      setGameStatus('check');
      // Find king position for highlighting
      const kingPiece = currentTurn === 'white' ? PIECES.WHITE_KING : PIECES.BLACK_KING;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] === kingPiece) {
            setKingInCheckPos({ row, col });
            break;
          }
        }
      }
    } else {
      setGameStatus('playing');
      setKingInCheckPos(null);
    }
  }, [board, currentTurn, lastMove, castlingRights]);
  
  const handleSquareClick = (row, col) => {
    // Game over - no more moves
    if (gameStatus === 'checkmate' || gameStatus === 'stalemate') {
      return;
    }
    
    const clickedPiece = board[row][col];
    
    // If no piece is selected
    if (!selectedSquare) {
      // Select piece if it belongs to current player
      if (clickedPiece && getPieceColor(clickedPiece) === currentTurn) {
        setSelectedSquare({ row, col });
        const moves = getValidMoves(board, row, col, lastMove, castlingRights);
        setValidMoves(moves);
      }
      return;
    }
    
    // If clicking the same square, deselect
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }
    
    // If clicking another piece of the same color, select it instead
    if (clickedPiece && getPieceColor(clickedPiece) === currentTurn) {
      setSelectedSquare({ row, col });
      const moves = getValidMoves(board, row, col, lastMove, castlingRights);
      setValidMoves(moves);
      return;
    }
    
    // Try to move the selected piece
    const isValid = isValidMove(
      board,
      selectedSquare.row,
      selectedSquare.col,
      row,
      col,
      lastMove,
      castlingRights
    );
    
    if (isValid) {
      const result = applyMove(
        board,
        selectedSquare.row,
        selectedSquare.col,
        row,
        col,
        lastMove,
        castlingRights
      );
      
      setBoard(result.board);
      
      // Update captured pieces
      if (result.capturedPiece) {
        const capturedColor = getPieceColor(result.capturedPiece);
        const capturingColor = capturedColor === 'white' ? 'black' : 'white';
        setCapturedPieces(prev => ({
          ...prev,
          [capturingColor]: [...prev[capturingColor], result.capturedPiece]
        }));
      }
      
      // Update castling rights
      const piece = board[selectedSquare.row][selectedSquare.col];
      const newCastlingRights = { ...castlingRights };
      
      // King moved
      if (piece === PIECES.WHITE_KING) {
        newCastlingRights.white = { kingSide: false, queenSide: false };
      } else if (piece === PIECES.BLACK_KING) {
        newCastlingRights.black = { kingSide: false, queenSide: false };
      }
      
      // Rook moved
      if (piece === PIECES.WHITE_ROOK) {
        if (selectedSquare.col === 0) newCastlingRights.white.queenSide = false;
        if (selectedSquare.col === 7) newCastlingRights.white.kingSide = false;
      } else if (piece === PIECES.BLACK_ROOK) {
        if (selectedSquare.col === 0) newCastlingRights.black.queenSide = false;
        if (selectedSquare.col === 7) newCastlingRights.black.kingSide = false;
      }
      
      setCastlingRights(newCastlingRights);
      
      // Update last move for en passant
      setLastMove({
        piece,
        fromRow: selectedSquare.row,
        fromCol: selectedSquare.col,
        toRow: row,
        toCol: col
      });
      
      // Switch turn
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Invalid move - deselect
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };
  
  const handleReset = () => {
    setBoard(initializeBoard());
    setSelectedSquare(null);
    setValidMoves([]);
    setCurrentTurn('white');
    setGameStatus('playing');
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    setKingInCheckPos(null);
    setCastlingRights({
      white: { kingSide: true, queenSide: true },
      black: { kingSide: true, queenSide: true }
    });
  };
  
  return (
    <div className="flex flex-col items-center py-12">
      <GameStatus
        currentTurn={currentTurn}
        gameStatus={gameStatus}
        capturedPieces={capturedPieces}
        onReset={handleReset}
      />
      
      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        kingInCheckPos={kingInCheckPos}
        onSquareClick={handleSquareClick}
      />
      
      <div className="mt-8 max-w-2xl text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Click a piece to select it, then click a highlighted square to move. 
          The game enforces all standard chess rules including castling, en passant, 
          pawn promotion, check, checkmate, and stalemate.
        </p>
      </div>
    </div>
  );
};

export default ChessGame;