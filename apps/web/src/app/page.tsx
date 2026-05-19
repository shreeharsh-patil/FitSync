import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Zap, Users, Brain } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="/">
          <Activity className="h-6 w-6 text-secondary" />
          <span className="ml-2 text-xl font-bold font-heading tracking-tighter">FitSync</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-secondary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-secondary transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-secondary transition-colors" href="/blog">
            Blog
          </Link>
          <Link className="text-sm font-medium hover:text-secondary transition-colors" href="/login">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading">
                Sync Your Body. <span className="text-secondary">Sync Your Life.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                The AI-powered fitness ecosystem designed to unify your tracking, nutrition, and community in one premium platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                View Features
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-heading">Engineered for Performance</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to reach your peak, powered by advanced AI and a thriving community.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="h-10 w-10 text-secondary" />}
                title="AI Workout Tracking"
                description="Intelligent logging that learns your strength patterns and suggests progressive overload."
              />
              <FeatureCard 
                icon={<Brain className="h-10 w-10 text-accent" />}
                title="Smart Nutrition"
                description="900K+ food database with AI-driven meal suggestions tailored to your goals."
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10 text-blue-400" />}
                title="Community First"
                description="Social activity feeds, global challenges, and a trainer marketplace to keep you motivated."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-border/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-heading text-secondary">Ready to Level Up?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join 500K+ athletes and take control of your fitness journey today.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white mt-4">
                Join the Community
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-border/40">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 FitSync Platform. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4" href="#">Terms of Service</Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-xl flex flex-col items-center text-center space-y-4 transition-transform hover:scale-[1.02]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold font-heading">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
