import { Document } from 'mongoose';

export interface UserPayload {
  userId: string;  
  email: string;
}

export interface ICounter extends Document {
  _id: string; // posts, users, comments
  seq: number;
}

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  googleId?: string;
  facebookId?: string;
  oauthProvider?: 'google' | 'facebook' | 'local';
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
  coffeeProfile?: {
    basics?: {
      favoriteType?: string;
      neighborhood?: string;
      favoriteCafe?: string;
      coffeeTime?: string;
      goToPastry?: string;
    };
    personality?: {
      usualOrder?: string;
      musicCombo?: string;
      coffeeVibe?: string;
      friendCafe?: string;
      dateCafe?: string;
      coffeeStylePerson?: string;
    };
    taste?: {
      beanOrigin?: string;
      roastPreference?: string;
      brewingMethod?: string;
      milkChoice?: string;
      sugarSyrup?: string;
    };
    vibe?: {
      coffeeMeaning?: string;
      bestMemory?: string;
      idealMate?: string;
      dreamCafe?: string;
      cafeToVisit?: string;
    };
  };
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

export interface ILocation extends Document {
  address: string;
  lat: number;
  lng: number;
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