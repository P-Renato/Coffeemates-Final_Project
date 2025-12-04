
import Map from "../components/Map";
import PostPage from "../features/posts/PostPage";
import '../styles/_global.css';
import styles from './homepage.module.css'

export default function HomePage() {
   return (
     <div className="bg-[#F5F4F2] m-0 box-border px-6 gap-2 pr-14 flex flex-col" >
        <b className={`${styles.courier} text-6xl text-[#1A1A1A] mt-[1.5em] `} style={{fontSize: 40}}>Home</b>
        <p className={styles.courier}>Where coffee lovers connect, one cup at a time</p>
         <Map />
         <PostPage />
     </div>
   )
}
