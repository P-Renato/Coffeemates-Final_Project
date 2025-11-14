import express from 'express';
import { allPosts, addNewPost, onePost, editPost, deletePost } from '../controllers/postController';

const posts = express.Router();

// Routes
posts.get("/:id", onePost);      // Get single post by ID
posts.patch("/:id", editPost);   // Edit a post by ID
posts.get("/", allPosts);        // Get all posts
posts.post("/", addNewPost);     // Add a new post
posts.delete("/:id", deletePost) // Delete a post and its comments

export default posts;
