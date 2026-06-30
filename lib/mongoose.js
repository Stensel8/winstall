import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI. Add it to .env (e.g. mongodb://127.0.0.1:27017/winstall)"
  );
}

const globalForMongoose = globalThis;

if (!globalForMongoose._mongooseCache) {
  globalForMongoose._mongooseCache = { conn: null, promise: null };
}

const cached = globalForMongoose._mongooseCache;

export async function connectMongoose() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((instance) => instance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default mongoose;
