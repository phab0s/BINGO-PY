import React, { useState } from 'react';
import { BingoCard } from './BingoCard';
import type { CardData } from '../types';

interface PrintLayoutProps {
  cards: CardData[];
  babyName: string;
}

export const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(({ cards, babyName }, ref) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (cards.length === 0) return null;

  return (
    <div ref={ref} className="print-container">
      {/* Navegación de cartones */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <button
          onClick={prevCard}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          disabled={cards.length <= 1}
        >
          ← Anterior
        </button>
        
        <div className="text-center">
          <span className="text-lg font-semibold text-gray-700">
            Cartón {currentCardIndex + 1} de {cards.length}
          </span>
        </div>
        
        <button
          onClick={nextCard}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          disabled={cards.length <= 1}
        >
          Siguiente →
        </button>
      </div>

      {/* Cartón actual - Vista en pantalla */}
      <div className="flex justify-center print:hidden">
        <div className="bingo-card-container max-w-2xl w-full">
          <BingoCard 
            cardData={cards[currentCardIndex]} 
            cardIndex={currentCardIndex} 
            babyName={babyName} 
          />
        </div>
      </div>

      {/* Para impresión: mostrar todos los cartones */}
      <div className="hidden print:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((cardData, index) => (
            <div key={index} className={`bingo-card-container ${index % 2 !== 0 ? 'page-break' : ''}`}>
              <BingoCard cardData={cardData} cardIndex={index} babyName={babyName} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

PrintLayout.displayName = 'PrintLayout';
