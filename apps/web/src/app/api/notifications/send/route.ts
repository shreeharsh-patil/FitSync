import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/lib/db";
import { sendPushToUser, sendPushToAllUsers } from "@/lib/notification-sender";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, body: messageBody, url, type, targetUserId } = body;

    if (!title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = {
      title,
      body: messageBody || "",
      url: url || "/dashboard",
      tag: `fitsync-${type || "general"}`,
      data: { type: type || "general" },
    };

    if (targetUserId) {
      const result = await sendPushToUser(targetUserId, payload);
      return NextResponse.json(result);
    }

    const result = await sendPushToAllUsers(payload);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
