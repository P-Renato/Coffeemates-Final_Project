import express from "express";
import { allComments, addNewComment, oneComment, editComment, deleteComment, commentsOfPost } from "../controllers/commentController";

const comments = express.Router();
comments.post("/", addNewComment);              // Add a new comment or reply
comments.get("/post/:postId", commentsOfPost);  // Get all comments for a post (nested)
comments.get("/:id", oneComment);               // Get a single comment by ID
comments.get("/",allComments)                   // get all comments
comments.patch("/:id", editComment);            // Edit a comment by ID
comments.delete("/:id", deleteComment)          // Delete comment and its nested comments

export default comments;
