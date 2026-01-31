
import Map from "../components/Map";
import PostPage from "../features/posts/PostPage";
import '../styles/_global.css';
import styles from './homepage.module.css'

// export default function HomePage() {
//    return (
//      <div className="bg-[#F5F4F2] m-0 box-border px-6 gap-2 pr-14 flex flex-col" >
//         <b className={`${styles.courier} text-6xl text-[#1A1A1A] mt-[1.5em] `} style={{fontSize: 40}}>Home</b>
//         <p className={styles.courier}>Where coffee lovers connect, one cup at a time</p>
//          <Map />
//          <PostPage />
//      </div>
//    )
// }

export default function HomePage() {
   return (
     <div className="
       bg-[#F5F4F2] 
       min-h-screen 
       w-full 
       max-w-full
       box-border
       px-4 sm:px-6 md:px-8  
       py-4 sm:py-6  
       sm:relative  
       sm:top-12       
       flex flex-col 
       gap-4 md:gap-6        
     ">
        <div className="w-full max-w-full">
          <h1 className={`${styles.courier} text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A]`}>
            Home
          </h1>
          
          <p className={`${styles.courier} text-lg md:text-xl text-gray-600 mt-2`}>
            Where coffee lovers connect, one cup at a time
          </p>
        </div>
        
        <div className="w-full max-w-full">
          <Map />
        </div>
        
        <div className="w-full max-w-full">
          <PostPage />
        </div>
     </div>
   )
}