import React, { useMemo } from 'react';
import type { CalledBingoItem } from '../types';

interface ModeratorViewProps {
  currentItem: CalledBingoItem | null;
  calledItems: CalledBingoItem[];
  nextLetter: string | null;
}

const BINGO_LETTERS: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];

export const ModeratorView: React.FC<ModeratorViewProps> = ({ currentItem, calledItems, nextLetter }) => {

  // Agrupar los objetos llamados por su letra
  const calledItemsByLetter = useMemo(() => {
    const groups: { [key in typeof BINGO_LETTERS[number]]: CalledBingoItem[] } = {
      B: [], I: [], N: [], G: [], O: [],
    };
    calledItems.forEach(item => {
      if (groups[item.letra]) {
        groups[item.letra].push(item);
      }
    });
    return groups;
  }, [calledItems]);

  return (
    <div className="mt-8 p-6 bg-white/70 rounded-xl shadow-lg print:hidden">
      {/* Panel Superior: Último llamado y Siguiente Letra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Último Objeto Llamado:</h4>
          {currentItem ? (
            <div className="inline-flex flex-col items-center justify-center p-4 bg-purple-100 border-4 border-dashed border-purple-300 rounded-lg shadow-inner min-h-[220px] min-w-[220px]">
              <span className="text-7xl font-bold text-purple-500">{currentItem.letra}</span>
              <img 
                src={currentItem.objeto.imageUrl} 
                alt={currentItem.objeto.name} 
                className="w-28 h-28 object-contain my-2"
              />
              <span className="text-3xl font-bold text-purple-800">{currentItem.objeto.name}</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 border-4 border-dashed border-gray-300 rounded-lg shadow-inner min-h-[220px] min-w-[220px]">
              <span className="text-2xl text-gray-500">Presiona "Llamar Objeto"</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Siguiente Letra:</h4>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 border-4 border-dashed border-pink-300 rounded-full shadow-inner">
            <span className="font-bold text-6xl text-pink-500">{nextLetter || '-'}</span>
          </div>
        </div>
      </div>

      {/* Panel Inferior: Historial en formato BINGO */}
      <div>
        <h3 className="font-pacifico text-3xl text-center text-[#8A8BC3] mb-4">Historial de Objetos</h3>
        <div className="grid grid-cols-5 gap-2 sm:gap-4 p-4 bg-gray-50 rounded-lg">
          {BINGO_LETTERS.map(letter => (
            <div key={letter} className="text-center">
              {/* Cabecera de la columna */}
              <h4 className="font-bold text-5xl text-purple-400 mb-3">{letter}</h4>
              {/* Contenedor de los objetos de la columna */}
              <div className="flex flex-col items-center gap-2">
                {calledItemsByLetter[letter].length > 0 ? (
                  calledItemsByLetter[letter].map(item => (
                    <div key={item.objeto.id} className="flex flex-col items-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
                      <img 
                        src={item.objeto.imageUrl} 
                        alt={item.objeto.name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md"
                      />
                      <span className="mt-1 text-xs sm:text-sm font-semibold text-gray-600 text-center">{item.objeto.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-1.5 rounded-lg w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200/50 rounded-md mx-auto"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
