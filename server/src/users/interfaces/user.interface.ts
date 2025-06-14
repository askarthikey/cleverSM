import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  followers: ObjectId[];
  following: ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface UserResponse {
  _id: ObjectId;
  username: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  followers: ObjectId[];
  following: ObjectId[];
  isVerified: boolean;
  isFollowing?: boolean;
  followRequestSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}