import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  Heart,
} from "lucide-react";
import { notFound } from "next/navigation";

interface BlogPost {
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  slug: string;
  content: string[];
}

const postsData: Record<string, BlogPost> = {
  "mastering-progressive-overload": {
    title: "Mastering Progressive Overload: The Key to Muscle Growth",
    category: "Workouts",
    author: "Dr. Sarah Chen",
    authorRole: "Sports Science Consultant",
    date: "May 15, 2026",
    readTime: "8 min read",
    slug: "mastering-progressive-overload",
    content: [
      "Progressive overload is the ultimate golden rule of muscle development. Simply put, it means continuously placing a higher physical stress on your body during training than it has previously adapted to. Without progressive overload, your muscles have absolutely no reason to adapt, grow, or become stronger.",
      "Many gym-goers make the mistake of running the exact same routine, lifting the exact same weight, and pushing the exact same reps week after week. While consistency is excellent, stasis is the enemy of physical transformation. If your muscles are not challenged beyond their comfort zone, progressive development stops completely.",
      "Here are the four core mechanisms you can utilize to implement progressive overload systematically in your FitSync workouts:",
      "1. Overloading via Resistance (Weight): The most straightforward method. If you squatted 60kg for 10 reps last week, aim to squat 62.5kg for 10 reps this week. Even micro-increments force muscle fiber adaptations.",
      "2. Overloading via Training Volume (Sets/Reps): If increasing the resistance is not feasible, increase the number of repetitions or total sets. Performing 3 sets of 12 instead of 3 sets of 10 increases the total volume load significantly.",
      "3. Overloading via Training Density: Training density refers to the amount of volume performed in a given time frame. Shortening your rest intervals from 90 seconds to 60 seconds while keeping weight and reps constant forces your muscles to recover faster.",
      "4. Overloading via Training Form and Tempo: Performing a movement with stricter mechanics or decelerating the eccentric phase (the lowering part) increases the total 'time under tension'. Try a 3-second negative phase on your bench press to trigger deep myofibrillar damage.",
      "Remember, progressive overload should be applied progressively and safely. Attempting to lift unsafe weights with compromised form is a fast track to injury. Track your routines carefully using the FitSync Workout logger, evaluate your PRs, and let your body adapt systematically.",
    ],
  },
  "science-of-macros": {
    title: "The Science of Macros: Why Protein is Just the Beginning",
    category: "Nutrition",
    author: "Markus Vane",
    authorRole: "Performance Nutritionist",
    date: "May 12, 2026",
    readTime: "12 min read",
    slug: "science-of-macros",
    content: [
      "In the fitness community, protein is held in ultimate high esteem. While it is undoubtedly the building block of muscle repair, a truly optimized athletic diet requires a sophisticated balance of all three macro-nutrients: Proteins, Carbohydrates, and Fats.",
      "Carbohydrates are your body's primary high-octane energy source. When you ingest carbs, they are broken down into glucose and stored in your muscle tissues and liver as glycogen. During a demanding, heavy session logged on FitSync, your body relies intensely on glycogen reserves. Insufficient carbs lead to lethargy, brain fog, and compromised strength PRs.",
      "Dietary fats are equally critical. They play a primary role in hormone regulation, including testosterone and growth hormone production. Consuming healthy fats (monounsaturated and omega-3s from avocados, nuts, and salmon) supports cellular repair, brain function, and joint health.",
      "How to set your macros inside FitSync's Nutrition tracker:",
      "Step 1: Calculate your TDEE (Total Daily Energy Expenditure). This is your calorie baseline based on your metabolic rate and daily movement metrics. FitSync handles this automatically in your profile metrics.",
      "Step 2: Set your daily protein target. Aim for roughly 1.6 to 2.2g of protein per kilogram of bodyweight, or roughly 30-35% of your total calories.",
      "Step 3: Allocate healthy fats. Fats should generally represent 20-30% of your total daily caloric intake.",
      "Step 4: Fill the remaining calories with high-quality complex carbohydrates. Focus on oats, sweet potatoes, brown rice, and quinoa to maintain stable insulin levels.",
      "By looking past protein and optimizing your entire macro matrix, you fuel both muscular recovery and athletic performance. Track your metrics inside the FitSync Nutrition panel to visualize daily targets in high-fidelity charts.",
    ],
  },
  "mind-over-muscle": {
    title: "Mind Over Muscle: Psychological Resilience in Training",
    category: "Mental Health",
    author: "Elena Rossi",
    authorRole: "Clinical Sports Psychologist",
    date: "May 10, 2026",
    readTime: "6 min read",
    slug: "mind-over-muscle",
    content: [
      "Physical strength is only half the battle. When you are on your fifth set of heavy squats, or battling through the final mile of a grueling run, it is your mind, not your skeletal muscles, that makes the choice to yield or succeed.",
      "Sports psychologists call this 'mental toughness' or 'cognitive resilience'. It is the capacity to maintain concentration, navigate discomfort, and push through high-intensity stress zones without succumbing to fatigue cues.",
      "Here are three practical mental protocols you can implement today to develop psychological resilience:",
      "Protocol 1: Cognitive Reframing. When lactic acid builds up, do not view the burning sensation as an indicator to quit. Reframe it as an indicator of muscle adaptations and mechanical work being completed successfully.",
      "Protocol 2: Micro-Segmentation. Do not focus on the total 5 sets ahead. Focus strictly on the single set at hand. During a grueling set, segment the set into micro-goals (e.g. 'just 3 more perfect reps').",
      "Protocol 3: Intentional Focus Cues. Direct your focus inward (internal focus, e.g., feeling the lats contract) or outward (external focus, e.g., pushing the floor away on deadlifts) to block out peripheral fatigue noise.",
      "Mental endurance is a muscle. The more you intentionally push through safe discomfort limits, the stronger your mind becomes. Use the FitSync Community challenges to stay accountable and build a strong athletic mindset.",
    ],
  },
  "high-protein-meals": {
    title: "10-Minute High-Protein Meals for Busy Professionals",
    category: "Recipes",
    author: "Chef Julian",
    authorRole: "FitSync Culinary Director",
    date: "May 08, 2026",
    readTime: "5 min read",
    slug: "high-protein-meals",
    content: [
      "Maintaining an elite nutrition log is notoriously challenging when your day is packed with corporate meetings, deliverables, and workouts. However, clean, high-protein cooking doesn't have to require hours of meal prep.",
      "These three high-performance, calorie-balanced recipes can be prepared in exactly 10 minutes or less, packing a massive protein payload:",
      "Recipe 1: The Ultimate Performance Bowl (Protein: 45g | Calories: 520)\nIngredients: 150g pre-cooked chicken breast, 1 cup microwaveable quinoa, 1/2 avocado, handful of spinach, 2 tbsp salsa.\nPreparation: Heat the quinoa and chicken. Slice the avocado. Assemble in a bowl and top with fresh salsa and spinach. Simple, high-fiber, and extremely nutrient-dense.",
      "Recipe 2: Dynamic Sweet Salmon Salad (Protein: 38g | Calories: 460)\nIngredients: 1 can of wild-caught salmon, 2 cups mixed baby greens, 10g walnuts, 1 tbsp olive oil, lemon juice.\nPreparation: Drain the salmon and flake it over the greens. Add chopped walnuts. Drizzle with olive oil and fresh lemon juice. Rich in anti-inflammatory Omega-3 fatty acids for joint recovery.",
      "Recipe 3: Hypertrophy Power Shake (Protein: 52g | Calories: 610)\nIngredients: 2 scoops grass-fed whey protein, 1 cup oat milk, 1 banana, 2 tbsp peanut butter, 1/2 cup rolled oats.\nPreparation: Combine all ingredients in a high-speed blender and blend for 45 seconds. The perfect post-workout liquid meal designed to initiate muscle protein synthesis immediately.",
      "Optimize your busy calendar by keeping these pre-cooked proteins and healthy fats stocked in your kitchen. Log these meals directly in the FitSync Nutrition vault to keep your macro progress on track.",
    ],
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = postsData[resolvedParams.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-secondary selection:text-primary">
      {/* Navigation */}
      <header className="w-full border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center">
          <Link className="flex items-center justify-center group" href="/">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <span className="ml-3 text-2xl font-bold font-heading tracking-tighter">
              FitSync
            </span>
          </Link>
          <nav className="ml-auto hidden md:flex gap-8">
            <Link
              className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-bold uppercase tracking-widest text-secondary"
              href="/blog"
            >
              Blog
            </Link>
          </nav>
          <div className="ml-auto md:ml-8 flex gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="font-bold uppercase tracking-widest text-xs"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-widest text-xs px-6">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--secondary)_0%,transparent_60%)] opacity-[0.02] pointer-events-none" />

        <div className="container px-4 mx-auto max-w-4xl space-y-12">
          {/* Breadcrumb / Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-secondary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3 fill-secondary" />
              {post.category}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author card & metrics */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-b border-white/5 pb-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-primary font-bold text-lg shadow-lg">
                  {post.author[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-none">
                    {post.author}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.authorRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="w-full aspect-[21/9] bg-gradient-to-br from-secondary/10 to-accent/10 border border-white/5 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center group shadow-2xl">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <Activity className="h-20 w-20 text-secondary/30 group-hover:scale-110 group-hover:text-secondary/40 transition-all duration-700 relative z-10" />
          </div>

          {/* Article Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Sidebar quick controls */}
            <div className="md:col-span-3 space-y-6">
              <div className="glass p-6 rounded-2xl border-white/5 space-y-6 sticky top-28">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <span>Reactions</span>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 border-white/10 hover:border-secondary/30 hover:bg-secondary/10"
                  >
                    <Heart className="h-4 w-4" />
                    <span>24</span>
                  </Button>
                </div>
                <hr className="border-white/5" />
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Quick Share
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-white/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-white/10"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Paragraph Content */}
            <div className="md:col-span-9 space-y-6 text-muted-foreground text-base leading-relaxed font-medium">
              {post.content.map((paragraph, index) => {
                if (paragraph.startsWith("1.") || paragraph.startsWith("Step") || paragraph.startsWith("Protocol") || paragraph.startsWith("Recipe")) {
                  // Render highlight blocks
                  return (
                    <div
                      key={index}
                      className="p-6 bg-white/[0.02] border-l-2 border-secondary rounded-r-2xl my-6 text-foreground text-sm font-semibold"
                    >
                      {paragraph}
                    </div>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 mt-20">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-heading tracking-tighter">
              FitSync
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 FitSync Journal. Scientifically optimized.
          </p>
          <nav className="flex gap-8">
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/terms"
            >
              Terms
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors"
              href="/security"
            >
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
