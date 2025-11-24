import { createContext, useContext, useState } from "react";

type AppContextType = {
  postPopup: boolean;
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [postPopup, setPostPopup] = useState(false);

  return (
    <AppContext.Provider value={{ postPopup, setPostPopup }}>
      {children}
    </AppContext.Provider>
  );
};
