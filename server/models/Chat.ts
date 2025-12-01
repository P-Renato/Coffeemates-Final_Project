import {  model } from "mongoose";
import type { IChat } from "../libs/types";
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    senderId: {type: String, required: true },
    receiverId: { type: String, required: true },
    senderUsername: {type: String, required: true },  
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", ChatSchema);
