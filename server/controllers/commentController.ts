import type { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import User from '../models/User';
import mongoose from "mongoose";

interface CommentWithReplies extends Omit<any, 'replies'> {
  replies: CommentWithReplies[];
}

// Get all comments
export const allComments = async (req: Request, res: Response) => {

}

// Get all comments for a post, including nested replies
export const commentsOfPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ success: false, msg: "Invalid postId" });
    }

    // Fetch all comments for the post with user info
    const comments = await Comment.aggregate([
      {
        $match: { pid: new mongoose.Types.ObjectId(postId) } // filter by postId
      },
   
      {
        $lookup: {
          from: "users",
          let: { userId: "$uid" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] }
              }
            },
            { $project: { username: 1 } }
          ],
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          content: 1,
          uid: 1,
          pid: 1,
          parentCommentId: 1,
          createdAt: 1,
          "user.username": 1
        }
      }
    ]);

    // Build nested comment tree
    const map: Record<string, any> = {};
    const roots: any[] = [];

    comments.forEach((comment) => {
      const commentWithReplies = { ...comment, replies: [] };
      map[commentWithReplies._id.toString()] = commentWithReplies;
    });

    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = map[comment.parentCommentId.toString()];
        if (parent) {
          parent.replies.push(map[comment._id.toString()]);
        }
      } else {
        roots.push(map[comment._id.toString()]);
      }
    });

    res.status(200).json({ success: true, comments: roots });

  } catch (err) {
    console.error("Comments Error:", err);
    res.status(500).json({ success: false, msg: "allComments error" });
  }
};


// GET: one comment by ID
export const oneComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, msg: "Comment not found" });
    }

    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching post" });
  }
};

// PATCH: edit a comment with user authorization
export const editComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updateComment = req.body;
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: id },
      updateComment,
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        msg: "Comment not found or unauthorized",
      });
    }
    const user = await User.findById(updatedComment.uid).select("username");         // Fetch the user info
    const populatedComment = {
      ...updatedComment.toObject(),
      user
    };
    res.status(200).json({ success: true, updatedComment: populatedComment });
  } catch (err) {
    res.status(400).json({ success: false, msg: "editPost error" });
  }
};


// POST: add new comment
export const addNewComment = async (req: Request, res: Response) => {
  try {
    const { content, uid, pid, parentCommentId } = req.body;
    const newComment = await Comment.create({ content, uid, pid, parentCommentId: parentCommentId || null });

    // update Post to include this comment's ID
    const newCommentId = newComment._id ? newComment._id.toString() : (newComment.id ?? null);
    if (!newCommentId) {
      return res.status(500).json({ success: false, msg: "Failed to create comment id" });
    }
    await Post.findByIdAndUpdate(
      pid,
      { $push: { commentIds: newCommentId } },
      { new: true }
    );

    // populate user info
    const user = await User.findById(uid).select("username");         // Fetch the user info
    const populatedComment = {
      ...newComment.toObject(),
      user
    };

    res.status(201).json({ success: true, newComment: populatedComment });
  } catch (err) {
    res.status(400).json({ success: false, msg: "addNewComment error" });
  }
};

// DELETE
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Fetch all comments for the post
    const commentToDelete = await Comment.findById(id);
    if (!commentToDelete) {
      return res.status(404).json({ success: false, msg: "Comment not found" });
    }

    // 2. Recursive function to find all nested replies
    const getAllNestedIds = async (parentId: string): Promise<string[]> => {
      const children = await Comment.find({ parentCommentId: parentId }).select("_id").lean();
      let ids: string[] = children.map(c => c._id.toString());

      for (const child of children) {
        const nestedIds = await getAllNestedIds(child._id.toString());
        ids = ids.concat(nestedIds);
      }
      return ids;
    };

    const nestedIds = await getAllNestedIds(id);

    // 3. Delete the comment and all nested replies
    await Comment.deleteMany({ _id: { $in: [id, ...nestedIds] } });

    res.status(200).json({ success: true, msg: "Comment and replies deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "deleteComment error" });
  }
};



