import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { TwoFactorClient } from "./TwoFactorClient";

export default async function TwoFactorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      twoFactorEnabled: true,
      passwordHash: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <TwoFactorClient
      userId={user.id}
      email={user.email || ""}
      twoFactorEnabled={user.twoFactorEnabled}
      hasPassword={!!user.passwordHash}
    />
  );
}
