import Sidebar from "../components/Sidebar";
import FeedPage from "../features/posts/FeedPage";

export default function Home() {
  return (
    <div className="flex gap-8 ">
        <Sidebar />
        <FeedPage />
    </div>
  )
}
