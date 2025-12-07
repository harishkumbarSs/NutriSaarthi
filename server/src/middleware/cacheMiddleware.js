/**
 * Cache Middleware
 * ================
 * Express middleware for caching API responses.
 */

const { cache, isAvailable } = require('../config/redis');

/**
 * Create cache middleware
 * @param {object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default 300)
 * @param {function} options.keyGenerator - Function to generate cache key from request
 * @param {boolean} options.userSpecific - Whether cache is user-specific (default true)
 */
const cacheMiddleware = (options = {}) => {
  const {
    ttl = 300,
    keyGenerator,
    userSpecific = true,
  } = options;

  return async (req, res, next) => {
    // Skip if Redis is not available
    if (!isAvailable()) {
      return next();
    }

    // Skip for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    let cacheKey;
    if (keyGenerator) {
      cacheKey = keyGenerator(req);
    } else {
      const userId = userSpecific && req.user ? req.user._id.toString() : 'public';
      const queryString = JSON.stringify(req.query);
      cacheKey = `api:${userId}:${req.originalUrl}:${queryString}`;
    }

    try {
      // Try to get from cache
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        // Add cache header
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(cacheKey, data, ttl).catch(() => {});
        }
        res.set('X-Cache', 'MISS');
        return originalJson(data);
      };

      next();
    } catch {
      // If cache fails, continue without caching
      next();
    }
  };
};

/**
 * Clear cache for specific patterns
 */
const clearCache = async (patterns) => {
  if (!isAvailable()) return;
  
  if (typeof patterns === 'string') {
    patterns = [patterns];
  }
  
  for (const pattern of patterns) {
    await cache.delPattern(pattern);
  }
};

/**
 * Clear user-specific cache
 */
const clearUserCache = async (userId) => {
  await clearCache([
    `api:${userId}:*`,
    `dashboard:${userId}:*`,
    `meals:${userId}:*`,
    `water:${userId}:*`,
    `recommendations:${userId}`,
  ]);
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearUserCache,
};

