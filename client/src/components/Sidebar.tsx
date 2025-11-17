import { useState } from "react";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  const [postpopup, setPostpopup] = useState(false);

  const postHandler = () => {
    
  }
  return (
    <div className="bg-blue-300">
      <ul>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/search">Search</NavLink></li>
        <li><NavLink to="/messages">Messages</NavLink></li>
        <li onClick={() => setPostpopup(true)} className="cursor-pointer">Post</li>
        <li><NavLink to="/profile">Profile</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
      </ul>

      {postpopup &&
        <div className="bg-red-200 m-4">
            <h2 className="text-center">Create new post</h2>
            <div className="flex gap-8">
              <img src="" alt="my-image" />
              <form onSubmit={postHandler} className="flex flex-col gap-2">
                <input className="bg-white border-b-2" type="text" placeholder="Title" />
                <input className="bg-white border-b-2" type="text" placeholder="Location" />
                <input className="bg-white border-b-2" type="text" placeholder="Rating" />
                <textarea className="bg-white" name="" cols={10} rows={10} placeholder="write your review here..."></textarea>
                <button className="bg-green-300 w-20 m-2">Post</button>
              </form>
            </div>
        </div>
      }
      
    </div>
  )
}
