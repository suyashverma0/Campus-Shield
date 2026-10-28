import mongoose from 'mongoose';
import { env } from './env.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    // Try connecting to the specified MONGODB_URI
    if (env.MONGODB_URI && !env.MONGODB_URI.includes('localhost:27017')) {
      console.log(`[DB] Attempting connection to MongoDB at: ${env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[DB] Successfully connected to MongoDB Atlas / remote cluster.');
      return mongoose.connection;
    }

    // If local URI is provided, attempt connection
    try {
      console.log('[DB] Attempting connection to MongoDB at:', env.MONGODB_URI);
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('[DB] Successfully connected to local MongoDB.');
      return mongoose.connection;
    } catch (localErr) {
      if (env.NODE_ENV === 'production') {
        throw localErr;
      }
      console.warn('[DB] Local MongoDB not available, initializing MongoMemoryServer for development fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'campus_shield' },
      });
      const memoryUri = mongoMemoryServer.getUri();
      console.log(`[DB] Connecting to MongoMemoryServer at: ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('[DB] Successfully connected to in-memory MongoDB fallback.');
      return mongoose.connection;
    }
  } catch (error) {
    console.error('[DB] MongoDB connection failed:', error.message);
    if (env.NODE_ENV === 'development') {
      try {
        console.log('[DB] Starting MongoMemoryServer development fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'campus_shield' },
        });
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log('[DB] Successfully connected to in-memory MongoDB fallback.');
        return mongoose.connection;
      } catch (memErr) {
        console.error('[DB] Failed to start MongoMemoryServer:', memErr.message);
        throw error;
      }
    }
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
    console.log('[DB] MongoDB disconnected gracefully.');
  } catch (error) {
    console.error('[DB] Error disconnecting MongoDB:', error.message);
  }
};

