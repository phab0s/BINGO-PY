import React, { useState, useRef } from 'react';
import { VICTORY_MODES } from '../constants';
import { VictoryMode } from '../types';

interface ControlsProps {
  onGenerateAuto: (count: number) => void;
  babyName: string;
  onBabyNameChange: (name: string) => void;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  hasCards: boolean;
  isGameStarted: boolean;
  onStartGame: () => void;
  onDrawItem: () => void;
  canDrawItems: boolean;
  onResetGame: () => void;
  // Props para guardar y cargar sesión
  onSaveSession: () => void;
  onLoadSession: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Props para modalidad de victoria
  victoryMode: VictoryMode;
  onVictoryModeChange: (mode: VictoryMode) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onGenerateAuto,
  babyName,
  onBabyNameChange,
  onDownloadPdf,
  isDownloadingPdf,
  hasCards,
  isGameStarted,
  onStartGame,
  onDrawItem,
  canDrawItems,
  onResetGame,
  onSaveSession,
  onLoadSession,
  victoryMode,
  onVictoryModeChange,
}) => {
  const [cardCount, setCardCount] = useState<number | string>(4);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 sm:p-6 bg-white/70 rounded-xl shadow-lg mb-6 sm:mb-8 print:hidden">
      {/* --- Configuración en móvil: Stack vertical --- */}
      <div className="space-y-4 mb-4">
        {/* Inputs de configuración */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="cardCount" className="font-semibold text-sm sm:text-lg text-gray-700 whitespace-nowrap">
              Cartones:
            </label>
            <input
              type="number"
              id="cardCount"
              min="1"
              max="100"
              value={cardCount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setCardCount('');
                } else {
                  const numValue = parseInt(value, 10);
                  if (!isNaN(numValue)) {
                    if (numValue > 100) setCardCount(100);
                    else setCardCount(numValue);
                  }
                }
              }}
              disabled={isGameStarted}
              className="w-16 sm:w-20 p-2 border border-purple-200 rounded-md text-center text-sm sm:text-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 disabled:bg-gray-200 number-input-no-arrows"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="babyName" className="font-semibold text-sm sm:text-lg text-gray-700 whitespace-nowrap">
              Nombre:
            </label>
            <input
              type="text"
              id="babyName"
              value={babyName}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[<>:"/\\|?*]/g, '');
                onBabyNameChange(cleanValue);
              }}
              placeholder="Opcional"
              maxLength={50}
              disabled={isGameStarted}
              className="flex-1 min-w-0 p-2 border border-purple-200 rounded-md text-sm sm:text-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 disabled:bg-gray-200"
            />
          </div>
        </div>
        
        {/* Selector de modalidad de victoria - Solo visible cuando hay cartones */}
        {hasCards && (
          <div className="space-y-2 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <label className="font-semibold text-sm sm:text-lg text-purple-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Modalidad de Victoria:
              {isGameStarted && <span className="text-xs font-normal text-purple-600">(No se puede cambiar durante el juego)</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {VICTORY_MODES.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    victoryMode === mode.value
                      ? 'border-[#8A8BC3] bg-[#8A8BC3]/10 shadow-md'
                      : 'border-gray-200 hover:border-[#8A8BC3]/50 bg-white'
                  } ${isGameStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="victoryMode"
                    value={mode.value}
                    checked={victoryMode === mode.value}
                    onChange={(e) => onVictoryModeChange(e.target.value as VictoryMode)}
                    disabled={isGameStarted}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{mode.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{mode.description}</div>
                  </div>
                  {victoryMode === mode.value && (
                    <svg className="w-5 h-5 text-[#8A8BC3] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Botones de Sesión */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onLoadSession}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleLoadClick}
            disabled={isGameStarted}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-400 text-sm sm:text-base"
            title="Cargar sesión desde archivo JSON"
          >
            📂 <span className="hidden sm:inline">Cargar Sesión</span><span className="sm:hidden">Cargar</span>
          </button>
          <button
            onClick={onSaveSession}
            disabled={!hasCards || isGameStarted}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300 disabled:bg-gray-400 text-sm sm:text-base"
          >
            💾 <span className="hidden sm:inline">Guardar</span><span className="sm:hidden">Guardar</span>
          </button>
        </div>
      </div>

      <hr className="my-4 border-gray-300"/>

      {/* --- Botones de Acción del Juego --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {!isGameStarted ? (
          <>
            <button
              onClick={() => {
                const count = typeof cardCount === 'string' ? parseInt(cardCount, 10) : cardCount;
                if (isNaN(count) || count < 1) {
                  setCardCount(1);
                  onGenerateAuto(1);
                } else {
                  onGenerateAuto(count);
                }
              }}
              className="w-full px-4 py-3 bg-[#4DB6AC] text-white font-bold rounded-lg shadow-md hover:bg-[#45a59a] transition-colors duration-300 text-sm sm:text-lg"
            >
              🎲 Generar Cartones
            </button>
            {hasCards && (
              <button
                onClick={onStartGame}
                className="w-full px-4 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 text-sm sm:text-lg"
              >
                🎉 Iniciar Juego
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={onDrawItem}
              disabled={!canDrawItems}
              className="w-full px-4 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 disabled:bg-gray-400 text-sm sm:text-lg"
            >
              {canDrawItems ? '🎟️ Llamar Objeto' : '🏁 Fin del Juego'}
            </button>
            <button
              onClick={onResetGame}
              className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 text-sm sm:text-lg"
            >
              🔄 Reiniciar Juego
            </button>
          </>
        )}
        <button
          onClick={onDownloadPdf}
          disabled={!hasCards || isDownloadingPdf}
          className="w-full px-4 py-3 bg-[#E59BB4] text-white font-bold rounded-lg shadow-md hover:bg-[#d48aa3] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-lg sm:col-span-2 lg:col-span-1"
        >
          {isDownloadingPdf ? 'Generando...' : '📄 Descargar PDF'}
        </button>
      </div>
    </div>
  );
};