import type { PostType, Location } from "../utils/types";
import { useEffect, useState } from 'react';
import { AppContext } from "./PostContext";

const apiUrl = import.meta.env.VITE_API_URL;   // create a .env file in client with VITE_API_URL=http://localhost:4343

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [postPopup, setPostPopup] = useState(false);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/post`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("API DATA:", data);

        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Fetching post error ", err);
        setError("Failed to load posts");
        setLoading(false);
      }
    );
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
    <AppContext.Provider value={{ postPopup, setPostPopup, locationList, setLocationList, posts, setPosts, loading, error, editingPost, setEditingPost }}>
      {children}
    </AppContext.Provider>
  );
};
