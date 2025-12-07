/**
 * Jest Setup File
 * ================
 * Global test configuration for backend tests.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Connect to in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect and stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_EXPIRES_IN = '1d';
process.env.NODE_ENV = 'test';

