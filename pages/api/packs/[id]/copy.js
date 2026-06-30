import { connectMongoose } from "../../../../lib/mongoose";
import {
  copyPack,
  formatPackForResponse,
} from "../../../../service/packService";
import { requireSessionUser, sendPackError } from "../session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid pack id." });
  }

  const userId = await requireSessionUser(req, res);
  if (!userId) return;

  try {
    await connectMongoose();
    const pack = await copyPack(id, userId);
    return res.status(200).json(formatPackForResponse(pack));
  } catch (err) {
    return sendPackError(res, err);
  }
}
