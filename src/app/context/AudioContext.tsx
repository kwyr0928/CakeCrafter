'use client';

import { createContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext({
  isPlaying: false,
  playAudio: () => {},
  pauseAudio: () => {}
});

import { type ReactNode } from 'react';

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio('/audio/audio.mp3');
  }, []);

  const playAudio = () => {
    const audio = audioRef.current;
    audio.loop = true;
    if (audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error("Audio play failed:", e);
        });
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    audio.loop = true;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playAudio, pauseAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;