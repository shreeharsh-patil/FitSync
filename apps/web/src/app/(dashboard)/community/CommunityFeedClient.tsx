"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Heart,
  Share2,
  Award,
  MessageSquare,
  ChevronRight,
  X,
  Sparkles,
  Users,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { io } from "socket.io-client";
import {
  followUser,
  unfollowUser,
  createPostAction,
  createCommentAction,
  toggleLikePostAction,
  getFeed,
  deletePost,
  createPostWithMedia,
  getNotificationCount,
} from "@/lib/actions";
import { PostCard } from "@/components/community/PostCard";
import { PostComposer } from "@/components/community/PostComposer";
import { PostSkeleton } from "@/components/community/PostSkeleton";
import { InfiniteScrollTrigger } from "@/components/community/InfiniteScrollTrigger";
import { FeedFilters, type FeedCategory, type FeedSort, type FeedScope } from "@/components/community/FeedFilters";

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
  mediaUrls?: string[];
  workoutName?: string;
  workoutMeta?: string;
  workoutCard?: { name: string; meta: string; exercises: number };
  achievementBadge?: { type: string; label: string };
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  isLikedByUser: boolean;
  userId?: string;
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
  initialHasMore?: boolean;
  initialCursor?: string | null;
}

export function CommunityFeedClient({
  user,
  otherUsers = [],
  initialFollowingIds = [],
  initialPosts = [],
  challenges = [],
  initialJoinedChallengeIds = [],
  initialHasMore = true,
  initialCursor = null,
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
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [joinedChallengeIds, setJoinedChallengeIds] = useState<string[]>(initialJoinedChallengeIds);
  const [followNotification, setFollowNotification] = useState("");
  const [showNotifToast, setShowNotifToast] = useState(false);

  const socketRef = useRef<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    getNotificationCount(user?.id).then(setNotifCount);
  }, [user?.id]);

  const handleFollowToggle = async (targetUserId: string) => {
    const isCurrentlyFollowing = followingIds.includes(targetUserId);

    if (isCurrentlyFollowing) {
      setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
      if (user?.id) await unfollowUser(user.id, targetUserId);
    } else {
      setFollowingIds((prev) => [...prev, targetUserId]);
      if (user?.id) await followUser(user.id, targetUserId);
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

  useEffect(() => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    if (socketServerUrl) {
      const socket = io(socketServerUrl, {
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("WebSocket connected to real-time feed server!");
        socket.emit("user-online", { userId: user?.id });
      });

      socket.on("post-received", (post: PostItem) => {
        setPosts((prev) => {
          if (prev.some((p) => p.id === post.id)) return prev;
          return [post, ...prev];
        });
      });

      socket.on("like-updated", (data: { postId: string; likesCount: number }) => {
        setPosts((prev) =>
          prev.map((p) => (p.id === data.postId ? { ...p, likesCount: data.likesCount } : p))
        );
      });

      socket.on("comment-received", (data: { postId: string; comment: Comment }) => {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === data.postId) {
              if (p.comments.some((c) => c.content === data.comment.content && c.author === data.comment.author)) return p;
              return { ...p, commentsCount: p.commentsCount + 1, comments: [...p.comments, data.comment] };
            }
            return p;
          })
        );
      });

      socket.on("user-follow-received", (data: { followerId: string; followerName: string; followingId: string; isFollowing: boolean }) => {
        if (data.followingId === user?.id && data.isFollowing) {
          setFollowNotification(`${data.followerName} just started following your training protocol!`);
          setShowNotifToast(true);
          setNotifCount((c) => c + 1);
          setTimeout(() => setShowNotifToast(false), 4500);
        }
      });

      socket.on("post-deleted", (data: { postId: string }) => {
        setPosts((prev) => prev.filter((p) => p.id !== data.postId));
      });

      socket.on("post-updated", (data: { post: PostItem }) => {
        setPosts((prev) => prev.map((p) => (p.id === data.post.id ? data.post : p)));
      });

      socket.on("user-status", (data: { userId: string; online: boolean }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (data.online) next.add(data.userId);
          else next.delete(data.userId);
          return next;
        });
      });

      socket.on("typing-indicator", (data: { postId: string; userName: string; typing: boolean }) => {
        setTypingUsers((prev) => {
          const postTyping = [...(prev[data.postId] || [])];
          if (data.typing && !postTyping.includes(data.userName)) {
            postTyping.push(data.userName);
          } else if (!data.typing) {
            const idx = postTyping.indexOf(data.userName);
            if (idx !== -1) postTyping.splice(idx, 1);
          }
          return { ...prev, [data.postId]: postTyping };
        });
      });

      socket.on("notification-count", (data: { count: number }) => {
        setNotifCount(data.count);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("user-offline", { userId: user?.id });
        socketRef.current.disconnect();
      }
    };
  }, [user?.id]);

  const handleComposePost = async (content: string, mediaUrls: string[]) => {
    if (!content.trim() && mediaUrls.length === 0) return;

    const tempId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const newPost: PostItem = {
      id: tempId,
      author: displayName,
      role: userGoal,
      avatar: avatarInitials,
      time: "Just now",
      content: content,
      mediaUrls,
      likesCount: 0,
      commentsCount: 0,
      isLikedByUser: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);

    if (user?.id) {
      const result = mediaUrls.length > 0
        ? await createPostWithMedia(user.id, content, mediaUrls)
        : await createPostAction(user.id, content);
      if (result.success && result.post) {
        setPosts((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: result.post.id } : p)));
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
            socketRef.current.emit("toggle-like", { postId, likesCount: nextCount });
          }
          return { ...p, isLikedByUser: isLiked, likesCount: nextCount };
        }
        return p;
      })
    );
    await toggleLikePostAction(postId, nextLikedState);
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      author: displayName,
      avatar: avatarInitials,
      content: text,
      time: "Just now",
    };

    if (socketRef.current) {
      socketRef.current.emit("new-comment", { postId, comment: newComment });
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, commentsCount: p.commentsCount + 1, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    if (user?.id) {
      await createCommentAction(user.id, postId, text);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (socketRef.current) {
      socketRef.current.emit("delete-post", { postId });
    }
    await deletePost(postId);
  };

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallengeIds((prev) => [...prev, challengeId]);
  };

  const [category, setCategory] = useState<FeedCategory>("all");
  const [sort, setSort] = useState<FeedSort>("latest");
  const [scope, setScope] = useState<FeedScope>("for-you");

  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await getFeed(user?.id, cursor || undefined, 10, {
        category,
        sort,
        scope,
      });
      if (result.posts.length > 0) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = result.posts.filter((p: PostItem) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        setCursor(result.nextCursor);
      }
      setHasMore(result.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor, user?.id, category, sort, scope]);

  useEffect(() => {
    setPosts(initialPosts);
    setHasMore(initialHasMore);
    setCursor(initialCursor);
  }, [initialPosts, initialHasMore, initialCursor]);

  const showNotificationToast = showNotifToast && followNotification;

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
              onClick={() => setShowNotifToast(false)}
              className="text-muted-foreground hover:text-white shrink-0 ml-1 p-0.5 rounded-full hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          </Card>
        </div>
      )}

      <div className="lg:col-span-2 space-y-6">
        <PostComposer
          avatarInitials={avatarInitials}
          displayName={displayName}
          onSubmit={handleComposePost}
        />

        <FeedFilters
          category={category}
          sort={sort}
          scope={scope}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onScopeChange={setScope}
        />

        {posts.length === 0 && !loadingMore ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No posts yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to share your workout achievements!
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserInitials={avatarInitials}
                onLike={handleLikeToggle}
                onComment={handleCommentSubmit}
                onDelete={handleDeletePost}
                onToggleComments={handleToggleComments}
                commentsExpanded={!!expandedComments[post.id]}
                isCurrentUserPost={post.userId === user?.id}
              />
            ))}

            {loadingMore && (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            )}

            <InfiniteScrollTrigger
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loadingMore}
            />
          </>
        )}
      </div>

      <div className="space-y-6">
        {notifCount > 0 && (
          <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-heading text-lg text-white">Notifications</h2>
              <div className="relative">
                <Bell className="h-5 w-5 text-secondary" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center text-white">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              </div>
            </div>
          </Card>
        )}

        {onlineUsers.size > 0 && (
          <Card className="p-6 glass border-white/5 rounded-[2.5rem] space-y-4">
            <h2 className="font-bold font-heading text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Online Now
            </h2>
            <p className="text-xs text-muted-foreground">{onlineUsers.size} athlete{onlineUsers.size !== 1 ? "s" : ""} online</p>
          </Card>
        )}

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
                          {isJoined ? "Participating" : `Join ${challenge.participantCount} active athletes`}
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
