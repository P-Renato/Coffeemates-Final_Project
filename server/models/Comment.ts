import {  model } from "mongoose";
import type { IComment} from "../libs/types";
import { Counter } from "./ModifyId";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    cid: { type: Number, unique: true },
    content: { type: String, required: true },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <-- ObjectId
    pid: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // <-- ObjectId
    parentCommentId: { type: String, require: true }, 
  },
  { timestamps: true }
);

// Auto-increment postId before saving
commentSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); 

  const counter = await Counter.findByIdAndUpdate(
    { _id: "comments" },          
    { $inc: { seq: 1 } },      
    { new: true, upsert: true } 
  );

  this.cid = counter.seq;
  next();
});


export const Comment = model<IComment>("Comment", commentSchema);
