import { createContext, useContext, useState, ReactNode } from 'react';

interface OutfitVariation {
  shirtColor: string;
  pantsColor: string;
  name: string;
}

interface CharacterData {
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  outfit: OutfitVariation;
}

interface CharacterContextType {
  characterData: CharacterData;
  setCharacterData: (data: CharacterData) => void;
}

const defaultCharacter: CharacterData = {
  skinColor: '#FFDBAC',
  hairColor: '#4A3728',
  eyeColor: '#000000',
  outfit: {
    shirtColor: '#FFFFFF',
    pantsColor: '#3B82F6',
    name: 'Classic'
  }
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacter);

  return (
    <CharacterContext.Provider value={{ characterData, setCharacterData }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
