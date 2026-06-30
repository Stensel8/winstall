import { ObjectId } from "mongodb";

import clientPromise from "../lib/mongodb";
import { connectMongoose } from "../lib/mongoose";
import Pack from "../dbModel/Pack";
import PackLike from "../dbModel/PackLike";

export class UserError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function toObjectId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

async function deleteNextAuthUser(dbUserId) {
  const objectId = toObjectId(dbUserId);
  if (!objectId) return;

  const client = await clientPromise;
  const db = client.db();

  await db.collection("accounts").deleteMany({ userId: objectId });
  await db.collection("sessions").deleteMany({ userId: objectId });
  await db.collection("users").deleteOne({ _id: objectId });
}

export async function deleteUserAccount(userId, dbUserId) {
  if (!userId) {
    throw new UserError("Authentication required", 401);
  }

  await connectMongoose();

  await Pack.updateMany(
    { userId, status: "active" },
    { $set: { status: "deleted" } }
  ).exec();

  await PackLike.deleteMany({ userId }).exec();

  if (dbUserId) {
    await deleteNextAuthUser(dbUserId);
  }

  return { msg: "Account deleted." };
}
