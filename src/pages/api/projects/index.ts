import type { NextApiRequest, NextApiResponse } from "next";
import { API_BASE_URL } from "@/lib/constants";

/**
 * BFF proxy for /api/v1/projects.
 * Forwards requests to the backend API, injecting the auth token.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization;

  const url = new URL(`${API_BASE_URL}/projects`);
  if (req.query) {
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === "string") {
        url.searchParams.set(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch {
    res.status(502).json({ error: "BAD_GATEWAY", message: "Backend unavailable" });
  }
}
