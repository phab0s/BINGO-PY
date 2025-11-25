import React from 'react';
import type { BingoItem, CardData } from '../types';
import { BINGO_LETTERS } from '../constants';

interface BingoCardProps {
  cardData: CardData;
  cardIndex: number;
  babyName?: string;
}

const FreeSpace: React.FC<{ babyName?: string }> = ({ babyName }) => (
  <div className="bingo-cell w-full h-full bg-white relative flex items-center justify-center">
    <div className="free-space-content flex flex-col items-center justify-center p-1">
      <span className="free-space-title text-center font-bold text-[#E59BB4] text-[0.65rem] sm:text-xs tracking-wider">
        BIENVENIDA
      </span>
      {babyName && (
        <span className="free-space-name text-center font-pacifico text-[0.55rem] sm:text-[0.65rem] text-[#8A8BC3] leading-none">
          {babyName}
        </span>
      )}
    </div>
  </div>
);

const BingoCell: React.FC<{ item: BingoItem }> = ({ item }) => {
  const hasImage = item.icon || item.imageUrl;
  
  // Sistema optimizado para mostrar imágenes más grandes y completas
  const getImageSizeClass = (imageUrl?: string) => {
    if (!imageUrl) return "w-auto h-auto max-w-[95%] max-h-[90%] min-w-[75%] min-h-[75%]";
    
    // Todas las imágenes usan object-contain para evitar cortes
    // Tamaños más grandes pero manteniendo proporciones
    if (imageUrl.includes('/animalitos/')) {
      // Animalitos: agrandar más manteniendo proporción
      return "w-auto h-auto max-w-[94%] max-h-[88%] min-w-[80%] min-h-[80%]";
    } else if (imageUrl.includes('/bebe/')) {
      // Imágenes de bebé: maximizar completamente
      return "w-auto h-auto max-w-[96%] max-h-[90%] min-w-[85%] min-h-[85%]";
    } else if (imageUrl.includes('/alimentos/')) {
      // Alimentos: agrandar considerablemente
      return "w-auto h-auto max-w-[95%] max-h-[89%] min-w-[80%] min-h-[80%]";
    }
    
    return "w-auto h-auto max-w-[95%] max-h-[90%] min-w-[75%] min-h-[75%]";
  };

  const getObjectFitClass = (imageUrl?: string) => {
    // Siempre usar object-contain para evitar cortes
    return "object-contain";
  };

  return (
    <div className="bingo-cell w-full h-full bg-white relative">
      {hasImage ? (
        <>
          {/* Contenedor de imagen optimizado */}
          <div className="flex-1 flex items-center justify-center p-1 min-h-0">
            {item.icon && <item.icon className={getImageSizeClass()} />}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className={`${getImageSizeClass(item.imageUrl)} ${getObjectFitClass(item.imageUrl)}`}
                style={{
                  imageRendering: 'auto'
                }}
                onError={(e) => {
                  console.warn(`Error al cargar imagen: ${item.imageUrl}`);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          {/* Texto compacto */}
          <div className="h-8 flex items-center justify-center px-1">
            <p className="text-[0.5rem] sm:text-[0.6rem] leading-tight font-semibold text-center text-gray-600 whitespace-normal break-words">
              {item.name}
            </p>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-2">
          <p className="text-[0.6rem] sm:text-[0.7rem] leading-tight font-semibold text-center text-gray-700 line-clamp-3">
            {item.name}
          </p>
        </div>
      )}
    </div>
  );
};


export const BingoCard: React.FC<BingoCardProps> = ({ cardData, cardIndex, babyName }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
       <div className="w-full flex justify-center">
         <div className="bingo-complete-grid">
         {/* Encabezado como primera fila */}
         {BINGO_LETTERS.map((letter) => (
           <div
             key={`header-${letter}`}
             className="bingo-header-cell text-[#8A8BC3]"
           >
             {letter}
           </div>
         ))}
         
         {/* Celdas del juego */}
         {Array.from({ length: 25 }).map((_, index) => {
            const col = index % 5;
            const row = Math.floor(index / 5);
            const letter = BINGO_LETTERS[col] as keyof CardData;

            if (letter === 'N' && row === 2) {
                return <FreeSpace key="free-space" babyName={babyName} />;
            }
            
            // Adjust index for N column after free space
            let itemRow = row;
            if (letter === 'N' && row > 2) {
                itemRow = row - 1; // N column has 4 items (free space in middle)
            }
            
            const item = cardData[letter]?.[itemRow];

            if (!item) {
              return <div key={`empty-${index}`} className="bingo-cell bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">Vacío</span>
              </div>;
            }

            return <BingoCell key={`${item.id}-${cardIndex}`} item={item} />;
         })}
         </div>
       </div>
       <p className="text-right text-xs text-gray-400 mt-2">Cartón #{cardIndex + 1}</p>
    </div>
  );
};