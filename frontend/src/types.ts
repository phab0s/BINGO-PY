import type React from 'react';

export interface BingoItem {
  id: number;
  name: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  imageUrl?: string;
}

export type CardData = {
  B: BingoItem[];
  I: BingoItem[];
  N: BingoItem[];
  G: BingoItem[];
  O: BingoItem[];
};

// --- Tipos para la comunicación con el Backend ---

/**
 * Representa un objeto que ya ha sido llamado por la balotera del backend.
 */
export interface CalledBingoItem {
  letra: 'B' | 'I' | 'N' | 'G' | 'O';
  objeto: BingoItem;
}

/**
 * Representa la respuesta del endpoint /api/game/next
 */
export interface NextItemResponse {
  llamado: CalledBingoItem;
  siguiente_letra: string;
}

/**
 * Representa el estado completo del juego desde el backend.
 */
export interface GameState {
  llamados: CalledBingoItem[];
  siguiente_letra: string;
  disponibles_por_columna: {
    [key in 'B' | 'I' | 'N' | 'G' | 'O']?: BingoItem[];
  };
}