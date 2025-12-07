/**
 * MongoDB Database Connection
 * ===========================
 * This file handles connecting to our MongoDB database.
 * MongoDB is a "NoSQL" database that stores data as JSON-like documents.
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables
 * 
 * Why async/await?
 * - Database connection takes time (network operation)
 * - We need to wait for it to complete before the server starts
 * - async/await makes this code readable and clean
 */
const connectDB = async () => {
  try {
    // Get the MongoDB URI from environment variables
    // This keeps sensitive data out of our code
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB with recommended options
    const conn = await mongoose.connect(mongoURI, {
      // These options prevent deprecation warnings and enable new features
      // In Mongoose 8+, most of these are default, but explicit is better
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Set up event listeners for connection issues
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected!');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // In production, you might want to retry instead of exiting
    // For now, we exit because we can't function without a database
    process.exit(1);
  }
};

module.exports = connectDB;

