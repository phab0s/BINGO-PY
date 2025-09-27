import React, { useState, useRef } from 'react';

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