import { useContext } from 'react';
import { AppContext } from '../context/PostContext';
import type { AppContextType } from '../utils/types';

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};