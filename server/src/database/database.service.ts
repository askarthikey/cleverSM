import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import { DatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: Db;
  private databaseConfig: DatabaseConfig;
  private isInitialized = false;

  constructor() {
    this.databaseConfig = DatabaseConfig.getInstance();
  }

  async onModuleInit() {
    console.log('🚀 DatabaseService: Initializing...');
    await this.databaseConfig.connect();
    this.db = this.databaseConfig.getDb();
    
    // Create unique indexes to prevent duplicates
    await this.createUniqueIndexes();
    
    this.isInitialized = true;
    console.log('✅ DatabaseService: Initialized successfully');
  }

  async onModuleDestroy() {
    console.log('🔌 DatabaseService: Shutting down...');
    await this.databaseConfig.disconnect();
    this.isInitialized = false;
  }

  getDb(): Db {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized yet. Please wait for module initialization.');
    }
    return this.db;
  }

  getCollection(name: string): Collection {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized yet. Please wait for module initialization.');
    }
    return this.db.collection(name);
  }

  // Add method to check if ready
  isReady(): boolean {
    return this.isInitialized;
  }

  // Create unique indexes to prevent duplicate data
  private async createUniqueIndexes() {
    try {
      // Create unique index for follow requests (one pending request per sender-recipient pair)
      await this.db.collection('followRequests').createIndex(
        { 
          senderId: 1, 
          recipientId: 1, 
          status: 1 
        },
        { 
          unique: true,
          name: 'unique_pending_follow_request',
          partialFilterExpression: { status: 'pending' }
        }
      );
      
      console.log('✅ Unique indexes created successfully');
    } catch (error) {
      console.warn('⚠️ Index creation warning (may already exist):', error.message);
    }
  }
}