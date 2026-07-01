import { connectMongoose } from "../../../lib/mongoose";
import { createPack, formatPackForResponse } from "../../../service/packService";
import {
  requireSessionUser,
  sendPackError,
  sendPackServiceResult,
} from "./session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await requireSessionUser(req, res);
  if (!userId) return;

  try {
    await connectMongoose();
    const result = await createPack(userId, req.body);
    return sendPackServiceResult(res, result, (pack) =>
      res.status(200).json(formatPackForResponse(pack))
    );
  } catch (err) {
    return sendPackError(res, err);
  }
}
