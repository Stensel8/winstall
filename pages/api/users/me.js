import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import { deleteUserAccount, UserError } from "../../../service/userService";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  const dbUserId = session?.user?.dbId;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const result = await deleteUserAccount(userId, dbUserId);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof UserError) {
      return res.status(err.status).json({ error: err.message });
    }

    console.error("[users API]", err);
    return res
      .status(500)
      .json({ error: err.message || "Something went wrong." });
  }
}
