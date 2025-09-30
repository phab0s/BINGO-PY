import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Controls } from './components/Controls';
import { PrintLayout } from './components/PrintLayout';
import { ModeratorView } from './components/ModeratorView';
import { LoadOptionsModal } from './components/LoadOptionsModal';
import { BingoPopup } from './components/BingoPopup';
import { BINGO_GROUPS } from './constants';
import { getCompletedCards } from './utils/bingoChecker';
import type { CardData, CalledBingoItem, VictoryMode } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.origin);

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const App: React.FC = () => {
  const [generatedCards, setGeneratedCards] = useState<CardData[]>([]);
  const [babyName, setBabyName] = useState<string>('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [isGameActive, setIsGameActive] = useState(false);
  const [calledItems, setCalledItems] = useState<CalledBingoItem[]>([]);
  const [currentItem, setCurrentItem] = useState<CalledBingoItem | null>(null);
  const [nextLetter, setNextLetter] = useState<string | null>(null);
  const [canDraw, setCanDraw] = useState(true);
  
  // Estado para modalidad de victoria
  const [victoryMode, setVictoryMode] = useState<VictoryMode>('full_card');

  // Estados para el modal de carga
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingSessionData, setPendingSessionData] = useState<any>(null);
  
  // Estado para controlar si se muestran los cartones en pantalla
  const [showCardsOnScreen, setShowCardsOnScreen] = useState(true);

  // Estados para el popup de BINGO
  const [showBingoPopup, setShowBingoPopup] = useState(false);
  const [winningCardNumber, setWinningCardNumber] = useState<number>(0);
  const [completedCards, setCompletedCards] = useState<number[]>([]);

  const printLayoutRef = useRef<HTMLDivElement>(null);

  // Efecto para detectar cartones completos
  useEffect(() => {
    if (isGameActive && generatedCards.length > 0 && calledItems.length > 0) {
      const newlyCompletedCards = getCompletedCards(generatedCards, calledItems, victoryMode);
      
      // Encontrar cartones que se completaron recientemente
      const newWinners = newlyCompletedCards.filter(cardNum => 
        !completedCards.includes(cardNum)
      );
      
      if (newWinners.length > 0) {
        // Mostrar popup para el primer cartón que se complete
        setWinningCardNumber(newWinners[0]);
        setShowBingoPopup(true);
        setCompletedCards(prev => [...prev, ...newWinners]);
      }
    }
  }, [calledItems, generatedCards, isGameActive, completedCards, victoryMode]);

  const handleCloseBingoPopup = () => {
    setShowBingoPopup(false);
  };

  const resetGameState = useCallback(async (notifyBackend: boolean) => {
    if (notifyBackend && isGameActive) {
      try {
        await fetch(`${API_BASE_URL}/api/game/reset`, { method: 'POST' });
      } catch (error) {
        console.error("No se pudo reiniciar el juego en el backend:", error);
      }
    }
    setIsGameActive(false);
    setCalledItems([]);
    setCurrentItem(null);
    setNextLetter(null);
    setCanDraw(true);
    setCompletedCards([]);
    setShowBingoPopup(false);
  }, [isGameActive]);

  const handleGenerateAutoCards = useCallback((cardCount: number) => {
    if (cardCount <= 0) {
      setGeneratedCards([]);
      setShowCardsOnScreen(true);
      resetGameState(false);
      return;
    }
    if (cardCount > 100) {
      alert("El número máximo de cartones es 100.");
      return;
    }

    const newCards: CardData[] = Array.from({ length: cardCount }, () => ({
      B: shuffleArray([...BINGO_GROUPS.B]).slice(0, 5),
      I: shuffleArray([...BINGO_GROUPS.I]).slice(0, 5),
      N: shuffleArray([...BINGO_GROUPS.N]).slice(0, 4),
      G: shuffleArray([...BINGO_GROUPS.G]).slice(0, 5),
      O: shuffleArray([...BINGO_GROUPS.O]).slice(0, 5),
    }));
    setGeneratedCards(newCards);
    setShowCardsOnScreen(true); // Mostrar cartones generados
    resetGameState(false);
  }, [resetGameState]);

  const handleStartGame = async () => {
    if (generatedCards.length === 0) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: generatedCards }),
      });
      if (!response.ok) throw new Error('No se pudo iniciar el juego en el servidor.');
      const stateResponse = await fetch(`${API_BASE_URL}/api/game/state`);
      if (!stateResponse.ok) throw new Error('No se pudo obtener el estado inicial del juego.');
      const initialState = await stateResponse.json();
      setNextLetter(initialState.siguiente_letra);
      setIsGameActive(true);
      setCalledItems([]);
      setCurrentItem(null);
      setCanDraw(true);
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
      alert("No se pudo iniciar el juego. Asegúrate de que el servidor de Python (backend) esté en ejecución.");
    }
  };

  const handleDrawItem = async () => {
    if (!canDraw) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/game/next`);
      if (!response.ok) {
        if (response.status === 404) {
          setCanDraw(false);
          alert("¡Fin del juego! No quedan más objetos en la balotera.");
        }
        throw new Error('Error al llamar el siguiente objeto.');
      }
      const data = await response.json();
      setCurrentItem(data.llamado);
      setCalledItems(prev => [...prev, data.llamado]);
      setNextLetter(data.siguiente_letra);
    } catch (error) {
      console.error("Error al llamar objeto:", error);
    }
  };

  const handleSaveSession = () => {
    if (generatedCards.length === 0) {
      alert("No hay cartones generados para guardar.");
      return;
    }
    const sessionData = {
      babyName: babyName,
      cards: generatedCards,
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bingo_sesion_${babyName || 'juego'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("El archivo no es válido.");
        const sessionData = JSON.parse(text);
        
        if (sessionData.babyName !== undefined && sessionData.cards && Array.isArray(sessionData.cards)) {
          // Guardar los datos y mostrar el modal de opciones
          setPendingFile(file);
          setPendingSessionData(sessionData);
          setShowLoadModal(true);
        } else {
          throw new Error("El formato del archivo de sesión no es correcto.");
        }
      } catch (err) {
        console.error("Error al cargar o procesar el archivo de sesión:", err);
        alert("No se pudo cargar el archivo. Asegúrate de que sea un archivo de sesión válido.");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Resetear el input para poder cargar el mismo archivo de nuevo
  };

  const handleLoadDataOnly = () => {
    if (pendingSessionData) {
      // Cargar datos sin mostrar cartones en pantalla (interfaz ligera)
      setBabyName(pendingSessionData.babyName);
      setGeneratedCards(pendingSessionData.cards);
      setShowCardsOnScreen(false); // NO mostrar cartones en pantalla
      resetGameState(false);
      alert(`¡Datos cargados! Nombre: "${pendingSessionData.babyName}". ${pendingSessionData.cards.length} cartones listos para el juego (sin mostrar en pantalla).`);
    }
    setShowLoadModal(false);
    setPendingFile(null);
    setPendingSessionData(null);
  };

  const handleLoadDataAndCards = () => {
    if (pendingSessionData) {
      // Cargar datos y mostrar cartones en pantalla uno a la vez
      setBabyName(pendingSessionData.babyName);
      setGeneratedCards(pendingSessionData.cards);
      setShowCardsOnScreen(true); // SÍ mostrar cartones en pantalla
      resetGameState(false);
      alert(`¡Sesión completa cargada! Nombre: "${pendingSessionData.babyName}" y ${pendingSessionData.cards.length} cartones mostrados uno a la vez en pantalla.`);
    }
    setShowLoadModal(false);
    setPendingFile(null);
    setPendingSessionData(null);
  };

  const handleCloseModal = () => {
    setShowLoadModal(false);
    setPendingFile(null);
    setPendingSessionData(null);
  };

  const handleServerPdfDownload = async () => {
    if (generatedCards.length === 0) {
      alert("No hay cartones para descargar. Por favor, genera cartones primero.");
      return;
    }
    setIsDownloadingPdf(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: generatedCards, babyName: babyName }),
      });
      if (!response.ok) throw new Error(`Error del servidor: ${response.statusText}`);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("No se pudo generar el PDF. Asegúrate de que el servidor de Python (backend) esté en ejecución.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDF8FD] text-gray-800 p-2 sm:p-4 lg:p-8">
      <main className="container mx-auto max-w-7xl">
        <header className="text-center mb-4 sm:mb-6 lg:mb-8 print:hidden">
          <h1 className="font-pacifico text-3xl sm:text-4xl lg:text-5xl text-[#E59BB4]">Baby Shower</h1>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-wide sm:tracking-[0.5rem] lg:tracking-[1rem] text-[#8A8BC3] mt-1 sm:mt-2">BINGO</h2>
        </header>

        <Controls
          onGenerateAuto={handleGenerateAutoCards}
          babyName={babyName}
          onBabyNameChange={setBabyName}
          onDownloadPdf={handleServerPdfDownload}
          isDownloadingPdf={isDownloadingPdf}
          hasCards={generatedCards.length > 0}
          isGameStarted={isGameActive}
          onStartGame={handleStartGame}
          onDrawItem={handleDrawItem}
          canDrawItems={canDraw}
          onResetGame={() => resetGameState(true)}
          onSaveSession={handleSaveSession}
          onLoadSession={handleLoadSession}
          victoryMode={victoryMode}
          onVictoryModeChange={setVictoryMode}
        />

        {isGameActive && (
          <ModeratorView 
            currentItem={currentItem} 
            calledItems={calledItems} 
            nextLetter={nextLetter}
          />
        )}

        {/* Indicador de ganador visible en pantalla */}
        {showBingoPopup && (
          <div className="fixed top-4 left-4 right-4 z-[9998] animate-modal-slide-up">
            <div className="bg-gradient-to-r from-[#4DB6AC] to-[#8A8BC3] text-white p-4 rounded-lg shadow-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl animate-celebration-pulse">🎉</span>
                <span className="font-bold text-lg">
                  ¡Cartón {winningCardNumber} ganó!
                </span>
                <span className="text-2xl animate-celebration-pulse">🎉</span>
              </div>
            </div>
          </div>
        )}

        {generatedCards.length > 0 && showCardsOnScreen && <PrintLayout ref={printLayoutRef} cards={generatedCards} babyName={babyName} />}
        
        {/* Modal de opciones de carga */}
        <LoadOptionsModal
          isOpen={showLoadModal}
          onClose={handleCloseModal}
          onLoadDataOnly={handleLoadDataOnly}
          onLoadDataAndCards={handleLoadDataAndCards}
          fileName={pendingFile?.name}
        />

        {/* Popup de BINGO */}
        <BingoPopup
          isOpen={showBingoPopup}
          onClose={handleCloseBingoPopup}
          cardNumber={winningCardNumber}
        />
      </main>
    </div>
  );
};

export default App;