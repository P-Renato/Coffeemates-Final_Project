import mongoose, { model } from "mongoose";
import type { IPost } from "../libs/types";
import { Counter } from "./ModifyId";

const postSchema = new mongoose.Schema(
  {
    pid: { type: Number, unique: true },
    title: { type: String, required: false },
    content: { type: String, required: true },
    location: { type: String, required: true },
    star: { type: Number, required: false },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <-- ObjectId
    shopName: { type: String, required: true },
    imageUrl: { type: String },
    commentIds: { type: [String], default: [] },
    likeIds: { type: [String], default: [] },
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
