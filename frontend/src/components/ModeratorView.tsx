import React, { useMemo } from 'react';
import type { CalledBingoItem } from '../types';

interface AudioPlayer {
  replayAudio: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  volume: number;
  isPlaying: boolean;
}

interface ModeratorViewProps {
  currentItem: CalledBingoItem | null;
  calledItems: CalledBingoItem[];
  nextLetter: string | null;
  audioPlayer: AudioPlayer;
}

const BINGO_LETTERS: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];

export const ModeratorView: React.FC<ModeratorViewProps> = ({ currentItem, calledItems, nextLetter, audioPlayer }) => {

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
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/70 rounded-xl shadow-lg print:hidden">
      {/* Controles de Audio */}
      <div className="mb-4 flex flex-wrap items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <button
          onClick={audioPlayer.replayAudio}
          disabled={!currentItem || audioPlayer.isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Repetir Audio
        </button>

        <button
          onClick={audioPlayer.toggleMute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            audioPlayer.isMuted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {audioPlayer.isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
          {audioPlayer.isMuted ? 'Silenciado' : 'Audio'}
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioPlayer.volume}
            onChange={(e) => audioPlayer.setVolume(parseFloat(e.target.value))}
            disabled={audioPlayer.isMuted}
            className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
          <span className="text-sm font-medium text-purple-700 min-w-[3ch]">
            {Math.round(audioPlayer.volume * 100)}%
          </span>
        </div>

        {audioPlayer.isPlaying && (
          <div className="flex items-center gap-2 text-purple-600 animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span className="text-sm font-medium">Reproduciendo...</span>
          </div>
        )}
      </div>

      {/* Panel Superior: Último llamado y Siguiente Letra */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-6 sm:mb-8">
        <div className="text-center">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Último Objeto Llamado:</h4>
          {currentItem ? (
            <div className="inline-flex flex-col items-center justify-center p-3 sm:p-4 bg-purple-100 border-4 border-dashed border-purple-300 rounded-lg shadow-inner min-h-[180px] sm:min-h-[220px] w-full max-w-[280px] sm:max-w-none sm:min-w-[220px]">
              <span className="text-4xl sm:text-7xl font-bold text-purple-500">{currentItem.letra}</span>
              <img 
                src={currentItem.objeto.imageUrl} 
                alt={currentItem.objeto.name} 
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain my-2"
              />
              <span className="text-lg sm:text-3xl font-bold text-purple-800 text-center px-2">{currentItem.objeto.name}</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gray-100 border-4 border-dashed border-gray-300 rounded-lg shadow-inner min-h-[180px] sm:min-h-[220px] w-full max-w-[280px] sm:max-w-none sm:min-w-[220px]">
              <span className="text-lg sm:text-2xl text-gray-500 text-center px-2">Presiona "Llamar Objeto"</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Siguiente Letra:</h4>
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-pink-100 border-4 border-dashed border-pink-300 rounded-full shadow-inner">
            <span className="font-bold text-4xl sm:text-6xl text-pink-500">{nextLetter || '-'}</span>
          </div>
        </div>
      </div>

      {/* Panel Inferior: Historial en formato BINGO */}
      <div>
        <h3 className="font-pacifico text-2xl sm:text-3xl text-center text-[#8A8BC3] mb-4">Historial de Objetos</h3>
        <div className="grid grid-cols-5 gap-1 sm:gap-2 lg:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg overflow-x-auto">
          {BINGO_LETTERS.map(letter => (
            <div key={letter} className="text-center min-w-0">
              {/* Cabecera de la columna */}
              <h4 className="font-bold text-2xl sm:text-3xl lg:text-5xl text-purple-400 mb-2 sm:mb-3">{letter}</h4>
              {/* Contenedor de los objetos de la columna */}
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                {calledItemsByLetter[letter].length > 0 ? (
                  calledItemsByLetter[letter].map(item => (
                    <div key={item.objeto.id} className="flex flex-col items-center p-1 sm:p-1.5 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
                      <img 
                        src={item.objeto.imageUrl} 
                        alt={item.objeto.name} 
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain rounded-md"
                      />
                      <span className="mt-1 text-xs sm:text-sm font-semibold text-gray-600 text-center leading-tight">{item.objeto.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-1 sm:p-1.5 rounded-lg w-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-200/50 rounded-md mx-auto"></div>
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
