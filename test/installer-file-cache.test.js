const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const { FileCache } = require('../utils/redisClient');

async function createTempCacheDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'winstall-installer-cache-test-'));
}

test('file cache is shared across cache instances (simulating multiple API routes)', async (t) => {
  const cacheDir = await createTempCacheDir();
  t.after(async () => {
    await fs.rm(cacheDir, { recursive: true, force: true });
  });

  const installerCache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });
  const callbackCache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });

  const key = 'installer:task:shared-instance-check';

  await installerCache.setEx(key, 60, '0');
  const readFromCallback = await callbackCache.get(key);

  assert.equal(readFromCallback, '0');
});

test('installer -> callback -> status lifecycle works without Redis', async (t) => {
  const cacheDir = await createTempCacheDir();
  t.after(async () => {
    await fs.rm(cacheDir, { recursive: true, force: true });
  });

  const installerCache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });
  const callbackCache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });
  const statusCache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });

  const taskId = 'task-3-step-lifecycle';
  const key = `installer:task:${taskId}`;

  // Step 1: installer route creates task with processing marker.
  await installerCache.setEx(key, 3600, '0');
  const callbackSeesTask = await callbackCache.get(key);
  assert.equal(callbackSeesTask, '0');

  // Step 2: callback route updates task with uploaded timestamp.
  const uploadedAt = Math.floor(Date.now() / 1000).toString();
  await callbackCache.setEx(key, 3600, uploadedAt);

  // Step 3: status route reads the completion timestamp.
  const statusValue = await statusCache.get(key);
  assert.notEqual(statusValue, null);
  assert.notEqual(statusValue, '0');
  assert.equal(Number.isInteger(Number(statusValue)), true);
  assert.equal(Number(statusValue) > 0, true);
});

test('expired entries are removed on read', async (t) => {
  const cacheDir = await createTempCacheDir();
  t.after(async () => {
    await fs.rm(cacheDir, { recursive: true, force: true });
  });

  const cache = new FileCache({ cacheDir, cleanupEvery: Number.MAX_SAFE_INTEGER });
  const key = 'installer:task:ttl-expiry';

  await cache.setEx(key, 1, '0');
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const valueAfterExpiry = await cache.get(key);
  assert.equal(valueAfterExpiry, null);
});
