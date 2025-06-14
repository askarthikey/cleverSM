import { ObjectId } from 'mongodb';

export interface Post {
  _id?: ObjectId;
  title: string;
  description: string;
  author: ObjectId;
  authorUsername: string;
  likes: ObjectId[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  shares: ObjectId[];
  sharesCount: number;
  allowComments: boolean;
  allowShares: boolean;
  isPublic: boolean;
  privacy: 'public' | 'followers' | 'friends' | 'private';
  tags?: string[];
  media?: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: ObjectId;
  author: ObjectId;
  authorUsername: string;
  content: string;
  likes: ObjectId[];
  likesCount: number;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  _id: ObjectId;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface PostResponse {
  _id: ObjectId;
  title: string;
  description: string;
  author: {
    _id: ObjectId;
    username: string;
    profilePicture?: string;
  };
  likes: ObjectId[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  shares: ObjectId[];
  sharesCount: number;
  allowComments: boolean;
  allowShares: boolean;
  isPublic: boolean;
  privacy: string;
  tags?: string[];
  media?: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
  isShared?: boolean;
}