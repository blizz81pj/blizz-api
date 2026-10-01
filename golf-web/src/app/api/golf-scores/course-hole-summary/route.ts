import { NextRequest } from "next/server";
import { GOLF_API_BASE_URL } from "@/lib/api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();

  try {
    const upstream = await fetch(
      `${GOLF_API_BASE_URL}/api/golf-scores/course-hole-summary?${query}`,
      { cache: "no-store" },
    );

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
