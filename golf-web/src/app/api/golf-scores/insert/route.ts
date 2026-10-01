import { NextRequest } from "next/server";
import { GOLF_API_BASE_URL as API_BASE } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.text();

  try {
    const upstream = await fetch(`${API_BASE}/api/golf-scores/insert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") ?? "text/plain",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reach golf API";
    return new Response(`Error processing request: ${message}`, {
      status: 502,
    });
  }
}
