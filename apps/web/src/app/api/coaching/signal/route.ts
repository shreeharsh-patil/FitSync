import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const signalingStore = new Map<string, { offer?: string; answer?: string }>();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const data = signalingStore.get(sessionId) || {};
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, type, sdp } = body;

    if (!sessionId || !type || !sdp) {
      return NextResponse.json({ error: "Missing sessionId, type, or sdp" }, { status: 400 });
    }

    const existing = signalingStore.get(sessionId) || {};

    if (type === "offer") {
      signalingStore.set(sessionId, { ...existing, offer: sdp });
    } else if (type === "answer") {
      signalingStore.set(sessionId, { ...existing, answer: sdp });
    }

    // Cleanup old entries after 5 minutes
    setTimeout(() => {
      signalingStore.delete(sessionId);
    }, 5 * 60 * 1000);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
