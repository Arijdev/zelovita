import { NextRequest, NextResponse } from "next/server";
import { Composio } from "@composio/core";

const composio = new Composio();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("user") || "health-chat-user";
    const session = await composio.sessions.create(userId);
    const result = await session.execute("COMPOSIO_SEARCH_TOOLS", {
      query: "health information search",
    });
    return NextResponse.json({ session: session.sessionId, result });
  } catch (error) {
    console.error("Composio test error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
