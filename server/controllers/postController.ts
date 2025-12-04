import type { Request, Response } from "express";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Location } from "../models/Location";
import User from '../models/User';

// GET: all posts
export const allPosts = async (req: Request, res: Response) => {
  try {
    console.log('🔄 Fetching all posts with populate...');
    
    // Since uid is String, we need to convert for populate
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean(); // Get plain objects
    
    // Manually populate user data
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        try {
          // Find user by _id (ObjectId) converted from uid string
          const user = await User.findById(post.uid).select('username profileImage').lean();
          return {
            ...post,
            user: user || { username: 'Unknown' }
          };
        } catch (error) {
          console.error(`Error fetching user for post ${post._id}:`, error);
          return {
            ...post,
            user: { username: 'Unknown' }
          };
        }
      })
    );

    console.log(`✅ Found ${postsWithUsers.length} posts`);
    
    res.status(200).json({ success: true, posts: postsWithUsers });
  } catch (err) {
    console.error('❌ Error in allPosts:', err);
    res.status(500).json({ success: false, msg: "Error fetching posts", error: (err as Error).message });
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
      shopName,
      commentIds,
      likeIds,
      lat,
      lng,
    } = req.body;

    console.log("body:", req.body);
    console.log("file:", req.file);

    const fileName = req.file?.filename;
    const imageUrl = fileName || null;

    const newPostContent = await Post.create({
      title,
      content,
      location,
      star: star ? Number(star) : null,
      uid: uid ? String(uid) : "2",
      imageUrl,
      shopName,
      commentIds: commentIds ? JSON.parse(commentIds) : [],
      likeIds: likeIds ? JSON.parse(likeIds) : [],
    });

    const newLocation = await Location.create({
      name: shopName,
      address: location || "",
      lat: lat !== undefined && lat !== null ? Number(lat) : 0, // fallback 0 if missing
      lng: lng !== undefined && lng !== null ? Number(lng) : 0, // fallback 0 if missing
    });


    res.status(201).json({ success: true, newPost: [newPostContent, newLocation] });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ success: false, msg: err.message || "addNewPost error" });
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

// POST: like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { uid } = req.body; // user ID from request body

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    const uidIndex = post.likeIds.indexOf(uid);
    if (uidIndex === -1) {
      // User has not liked the post yet, add like
      post.likeIds.push(uid);
    } else {
      // User has already liked the post, remove like
      post.likeIds.splice(uidIndex, 1);
    }

    await post.save();

    res.status(200).json({ success: true, likeCount: post.likeIds.length,  liked: uidIndex === -1 });
  } catch (err) {
    res.status(500).json({ success: false, msg: "likePost error" });
  }
}

// GET: Get posts by user ID
export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('📱 Fetching posts for user:', userId);
    
    // Find posts where uid matches userId
    const posts = await Post.find({ uid: userId })
      .sort({ createdAt: -1 }) // Newest first
      .lean();
    
    console.log(`✅ Found ${posts.length} posts for user ${userId}`);
    
    res.status(200).json({ 
      success: true, 
      posts: posts,
      count: posts.length
    });
    
  } catch (err) {
    console.error('❌ Error fetching user posts:', err);
    res.status(500).json({ 
      success: false, 
      msg: "Error fetching user posts" 
    });
  }
};

