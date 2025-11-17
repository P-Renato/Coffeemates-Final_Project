import { useEffect, useState } from "react"
import PostCard from "../../components/PostCard";

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {

  }, [])
  return (
    <div>
      <h2>Others Post</h2>
      {
        posts.map((post) => (
          <PostCard />
        ))
      }
    </div>
  )
}
