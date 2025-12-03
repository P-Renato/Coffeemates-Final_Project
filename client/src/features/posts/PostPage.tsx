import PostCard from "../../components/PostCard";
import { useAppContext } from "../../context/LocationPostContext";

export default function PostPage() {
  const { posts } = useAppContext();

  return (
    <div className="m-4 p-2">
      <h2 className="text-center p-2 font-bold text-xl">Others Post</h2>
      <div className="flex flex-col p-2 gap-4">
        {
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        }
      </div>

    </div>
  )
}
