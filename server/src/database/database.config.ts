import { MongoClient, Db } from 'mongodb';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private client: MongoClient;
  private db: Db;

  private constructor() {}

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async connect(): Promise<void> {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb+srv://askarthikey01:daisy.ask@cleversm.txzl0ud.mongodb.net/?retryWrites=true&w=majority&appName=cleverSM';
      
      this.client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      this.db = this.client.db('cleverSocialMedia'); // Your database name
      
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    }
  }
}