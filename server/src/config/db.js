import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Local Connection Failed]: ${error.message}`);
    console.log('[MongoDB]: Attempting fallback with MongoMemoryServer for standalone execution...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB Memory Server Connected]: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`[MongoDB Error]: Could not establish MongoDB connection: ${memError.message}`);
      process.exit(1);
    }
  }
};
