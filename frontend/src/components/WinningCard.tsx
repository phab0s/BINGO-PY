import React from 'react';
import type { BingoItem, CardData, WinningPosition } from '../types';
import { BINGO_LETTERS } from '../constants';

interface WinningCardProps {
  cardData: CardData;
  cardIndex: number;
  babyName?: string;
  winningPositions: WinningPosition[];
  victoryMode: string;
}

const FreeSpace: React.FC<{ babyName?: string; isWinning?: boolean }> = ({ babyName, isWinning = false }) => (
  <div className={`bingo-cell w-full h-full relative ${isWinning ? 'bg-yellow-200 border-4 border-yellow-500' : 'bg-white'}`}>
    <div className="flex-1 flex flex-col items-center justify-center p-1">
      <span className="text-center font-bold text-[#E59BB4] text-[0.65rem] sm:text-xs tracking-wider mb-1">
        BIENVENIDA
      </span>
      {babyName && (
        <span className="text-center font-pacifico text-[0.55rem] sm:text-[0.65rem] text-[#8A8BC3] leading-none">
          {babyName}
        </span>
      )}
      {isWinning && (
        <div className="absolute top-1 right-1">
          <span className="text-yellow-600 text-lg">⭐</span>
        </div>
      )}
    </div>
  </div>
);

const BingoCell: React.FC<{ 
  item: BingoItem; 
  isWinning: boolean;
  position: { row: number; col: number };
}> = ({ item, isWinning, position }) => {
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
    <div className={`bingo-cell w-full h-full relative ${
      isWinning 
        ? 'bg-yellow-200 border-4 border-yellow-500 shadow-lg' 
        : 'bg-white'
    }`}>
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
      
      {/* Indicador de victoria */}
      {isWinning && (
        <div className="absolute top-1 right-1">
          <span className="text-yellow-600 text-lg">⭐</span>
        </div>
      )}
    </div>
  );
};

export const WinningCard: React.FC<WinningCardProps> = ({ 
  cardData, 
  cardIndex, 
  babyName, 
  winningPositions,
  victoryMode 
}) => {
  // Crear un Set de posiciones ganadoras para búsqueda rápida
  const winningPositionsSet = new Set(
    winningPositions.map(pos => `${pos.row}-${pos.col}`)
  );

  // Función para verificar si una posición es ganadora
  const isWinningPosition = (row: number, col: number): boolean => {
    return winningPositionsSet.has(`${row}-${col}`);
  };

  // Función para obtener el nombre de la modalidad de victoria
  const getVictoryModeName = (mode: string): string => {
    const modeNames: { [key: string]: string } = {
      'full_card': 'Cartón Completo',
      'line': 'Línea Horizontal',
      'square': 'Perímetro',
      'l_shape': 'Forma L',
      'diagonal': 'Diagonal Principal'
    };
    return modeNames[mode] || mode;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      {/* Título del cartón ganador */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-[#8A8BC3] mb-2">
          🎉 Cartón Ganador #{cardIndex + 1} 🎉
        </h3>
        <p className="text-sm text-gray-600">
          Modalidad: <span className="font-semibold text-[#E59BB4]">{getVictoryModeName(victoryMode)}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Las casillas marcadas con ⭐ son las que completaron la victoria
        </p>
      </div>

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
              return (
                <FreeSpace 
                  key="free-space" 
                  babyName={babyName} 
                  isWinning={isWinningPosition(row, col)}
                />
              );
            }
            
            // Adjust index for N column after free space
            let itemRow = row;
            if (letter === 'N' && row > 2) {
              itemRow = row - 1; // N column has 4 items (free space in middle)
            }
            
            const item = cardData[letter]?.[itemRow];

            if (!item) {
              return (
                <div 
                  key={`empty-${index}`} 
                  className={`bingo-cell flex items-center justify-center ${
                    isWinningPosition(row, col) 
                      ? 'bg-yellow-200 border-4 border-yellow-500' 
                      : 'bg-gray-100'
                  }`}
                >
                  <span className="text-xs text-gray-400">Vacío</span>
                  {isWinningPosition(row, col) && (
                    <div className="absolute top-1 right-1">
                      <span className="text-yellow-600 text-lg">⭐</span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <BingoCell 
                key={`${item.id}-${cardIndex}`} 
                item={item} 
                isWinning={isWinningPosition(row, col)}
                position={{ row, col }}
              />
            );
          })}
        </div>
      </div>
      
      <p className="text-right text-xs text-gray-400 mt-2">Cartón #{cardIndex + 1}</p>
    </div>
  );
};
