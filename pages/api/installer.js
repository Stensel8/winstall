const { v4: uuidv4 } = require('uuid');
const { initRedisClient, getClient } = require('../../utils/redisClient');
const { initS3Client, generatePutPresignedUrl } = require('../../utils/s3Client');

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
		await redisClient.setEx(cacheKey, 3600, '0');

		const s3Result = await generatePutPresignedUrl(taskId, 900);

		const protocol = req.headers['x-forwarded-proto'] || (req.connection.encrypted ? 'https' : 'http');
		const host = req.headers.host;
		const callbackUrl = `${protocol}://${host}/api/installer/callback?taskId=${taskId}`;
		console.log('callbackUrl:', callbackUrl);

		const uploadData = {};
		const payload = {
			upload: uploadData,
			config: req.body.config,
		};

		if (s3Result) {
			console.log('s3Key:', s3Result.key);
			console.log('uploadUrl:', s3Result.url);
			uploadData.upload_url = s3Result.url;
			uploadData.callback_url = callbackUrl;
		}

		const url = `${installBase}/installer`;
		if (process.env.NODE_ENV === 'development') {
			console.log('generate installer with payload:', JSON.stringify(payload, null, 2));
		}

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const contentType = response.headers.get('content-type');

		if (contentType?.includes('application/octet-stream')) {
			const buffer = await response.arrayBuffer();

			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader('Content-Disposition', `attachment; filename="${taskId}.exe"`);
			res.setHeader('Content-Length', buffer.byteLength);

			await redisClient.del(cacheKey);

			return res.status(200).send(Buffer.from(buffer));
		}

		const statusUrl = `${protocol}://${host}/api/installer/status?taskId=${taskId}`;

		return res.status(202).json({
			taskId,
			statusUrl,
			message: 'Installer generation in progress',
		});
	} catch (error) {
		console.error('[Installer API] Error:', error);

		try {
			await redisClient.del(cacheKey);
		} catch (cleanupError) {
			console.error('[Installer API] Cleanup error:', cleanupError);
		}

		return res.status(500).json({ error: error.message });
	}
}
