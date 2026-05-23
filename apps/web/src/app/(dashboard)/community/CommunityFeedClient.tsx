"use client";

import { useState } from "react";
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
  Sparkles,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

interface Comment {
  author: string;
  avatar: string;
  content: string;
  time: string;
}

interface PostItem {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  content: string;
  workoutName?: string;
  workoutMeta?: string;
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  isLikedByUser: boolean;
}

export function CommunityFeedClient() {
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: "1",
      author: "Sarah Connor",
      role: "Powerlifter",
      avatar: "S",
      time: "2 hours ago",
      content: "Just crushed the \"Leg Day Destroyer\" routine! Added 10kg to my squat PR. Feeling strong but definitely going to be sore tomorrow. 🔥💪",
      workoutName: "Leg Day Destroyer",
      workoutMeta: "Volume: 12,400 kg • Duration: 1h 15m",
      likesCount: 24,
      commentsCount: 2,
      isLikedByUser: false,
      comments: [
        { author: "Markus Vane", avatar: "M", content: "Insane squat volume Sarah! Standard overload.", time: "1 hour ago" },
        { author: "Elena Rossi", avatar: "E", content: "Crushing it! Remember dynamic stretching tonight.", time: "45 mins ago" },
      ],
    },
    {
      id: "2",
      author: "Markus Vane",
      role: "Performance Coach",
      avatar: "M",
      time: "5 hours ago",
      content: "Highly recommend checking your cellular hydration metrics today. The summer heat requires at least 3.5L of water intake to maintain maximal muscle contractility. Hydration is performance! 💧🏋️‍♂️",
      likesCount: 18,
      commentsCount: 1,
      isLikedByUser: false,
      comments: [
        { author: "Sarah Connor", avatar: "S", content: "Logged 2.5L so far, tracking on the nutrition dashboard!", time: "3 hours ago" },
      ],
    },
  ]);

  // Form composer state
  const [newPostContent, setNewPostContent] = useState("");

  // Comments state per post
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  // Challenge Join states
  const [joinedChallenges, setJoinedChallenges] = useState<Record<string, boolean>>({
    shred: true,
    core: false,
  });

  const handleComposePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: PostItem = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      author: "Alex Rivers",
      role: "Premium Athlete",
      avatar: "A",
      time: "Just now",
      content: newPostContent,
      likesCount: 0,
      commentsCount: 0,
      isLikedByUser: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
  };

  const handleLikeToggle = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            isLikedByUser: isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = (postId: string) => {
    const text = newCommentText[postId] || "";
    if (!text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [
              ...p.comments,
              {
                author: "Alex Rivers",
                avatar: "A",
                content: text,
                time: "Just now",
              },
            ],
          };
        }
        return p;
      })
    );

    // Reset comment input
    setNewCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  const handleJoinChallenge = (key: string) => {
    setJoinedChallenges((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* Post Composer */}
        <Card className="p-6 glass border-white/5 rounded-[2rem]">
          <form onSubmit={handleComposePost} className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary flex shrink-0 items-center justify-center font-bold text-primary shadow-lg shadow-secondary/15">
              AR
            </div>
            <div className="flex-1 space-y-4">
              <Input
                placeholder="Share your hypertrophy PRs, routine reviews, or energy metrics..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="bg-white/5 border-none h-12 text-sm focus-visible:ring-secondary/40 text-white placeholder:text-muted-foreground"
              />
              <div className="flex justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-white gap-2 font-bold hover:bg-white/5 rounded-xl"
                >
                  <ImageIcon className="h-4 w-4" />
                  Add Photo
                </Button>
                <Button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl px-8 h-10 shadow-lg shadow-secondary/15"
                >
                  Post to Feed
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Posts List */}
        {posts.map((post) => (
          <Card key={post.id} className="p-6 glass border-white/5 rounded-[2rem] space-y-4 shadow-xl">
            {/* Post Header */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center font-bold text-white shadow-md">
                  {post.avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{post.author}</p>
                  <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest mt-0.5">
                    {post.role} • {post.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Post Body */}
            <p className="text-sm leading-relaxed text-muted-foreground font-medium">{post.content}</p>

            {/* Linked Workout Module */}
            {post.workoutName && (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4 group cursor-pointer hover:border-secondary/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-secondary transition-colors">
                    {post.workoutName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {post.workoutMeta}
                  </p>
                </div>
              </div>
            )}

            {/* Post Footer Action Buttons */}
            <div className="flex items-center gap-6 pt-2 border-t border-white/5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeToggle(post.id)}
                className={`gap-2 px-0 hover:bg-transparent font-bold ${
                  post.isLikedByUser ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-white"
                }`}
              >
                <Heart className={`h-4 w-4 ${post.isLikedByUser ? "fill-red-500 text-red-500" : ""}`} />
                <span>{post.likesCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleComments(post.id)}
                className="text-muted-foreground hover:text-white gap-2 px-0 hover:bg-transparent font-bold"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentsCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-white gap-2 px-0 hover:bg-transparent font-bold ml-auto"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Comments Expanded Area */}
            {expandedComments[post.id] && (
              <div className="pt-4 border-t border-white/5 space-y-4 bg-black/10 p-4 rounded-2xl animate-fade-in">
                {/* Existing Comments */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {post.comments.map((comment, cIdx) => (
                    <div key={cIdx} className="flex gap-3 text-xs">
                      <div className="h-7 w-7 rounded-full bg-white/5 flex shrink-0 items-center justify-center font-bold text-white">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-2.5 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-white">{comment.author}</span>
                          <span className="text-[8px] text-muted-foreground font-mono">{comment.time}</span>
                        </div>
                        <p className="text-muted-foreground leading-normal">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input Composer */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex shrink-0 items-center justify-center font-bold text-primary text-[10px]">
                    AR
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newCommentText[post.id] || ""}
                      onChange={(e) =>
                        setNewCommentText((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      className="bg-white/5 h-8 border-none text-xs"
                    />
                    <Button
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!(newCommentText[post.id] || "").trim()}
                      className="h-8 bg-secondary text-primary font-bold text-xs rounded-lg px-4 shadow-md shadow-secondary/15"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Community Widgets Sidebar */}
      <div className="space-y-6">
        {/* Active Challenges Widget */}
        <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold font-heading text-lg text-white">Active Challenges</h2>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>

          <div className="space-y-4">
            {/* Shred challenge */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 relative overflow-hidden group">
              <div className="relative z-10 space-y-2">
                <p className="font-bold text-sm text-white">Summer Shred 100km</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">
                  45km / 100km completed
                </p>
                <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[45%]" />
                </div>
              </div>
            </div>

            {/* Core challenge */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 transition-all group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-secondary transition-colors">
                      30-Day Core Builder
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {joinedChallenges.core ? "Participating • Day 1" : "Join 1,204 active athletes"}
                    </p>
                  </div>
                  {joinedChallenges.core && <Sparkles className="h-4 w-4 text-secondary animate-pulse" />}
                </div>

                {joinedChallenges.core ? (
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[3%]" />
                  </div>
                ) : (
                  <Button
                    onClick={() => handleJoinChallenge("core")}
                    variant="link"
                    className="p-0 h-auto text-secondary text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Join Challenge
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Suggested Contacts Widget */}
        <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-6">
          <h2 className="font-bold font-heading text-lg text-white">Suggested Athletes</h2>
          <div className="space-y-4">
            <SuggestedAthlete name="Elena Rossi" role="Sports Psychologist" avatar="E" />
            <SuggestedAthlete name="Dr. Sarah Chen" role="Sports Scientist" avatar="S" />
            <SuggestedAthlete name="Chef Julian" role="FitSync Culinary" avatar="J" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SuggestedAthlete({ name, role, avatar }: { name: string; role: string; avatar: string }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/5 flex shrink-0 items-center justify-center font-bold text-white border border-white/5 group-hover:border-secondary/20 transition-colors">
          {avatar}
        </div>
        <div>
          <p className="font-bold text-sm text-white">{name}</p>
          <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{role}</p>
        </div>
      </div>
      <Button
        onClick={() => setFollowing(!following)}
        variant={following ? "outline" : "secondary"}
        size="sm"
        className={`h-8 text-xs font-bold rounded-xl transition-all ${
          following ? "border-white/10 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500" : ""
        }`}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
