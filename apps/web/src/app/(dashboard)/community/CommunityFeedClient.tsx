"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Flame,
  Heart,
  Share2,
  Award,
  Image as ImageIcon,
  Sparkles,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { io } from "socket.io-client";
import { followUser, unfollowUser, createPostAction, createCommentAction, toggleLikePostAction } from "@/lib/actions";

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

interface Challenge {
  id: string;
  title: string;
  participantCount: number;
}

interface CommunityFeedClientProps {
  user?: any;
  otherUsers?: { id: string; name: string; role: string; avatar: string }[];
  initialFollowingIds?: string[];
  initialPosts?: PostItem[];
  challenges?: Challenge[];
  initialJoinedChallengeIds?: string[];
}

export function CommunityFeedClient({
  user,
  otherUsers = [],
  initialFollowingIds = [],
  initialPosts = [],
  challenges = [],
  initialJoinedChallengeIds = [],
}: CommunityFeedClientProps) {
  const displayName = user?.name || "Athlete";
  const avatarInitials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AT";
  const userGoal = user?.fitnessGoal
    ? `${user.fitnessGoal.charAt(0).toUpperCase() + user.fitnessGoal.slice(1).toLowerCase()} Athlete`
    : "Premium Athlete";

  const [followingIds, setFollowingIds] = useState<string[]>(initialFollowingIds);

  const handleFollowToggle = async (targetUserId: string) => {
    const isCurrentlyFollowing = followingIds.includes(targetUserId);

    if (isCurrentlyFollowing) {
      setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
      if (user?.id) {
        await unfollowUser(user.id, targetUserId);
      }
    } else {
      setFollowingIds((prev) => [...prev, targetUserId]);
      if (user?.id) {
        await followUser(user.id, targetUserId);
      }
    }

    if (socketRef.current) {
      socketRef.current.emit("user-follow", {
        followerId: user?.id,
        followerName: displayName,
        followingId: targetUserId,
        isFollowing: !isCurrentlyFollowing,
      });
    }
  };

  const [posts, setPosts] = useState<PostItem[]>(initialPosts);

  const [newPostContent, setNewPostContent] = useState("");

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>(initialJoinedChallengeIds);

  const [followNotification, setFollowNotification] = useState("");
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    if (socketServerUrl) {
      const socket = io(socketServerUrl, {
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("WebSocket connected to real-time feed server!");
      });

      socket.on("post-received", (post: PostItem) => {
        setPosts((prev) => {
          if (prev.some((p) => p.id === post.id)) return prev;
          return [post, ...prev];
        });
      });

      socket.on("like-updated", (data: { postId: string; likesCount: number }) => {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === data.postId) {
              return { ...p, likesCount: data.likesCount };
            }
            return p;
          })
        );
      });

      socket.on("comment-received", (data: { postId: string; comment: Comment }) => {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === data.postId) {
              if (p.comments.some((c) => c.content === data.comment.content && c.author === data.comment.author)) {
                return p;
              }
              return {
                ...p,
                commentsCount: p.commentsCount + 1,
                comments: [...p.comments, data.comment],
              };
            }
            return p;
          })
        );
      });

      socket.on("user-follow-received", (data: { followerId: string; followerName: string; followingId: string; isFollowing: boolean }) => {
        if (data.followingId === user?.id && data.isFollowing) {
          setFollowNotification(`${data.followerName} just started following your training protocol!`);
          setShowNotificationToast(true);
          setTimeout(() => setShowNotificationToast(false), 4500);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.id]);

  const handleComposePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const tempId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const newPost: PostItem = {
      id: tempId,
      author: displayName,
      role: userGoal,
      avatar: avatarInitials,
      time: "Just now",
      content: newPostContent,
      likesCount: 0,
      commentsCount: 0,
      isLikedByUser: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    const contentToPost = newPostContent;
    setNewPostContent("");

    if (user?.id) {
      const result = await createPostAction(user.id, contentToPost);
      if (result.success && result.post) {
        setPosts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: result.post.id } : p))
        );
        newPost.id = result.post.id;
      }
    }

    if (socketRef.current) {
      socketRef.current.emit("new-post", newPost);
    }
  };

  const handleLikeToggle = async (postId: string) => {
    let nextLikedState = false;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          nextLikedState = isLiked;
          const nextCount = isLiked ? p.likesCount + 1 : p.likesCount - 1;

          if (socketRef.current) {
            socketRef.current.emit("toggle-like", {
              postId,
              likesCount: nextCount,
            });
          }

          return {
            ...p,
            isLikedByUser: isLiked,
            likesCount: nextCount,
          };
        }
        return p;
      })
    );

    await toggleLikePostAction(postId, nextLikedState);
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = newCommentText[postId] || "";
    if (!text.trim()) return;

    const newComment: Comment = {
      author: displayName,
      avatar: avatarInitials,
      content: text,
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          if (socketRef.current) {
            socketRef.current.emit("new-comment", {
              postId,
              comment: newComment,
            });
          }

          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setNewCommentText((prev) => ({
      ...prev,
      [postId]: "",
    }));

    if (user?.id) {
      await createCommentAction(user.id, postId, text);
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallengeIds((prev) => [...prev, challengeId]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {showNotificationToast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-6 fade-in duration-300 max-w-sm">
          <Card className="p-4 bg-slate-950/90 backdrop-blur-xl border border-secondary/40 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/20 flex shrink-0 items-center justify-center text-secondary border border-secondary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[9px] font-bold text-secondary uppercase tracking-widest leading-none">Athlete Connection</p>
              <p className="text-xs font-semibold text-white mt-1.5 leading-normal">{followNotification}</p>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-muted-foreground hover:text-white shrink-0 ml-1 p-0.5 rounded-full hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          </Card>
        </div>
      )}

      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 glass border-white/5 rounded-[2rem]">
          <form onSubmit={handleComposePost} className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary flex shrink-0 items-center justify-center font-bold text-primary shadow-lg shadow-secondary/15">
              {avatarInitials}
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

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No posts yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to share your workout achievements!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="p-6 glass border-white/5 rounded-[2rem] space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center font-bold text-white shadow-md">
                    {post.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{post.author}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest mt-0.5">
                      {post.role} &bull; {post.time}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground font-medium">{post.content}</p>

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

              {expandedComments[post.id] && (
                <div className="pt-4 border-t border-white/5 space-y-4 bg-black/10 p-4 rounded-2xl">
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

                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex shrink-0 items-center justify-center font-bold text-primary text-[10px]">
                      {avatarInitials}
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
          ))
        )}
      </div>

      <div className="space-y-6">
        {challenges.length > 0 && (
          <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-heading text-lg text-white">Active Challenges</h2>
              <Award className="h-5 w-5 text-yellow-400" />
            </div>

            <div className="space-y-4">
              {challenges.map((challenge) => {
                const isJoined = joinedChallengeIds.includes(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all group",
                      isJoined
                        ? "bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20"
                        : "bg-white/5 border-white/5 hover:border-secondary/20"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-white group-hover:text-secondary transition-colors">
                          {challenge.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isJoined
                            ? "Participating"
                            : `Join ${challenge.participantCount} active athletes`}
                        </p>
                      </div>
                      {isJoined && <Sparkles className="h-4 w-4 text-secondary" />}
                    </div>

                    {!isJoined && (
                      <Button
                        onClick={() => handleJoinChallenge(challenge.id)}
                        variant="link"
                        className="p-0 h-auto text-secondary text-xs font-bold flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform"
                      >
                        Join Challenge
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-6">
          <h2 className="font-bold font-heading text-lg text-white">Suggested Athletes</h2>
          <div className="space-y-4">
            {otherUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No other athletes found yet.
              </p>
            ) : (
              otherUsers.map((ath) => (
                <SuggestedAthlete
                  key={ath.id}
                  id={ath.id}
                  name={ath.name}
                  role={ath.role}
                  avatar={ath.avatar}
                  isFollowing={followingIds.includes(ath.id)}
                  onToggle={() => handleFollowToggle(ath.id)}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SuggestedAthlete({
  id,
  name,
  role,
  avatar,
  isFollowing,
  onToggle,
}: {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isFollowing: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between group" id={`suggested-athlete-${id}`}>
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
        onClick={onToggle}
        variant={isFollowing ? "outline" : "secondary"}
        size="sm"
        className={`h-8 text-xs font-bold rounded-xl transition-all ${
          isFollowing ? "border-white/10 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-500" : ""
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
