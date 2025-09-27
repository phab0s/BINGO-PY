import React from 'react';
import { BingoCard } from './BingoCard';
import type { CardData } from '../types';

interface PrintLayoutProps {
  cards: CardData[];
  babyName: string;
}

export const PrintLayout = React.forwardRef<HTMLDivElement, PrintLayoutProps>(({ cards, babyName }, ref) => {
  return (
    <div ref={ref} className="print-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((cardData, index) => (
          <div key={index} className={`bingo-card-container ${index % 2 !== 0 ? 'page-break' : ''}`}>
            <BingoCard cardData={cardData} cardIndex={index} babyName={babyName} />
          </div>
        ))}
      </div>
    </div>
  );
});

PrintLayout.displayName = 'PrintLayout';
