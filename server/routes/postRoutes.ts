import express from 'express';
import { uploadPostImage } from "../middlewares/uploadMiddleware";
import { allPosts, addNewPost, onePost, editPost, deletePost, likePost, getPostsByUserId } from '../controllers/postController';

const posts = express.Router();


// Routes
posts.get("/", allPosts);        
posts.get("/user/:userId", getPostsByUserId);
posts.patch("/like/:id", likePost); 
posts.get("/:id", onePost);      
posts.post("/", uploadPostImage, addNewPost);
posts.patch("/:id", uploadPostImage, editPost);

posts.delete("/:id", deletePost);

export default posts;
