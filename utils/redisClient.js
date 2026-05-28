// Redis client for installer task tracking
// Falls back to file cache in tmpdir if Redis is not configured

const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

let client = null;
let isRedis = false;

class FileCache {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(os.tmpdir(), 'winstall-installer-cache');
    this.cleanupEvery = options.cleanupEvery || 50;
    this.operationCount = 0;
    this.ready = null;
  }

  async ensureReady() {
    if (!this.ready) {
      this.ready = fs.mkdir(this.cacheDir, { recursive: true });
    }
    await this.ready;
  }

  getFilePath(key) {
    return path.join(this.cacheDir, `${encodeURIComponent(key)}.json`);
  }

  async readEntry(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(content);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      return parsed;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      return null;
    }
  }

  async removeFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  async get(key) {
    await this.ensureReady();
    const filePath = this.getFilePath(key);
    const entry = await this.readEntry(filePath);

    if (!entry || typeof entry.value !== 'string' || typeof entry.expiresAt !== 'number') {
      if (entry !== null) {
        await this.removeFile(filePath);
      }
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      await this.removeFile(filePath);
      return null;
    }

    return entry.value;
  }

  async setEx(key, ttl, value) {
    await this.ensureReady();
    const now = Date.now();
    const filePath = this.getFilePath(key);
    const tempPath = `${filePath}.${process.pid}.${now}.tmp`;
    const entry = {
      value: String(value),
      expiresAt: now + ttl * 1000,
      createdAt: now,
      updatedAt: now,
    };

    await fs.writeFile(tempPath, JSON.stringify(entry), 'utf8');
    await fs.rename(tempPath, filePath);

    this.operationCount += 1;
    if (this.operationCount % this.cleanupEvery === 0) {
      await this.cleanupExpired();
    }
  }

  async cleanupExpired() {
    await this.ensureReady();
    const now = Date.now();
    const files = await fs.readdir(this.cacheDir);

    for (const fileName of files) {
      if (!fileName.endsWith('.json')) {
        continue;
      }

      const filePath = path.join(this.cacheDir, fileName);
      const entry = await this.readEntry(filePath);

      if (!entry || typeof entry.expiresAt !== 'number' || entry.expiresAt <= now) {
        await this.removeFile(filePath);
      }
    }
  }

  async del(key) {
    await this.ensureReady();
    const filePath = this.getFilePath(key);
    await this.removeFile(filePath);
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
      console.warn('[Redis] Failed to connect to Redis, falling back to file cache:', err.message);
    }
  }

  // Fallback to file cache shared across API route contexts
  client = new FileCache();
  console.log(`[Redis] Using file cache at ${client.cacheDir}`);
  isRedis = false;
  return client;
}

function getClient() {
  if (!client) {
    throw new Error('Redis client not initialized. Call init first.');
  }
  return client;
}

function isUsingRedis() {
  return isRedis;
}

module.exports = {
  FileCache,
  initRedisClient,
  getClient,
  isUsingRedis,
};
