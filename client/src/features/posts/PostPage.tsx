import { useEffect, useState } from "react"
import PostCard from "../../components/PostCard";
import type { PostType } from "../../utils/types";


export default function PostPage() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    fetch("http://localhost:4343/api/post")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);

        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.log("Fetching post error ", err));
  }, []);

  console.log(posts)
  return (
    <div className="">
      <h2 className="text-left p-2 font-bold border-b border-[#8E8E8E] text-xl">Suggestions for you</h2>
      <div className="flex flex-col p-2 gap-4">
        {
          posts.map((post) => (
            <PostCard post={post} />
          ))
        }
      </div>

    </div>
  )
}
