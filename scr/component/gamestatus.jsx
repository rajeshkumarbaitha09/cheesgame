import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const GameStatus = ({ currentTurn, gameStatus, capturedPieces, onReset }) => {
  const getStatusText = () => {
    switch (gameStatus) {
      case 'check':
        return `${currentTurn === 'white' ? 'White' : 'Black'} is in check`;
      case 'checkmate':
        return `Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins`;
      case 'stalemate':
        return 'Stalemate - Draw';
      default:
        return 'In progress';
    }
  };
  
  const getStatusColor = () => {
    switch (gameStatus) {
      case 'check':
        return 'text-orange-600';
      case 'checkmate':
        return 'text-red-600 font-bold';
      case 'stalemate':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Current turn</p>
          <p className="text-2xl font-bold">
            {currentTurn === 'white' ? '♔ White' : '♚ Black'}
          </p>
        </div>
        
        <div className="h-12 w-px bg-border" />
        
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-1">Game status</p>
          <p className={`text-xl font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>
      
      {capturedPieces && (capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
        <div className="flex gap-8 text-2xl">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Captured by White</p>
            <div className="flex gap-1">
              {capturedPieces.white.map((piece, index) => (
                <span key={index}>{piece}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Captured by Black</p>
            <div className="flex gap-1">
              {capturedPieces.black.map((piece, index) => (
                <span key={index}>{piece}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RotateCcw className="w-4 h-4" />
        New game
      </Button>
    </div>
  );
};

export default GameStatus;