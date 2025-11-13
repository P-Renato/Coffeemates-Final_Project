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
  _id: string; // e.g., 'posts', 'users', etc.
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
  content: string;
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
  parentcommentId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ErrorType = {
  status: number;
  message: string;
};