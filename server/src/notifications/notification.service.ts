import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { 
  Notification, 
  FollowRequest, 
  NotificationResponse, 
  FollowRequestResponse 
} from './interfaces/notification.interface';

@Injectable()
export class NotificationService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService
  ) {}

  private getNotificationsCollection(): Collection {
    return this.databaseService.getCollection('notifications');
  }

  private getFollowRequestsCollection(): Collection {
    return this.databaseService.getCollection('followRequests');
  }

  // Create a notification
  async createNotification(
    recipientId: string,
    senderId: string,
    senderUsername: string,
    type: string,
    message: string,
    data?: any
  ): Promise<NotificationResponse> {
    const notificationsCollection = this.getNotificationsCollection();

    const notification: Omit<Notification, '_id'> = {
      recipientId: new ObjectId(recipientId),
      senderId: new ObjectId(senderId),
      senderUsername,
      type: type as any,
      message,
      data,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await notificationsCollection.insertOne(notification);
    const createdNotification = await notificationsCollection.findOne({ _id: result.insertedId });

    return createdNotification as NotificationResponse;
  }

  // Get notifications for a user
  async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: NotificationResponse[]; total: number; unreadCount: number }> {
    const notificationsCollection = this.getNotificationsCollection();
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      notificationsCollection
        .find({ recipientId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<NotificationResponse[]>,
      notificationsCollection.countDocuments({ recipientId: new ObjectId(userId) }),
      notificationsCollection.countDocuments({ 
        recipientId: new ObjectId(userId), 
        isRead: false 
      })
    ]);

    return { notifications, total, unreadCount };
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notificationsCollection = this.getNotificationsCollection();

    await notificationsCollection.updateOne(
      { 
        _id: new ObjectId(notificationId),
        recipientId: new ObjectId(userId)
      },
      { 
        $set: { isRead: true, updatedAt: new Date() }
      }
    );
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<void> {
    const notificationsCollection = this.getNotificationsCollection();

    await notificationsCollection.updateMany(
      { recipientId: new ObjectId(userId), isRead: false },
      { $set: { isRead: true, updatedAt: new Date() } }
    );
  }

  // Send follow request
  async sendFollowRequest(
    senderId: string,
    senderUsername: string,
    recipientId: string,
    recipientUsername: string,
    message?: string
  ): Promise<FollowRequestResponse> {
    if (senderId === recipientId) {
      throw new BadRequestException('Cannot send follow request to yourself');
    }

    const followRequestsCollection = this.getFollowRequestsCollection();

    // Check if request already exists
    const existingRequest = await followRequestsCollection.findOne({
      senderId: new ObjectId(senderId),
      recipientId: new ObjectId(recipientId),
      status: 'pending'
    });

    if (existingRequest) {
      throw new BadRequestException('Follow request already sent');
    }

    const followRequest: Omit<FollowRequest, '_id'> = {
      senderId: new ObjectId(senderId),
      senderUsername,
      recipientId: new ObjectId(recipientId),
      recipientUsername,
      status: 'pending',
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await followRequestsCollection.insertOne(followRequest);
    const createdRequest = await followRequestsCollection.findOne({ _id: result.insertedId });

    // Create notification for recipient
    await this.createNotification(
      recipientId,
      senderId,
      senderUsername,
      'follow_request',
      `${senderUsername} wants to follow you`,
      { followRequestId: result.insertedId }
    );

    return createdRequest as FollowRequestResponse;
  }

  // Get follow requests for a user
  async getFollowRequests(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ requests: FollowRequestResponse[]; total: number }> {
    const followRequestsCollection = this.getFollowRequestsCollection();
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      followRequestsCollection
        .find({ recipientId: new ObjectId(userId), status: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<FollowRequestResponse[]>,
      followRequestsCollection.countDocuments({ 
        recipientId: new ObjectId(userId), 
        status: 'pending' 
      })
    ]);

    return { requests, total };
  }

  // Get pending follow requests sent by a user
  async getPendingRequestsBySender(senderId: string): Promise<FollowRequestResponse[]> {
    const followRequestsCollection = this.getFollowRequestsCollection();
    
    const requests = await followRequestsCollection
      .find({ 
        senderId: new ObjectId(senderId), 
        status: 'pending' 
      })
      .toArray() as FollowRequestResponse[];

    return requests;
  }

  // Accept follow request
  async acceptFollowRequest(requestId: string, userId: string): Promise<void> {
    const followRequestsCollection = this.getFollowRequestsCollection();

    const request = await followRequestsCollection.findOne({
      _id: new ObjectId(requestId),
      recipientId: new ObjectId(userId),
      status: 'pending'
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    // Update request status
    await followRequestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { 
        $set: { 
          status: 'accepted', 
          updatedAt: new Date() 
        }
      }
    );

    // Actually create the follow relationship
    await this.usersService.acceptFollowAndFollow(
      request.senderId.toString(),
      request.recipientId.toString()
    );

    // Create notification for sender
    await this.createNotification(
      request.senderId.toString(),
      userId,
      request.recipientUsername,
      'follow_accepted',
      `${request.recipientUsername} accepted your follow request`
    );
  }

  // Reject follow request
  async rejectFollowRequest(requestId: string, userId: string): Promise<void> {
    const followRequestsCollection = this.getFollowRequestsCollection();

    const request = await followRequestsCollection.findOne({
      _id: new ObjectId(requestId),
      recipientId: new ObjectId(userId),
      status: 'pending'
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    // Update request status
    await followRequestsCollection.updateOne(
      { _id: new ObjectId(requestId) },
      { 
        $set: { 
          status: 'rejected', 
          updatedAt: new Date() 
        }
      }
    );
  }

  // Cancel follow request
  async cancelFollowRequest(senderId: string, recipientId: string): Promise<void> {
    const followRequestsCollection = this.getFollowRequestsCollection();

    const request = await followRequestsCollection.findOne({
      senderId: new ObjectId(senderId),
      recipientId: new ObjectId(recipientId),
      status: 'pending'
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    // Update request status to cancelled
    await followRequestsCollection.updateOne(
      { _id: request._id },
      { 
        $set: { 
          status: 'cancelled', 
          updatedAt: new Date() 
        }
      }
    );

    // Remove the notification for the recipient
    const notificationsCollection = this.getNotificationsCollection();
    await notificationsCollection.deleteOne({
      recipientId: new ObjectId(recipientId),
      senderId: new ObjectId(senderId),
      type: 'follow_request',
      'data.followRequestId': request._id
    });
  }

  // Delete notification
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notificationsCollection = this.getNotificationsCollection();

    await notificationsCollection.deleteOne({
      _id: new ObjectId(notificationId),
      recipientId: new ObjectId(userId)
    });
  }
}
