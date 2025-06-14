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
}