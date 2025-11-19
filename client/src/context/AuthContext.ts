import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Create context with proper typing
export const AuthContext = createContext<AuthContextType | undefined>(undefined);