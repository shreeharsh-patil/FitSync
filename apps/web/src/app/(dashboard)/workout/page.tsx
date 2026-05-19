import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search, Dumbbell, Clock, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { auth } from "@/auth";
import { getWorkouts } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function WorkoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const workouts = await getWorkouts(session.user.id);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
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
        {/* Active Plans */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-heading">Your Active Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.length > 0 ? (
              workouts.map((workout) => (
                <PlanCard
                  key={workout.id}
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
...
        {/* Exercise Database Quick Search */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-heading">Exercise Database</h2>
          <Card className="p-6 glass border-secondary/20 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search 500+ exercises..." className="pl-10" />
            </div>
            <div className="space-y-3">
              <QuickExercise name="Barbell Bench Press" category="Chest" />
              <QuickExercise name="Deadlift" category="Back" />
              <QuickExercise name="Squats" category="Legs" />
              <QuickExercise name="Overhead Press" category="Shoulders" />
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
  name,
  days,
  difficulty,
  exercises,
}: {
  name: string;
  days: string;
  difficulty: string;
  exercises: number;
}) {
  return (
    <Card className="p-6 glass border-border/40 hover:border-secondary/40 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
          <Dumbbell className="h-5 w-5" />
        </div>
        <div className="px-2 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {difficulty}
        </div>
      </div>
      <h3 className="text-lg font-bold font-heading group-hover:text-secondary transition-colors">
        {name}
      </h3>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {days}
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {exercises} Exercises
        </div>
      </div>
    </Card>
  );
}

function QuickExercise({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
      <span className="text-sm font-medium group-hover:text-secondary transition-colors">
        {name}
      </span>
      <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {category}
      </span>
    </div>
  );
}
