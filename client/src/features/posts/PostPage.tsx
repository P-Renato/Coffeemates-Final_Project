import { useEffect, useState } from "react";
import PostCard from "../../components/PostCard";
import type { PostType } from "../../utils/types";
import { getAllPosts } from "../../api/postApi"; // This import should work now

export default function PostPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getAllPosts();
        console.log('Fetched posts:', postsData);
        setPosts(postsData);
      } catch (err) {
        console.error("Fetching posts error:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="p-4">Loading posts...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="">
      <h2 className="text-left p-2 font-bold border-b border-[#8E8E8E] text-xl">
        Suggestions for you ({posts.length})
      </h2>
      <div className="flex flex-col p-2 gap-4">
        {posts.length === 0 ? (
          <div className="p-4 text-gray-500">No posts yet. Be the first to post!</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}