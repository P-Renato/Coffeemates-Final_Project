import { createContext } from 'react';
import type { AppContextType } from '../utils/types';

export const AppContext = createContext<AppContextType | undefined>(undefined);