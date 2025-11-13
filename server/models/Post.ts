import {  model } from "mongoose";
import type { IPost } from "../libs/types";
import { Counter } from "./ModifyId";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    pid: { type: Number, unique: true },
    content: { type: String, required: true },
    uid: { type: Number, required: true },
    imageUrl: { type: String }, 
    commentIds: { type: [Number], default: [] }, 
    likeIds: { type: [Number], default: [] },  
  },
  { timestamps: true }
);

// Auto-increment postId before saving
postSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); 

  const counter = await Counter.findByIdAndUpdate(
    { _id: "posts" },          
    { $inc: { seq: 1 } },      
    { new: true, upsert: true } 
  );

  this.pid = counter.seq;
  next();
});


export const Post = model<IPost>("Post", postSchema);
