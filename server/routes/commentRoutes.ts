import express from 'express';
import { allComments, addNewComment, oneComment, editComment } from '../controllers/commentController';

const comment = express.Router();

comment.get("/", allComments);
comment.post("/", addNewComment);

comment.get("/:id",oneComment);
comment.patch("/:id", editComment);

export default comment
