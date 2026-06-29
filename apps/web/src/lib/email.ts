import db from "@/lib/db";
import { randomBytes } from "crypto";

export async function generateVerificationToken(userId: string, email: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  console.log("=== MOCK EMAIL ===");
  console.log(`To: ${email}`);
  console.log(`Subject: Verify your FitSync email`);
  console.log(`Body: Click here to verify: ${url}`);
  console.log("==================");
}

export async function verifyEmailToken(token: string, email: string): Promise<boolean> {
  const record = await db.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  if (!record) return false;
  if (record.expires < new Date()) return false;

  await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  return true;
}
