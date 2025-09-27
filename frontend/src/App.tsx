import React, { useState, useCallback, useRef } from 'react';
import { Controls } from './components/Controls';
import { PrintLayout } from './components/PrintLayout';
import { ModeratorView } from './components/ModeratorView';
import { LoadOptionsModal } from './components/LoadOptionsModal';
import { BINGO_GROUPS } from './constants';
import type { CardData, CalledBingoItem } from './types';

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

  // Estados para el modal de carga
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const printLayoutRef = useRef<HTMLDivElement>(null);

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
  }, [isGameActive]);

  const handleGenerateAutoCards = useCallback((cardCount: number) => {
    if (cardCount <= 0) {
      setGeneratedCards([]);
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

    // Guardar el archivo y mostrar el modal de opciones
    setPendingFile(file);
    setShowLoadModal(true);
    event.target.value = ''; // Resetear el input para poder cargar el mismo archivo de nuevo
  };

  const processFileLoad = (file: File, loadCards: boolean) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("El archivo no es válido.");
        const sessionData = JSON.parse(text);
        
        if (sessionData.babyName !== undefined) {
          setBabyName(sessionData.babyName);
          
          if (loadCards && sessionData.cards && Array.isArray(sessionData.cards)) {
            // Cargar cartones exactos del archivo
            setGeneratedCards(sessionData.cards);
            resetGameState(false);
            alert(`¡Sesión completa cargada! Nombre: "${sessionData.babyName}" y ${sessionData.cards.length} cartones originales.`);
          } else if (sessionData.cards && Array.isArray(sessionData.cards)) {
            // Solo datos básicos: generar cartones frescos con la misma cantidad
            const cardCount = sessionData.cards.length;
            const newCards: CardData[] = Array.from({ length: cardCount }, () => ({
              B: shuffleArray([...BINGO_GROUPS.B]).slice(0, 5),
              I: shuffleArray([...BINGO_GROUPS.I]).slice(0, 5),
              N: shuffleArray([...BINGO_GROUPS.N]).slice(0, 4),
              G: shuffleArray([...BINGO_GROUPS.G]).slice(0, 5),
              O: shuffleArray([...BINGO_GROUPS.O]).slice(0, 5),
            }));
            setGeneratedCards(newCards);
            resetGameState(false);
            alert(`¡Datos cargados! Nombre: "${sessionData.babyName}" y ${cardCount} cartones frescos generados. ¡Listo para jugar!`);
          } else {
            setGeneratedCards([]);
            resetGameState(false);
            alert(`¡Datos cargados! Nombre: "${sessionData.babyName}". Genera cartones para continuar.`);
          }
        } else {
          throw new Error("El formato del archivo de sesión no es correcto.");
        }
      } catch (err) {
        console.error("Error al cargar o procesar el archivo de sesión:", err);
        alert("No se pudo cargar el archivo. Asegúrate de que sea un archivo de sesión válido.");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDataOnly = () => {
    if (pendingFile) {
      processFileLoad(pendingFile, false);
    }
    setShowLoadModal(false);
    setPendingFile(null);
  };

  const handleLoadDataAndCards = () => {
    if (pendingFile) {
      processFileLoad(pendingFile, true);
    }
    setShowLoadModal(false);
    setPendingFile(null);
  };

  const handleCloseModal = () => {
    setShowLoadModal(false);
    setPendingFile(null);
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
        />

        {isGameActive && (
          <ModeratorView 
            currentItem={currentItem} 
            calledItems={calledItems} 
            nextLetter={nextLetter}
          />
        )}

        {generatedCards.length > 0 && <PrintLayout ref={printLayoutRef} cards={generatedCards} babyName={babyName} />}
        
        {/* Modal de opciones de carga */}
        <LoadOptionsModal
          isOpen={showLoadModal}
          onClose={handleCloseModal}
          onLoadDataOnly={handleLoadDataOnly}
          onLoadDataAndCards={handleLoadDataAndCards}
          fileName={pendingFile?.name}
        />
      </main>
    </div>
  );
};

export default App;