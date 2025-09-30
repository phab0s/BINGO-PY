import { CardData, CalledBingoItem, VictoryMode } from '../types';

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
 * Verifica si hay alguna línea completa (horizontal, vertical o diagonal)
 */
const checkLines = (cardData: CardData, calledItemIds: Set<number>): boolean => {
  // Verificar líneas horizontales
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
  
  // Verificar líneas verticales
  const columns = ['B', 'I', 'N', 'G', 'O'] as const;
  for (const column of columns) {
    const columnItems = cardData[column];
    const itemsToCheck = column === 'N' ? columnItems.slice(0, 4) : columnItems;
    
    let lineComplete = true;
    for (const item of itemsToCheck) {
      if (!calledItemIds.has(item.id)) {
        lineComplete = false;
        break;
      }
    }
    if (lineComplete) return true;
  }
  
  // Verificar diagonales
  return checkDiagonals(cardData, calledItemIds);
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
 * Verifica si hay alguna diagonal completa
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
  if (diagonalComplete) return true;
  
  // Diagonal secundaria (de arriba-derecha a abajo-izquierda)
  diagonalComplete = true;
  for (let i = 0; i < 5; i++) {
    const column = columns[4 - i];
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
