import { auth } from "@/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { TrainerDashboardClient } from "./TrainerDashboardClient";
import {
  getTrainerByUserId,
  getTrainerStats,
  getClientList,
  getTrainerBookings,
} from "@/lib/actions";

export default async function TrainerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) redirect("/login");

  // Check if user is a trainer; redirect if not
  if (user.role !== "TRAINER") {
    // Allow viewing but show limited info, or redirect
    redirect("/dashboard");
  }

  const trainerProfile = await getTrainerByUserId(session.user.id);

  // If no trainer profile exists, create one
  let profile = trainerProfile;
  if (!profile) {
    profile = await db.trainerProfile.create({
      data: {
        userId: session.user.id,
        specialties: "[]",
        certifications: "[]",
      },
      include: {
        packages: { orderBy: { createdAt: "desc" } },
        timeSlots: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
        _count: { select: { testimonials: true, followers: true } },
      },
    });
  }

  const stats = await getTrainerStats(profile.id);
  const clients = await getClientList(profile.id);
  const bookings = await getTrainerBookings(profile.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <TrainerDashboardClient
        trainer={profile}
        stats={stats}
        clients={clients}
        bookings={bookings}
        user={user}
      />
    </div>
  );
}
