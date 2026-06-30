import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Missing MONGODB_URI. Add it to .env (e.g. mongodb://127.0.0.1:27017/winstall)"
  );
}

const options = {};

/** @type {import("mongodb").MongoClient | undefined} */
let client;

/** @type {Promise<import("mongodb").MongoClient> | undefined} */
let clientPromise;

const globalForMongo = globalThis;

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
