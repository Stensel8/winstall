// Redis client for installer task tracking
// Falls back to in-memory Map if Redis is not configured

let client = null;
let isRedis = false;

// In-memory fallback
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  async get(key) {
    return this.cache.get(key) || null;
  }

  async setEx(key, ttl, value) {
    this.cache.set(key, value);

    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl * 1000);

    this.timers.set(key, timer);
  }

  async del(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }
}

async function initRedisClient() {
  if (client) {
    return client;
  }

  const redisHost = process.env.REDIS_HOST;
  const redisPort = process.env.REDIS_PORT;

  // Use Redis if configured
  if (redisHost && redisPort) {
    try {
      const { createClient } = require('redis');
      const useTls = process.env.REDIS_USE_SSL === 'true';

      const redisClient = createClient({
        socket: {
          host: redisHost,
          port: parseInt(redisPort, 10),
          tls: useTls ? { servername: redisHost } : undefined,
        },
        password: process.env.REDIS_KEY,
      });

      await redisClient.connect();
      console.log('[Redis] Connected to Redis server');

      client = redisClient;
      isRedis = true;
      return client;
    } catch (err) {
      console.warn('[Redis] Failed to connect to Redis, falling back to in-memory cache:', err.message);
    }
  }

  // Fallback to in-memory cache
  console.log('[Redis] Using in-memory cache (Redis not configured)');
  client = new MemoryCache();
  isRedis = false;
  return client;
}

function getClient() {
  if (!client) {
    throw new Error('Redis client not initialized. Call initRedisClient() first.');
  }
  return client;
}

function isUsingRedis() {
  return isRedis;
}

module.exports = {
  initRedisClient,
  getClient,
  isUsingRedis,
};
