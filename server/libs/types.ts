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
  place?: string;
  role: 'user' | 'admin';
  password: string;
  photoURL?: string;
  coverImageURL?: string;
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
  shopName: string;
  imageUrl: string;
  commentIds: string[];
  likeIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  cid: number;
  content: string;
  uid: string;
  pid: string;
  parentCommentId: string;
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

export interface IChat extends Document {
  content: string;
  senderId: string;
  receiverId: string;
  senderUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithReplies extends Omit<IComment, 'uid' | 'pid' | 'parentCommentId'> {
  uid: string;
  pid: string; 
  parentCommentId: string | null;
  replies?: CommentWithReplies[];
}


export type ErrorType = {
  status: number;
  message: string;
};