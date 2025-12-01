import { useState, useEffect } from "react";
import { AppContext } from "./LocationPostContext";


export interface CoffeeLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
}


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [postPopup, setPostPopup] = useState(false);
    const [locationList, setLocationList] = useState<CoffeeLocation[]>([]);
  
    useEffect(() => {
    fetch("http://localhost:4343/api/location")
      .then((res) => res.json())
      .then((data) => {
        console.log("📍 locationList in Map:", locationList);
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
