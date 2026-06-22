import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search, Dumbbell, Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { auth } from "@/auth";
import { getWorkouts } from "@/lib/actions";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function WorkoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const workouts = await getWorkouts(session.user.id);
  const exercises = await db.exercise.findMany({
    take: 4,
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">
            Workouts
          </h1>
          <p className="text-muted-foreground mt-2">
            Build, track, and optimize your training routines.
          </p>
        </div>
        <Link href="/workout/builder">
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold gap-2">
            <Plus className="h-4 w-4" />
            Create New Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-heading">Your Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <PlanCard
                  key={workout.id}
                  id={workout.id}
                  name={workout.name}
                  days={`${workout.daysPerWeek} days/week`}
                  difficulty={workout.difficulty}
                  exercises={workout.exercises.length}
                />
              ))
            ) : (
              <Card className="p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 md:col-span-2">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">No active plans found</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first workout plan to start tracking.
                  </p>
                </div>
                <Link href="/workout/builder">
                  <Button variant="outline" size="sm" className="font-bold">
                    Go to Builder
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading">Exercise Database</h2>
          <Card className="p-6 glass border-secondary/20 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search exercises..." className="pl-10" />
            </div>
            <div className="space-y-3">
              {exercises.length > 0 ? (
                exercises.map((ex) => (
                  <QuickExercise key={ex.id} name={ex.name} category={ex.category} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Run database seed to populate exercises
                </p>
              )}
            </div>
            <Link href="/workout/exercises" className="block w-full">
              <Button
                variant="ghost"
                className="w-full text-secondary hover:text-secondary hover:bg-secondary/10"
              >
                Browse All Exercises
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  id,
  name,
  days,
  difficulty,
  exercises,
}: {
  id: string;
  name: string;
  days: string;
  difficulty: string;
  exercises: number;
}) {
  return (
    <Link href={`/workout/${id}`}>
      <Card className="p-6 glass border-border/40 hover:border-secondary/40 transition-all cursor-pointer group h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="px-2 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-white/5">
            {difficulty}
          </div>
        </div>
        <h3 className="text-lg font-bold font-heading group-hover:text-secondary transition-colors">
          {name}
        </h3>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-secondary/70" />
            {days}
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-accent/70" />
            {exercises} Exercises
          </div>
        </div>
      </Card>
    </Link>
  );
}

function QuickExercise({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group">
      <span className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
        {name}
      </span>
      <span className="text-[10px] font-extrabold uppercase text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
        {category}
      </span>
    </div>
  );
}
