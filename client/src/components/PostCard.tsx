import type { PostType } from "../utils/types";
import cafe1 from "../assets/cafe1.jpeg";
import MapWithSidePanel from "../features/map/MapSidePanel";
import CommentList from "../features/comment/CommentList";
import { star } from "../utils/rating";

export default function PostCard({ post }: { post: PostType }) {
  const rating = star(post.star);
  return (
    <div className="flex w-full border" key={post.pid}>
      <img
        src={cafe1}
        alt="image"
        className="basis-[33%] object-cover"
      />

      <div className="basis-[33%] flex items-center justify-center bg-gray-100 p-2">
        <MapWithSidePanel content={post} />
      </div>

      <div className="basis-[34%] bg-white p-2 flex flex-col justify-between">
        <p className="font-bold">{post.title}</p>
        <p className="text-yellow-600">Rating: {post.star} {rating}</p>
        <p>{post.content}</p>
        <CommentList pid={post._id} />
      </div>
    </div>
  );
}
