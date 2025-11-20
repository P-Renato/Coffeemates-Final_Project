import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

const MainLayout = () => {
  const { postPopup, setPostPopup } = useAppContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [star, setStar] = useState(5);
  const [imageUrl, setImageUrl] = useState("");

  const postHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4343/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, location, star, uid: 2, imageUrl, commentIds: [], likeIds: [] }),
      })
      if (!res.ok) {
        const error = await res.json();
        alert("Adding post failed: " + (error.msg || "Unknown error"));
        return;
      }

      const data = await res.json();
      setPostPopup(!postPopup);
      setTitle("");
      setContent("");
      setLocation("");
      setStar(5);
      setImageUrl("");

    } catch (err) {
      console.error("fetch error", err);
      alert("Something went wrong. Please try again.");
    }

  }

  const handleCancel = () => {
    setPostPopup(!postPopup);
    setTitle("");
    setContent("");
    setLocation("");
    setStar(5);
    setImageUrl("");
  };
  return (
    <div className="flex">
      <Sidebar />

      {postPopup &&
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-500 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full sm:w-[800px] relative">
            <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">Create new post</h2>

            <div className="flex flex-col sm:flex-row gap-10">
              <input type="file" className="w-70 h-70 bg-gray-200 rounded-lg object-cover m-auto mt-2" />

              <form onSubmit={postHandler} className="flex flex-col gap-4 flex-1">
                <input className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" type="text" placeholder="Title" />
                <input className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" type="text" placeholder="Location" />
                <input className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" type="text" placeholder="Rating (1-5)" />

                <textarea className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" rows={8} placeholder="Write your review here..."></textarea>

                <button type="submit" className="w-[10em] m-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  Post
                </button>
              </form>
            </div>

            <button onClick={handleCancel} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer">✕</button>
          </div>
        </div>

      }

      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
