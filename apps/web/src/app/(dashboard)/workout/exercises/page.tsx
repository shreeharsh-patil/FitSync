import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  Dumbbell,
  Info,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const exercises = [
  {
    name: "Push-up",
    category: "Strength",
    muscle: "Chest",
    difficulty: "Beginner",
  },
  {
    name: "Squat",
    category: "Strength",
    muscle: "Legs",
    difficulty: "Beginner",
  },
  {
    name: "Pull-up",
    category: "Strength",
    muscle: "Back",
    difficulty: "Intermediate",
  },
  {
    name: "Deadlift",
    category: "Strength",
    muscle: "Back/Legs",
    difficulty: "Advanced",
  },
  {
    name: "Plank",
    category: "Stability",
    muscle: "Core",
    difficulty: "Beginner",
  },
  {
    name: "Overhead Press",
    category: "Strength",
    muscle: "Shoulders",
    difficulty: "Intermediate",
  },
  {
    name: "Lunges",
    category: "Strength",
    muscle: "Legs",
    difficulty: "Beginner",
  },
  {
    name: "Barbell Row",
    category: "Strength",
    muscle: "Back",
    difficulty: "Intermediate",
  },
];

export default function ExercisesPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">
            Exercise Database
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive library of movements for your training.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises, muscle groups, equipment..."
            className="pl-10 h-12 bg-card"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 gap-2 border-border/40">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {exercises.map((ex) => (
          <ExerciseCard key={ex.name} {...ex} />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({
  name,
  category,
  muscle,
  difficulty,
}: {
  name: string;
  category: string;
  muscle: string;
  difficulty: string;
}) {
  return (
    <Card className="p-0 overflow-hidden glass border-border/40 hover:border-secondary/40 transition-all group cursor-pointer">
      <div className="aspect-video bg-muted/50 relative flex items-center justify-center">
        <Dumbbell className="h-12 w-12 text-muted-foreground/20 group-hover:scale-110 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider">
            {difficulty}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/20 backdrop-blur-[2px]">
          <PlayCircle className="h-12 w-12 text-white" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold group-hover:text-secondary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {category} • {muscle}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Info className="h-3 w-3" />
            Details
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Card>
  );
}
