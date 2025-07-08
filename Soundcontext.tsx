import { createContext, useContext } from "react";
import { Audio } from "expo-av";

export type SoundContextType = {
  playSound: () => Promise<void>;
  soundRef: React.RefObject<Audio.Sound | null>;
  soundPaused: boolean;
  setSoundPaused: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SoundContext = createContext<SoundContextType | null>(null);

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundContext must be used within a SoundContext.Provider");
  return context;
};
