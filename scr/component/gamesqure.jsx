import React from 'react';

const ChessSquare = ({ row, col, piece, isSelected, isValidMove, isCheck, onClick }) => {
  const isLight = (row + col) % 2 === 0;
  
  const handleClick = () => {
    onClick(row, col);
  };
  
  return (
    <button
      onClick={handleClick}
      className={`
        chess-square
        ${isLight ? 'chess-square-light' : 'chess-square-dark'}
        ${isSelected ? 'chess-square-selected' : ''}
        ${isValidMove ? 'chess-square-valid-move' : ''}
        ${isCheck ? 'chess-square-check' : ''}
        w-20 h-20 flex items-center justify-center text-5xl
        transition-all duration-200 hover:brightness-110
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        relative
      `}
      aria-label={`Square ${String.fromCharCode(97 + col)}${8 - row}${piece ? `, ${piece}` : ''}`}
    >
      {piece && <span className="chess-piece">{piece}</span>}
      {isValidMove && !piece && (
        <div className="w-4 h-4 rounded-full bg-green-500/50" />
      )}
    </button>
  );
};

export default ChessSquare;