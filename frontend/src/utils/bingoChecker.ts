import { CardData, CalledBingoItem, VictoryMode } from '../types';

export interface WinningPosition {
  row: number;
  col: number;
  letter: 'B' | 'I' | 'N' | 'G' | 'O';
  itemId: number;
}

export interface VictoryInfo {
  isComplete: boolean;
  winningPositions: WinningPosition[];
}

/**
 * Verifica si un cartón de bingo cumple con la modalidad de victoria especificada
 * @param cardData - Los datos del cartón a verificar
 * @param calledItems - Lista de objetos que han sido llamados
 * @param victoryMode - Modalidad de victoria a verificar
 * @returns true si el cartón cumple la condición de victoria, false en caso contrario
 */
export const isCardComplete = (cardData: CardData, calledItems: CalledBingoItem[], victoryMode: VictoryMode = 'full_card'): boolean => {
  // Crear un Set de los IDs de los objetos llamados para búsqueda rápida
  const calledItemIds = new Set(calledItems.map(item => item.objeto.id));
  
  switch (victoryMode) {
    case 'full_card':
      return checkFullCard(cardData, calledItemIds);
    case 'line':
      return checkLines(cardData, calledItemIds);
    case 'square':
      return checkSquares(cardData, calledItemIds);
    case 'l_shape':
      return checkLShapes(cardData, calledItemIds);
    case 'diagonal':
      return checkDiagonals(cardData, calledItemIds);
    default:
      return checkFullCard(cardData, calledItemIds);
  }
};

/**
 * Verifica si un cartón de bingo cumple con la modalidad de victoria especificada y devuelve información detallada
 * @param cardData - Los datos del cartón a verificar
 * @param calledItems - Lista de objetos que han sido llamados
 * @param victoryMode - Modalidad de victoria a verificar
 * @returns Información detallada sobre la victoria incluyendo las posiciones ganadoras
 */
export const getCardVictoryInfo = (cardData: CardData, calledItems: CalledBingoItem[], victoryMode: VictoryMode = 'full_card'): VictoryInfo => {
  // Crear un Set de los IDs de los objetos llamados para búsqueda rápida
  const calledItemIds = new Set(calledItems.map(item => item.objeto.id));
  
  switch (victoryMode) {
    case 'full_card':
      return getFullCardVictoryInfo(cardData, calledItemIds);
    case 'line':
      return getLinesVictoryInfo(cardData, calledItemIds);
    case 'square':
      return getSquaresVictoryInfo(cardData, calledItemIds);
    case 'l_shape':
      return getLShapesVictoryInfo(cardData, calledItemIds);
    case 'diagonal':
      return getDiagonalsVictoryInfo(cardData, calledItemIds);
    default:
      return getFullCardVictoryInfo(cardData, calledItemIds);
  }
};

/**
 * Verifica si el cartón está completamente lleno (modalidad original)
 */
const checkFullCard = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  for (const column of columns) {
    const columnItems = cardData[column];
    const itemsToCheck = column === 'N' ? columnItems.slice(0, 4) : columnItems;
    
    for (const item of itemsToCheck) {
      if (!calledItemIds.has(item.id)) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Verifica si hay alguna línea horizontal completa
 */
const checkLines = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  // Verificar líneas horizontales únicamente
  for (let row = 0; row < 5; row++) {
    let lineComplete = true;
    for (let col = 0; col < 5; col++) {
      const column = ['B', 'I', 'N', 'G', 'O'][col] as keyof CardData;
      const columnItems = cardData[column];
      
      // Saltar el centro para la columna N
      if (column === 'N' && row === 2) {
        continue;
      }
      
      const itemIndex = column === 'N' && row > 2 ? row - 1 : row;
      if (itemIndex < columnItems.length && !calledItemIds.has(columnItems[itemIndex].id)) {
        lineComplete = false;
        break;
      }
    }
    if (lineComplete) return true;
  }
  
  return false;
};

/**
 * Verifica si todo el borde del cartón está completo (perímetro)
 */
const checkSquares = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Verificar borde superior (fila 0)
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    
    // Para la fila 0, no hay que saltar el centro de la columna N
    const itemIndex = 0;
    if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
      return false;
    }
  }
  
  // Verificar borde inferior (fila 4)
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    
    // Para la fila 4, saltar el centro de la columna N (que está en fila 2)
    if (column === 'N') {
      // La columna N tiene 4 elementos, el último es el índice 3
      const itemIndex = 3;
      if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
        return false;
      }
    } else {
      // Para las otras columnas, la fila 4 es el índice 4
      const itemIndex = 4;
      if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
        return false;
      }
    }
  }
  
  // Verificar borde izquierdo (columna B, filas 1-3)
  const columnB = cardData.B;
  for (let row = 1; row < 4; row++) {
    if (row >= columnB.length || !calledItemIds.has(columnB[row].id)) {
      return false;
    }
  }
  
  // Verificar borde derecho (columna O, filas 1-3)
  const columnO = cardData.O;
  for (let row = 1; row < 4; row++) {
    if (row >= columnO.length || !calledItemIds.has(columnO[row].id)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Verifica si el borde izquierdo + borde inferior están completos (forma de L)
 */
const checkLShapes = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  // Verificar borde izquierdo completo (columna B, todas las filas)
  const columnB = cardData.B;
  for (let row = 0; row < columnB.length; row++) {
    if (!calledItemIds.has(columnB[row].id)) {
      return false;
    }
  }
  
  // Verificar borde inferior completo (todas las columnas, fila 4)
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    
    // Para la fila 4, saltar el centro de la columna N (que está en fila 2)
    if (column === 'N') {
      // La columna N tiene 4 elementos, el último es el índice 3
      const itemIndex = 3;
      if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
        return false;
      }
    } else {
      // Para las otras columnas, la fila 4 es el índice 4
      const itemIndex = 4;
      if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Verifica si la diagonal principal está completa (de arriba-izquierda a abajo-derecha)
 */
const checkDiagonals = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Diagonal principal (de arriba-izquierda a abajo-derecha)
  let diagonalComplete = true;
  for (let i = 0; i < 5; i++) {
    const column = columns[i];
    const columnItems = cardData[column];
    
    // Saltar el centro para la columna N
    if (column === 'N' && i === 2) {
      diagonalComplete = false;
      break;
    }
    
    const itemIndex = column === 'N' && i > 2 ? i - 1 : i;
    if (itemIndex >= columnItems.length || !calledItemIds.has(columnItems[itemIndex].id)) {
      diagonalComplete = false;
      break;
    }
  }
  
  return diagonalComplete;
};

/**
 * Verifica todos los cartones y devuelve los números de los cartones completos
 * @param cards - Array de cartones
 * @param calledItems - Lista de objetos que han sido llamados
 * @param victoryMode - Modalidad de victoria a verificar
 * @returns Array con los números de cartones completos (basado en índice + 1)
 */
export const getCompletedCards = (cards: CardData[], calledItems: CalledBingoItem[], victoryMode: VictoryMode = 'full_card'): number[] => {
  const completedCards: number[] = [];
  
  cards.forEach((card, index) => {
    if (isCardComplete(card, calledItems, victoryMode)) {
      completedCards.push(index + 1); // Los números de cartón empiezan en 1
    }
  });
  
  return completedCards;
};

// Funciones de información detallada de victoria

/**
 * Obtiene información detallada sobre la victoria de cartón completo
 */
const getFullCardVictoryInfo = (cardData: CardData, calledItemIds: Set<number>): VictoryInfo => {
  const winningPositions: WinningPosition[] = [];
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  for (const column of columns) {
    const columnItems = cardData[column];
    const itemsToCheck = column === 'N' ? columnItems.slice(0, 4) : columnItems;
    
    for (let i = 0; i < itemsToCheck.length; i++) {
      const item = itemsToCheck[i];
      if (calledItemIds.has(item.id)) {
        const row = column === 'N' && i >= 2 ? i + 1 : i; // Ajustar para el espacio libre en N
        winningPositions.push({
          row,
          col: columns.indexOf(column),
          letter: column,
          itemId: item.id
        });
      }
    }
  }
  
  const isComplete = winningPositions.length === 24; // 5+5+4+5+5 = 24 (sin el espacio libre)
  
  return { isComplete, winningPositions };
};

/**
 * Obtiene información detallada sobre la victoria de líneas horizontales
 */
const getLinesVictoryInfo = (cardData: CardData, calledItemIds: Set<number>): VictoryInfo => {
  const winningPositions: WinningPosition[] = [];
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Verificar líneas horizontales
  for (let row = 0; row < 5; row++) {
    const linePositions: WinningPosition[] = [];
    let lineComplete = true;
    
    for (let col = 0; col < 5; col++) {
      const column = columns[col];
      const columnItems = cardData[column];
      
      // Saltar el centro para la columna N
      if (column === 'N' && row === 2) {
        continue;
      }
      
      const itemIndex = column === 'N' && row > 2 ? row - 1 : row;
      if (itemIndex < columnItems.length) {
        const item = columnItems[itemIndex];
        if (calledItemIds.has(item.id)) {
          linePositions.push({
            row,
            col,
            letter: column,
            itemId: item.id
          });
        } else {
          lineComplete = false;
          break;
        }
      }
    }
    
    if (lineComplete && linePositions.length > 0) {
      winningPositions.push(...linePositions);
      return { isComplete: true, winningPositions };
    }
  }
  
  return { isComplete: false, winningPositions };
};

/**
 * Obtiene información detallada sobre la victoria de perímetro
 */
const getSquaresVictoryInfo = (cardData: CardData, calledItemIds: Set<number>): VictoryInfo => {
  const winningPositions: WinningPosition[] = [];
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Verificar borde superior (fila 0)
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    const itemIndex = 0;
    if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
      winningPositions.push({
        row: 0,
        col,
        letter: column,
        itemId: columnItems[itemIndex].id
      });
    }
  }
  
  // Verificar borde inferior (fila 4)
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    
    if (column === 'N') {
      const itemIndex = 3;
      if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
        winningPositions.push({
          row: 4,
          col,
          letter: column,
          itemId: columnItems[itemIndex].id
        });
      }
    } else {
      const itemIndex = 4;
      if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
        winningPositions.push({
          row: 4,
          col,
          letter: column,
          itemId: columnItems[itemIndex].id
        });
      }
    }
  }
  
  // Verificar borde izquierdo (columna B, filas 1-3)
  const columnB = cardData.B;
  for (let row = 1; row < 4; row++) {
    if (row < columnB.length && calledItemIds.has(columnB[row].id)) {
      winningPositions.push({
        row,
        col: 0,
        letter: 'B',
        itemId: columnB[row].id
      });
    }
  }
  
  // Verificar borde derecho (columna O, filas 1-3)
  const columnO = cardData.O;
  for (let row = 1; row < 4; row++) {
    if (row < columnO.length && calledItemIds.has(columnO[row].id)) {
      winningPositions.push({
        row,
        col: 4,
        letter: 'O',
        itemId: columnO[row].id
      });
    }
  }
  
  const isComplete = winningPositions.length >= 16; // Aproximadamente el perímetro completo
  
  return { isComplete, winningPositions };
};

/**
 * Obtiene información detallada sobre la victoria de forma L
 */
const getLShapesVictoryInfo = (cardData: CardData, calledItemIds: Set<number>): VictoryInfo => {
  const winningPositions: WinningPosition[] = [];
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Verificar borde izquierdo completo (columna B, todas las filas)
  const columnB = cardData.B;
  for (let row = 0; row < columnB.length; row++) {
    if (calledItemIds.has(columnB[row].id)) {
      winningPositions.push({
        row,
        col: 0,
        letter: 'B',
        itemId: columnB[row].id
      });
    }
  }
  
  // Verificar borde inferior completo (todas las columnas, fila 4)
  for (let col = 0; col < 5; col++) {
    const column = columns[col];
    const columnItems = cardData[column];
    
    if (column === 'N') {
      const itemIndex = 3;
      if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
        winningPositions.push({
          row: 4,
          col,
          letter: column,
          itemId: columnItems[itemIndex].id
        });
      }
    } else {
      const itemIndex = 4;
      if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
        winningPositions.push({
          row: 4,
          col,
          letter: column,
          itemId: columnItems[itemIndex].id
        });
      }
    }
  }
  
  const isComplete = winningPositions.length >= 9; // 5 (columna B) + 4 (fila inferior sin B)
  
  return { isComplete, winningPositions };
};

/**
 * Obtiene información detallada sobre la victoria de diagonal principal
 */
const getDiagonalsVictoryInfo = (cardData: CardData, calledItemIds: Set<number>): VictoryInfo => {
  const winningPositions: WinningPosition[] = [];
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  
  // Diagonal principal (de arriba-izquierda a abajo-derecha)
  for (let i = 0; i < 5; i++) {
    const column = columns[i];
    const columnItems = cardData[column];
    
    // Saltar el centro para la columna N
    if (column === 'N' && i === 2) {
      continue;
    }
    
    const itemIndex = column === 'N' && i > 2 ? i - 1 : i;
    if (itemIndex < columnItems.length && calledItemIds.has(columnItems[itemIndex].id)) {
      const row = column === 'N' && i > 2 ? i : i; // Ajustar para el espacio libre
      winningPositions.push({
        row,
        col: i,
        letter: column,
        itemId: columnItems[itemIndex].id
      });
    }
  }
  
  const isComplete = winningPositions.length >= 4; // Diagonal principal sin el centro
  
  return { isComplete, winningPositions };
};
