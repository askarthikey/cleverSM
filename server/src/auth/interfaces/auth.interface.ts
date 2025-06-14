import { ObjectId } from 'mongodb';

export interface AuthResponse {
  user: {
    _id: ObjectId;
    username: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    bio?: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}