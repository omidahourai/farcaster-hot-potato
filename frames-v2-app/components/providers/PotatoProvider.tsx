import { createContext, useContext, useState, ReactNode } from 'react';
import { Potato } from '../../models/potato';

interface PotatoContextType {
  potatoes: Potato[];
  setPotatoes: (potatoes: Potato[]) => void;
}

const PotatoContext = createContext<PotatoContextType | undefined>(undefined);

export const PotatoProvider = ({ children }: { children: ReactNode }) => {
  const [potatoes, setPotatoes] = useState<Potato[]>([]);

  return (
    <PotatoContext.Provider value={{ potatoes, setPotatoes }}>
      {children}
    </PotatoContext.Provider>
  );
};

export const usePotato = () => {
  const context = useContext(PotatoContext);
  if (!context) {
    throw new Error('usePotato must be used within a PotatoProvider');
  }
  return context;
};