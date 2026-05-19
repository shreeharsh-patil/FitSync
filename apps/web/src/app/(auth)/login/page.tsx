import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity, Code } from "lucide-react"
import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10" />
      
      <Card className="w-full max-w-md p-8 glass border-secondary/20">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <Activity className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-heading tracking-tight">Welcome to FitSync</h1>
            <p className="text-muted-foreground">Sign in to sync your body and your life.</p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <form action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}>
              <Button variant="outline" className="w-full h-12 font-bold flex items-center gap-3 border-border/40 hover:bg-secondary/10 hover:border-secondary/40 transition-all">
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
                Continue with Google
              </Button>
            </form>

            <form action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/dashboard" })
            }}>
              <Button variant="outline" className="w-full h-12 font-bold flex items-center gap-3 border-border/40 hover:bg-secondary/10 hover:border-secondary/40 transition-all">
                <Code className="h-5 w-5" />
                Continue with GitHub
              </Button>
            </form>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  )
}
