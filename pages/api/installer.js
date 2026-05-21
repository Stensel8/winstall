const { v4: uuidv4 } = require('uuid');
const { initRedisClient, getClient } = require('../../utils/redisClient');
const { initS3Client, generatePutPresignedUrl } = require('../../utils/s3Client');

// Initialize clients on module load
let redisInitialized = false;
let s3Initialized = false;

async function ensureClientsInitialized() {
  if (!redisInitialized) {
    await initRedisClient();
    redisInitialized = true;
  }
  if (!s3Initialized) {
    initS3Client();
    s3Initialized = true;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const installBase = process.env.WINSTALL_INSTALLER_BASE;

  if (!installBase) {
    return res.status(500).json({ error: 'Installer service not configured' });
  }

  await ensureClientsInitialized();

  const taskId = uuidv4();
  const redisClient = getClient();
  const cacheKey = `installer:task:${taskId}`;

  try {
    // Store task in Redis with initial uploaded value of 0, TTL 1 hour
    await redisClient.setEx(cacheKey, 3600, '0');

    // Generate S3 PUT pre-signed URL if configured (15 min expiry)
    const s3Result = await generatePutPresignedUrl(taskId, 900);

    // Build callback URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || (req.connection.encrypted ? 'https' : 'http');
    const host = req.headers.host;
    const callbackUrl = `${protocol}://${host}/api/installer/callback?taskId=${taskId}`;

    const payload = {
      config: req.body.config,
      callbackUrl,
    };

    // Add S3 pre-signed URL if available
    if (s3Result) {
      payload.putUrl = s3Result.url;
      payload.s3Key = s3Result.key;
    }

    const url = `${installBase}/installer`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');

    // Legacy sync mode: installer returns binary directly
    if (contentType?.includes('application/octet-stream')) {
      const buffer = await response.arrayBuffer();

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${taskId}.exe"`);
      res.setHeader('Content-Length', buffer.byteLength);

      // Clean up Redis cache since we're returning directly
      await redisClient.del(cacheKey);

      return res.status(200).send(Buffer.from(buffer));
    }

    // Async mode: return task info for polling
    const statusUrl = `${protocol}://${host}/api/installer/status?taskId=${taskId}`;

    return res.status(202).json({
      taskId,
      statusUrl,
      message: 'Installer generation in progress',
    });

  } catch (error) {
    console.error('[Installer API] Error:', error);

    // Clean up Redis on error
    try {
      await redisClient.del(cacheKey);
    } catch (cleanupError) {
      console.error('[Installer API] Cleanup error:', cleanupError);
    }

    return res.status(500).json({ error: error.message });
  }
}
