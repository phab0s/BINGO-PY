import React from 'react';

interface LoadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadDataOnly: () => void;
  onLoadDataAndCards: () => void;
  fileName?: string;
}

export const LoadOptionsModal: React.FC<LoadOptionsModalProps> = ({
  isOpen,
  onClose,
  onLoadDataOnly,
  onLoadDataAndCards,
  fileName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            📂 Opciones de Carga
          </h3>
          <p className="text-gray-600 text-sm">
            {fileName && `Archivo: ${fileName}`}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Elige qué deseas cargar del archivo JSON
          </p>
        </div>

        <div className="space-y-3">
          {/* Opción 1: Solo datos */}
          <button
            onClick={onLoadDataOnly}
            className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-700">
                  Solo datos originales
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cargar nombre y cartones del archivo para el juego, sin mostrarlos en pantalla.
                  <span className="block text-green-600 font-medium">✅ Recomendado - Solo para jugar</span>
                </p>
              </div>
            </div>
          </button>

          {/* Opción 2: Datos y cartones */}
          <button
            onClick={onLoadDataAndCards}
            className="w-full p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">📋</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-700">
                  Datos y mostrar cartones
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Cargar todo y mostrar los cartones uno a la vez en pantalla con navegación.
                  <span className="block text-orange-600 font-medium">📋 Para revisar cartones antes del juego</span>
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Botón cancelar */}
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ✖️ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
