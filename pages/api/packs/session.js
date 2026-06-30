import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PackError } from "../../../service/packService";

export async function requireSessionUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }

  return userId;
}

export async function getOptionalSessionUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return session?.user?.id ?? null;
}

export function sendPackError(res, err) {
  if (err instanceof PackError) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error("[packs API]", err);
  return res
    .status(500)
    .json({ error: err.message || "Something went wrong." });
}
