import { Document } from 'mongoose';

export interface UserType extends Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICounter extends Document {
  _id: string; // posts, users, comments
  seq: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  pid: number;
  title: string;
  content: string;
  location: string;
  star: number  ;
  uid: number;
  imageUrl: string;
  commentIds: number[];
  likeIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  cid: number;
  content: string;
  uid: number;
  pid: number;
  parentCommentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithReplies extends IComment {
  replies: CommentWithReplies[];
}


export type ErrorType = {
  status: number;
  message: string;
};