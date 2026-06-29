import { getExercises } from "@/lib/admin-actions";
import { ExercisesClient } from "./ExercisesClient";

export default async function AdminExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const search = sp.search || "";
  const category = sp.category || "ALL";

  const data = await getExercises(page, search, category);

  return <ExercisesClient initialData={data} />;
}
