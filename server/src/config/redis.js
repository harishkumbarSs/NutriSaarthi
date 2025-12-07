/**
 * Redis Configuration
 * ====================
 * Provides Redis client instance for caching.
 * Falls back gracefully if Redis is unavailable.
 */

const Redis = require('ioredis');

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis connection
 */
const initRedis = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('Redis: Max retries reached, running without cache');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      isConnected = true;
      console.log('✅ Redis connected');
    });

    redisClient.on('error', (err) => {
      if (isConnected) {
        console.error('Redis error:', err.message);
      }
      isConnected = false;
    });

    redisClient.on('close', () => {
      isConnected = false;
    });

    // Try to connect
    redisClient.connect().catch(() => {
      console.log('⚠️  Redis unavailable, running without cache');
    });
  } catch (error) {
    console.log('⚠️  Redis not configured, running without cache');
  }

  return redisClient;
};

/**
 * Get Redis client (with fallback)
 */
const getClient = () => {
  if (!redisClient) {
    initRedis();
  }
  return redisClient;
};

/**
 * Check if Redis is available
 */
const isAvailable = () => isConnected;

/**
 * Cache helper functions
 */
const cache = {
  /**
   * Get cached value
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached value or null
   */
  async get(key) {
    if (!isConnected) return null;
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set cache value
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default 5 minutes)
   */
  async set(key, value, ttl = 300) {
    if (!isConnected) return;
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch {
      // Ignore cache errors
    }
  },

  /**
   * Delete cached value
   * @param {string} key - Cache key
   */
  async del(key) {
    if (!isConnected) return;
    try {
      await redisClient.del(key);
    } catch {
      // Ignore cache errors
    }
  },

  /**
   * Delete all keys matching pattern
   * @param {string} pattern - Pattern to match (e.g., "user:*")
   */
  async delPattern(pattern) {
    if (!isConnected) return;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch {
      // Ignore cache errors
    }
  },

  /**
   * Get or set cache (with callback)
   * @param {string} key - Cache key
   * @param {function} fetchFn - Function to fetch data if not cached
   * @param {number} ttl - Time to live in seconds
   */
  async getOrSet(key, fetchFn, ttl = 300) {
    // Try to get from cache
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();
    
    // Store in cache
    await this.set(key, data, ttl);
    
    return data;
  },
};

/**
 * Cache key generators
 */
const keys = {
  user: (userId) => `user:${userId}`,
  userProfile: (userId) => `user:${userId}:profile`,
  dashboard: (userId, date) => `dashboard:${userId}:${date}`,
  meals: (userId, date) => `meals:${userId}:${date}`,
  water: (userId, date) => `water:${userId}:${date}`,
  foodSearch: (query) => `food:search:${query.toLowerCase().trim()}`,
  recommendations: (userId) => `recommendations:${userId}`,
};

module.exports = {
  initRedis,
  getClient,
  isAvailable,
  cache,
  keys,
};

