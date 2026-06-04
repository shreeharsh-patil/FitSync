import React, { useState, useEffect } from "react";
import { 
  Flame, 
  MessageSquare, 
  Send, 
  Share2, 
  Image as ImageIcon, 
  Tag, 
  User, 
  Sparkles, 
  ThumbsUp,
  Heart
} from "lucide-react";

// Robust high-quality realistic fallback posts representing FitSync community
const DEFAULT_POSTS = [
  {
    id: "default_1",
    author: "Sarah Miller",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    tag: "Milestone",
    content: "Just smashed my 10k personal record today! Kept a steady 5:12/km pace all the way. Feeling absolutely unstoppable! 🏃‍♀️🔥",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    time: "2 hours ago",
    reactions: { fire: 8, strong: 5, clap: 12 },
    reactedUsers: { fire: [], strong: [], clap: [] },
    comments: [
      { id: 1, author: "John Doe", text: "Incredible pace, Sarah! Keep it up!", time: "1 hour ago" },
      { id: 2, author: "Coach Alex", text: "Consistent pacing pays off. Great form!", time: "45 mins ago" }
    ],
    showComments: false
  },
  {
    id: "default_2",
    author: "John Doe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    tag: "Nutrition",
    content: "Meal prep Sunday complete! Fueling the week with grilled chicken breast, roasted sweet potatoes, and steamed broccoli. Consistency is key! 🥑🥦🍗",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    time: "5 hours ago",
    reactions: { fire: 4, strong: 6, clap: 3 },
    reactedUsers: { fire: [], strong: [], clap: [] },
    comments: [
      { id: 1, author: "Sarah Miller", text: "Looks delicious! Do you use any specific seasoning?", time: "4 hours ago" }
    ],
    showComments: false
  },
  {
    id: "default_3",
    author: "Coach Alex",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    tag: "Activity",
    content: "Remember, fitness is not a destination; it's a way of life. If you're struggling to stay motivated, focus on just showing up today. A 15-minute workout is infinitely better than 0 minutes. Let's get it! 💪⚡",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    time: "1 day ago",
    reactions: { fire: 15, strong: 18, clap: 14 },
    reactedUsers: { fire: [], strong: [], clap: [] },
    comments: [],
    showComments: false
  }
];

export default function CommunityFeed({ userProfile, activeLog, triggerToast, currentUser, posts, setPosts }) {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Activity");
  const [selectedPresetImage, setSelectedPresetImage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  // Preset image selections representing routes or meals
  const presetImages = [
    { name: "Running Route", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80" },
    { name: "Healthy Breakfast", url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80" },
    { name: "Fitness Gear", url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" }
  ];

  const mapPostData = (post, currentUserId) => {
    const isReacted = (type) => {
      if (!post.reactedUsers || !post.reactedUsers[type]) return false;
      return currentUserId ? post.reactedUsers[type].includes(currentUserId) : false;
    };
    return {
      ...post,
      id: post._id || post.id,
      time: post.createdAt ? new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : (post.time || "Just now"),
      userReacted: {
        fire: isReacted("fire"),
        strong: isReacted("strong"),
        clap: isReacted("clap")
      },
      showComments: post.showComments || false
    };
  };

  // Fetch posts from backend on load
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const raw = await res.json();
          const dbPosts = raw.map(p => mapPostData(p, currentUser?.id));
          const defaultMapped = DEFAULT_POSTS.map(p => mapPostData(p, currentUser?.id));
          setPosts([...dbPosts, ...defaultMapped]);
        } else {
          setPosts(DEFAULT_POSTS.map(p => mapPostData(p, currentUser?.id)));
        }
      } catch (err) {
        console.error("Failed to load community feed posts:", err);
        setPosts(DEFAULT_POSTS.map(p => mapPostData(p, currentUser?.id)));
      }
    };
    loadPosts();
  }, [currentUser, setPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const postPayload = {
      userId: currentUser?.id || "mock-user",
      author: userProfile.name,
      avatar: userProfile.avatar,
      tag: selectedTag,
      content: newPostContent,
      image: selectedPresetImage
    };

    try {
      if (currentUser) {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload)
        });
        if (res.ok) {
          const saved = await res.json();
          setPosts(prev => [mapPostData(saved, currentUser.id), ...prev]);
        }
      } else {
        const newPost = {
          ...postPayload,
          id: Date.now().toString(),
          time: "Just now",
          reactions: { fire: 0, strong: 0, clap: 0 },
          userReacted: { fire: false, strong: false, clap: false },
          comments: [],
          showComments: false
        };
        setPosts(prev => [newPost, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }

    setNewPostContent("");
    setSelectedPresetImage("");
    triggerToast("✨ Share published to FitSync Feed!");
  };

  const handleReaction = async (postId, reactionType) => {
    const isDefaultPost = postId && postId.toString().startsWith("default_");
    try {
      if (currentUser && !isDefaultPost) {
        const res = await fetch(`/api/posts/${postId}/react`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id, reactionType })
        });
        if (res.ok) {
          const updated = await res.json();
          setPosts(prev => 
            prev.map(p => (p.id === postId ? mapPostData(updated, currentUser.id) : p))
          );
        }
      } else {
        // Fallback local updates for guest users OR default posts
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const reacted = post.userReacted[reactionType];
              const updatedReactions = { ...post.reactions };
              updatedReactions[reactionType] = reacted 
                ? Math.max(0, updatedReactions[reactionType] - 1) 
                : updatedReactions[reactionType] + 1;
              
              const updatedUserReacted = { ...post.userReacted };
              updatedUserReacted[reactionType] = !reacted;

              // Update the reactedUsers locally for UI state representation
              const updatedReactedUsers = post.reactedUsers ? { ...post.reactedUsers } : { fire: [], strong: [], clap: [] };
              if (!updatedReactedUsers[reactionType]) {
                updatedReactedUsers[reactionType] = [];
              }
              const userId = currentUser?.id || "mock-user";
              if (reacted) {
                updatedReactedUsers[reactionType] = updatedReactedUsers[reactionType].filter(uid => uid !== userId);
              } else {
                updatedReactedUsers[reactionType] = [...updatedReactedUsers[reactionType], userId];
              }

              return {
                ...post,
                reactions: updatedReactions,
                userReacted: updatedUserReacted,
                reactedUsers: updatedReactedUsers
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => 
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;

    const isDefaultPost = postId && postId.toString().startsWith("default_");
    try {
      if (currentUser && !isDefaultPost) {
        const res = await fetch(`/api/posts/${postId}/comment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author: userProfile.name, text })
        });
        if (res.ok) {
          const updated = await res.json();
          setPosts(prev => 
            prev.map(p => (p.id === postId ? mapPostData(updated, currentUser.id) : p))
          );
        }
      } else {
        setPosts(prevPosts =>
          prevPosts.map(post => {
            if (post.id === postId) {
              const newComment = {
                id: (post.comments ? post.comments.length : 0) + 1,
                author: userProfile.name,
                text: text,
                time: "Just now"
              };
              return {
                ...post,
                comments: [
                  ...(post.comments || []),
                  newComment
                ]
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    triggerToast("💬 Comment posted");
  };

  return (
    <div className="flex flex-col gap-lg animate-fade-in text-on-surface">
      {/* Post Composer Card */}
      <div className="glass-card p-md md:p-lg rounded-2xl border border-white/10 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-sm mb-sm border-b border-white/5 pb-sm">
          <Sparkles className="h-5 w-5 text-primary-fixed" />
          <h3 className="font-display-sm text-sm font-bold uppercase tracking-wider text-white">Share Your Activity</h3>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-sm">
          <div className="flex gap-sm items-start">
            <img src={userProfile.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-primary-fixed/20" />
            <div className="flex-1 space-y-sm">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What did you smash today? Share a workout, diet milestone, or fitness updates..."
                className="w-full bg-background/50 border border-white/15 hover:border-white/20 rounded-xl p-md text-xs text-primary focus:outline-none focus:border-primary-fixed transition-all min-h-[90px] resize-none"
              />

              {/* Tag & Preset Image Selectors */}
              <div className="flex flex-wrap items-center justify-between gap-sm pt-xs">
                <div className="flex items-center gap-xs">
                  <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> TYPE:
                  </span>
                  {["Activity", "Strength", "Nutrition", "Milestone"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTag(t)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        selectedTag === t 
                          ? "bg-primary-container text-on-primary-container shadow" 
                          : "bg-surface-container hover:bg-surface-bright text-on-surface-variant"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-xs">
                  <span className="text-[10px] text-on-surface-variant font-bold flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> ATTACH:
                  </span>
                  <div className="flex gap-1.5">
                    {presetImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPresetImage(selectedPresetImage === img.url ? "" : img.url)}
                        title={img.name}
                        className={`w-7 h-7 rounded border transition-all overflow-hidden relative ${
                          selectedPresetImage === img.url 
                            ? "border-primary-fixed ring-2 ring-primary-fixed/30" 
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        {selectedPresetImage === img.url && (
                          <div className="absolute inset-0 bg-primary-fixed/20 flex items-center justify-center">
                            <span className="text-[8px] text-on-primary-fixed font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-sm border-t border-white/5">
            <button
              type="submit"
              disabled={!newPostContent.trim()}
              className="px-6 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-bold hover:bg-white transition-all text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:pointer-events-none glow-lime"
            >
              Post to Feed
            </button>
          </div>
        </form>
      </div>

      {/* Social Feed List */}
      <div className="space-y-md">
        {posts && posts.map((post) => (
          <div key={post.id} className="glass-card p-md md:p-lg rounded-2xl border border-white/5 flex flex-col gap-md">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <img src={post.avatar} alt="Author" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="font-label-md text-xs text-white font-bold">{post.author}</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium">{post.time}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                post.tag === "Cardio" || post.tag === "Activity" 
                  ? "bg-secondary-container/10 text-secondary-fixed-dim border border-secondary-fixed-dim/20" 
                  : post.tag === "Strength" 
                    ? "bg-primary-container/10 text-primary-fixed border border-primary-fixed/20" 
                    : "bg-tertiary-container/10 text-tertiary-fixed-dim border border-tertiary-fixed-dim/20"
              }`}>
                {post.tag}
              </span>
            </div>

            {/* Content text */}
            <p className="text-xs leading-relaxed text-primary">{post.content}</p>

            {/* Post image */}
            {post.image && (
              <div className="rounded-xl overflow-hidden border border-white/10 max-h-[300px]">
                <img src={post.image} alt="Attached workout/meal path" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Reactions row */}
            <div className="flex justify-between items-center border-y border-white/5 py-2 mt-xs text-[10px]">
              <div className="flex gap-sm">
                {/* Fire reaction */}
                <button
                  onClick={() => handleReaction(post.id, "fire")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                    post.userReacted?.fire 
                      ? "bg-red-500/10 border-red-500/30 text-red-400 font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${post.userReacted?.fire ? "fill-red-400" : ""}`} />
                  <span>🔥 {post.reactions?.fire || 0}</span>
                </button>

                {/* Strong reaction */}
                <button
                  onClick={() => handleReaction(post.id, "strong")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                    post.userReacted?.strong 
                      ? "bg-primary-container/10 border-primary-fixed/30 text-primary-fixed font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <span className="text-[12px]">💪</span>
                  <span>{post.reactions?.strong || 0}</span>
                </button>

                {/* Clap reaction */}
                <button
                  onClick={() => handleReaction(post.id, "clap")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                    post.userReacted?.clap 
                      ? "bg-secondary-container/10 border-secondary-fixed-dim/30 text-secondary-fixed-dim font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <span className="text-[12px]">👏</span>
                  <span>{post.reactions?.clap || 0}</span>
                </button>
              </div>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.comments?.length || 0} comments</span>
              </button>
            </div>

            {/* Comments block */}
            {post.showComments && (
              <div className="space-y-sm bg-background/30 rounded-xl p-md border border-white/5">
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-sm max-h-[200px] overflow-y-auto pr-xs">
                    {post.comments.map((comment, cidx) => (
                      <div key={cidx} className="text-xs leading-normal">
                        <div className="flex justify-between font-semibold text-primary-fixed text-[10px]">
                          <span>{comment.author}</span>
                          <span className="text-on-surface-variant font-normal text-[8px]">{comment.time}</span>
                        </div>
                        <p className="text-on-surface mt-0.5 pl-2 border-l border-white/10">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-on-surface-variant text-center py-2">No comments yet. Be the first to cheer!</p>
                )}

                {/* Comment composer */}
                <div className="flex gap-2 pt-xs mt-xs border-t border-white/5">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="Write a supportive comment..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                    className="flex-1 bg-surface-container border border-white/10 rounded-lg px-3 py-1 text-xs text-primary focus:outline-none focus:border-primary-fixed"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="w-7 h-7 bg-primary-fixed text-on-primary-fixed rounded-lg flex items-center justify-center cursor-pointer hover:bg-white active:scale-90 transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
