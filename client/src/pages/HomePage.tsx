
import Map from "../components/Map";
import PostPage from "../features/posts/PostPage";

export default function HomePage() {
   return (
     <div className="bg-pink-300 ">
        <b className="text-4xl">Home</b>
        <p>Where coffee lovers connect, one cup at a time</p>
         <Map />
         <PostPage />
     </div>
   )
}
