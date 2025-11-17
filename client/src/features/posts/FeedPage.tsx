import Map from "../../components/Map";
import PostPage from "./PostPage";

export default function FeedPage() {
    const positions = [
    [52.5200, 13.4050],   // Berlin
    [48.8566, 2.3522],    // Paris
    [51.5074, -0.1278],   // London
  ];
  return (
    <div className="bg-pink-300 w-[90%]">
        <Map positions={positions} />
        <PostPage />
    </div>
  )
}
