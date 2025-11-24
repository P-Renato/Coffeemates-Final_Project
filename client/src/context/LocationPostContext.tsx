import { createContext, useContext, useState, useEffect } from "react";

type AppContextType = {
  postPopup: boolean;
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
  locationList: Location[];
  setLocationList: React.Dispatch<React.SetStateAction<Location[]>>;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [postPopup, setPostPopup] = useState(false);
    const [locationList, setLocationList] = useState<Location[]>([]);
  
    useEffect(() => {
    fetch("http://localhost:4343/api/location")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.locations)) {
          setLocationList(data.locations);
        } else {
          setLocationList([]);
        }
      })
      .catch(() => setLocationList([]));
  }, []);

  return (
    <AppContext.Provider value={{ postPopup, setPostPopup, locationList, setLocationList }}>
      {children}
    </AppContext.Provider>
  );
};
