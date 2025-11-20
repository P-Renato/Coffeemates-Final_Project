import express from 'express';
import multer from "multer";
import { allPosts, addNewPost, onePost, editPost, deletePost } from '../controllers/postController';

const posts = express.Router();

// configuration for file upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb)=>{
        // picture.png -> picture_9320429384029.png
        const number = Date.now(); //34242323423
        const fileName = file.originalname.split(".")[0];
        const fileExt = file.originalname.split(".")[1];
        const newFileName = fileName + "_" + number + "." + fileExt;
        req.postImg = newFileName;
        cb(null, newFileName);
    }
});
const upload = multer({storage: storage});

// Routes
posts.get("/:id", onePost);      // Get single post by ID
posts.patch("/:id", editPost);   // Edit a post by ID
posts.get("/", allPosts);        // Get all posts
posts.post("/", addNewPost);     // Add a new post
posts.delete("/:id", deletePost) // Delete a post and its comments

export default posts;
