
import Map from "../components/Map";
import PostPage from "../features/posts/PostPage";

export default function HomePage() {
   return (
     <div className="bg-pink-300 w-[90%]">
         <Map />
         <PostPage />
     </div>
   )
}
