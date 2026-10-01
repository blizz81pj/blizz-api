import { NextRequest } from "next/server";
import { GOLF_API_BASE_URL } from "@/lib/api";

type Ctx = RouteContext<"/api/golf-scores/rounds/[roundId]">;

export async function PUT(request: NextRequest, ctx: Ctx) {
  const { roundId } = await ctx.params;
  return proxy(roundId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { roundId } = await ctx.params;
  return proxy(roundId, { method: "DELETE" });
}

async function proxy(roundId: string, init: RequestInit): Promise<Response> {
  try {
    const upstream = await fetch(
      `${GOLF_API_BASE_URL}/api/golf-scores/rounds/${encodeURIComponent(roundId)}`,
      init,
    );

    if (upstream.status === 204) {
      return new Response(null, { status: 204 });
    }

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
