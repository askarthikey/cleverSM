import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from '../database/database.service';
import { User, CreateUserDto, UserResponse } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  // Get collection lazily when needed
  private getUsersCollection(): Collection {
    return this.databaseService.getCollection('users');
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const usersCollection = this.getUsersCollection();

    // Check if username already exists
    const existingUsername = await usersCollection.findOne({
      username: createUserDto.username
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists (if provided)
    if (createUserDto.email) {
      const existingEmail = await usersCollection.findOne({
        email: createUserDto.email
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check if phone already exists (if provided)
    if (createUserDto.phone) {
      const existingPhone = await usersCollection.findOne({
        phone: createUserDto.phone
      });

      if (existingPhone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser: Omit<User, '_id'> = {
      username: createUserDto.username,
      email: createUserDto.email,
      phone: createUserDto.phone,
      password: hashedPassword,
      followers: [],
      following: [],
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    
    const user = await usersCollection.findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    return user as UserResponse;
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    const usersCollection = this.getUsersCollection();
    
    // Find by username, email, or phone
    const user = await usersCollection.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier }
      ]
    });

    return user as User | null;
  }

  async findById(id: string): Promise<UserResponse> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }

    const usersCollection = this.getUsersCollection();
    
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as UserResponse;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const usersCollection = this.getUsersCollection();
    const user = await usersCollection.findOne({ username });
    return !user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async searchUsers(query: string, page: number = 1, limit: number = 20, currentUserId: string) {
    const usersCollection = this.getUsersCollection();
    const followRequestsCollection = this.databaseService.getCollection('followRequests');
    const skip = (page - 1) * limit;

    // Search by username (case-insensitive)
    const searchRegex = new RegExp(query, 'i');
    
    const users = await usersCollection
      .find(
        {
          username: { $regex: searchRegex },
          _id: { $ne: new ObjectId(currentUserId) } // Exclude current user
        },
        { projection: { password: 0 } }
      )
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await usersCollection.countDocuments({
      username: { $regex: searchRegex },
      _id: { $ne: new ObjectId(currentUserId) }
    });

    // Get current user's following list and pending follow requests
    const currentUser = await this.findById(currentUserId);
    const userIds = users.map(user => user._id);
    const pendingRequests = await followRequestsCollection
      .find({
        senderId: new ObjectId(currentUserId),
        recipientId: { $in: userIds },
        status: 'pending'
      })
      .toArray();

    const pendingRequestUserIds = new Set(
      pendingRequests.map(req => req.recipientId.toString())
    );

    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: currentUser.following.some(id => id.toString() === user._id.toString()),
      followRequestSent: pendingRequestUserIds.has(user._id.toString())
    }));

    return {
      users: usersWithFollowStatus,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserSuggestions(page: number = 1, limit: number = 20, currentUserId: string) {
    const usersCollection = this.getUsersCollection();
    const followRequestsCollection = this.databaseService.getCollection('followRequests');
    const skip = (page - 1) * limit;

    const currentUser = await this.findById(currentUserId);
    const followingIds = currentUser.following.map(id => new ObjectId(id));
    followingIds.push(new ObjectId(currentUserId)); // Exclude current user

    // Get users that the current user is not following
    const users = await usersCollection
      .find(
        { _id: { $nin: followingIds } },
        { projection: { password: 0 } }
      )
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await usersCollection.countDocuments({
      _id: { $nin: followingIds }
    });

    // Get all pending follow requests sent by current user
    const userIds = users.map(user => user._id);
    const pendingRequests = await followRequestsCollection
      .find({
        senderId: new ObjectId(currentUserId),
        recipientId: { $in: userIds },
        status: 'pending'
      })
      .toArray();

    const pendingRequestUserIds = new Set(
      pendingRequests.map(req => req.recipientId.toString())
    );

    const usersWithFollowStatus = users.map(user => ({
      ...user,
      isFollowing: false,
      followRequestSent: pendingRequestUserIds.has(user._id.toString())
    }));

    return {
      users: usersWithFollowStatus,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    const usersCollection = this.getUsersCollection();
    const skip = (page - 1) * limit;

    const user = await this.findById(userId);
    const followingIds = user.following.map(id => new ObjectId(id));

    const following = await usersCollection
      .find(
        { _id: { $in: followingIds } },
        { projection: { password: 0 } }
      )
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = followingIds.length;

    const followingWithStatus = following.map(user => ({
      ...user,
      isFollowing: true,
      followRequestSent: false // Already following, so no pending request
    }));

    return {
      users: followingWithStatus,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    const usersCollection = this.getUsersCollection();
    const skip = (page - 1) * limit;

    const user = await this.findById(userId);
    const followerIds = user.followers.map(id => new ObjectId(id));

    const followers = await usersCollection
      .find(
        { _id: { $in: followerIds } },
        { projection: { password: 0 } }
      )
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = followerIds.length;

    // Check if current user is following these followers
    const followersWithStatus = followers.map(follower => ({
      ...follower,
      isFollowing: user.following.some(id => id.toString() === follower._id.toString())
    }));

    return {
      users: followersWithStatus,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async followUser(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new ConflictException('Cannot follow yourself');
    }

    const usersCollection = this.getUsersCollection();
    const followerObjectId = new ObjectId(followerId);
    const targetObjectId = new ObjectId(targetUserId);

    // Check if target user exists
    const targetUser = await usersCollection.findOne({ _id: targetObjectId });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Check if already following
    const follower = await usersCollection.findOne({ _id: followerObjectId });
    if (!follower) {
      throw new NotFoundException('Follower not found');
    }
    if (follower.following.some(id => id.toString() === targetUserId)) {
      throw new ConflictException('Already following this user');
    }

    // Instead of directly following, return info that a follow request should be sent
    return { 
      success: true, 
      message: 'Send follow request',
      requiresRequest: true,
      isFollowing: false
    };
  }

  async acceptFollowAndFollow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new ConflictException('Cannot follow yourself');
    }

    const usersCollection = this.getUsersCollection();
    const followerObjectId = new ObjectId(followerId);
    const targetObjectId = new ObjectId(targetUserId);

    // Add to follower's following list
    await usersCollection.updateOne(
      { _id: followerObjectId },
      { 
        $addToSet: { following: targetObjectId },
        $set: { updatedAt: new Date() }
      }
    );

    // Add to target's followers list
    await usersCollection.updateOne(
      { _id: targetObjectId },
      { 
        $addToSet: { followers: followerObjectId },
        $set: { updatedAt: new Date() }
      }
    );

    return { 
      success: true, 
      message: 'Successfully followed user',
      isFollowing: true
    };
  }

  async unfollowUser(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new ConflictException('Cannot unfollow yourself');
    }

    const usersCollection = this.getUsersCollection();
    const followerObjectId = new ObjectId(followerId);
    const targetObjectId = new ObjectId(targetUserId);

    // Check if target user exists
    const targetUser = await usersCollection.findOne({ _id: targetObjectId });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Remove from follower's following list
    await usersCollection.updateOne(
      { _id: followerObjectId },
      { 
        $pull: { following: targetObjectId } as any,
        $set: { updatedAt: new Date() }
      }
    );

    // Remove from target's followers list
    await usersCollection.updateOne(
      { _id: targetObjectId },
      { 
        $pull: { followers: followerObjectId } as any,
        $set: { updatedAt: new Date() }
      }
    );

    return { 
      success: true, 
      message: 'Successfully unfollowed user',
      isFollowing: false
    };
  }
}