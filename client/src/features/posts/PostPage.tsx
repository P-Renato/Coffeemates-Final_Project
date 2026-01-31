import PostCard from "../../components/PostCard";
import { useAppContext } from "../../hooks/usePost";

export default function PostPage() {
  const { posts, error, loading } = useAppContext();

  if (loading) return <div className="p-4">Loading posts...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="">
      <h2 className="text-left p-2 md:p-3 font-bold border-b border-[#8E8E8E] text-xl w-full max-w-full ">
        Suggestions for you ({posts.length})
      </h2>
      <div className="flex flex-col gap-4 p-4 w-full max-w-full">
        {posts.length === 0 ? (
          <div className="p-4 text-gray-500 bg-white w-full max-w-full">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}