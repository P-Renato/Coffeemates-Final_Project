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

// Or even better, use mongoose's Document directly:
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


export type ErrorType = {
    status: number;
    message: string;
};