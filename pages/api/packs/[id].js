import { connectMongoose } from "../../../lib/mongoose";
import {
  deletePack,
  formatPackForResponse,
  getPackById,
  updatePack,
} from "../../../service/packService";
import {
  getOptionalSessionUser,
  requireSessionUser,
  sendPackError,
  sendPackServiceResult,
} from "./session";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid pack id." });
  }

  try {
    await connectMongoose();

    if (req.method === "GET") {
      const userId = await getOptionalSessionUser(req, res);
      const pack = await getPackById(id, userId);
      return res.status(200).json(pack);
    }

    const userId = await requireSessionUser(req, res);
    if (!userId) return;

    if (req.method === "PATCH") {
      const result = await updatePack(id, userId, req.body);
      return sendPackServiceResult(res, result, (pack) =>
        res.status(200).json(formatPackForResponse(pack))
      );
    }

    if (req.method === "DELETE") {
      const result = await deletePack(id, userId);
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return sendPackError(res, err);
  }
}
