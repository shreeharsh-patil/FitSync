import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { integration, enabled } = body;

    const validIntegrations = ["appleHealth", "googleFit", "fitbit", "strava"];
    if (!validIntegrations.includes(integration)) {
      return NextResponse.json({ error: "Invalid integration" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { [`integrations.${integration}`]: enabled } },
      { new: true }
    ).lean();

    return NextResponse.json({ integrations: (user as any)?.integrations });
  } catch (error) {
    console.error("Integrations PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
