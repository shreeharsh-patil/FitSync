import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Activity, Mail, Lock, User } from "lucide-react"
import { signIn } from "@/auth"
import { register } from "@/lib/actions"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-md glass border-white/10 shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary p-[1px]">
              <div className="h-full w-full rounded-2xl bg-background flex items-center justify-center text-accent">
                <Activity className="h-10 w-10" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-heading tracking-tight">Create Account</h1>
              <p className="text-muted-foreground text-sm">Join the 500K+ athletes syncing their life.</p>
            </div>
          </div>

          <form action={async (formData) => {
            "use server"
            await register(formData)
          }} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="name"
                  type="text" 
                  placeholder="Full Name" 
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-secondary/40 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Email Address" 
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-secondary/40 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  name="password"
                  type="password" 
                  placeholder="Password (min. 6 characters)" 
                  className="pl-10 h-12 bg-background/50 border-border/40 focus:border-secondary/40 transition-all"
                  required
                />
              </div>
            </div>
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-lg shadow-accent/20 transition-all active:scale-[0.98]">
              Get Started Free
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}>
              <Button variant="outline" className="w-full h-12 font-bold gap-3 border-border/40 hover:bg-secondary/10 hover:border-secondary/40 transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.34v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.12z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </form>
            <form action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/dashboard" })
            }}>
              <Button variant="outline" className="w-full h-12 font-bold gap-3 border-border/40 hover:bg-secondary/10 hover:border-secondary/40 transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline font-bold">Sign in</Link>
          </p>
        </div>
        <div className="bg-accent/5 p-4 text-center border-t border-white/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            No credit card required · Cancel anytime
          </p>
        </div>
      </Card>
    </div>
  )
}
