import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { error: "Missing token or email parameter" },
        { status: 400 }
      );
    }

    const result = await verifyEmailToken(token, email);

    if (!result) {
      return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
    }

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
