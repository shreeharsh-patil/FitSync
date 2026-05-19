import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, MessageSquare, Heart, Share2, Plus, Search, TrendingUp, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CommunityPage() {
  return (
    <div className="p-8 space-y-12">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight">Community Feed</h1>
          <p className="text-muted-foreground mt-2">Connect with athletes, share your wins, and stay motivated.</p>
        </div>
        <div className="flex gap-4 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Find athletes..." className="pl-10 h-12 bg-card/50 border-white/5 rounded-2xl" />
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 px-6 rounded-2xl gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <PostCard 
            user="Marcus Thorne" 
            role="PRO ATHLETE" 
            content="Just crushed a new PR on deadlifts! 220kg felt like air today. Consistency is everything. 😤" 
            stats="12 sets • 4,500kg volume"
            likes={42}
            comments={8}
            time="2h ago"
          />
          <PostCard 
            user="Elena Rossi" 
            role="TRAINER" 
            content="Consistency > Intensity. Don't worry about being the fastest today, worry about showing up tomorrow. Here's a quick mobility routine I do before every leg day." 
            stats="Shared a routine"
            likes={156}
            comments={24}
            time="5h ago"
          />
          <PostCard 
            user="Julian Vane" 
            role="BEGINNER" 
            content="First 5k completed! 32 minutes might not be world-class, but it's a world away from where I was a month ago. Thanks to the FitSync community for the support! 🏃‍♂️" 
            stats="5.2km • 32:15"
            likes={89}
            comments={15}
            time="8h ago"
          />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Challenges */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <Trophy className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold font-heading">Active Challenges</h2>
            </div>
            <div className="space-y-4">
              <ChallengeItem title="30-Day Plank" participants="1.2k" progress={65} color="bg-secondary" />
              <ChallengeItem title="10k Steps/Day" participants="4.5k" progress={40} color="bg-accent" />
              <ChallengeItem title="No Sugar May" participants="800" progress={85} color="bg-blue-500" />
            </div>
            <Button variant="outline" className="w-full border-white/5 hover:bg-white/5 font-bold rounded-xl">View All Challenges</Button>
          </Card>

          {/* Trending Athletes */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
             <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold font-heading">Trending</h2>
            </div>
            <div className="space-y-4">
              <AthleteSmall name="Sarah Jenkins" followers="12k" />
              <AthleteSmall name="David Bek" followers="8.4k" />
              <AthleteSmall name="Mina Low" followers="15k" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PostCard({ user, role, content, stats, likes, comments, time }: any) {
  return (
    <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/5 transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary/40 border border-white/5" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-heading">{user}</h3>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 tracking-widest">{role}</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{time}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{content}</p>
        <div className="p-4 rounded-2xl bg-background/40 border border-white/5 flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
             <Activity className="h-5 w-5" />
           </div>
           <span className="text-xs font-bold tracking-wide">{stats}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group/btn">
          <Heart className="h-5 w-5 group-hover/btn:fill-accent group-hover/btn:scale-110 transition-all" />
          <span className="text-xs font-bold">{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors group/btn">
          <MessageSquare className="h-5 w-5 group-hover/btn:scale-110 transition-all" />
          <span className="text-xs font-bold">{comments}</span>
        </button>
      </div>
    </Card>
  )
}

function ChallengeItem({ title, participants, progress, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="font-heading">{title}</span>
        <span className="text-muted-foreground">{participants} joined</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function AthleteSmall({ name, followers }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted border border-white/5" />
        <div>
          <p className="text-sm font-bold group-hover:text-secondary transition-colors">{name}</p>
          <p className="text-[10px] text-muted-foreground font-bold">{followers} followers</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-secondary hover:bg-secondary/10">Follow</Button>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"
