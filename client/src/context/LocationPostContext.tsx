import { createContext, useContext, useState, useEffect } from "react";
import type { PostType, Location } from "../utils/types";

const apiUrl = import.meta.env.VITE_API_URL;

type AppContextType = {
  postPopup: boolean;
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
  locationList: Location[];
  setLocationList: React.Dispatch<React.SetStateAction<Location[]>>;
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
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
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/post`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);

        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.log("Fetching post error ", err));
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/api/location`)
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
    <AppContext.Provider value={{ postPopup, setPostPopup, locationList, setLocationList, posts, setPosts }}>
      {children}
    </AppContext.Provider>
  );
};
