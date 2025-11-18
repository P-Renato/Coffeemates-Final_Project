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
    <div className="m-4 p-2">
      <h2 className="text-center p-2 font-bold text-xl">Others Post</h2>
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
