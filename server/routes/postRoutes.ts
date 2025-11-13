import express from 'express';
import { allPosts, addNewPost, onePost, editPost } from '../controllers/postController';

const post = express.Router();

post.get("/", allPosts);
post.post("/", addNewPost);

post.get("/:id",onePost);
post.patch("/:id", editPost);

export default post
