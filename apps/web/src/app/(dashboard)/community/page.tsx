import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Flame,
  MessageCircle,
  Heart,
  Share2,
  Award,
  Search,
  Image as ImageIcon,
} from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-accent" />
            Community
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect, compete, and celebrate with the FitSync family.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              className="pl-10 bg-card/50 border-white/5"
            />
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-white font-bold shrink-0">
            Find Friends
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="p-6 glass border-white/5 rounded-[2rem]">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex shrink-0 items-center justify-center font-bold text-secondary">
                A
              </div>
              <div className="flex-1 space-y-4">
                <Input
                  placeholder="Share your latest workout or thought..."
                  className="bg-white/5 border-none h-12"
                />
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Photo/Video
                  </Button>
                  <Button className="bg-secondary text-primary font-bold rounded-xl px-6">
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Feed Item 1 */}
          <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                  S
                </div>
                <div>
                  <p className="font-bold">Sarah Connor</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    2 hours ago
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed">
              Just crushed the &quot;Leg Day Destroyer&quot; routine! Added 10kg
              to my squat PR. Feeling strong but definitely going to be sore
              tomorrow. 🔥💪
            </p>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Leg Day Destroyer</p>
                <p className="text-xs text-muted-foreground">
                  Volume: 12,400 kg • Duration: 1h 15m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 border-t border-white/5">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-secondary gap-2 px-0"
              >
                <Heart className="h-4 w-4" /> 24
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2 px-0"
              >
                <MessageCircle className="h-4 w-4" /> 5
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2 px-0 ml-auto"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-heading text-lg">
                Active Challenges
              </h2>
              <Award className="h-5 w-5 text-yellow-400" />
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                  <p className="font-bold text-sm">Summer Shred 100km</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    45km / 100km completed
                  </p>
                  <div className="h-2 w-full bg-background rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[45%]" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/20 transition-colors cursor-pointer">
                <p className="font-bold text-sm">30-Day Core Builder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Join 1,204 others
                </p>
                <Button
                  variant="link"
                  className="px-0 h-auto text-secondary text-xs mt-2 font-bold"
                >
                  Join Challenge
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-6">
            <h2 className="font-bold font-heading text-lg">
              Suggested Athletes
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/10" />
                    <div>
                      <p className="font-bold text-sm">Athlete {i}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Powerlifter
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold rounded-full"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
