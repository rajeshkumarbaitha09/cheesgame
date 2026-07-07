import React from 'react';
import ChessSquare from './ChessSquare.jsx';

const ChessBoard = ({ board, selectedSquare, validMoves, kingInCheckPos, onSquareClick }) => {
  const isValidMove = (row, col) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };
  
  const isCheck = (row, col) => {
    return kingInCheckPos && kingInCheckPos.row === row && kingInCheckPos.col === col;
  };
  
  return (
    <div className="chess-board">
      <div className="grid grid-cols-8 border-4 border-gray-800 shadow-2xl">
        {board.map((row, rowIndex) => (
          row.map((piece, colIndex) => (
            <ChessSquare
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={piece}
              isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              isValidMove={isValidMove(rowIndex, colIndex)}
              isCheck={isCheck(rowIndex, colIndex)}
              onClick={onSquareClick}
            />
          ))
        ))}
      </div>
      
      {/* Board coordinates */}
      <div className="flex justify-around mt-2 text-sm font-medium text-muted-foreground">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <span key={letter} className="w-20 text-center">{letter}</span>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;