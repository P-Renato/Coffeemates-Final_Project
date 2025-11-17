import type { PostType } from "../utils/types";

export default function PostCard({ post }: { post: PostType }) {
  return (
    <div className="flex justify-between" key={post.pid}>
      <img src={post.imageUrl} alt="image" />
      <div className="bg-white flex justify-between p-2">
        <p className="p-2">{post.location}</p>
        <div className="border-l p-2">
          <p className="font-bold">{post.title}</p>
          <p className="text-yellow-600">Rating: {post.star}</p>
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
}
