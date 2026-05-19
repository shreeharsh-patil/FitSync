import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Filter, Calendar, Clock, ChevronRight, Share2, Bookmark } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const categories = ["All", "Workouts", "Nutrition", "Mental Health", "Weight Loss", "Recipes", "Gear"]

const posts = [
  {
    title: "Mastering Progressive Overload: The Key to Muscle Growth",
    excerpt: "Learn how to systematically increase the stress on your body to achieve consistent gains without hitting a plateau.",
    category: "Workouts",
    author: "Dr. Sarah Chen",
    date: "May 15, 2026",
    readTime: "8 min read",
    image: "/blog/post1.jpg",
    slug: "mastering-progressive-overload"
  },
  {
    title: "The Science of Macros: Why Protein is Just the Beginning",
    excerpt: "Diving deep into how fats and carbohydrates play a crucial role in your athletic performance and hormonal health.",
    category: "Nutrition",
    author: "Markus Vane",
    date: "May 12, 2026",
    readTime: "12 min read",
    image: "/blog/post2.jpg",
    slug: "science-of-macros"
  },
  {
    title: "Mind Over Muscle: Psychological Resilience in Training",
    excerpt: "How to build the mental toughness required to push through the most demanding sessions and stay consistent.",
    category: "Mental Health",
    author: "Elena Rossi",
    date: "May 10, 2026",
    readTime: "6 min read",
    image: "/blog/post3.jpg",
    slug: "mind-over-muscle"
  },
  {
    title: "10-Minute High-Protein Meals for Busy Professionals",
    excerpt: "Quick, delicious, and nutrient-dense recipes that fit into even the most crowded schedules.",
    category: "Recipes",
    author: "Chef Julian",
    date: "May 08, 2026",
    readTime: "5 min read",
    image: "/blog/post4.jpg",
    slug: "high-protein-meals"
  }
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation (Reuse from Landing) */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <span className="ml-3 text-2xl font-bold font-heading tracking-tighter">FitSync</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-8">
           <Link className="text-sm font-bold uppercase tracking-widest text-secondary" href="/blog">
            Blog
          </Link>
          <Link className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="/#features">
            Features
          </Link>
          <Link className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="/#pricing">
            Pricing
          </Link>
        </nav>
        <div className="ml-auto md:ml-8 flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold uppercase tracking-widest text-xs">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-widest text-xs px-6">Join Now</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-6 py-12 md:py-24 space-y-16">
        {/* Blog Header */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-[0.2em]">
            Insider Knowledge
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight leading-tight">
            The FitSync <span className="text-secondary">Journal</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Expert insights on training, nutrition, and the science of human performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full pt-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10 h-14 bg-card/50 border-white/5 rounded-2xl" />
            </div>
            <Button className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-2xl">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <Button 
              key={cat}
              variant={cat === "All" ? "secondary" : "outline"}
              className={cn(
                "rounded-full px-6 font-bold text-xs uppercase tracking-widest border-white/5",
                cat === "All" ? "text-primary shadow-lg shadow-secondary/10" : "hover:bg-white/5"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <BlogCard key={post.title} {...post} featured={i === 0} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center pt-12">
          <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold uppercase tracking-widest px-8 h-14 rounded-2xl">
            Load More Articles
          </Button>
        </div>
      </main>

      {/* Footer (Reuse) */}
      <footer className="w-full py-12 border-t border-white/5">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-secondary" />
            <span className="text-xl font-bold font-heading tracking-tighter">FitSync</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 FitSync Platform. Built for the modern athlete.</p>
          <nav className="flex gap-8">
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">Terms</Link>
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">Privacy</Link>
            <Link className="text-xs font-bold uppercase tracking-widest hover:text-secondary transition-colors" href="#">Security</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function BlogCard({ title, excerpt, category, author, date, readTime, slug, featured }: any) {
  return (
    <Link href={`/blog/${slug}`} className={cn("group flex flex-col space-y-4", featured && "md:col-span-2 lg:col-span-2 md:flex-row md:space-y-0 md:gap-8")}>
      <div className={cn("aspect-[16/9] bg-muted rounded-[2rem] relative overflow-hidden", featured ? "md:w-3/5" : "w-full")}>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-secondary text-primary text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
        <div className="h-full w-full bg-gradient-to-br from-primary/40 to-secondary/20 group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className={cn("flex flex-col space-y-3", featured ? "md:w-2/5 md:justify-center" : "pt-2")}>
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime}
          </div>
        </div>
        <h3 className={cn("font-bold font-heading group-hover:text-secondary transition-colors leading-tight", featured ? "text-3xl" : "text-xl line-clamp-2")}>
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted border border-white/5" />
            <span className="text-xs font-bold">{author}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/10 hover:text-secondary">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/10 hover:text-secondary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"
