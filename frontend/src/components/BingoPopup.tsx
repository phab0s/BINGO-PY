import React, { useEffect } from 'react';
import { WinningCard } from './WinningCard';
import type { CardData, WinningPosition } from '../types';

interface BingoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cardNumber: number;
  winningCardData?: CardData;
  winningPositions?: WinningPosition[];
  victoryMode?: string;
  babyName?: string;
}

export const BingoPopup: React.FC<BingoPopupProps> = ({ 
  isOpen, 
  onClose, 
  cardNumber, 
  winningCardData, 
  winningPositions = [], 
  victoryMode = 'full_card',
  babyName 
}) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Forzar el foco al modal para asegurar que se muestre
      const modal = document.getElementById('bingo-modal');
      if (modal) {
        modal.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bingo-title"
    >
      <div 
        id="bingo-modal"
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl w-full modal-mobile animate-modal-slide-up my-4"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Encabezado de celebración */}
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-4 animate-celebration-pulse">🎉</div>
          <h2 id="bingo-title" className="text-3xl sm:text-4xl font-bold text-[#8A8BC3] mb-2">
            ¡BINGO!
          </h2>
          <p className="text-lg sm:text-xl text-gray-700">
            El cartón número <span className="font-bold text-[#E59BB4] text-2xl sm:text-3xl">{cardNumber}</span> es el ganador
          </p>
        </div>

        {/* Cartón ganador con casillas resaltadas */}
        {winningCardData && (
          <div className="mb-6">
            <WinningCard
              cardData={winningCardData}
              cardIndex={cardNumber - 1}
              babyName={babyName}
              winningPositions={winningPositions}
              victoryMode={victoryMode}
            />
          </div>
        )}

        {/* Botón de cierre */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-[#4DB6AC] text-white font-bold rounded-lg shadow-md hover:bg-[#45a59a] active:bg-[#3d9a8f] transition-colors duration-300 text-lg touch-manipulation min-h-[48px]"
            autoFocus
          >
            ¡Genial! 🎊
          </button>
        </div>
      </div>
    </div>
  );
};
