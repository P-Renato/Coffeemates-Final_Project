import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/LocationPostContext";
import PopUpPost from "../features/posts/PopUpPost";

const MainLayout = () => {
   const { postPopup, editingPost } = useAppContext();

  return (
    <div className="flex">
      <Sidebar />

      {postPopup && (
          <PopUpPost postToEdit={editingPost} />
      )}

      <div className="flex-1 ">
        <Outlet />
      </div>
      
    </div>
  );
};

export default MainLayout;
