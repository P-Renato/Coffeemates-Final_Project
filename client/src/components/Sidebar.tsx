import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";


export default function Sidebar() {
  const { postPopup, setPostPopup } = useAppContext();

  return (
    <div className="bg-blue-300">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>
        <li><NavLink to="/messages">Messages</NavLink></li>
        <li onClick={() => setPostPopup(!postPopup)} className="cursor-pointer">Post</li>
        <li><NavLink to="/profile">Profile</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
      </ul>
    </div>
  )
}
