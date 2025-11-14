import type { Request, Response } from "express";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";

// GET: all posts
export const allPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching posts" });
  }
};

// GET: one post by ID
export const onePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // mongoDB stored with format _id but just use id for findbyId
    const post = await Post.findById(id).lean();

    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching 1 post" });
  }
};

// PATCH: edit a post with user authorization
export const editPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;     
    //const uid = req.body.uid;      

    const updateData = req.body;
    // have to use _id with findOneAndUpdate
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }                 
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        msg: "Post not found for editing",
      });
    }

    res.status(200).json({ success: true, updatedPost });
  } catch (err) {
    res.status(400).json({ success: false, msg: "editPost error" });
  }
};


// POST: add new post
export const addNewPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      location,
      star,
      uid,
      imageUrl,
      commentIds,
      likeIds,
    } = req.body;

    const newPost = await Post.create({
      title,
      content,
      location,
      star,
      uid,
      imageUrl,
      commentIds,
      likeIds,
    });

    res.status(201).json({ success: true, newPost });
  } catch (err) {
    res.status(400).json({ success: false, msg: "addNewPost error" });
  }
};

// DELETE a post and its comments
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    // Delete related comments
    await Comment.deleteMany({ pid: id });

    await Post.findByIdAndDelete(id);

    res.status(200).json({ success: true, msg: "Post and related comments deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "deletePost error" });
  }
};