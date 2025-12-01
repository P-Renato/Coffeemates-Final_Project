import { createContext, useContext } from 'react';
import type { CoffeeLocation } from './LocationPostProvider';

type AppContextType = {
  postPopup: boolean;
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
  locationList: CoffeeLocation[];
  setLocationList: React.Dispatch<React.SetStateAction<CoffeeLocation[]>>;
};
export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
