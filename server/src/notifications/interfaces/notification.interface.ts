import { ObjectId } from 'mongodb';

export interface Notification {
  _id?: ObjectId;
  recipientId: ObjectId;
  senderId: ObjectId;
  senderUsername: string;
  type: 'follow_request' | 'follow_accepted' | 'follow_rejected' | 'like' | 'comment' | 'share';
  message: string;
  data?: {
    postId?: ObjectId;
    commentId?: ObjectId;
    followRequestId?: ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowRequest {
  _id?: ObjectId;
  senderId: ObjectId;
  senderUsername: string;
  recipientId: ObjectId;
  recipientUsername: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationResponse {
  _id: ObjectId;
  recipientId: ObjectId;
  senderId: ObjectId;
  senderUsername: string;
  type: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowRequestResponse {
  _id: ObjectId;
  senderId: ObjectId;
  senderUsername: string;
  recipientId: ObjectId;
  recipientUsername: string;
  status: string;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
