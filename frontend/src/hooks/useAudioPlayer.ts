import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioMap {
  [key: string]: string;
}

export const useAudioPlayer = () => {
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioPathRef = useRef<string | null>(null);

  // Cargar el mapeo de audios
  useEffect(() => {
    fetch('/audios/audio-map.json')
      .then(res => res.json())
      .then(data => {
        setAudioMap(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error cargando audio-map.json:', err);
        setIsLoading(false);
      });
  }, []);

  // Inicializar audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.pause();
      }
    };
  }, []);

  // Actualizar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playAudio = useCallback((itemId: number) => {
    if (isLoading || !audioMap[itemId] || isMuted) return;

    const audioPath = audioMap[itemId];
    currentAudioPathRef.current = audioPath;

    if (audioRef.current) {
      audioRef.current.src = audioPath;
      audioRef.current.play().catch(err => {
        console.error('Error reproduciendo audio:', err);
        setIsPlaying(false);
      });
    }
  }, [audioMap, isLoading, isMuted]);

  const replayAudio = useCallback(() => {
    if (!currentAudioPathRef.current || isMuted) return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.error('Error reproduciendo audio:', err);
        setIsPlaying(false);
      });
    }
  }, [isMuted]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playAudio,
    replayAudio,
    stopAudio,
    toggleMute,
    setVolume,
    isMuted,
    volume,
    isPlaying,
    isLoading,
    hasAudio: (itemId: number) => !!audioMap[itemId],
  };
};
