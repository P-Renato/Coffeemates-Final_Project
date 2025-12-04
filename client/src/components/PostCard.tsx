import { useState, useEffect } from "react";
import type { PostType } from "../utils/types";
import MapWithSidePanel from "../features/map/MapSidePanel";
import CommentList from "../features/comment/CommentList";
import { star } from "../utils/rating";
import { useAuth } from "../hooks/useAuth";
import UserAvatar from './UserAvatar';

// create a .env file in client with VITE_API_URL=http://localhost:4343
const apiUrl = import.meta.env.VITE_API_URL;
const imagePath = import.meta.env.VITE_IMAGE_PATH;

export default function PostCard({ post }: { post: PostType }) {
    const { user } = useAuth(); // current logged-in user
  const rating = star(post.star);

  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeIds.length);

  // Check if user already liked this post
  useEffect(() => {
    if (user && post.likeIds.includes(user.id)) {
      setLike(true);
    }
  }, [user, post.likeIds]);

  // Like/Unlike handler
  const likeHandler = async () => {
    if (!user || !user.id) return alert("You must be logged in to like a post.");

    try {
      const res = await fetch(`${apiUrl}/api/post/like/${post._id}`, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        return alert("Error liking post: " + (data.msg || "Unknown error"));
      }

      // Update state based on response
      setLike((prev) => !prev);             
      setLikeCount(data.likeCount);          

    } catch (err) {
      console.error("Like API error:", err);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-blue-200">
        <b>{post.user?.username || 'Unknown User'}</b>

        <span className="cursor-pointer" onClick={likeHandler}>
          {like ? " ❤️" : " 🤍"} {likeCount}
        </span>
      </div>

      <div className="flex w-full border" key={post._id}>
        <img
          src={`${apiUrl}${imagePath}${post.imageUrl}`}
          alt="Coffee post"
          className="basis-[33%] object-cover max-h-64" // Limits to 256px max height
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/400x300/333/fff?text=Coffee+Post';
          }}
        />

        <div className="basis-[33%] flex items-center justify-center bg-gray-100 p-2">
          <MapWithSidePanel content={post} />
        </div>

        <div className="basis-[34%] bg-white p-2 flex flex-col justify-between">
          <p className="font-bold">{post.title}</p>
          <p className="text-yellow-600">Rating: {post.star} {rating}</p>
          <i className="text-green-600 text-sm">{new Date(post.createdAt).toLocaleString()}</i>
          <p>{post.content}</p>
          <CommentList pid={post._id} />
        </div>
      </div>
    </div>
  );
}
