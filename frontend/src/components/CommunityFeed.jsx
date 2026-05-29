import React, { useState } from "react";
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

export default function CommunityFeed({ userProfile, activeLog, triggerToast }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Sarah Miller",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtXGk-Zp7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8tWq0",
      time: "2 hours ago",
      tag: "Cardio",
      content: "Smashed my morningtempo run around the reservoir! Cadence felt amazing and managed to shave off 12 seconds from my best mile pace. Progressive overload is paying off! 🏃‍♀️✨",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-",
      reactions: { fire: 14, strong: 8, clap: 6 },
      userReacted: { fire: false, strong: false, clap: false },
      comments: [
        { id: 1, author: "John Doe", text: "Incredible pace, Sarah! What shoes are you running in?", time: "1h ago" },
        { id: 2, author: "Coach Marcus", text: "Form is looking extremely stable. Keep up the high cadence work.", time: "45m ago" }
      ],
      showComments: false
    },
    {
      id: 2,
      author: "John Doe",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuEtWq0z7Hxto9p5Q1z3m6j9L5bVw6c7F6E_V4N3u8",
      time: "5 hours ago",
      tag: "Strength",
      content: "Hit a new Personal Record on bench press today: 110kg for 3 clean reps! Rest periods were longer, but the power output felt solid. Fueled by high protein meals all week! 💪🏋️‍♂️",
      image: "",
      reactions: { fire: 9, strong: 18, clap: 4 },
      userReacted: { fire: false, strong: false, clap: false },
      comments: [
        { id: 1, author: "Sarah Miller", text: "Massive lift John! Clean reps too!", time: "4h ago" }
      ],
      showComments: false
    }
  ]);

  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Activity");
  const [selectedPresetImage, setSelectedPresetImage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  // Preset image selections representing routes or meals
  const presetImages = [
    { name: "Running Route", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-" },
    { name: "Healthy Breakfast", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV7IXAaqBntuTh8n7T6_8zYT_lyrU9CJR0qksXGrpxzmanxR-ftEcKBdgBYWhgomr8ygc0XK39Kj92CSTVap9WBNynJi2_Bmyk-L0n0nk1wPj7Lkg-G5ZceQ9jocykOIl2nqmB6wX0ErPs9zvZgbMQrXyiTZsOLrCDkV9cLiedjkp3AiGS7gdu5V4bPz-vqCxWqqler075pyCTnrgGmZi-WnjuAK19L4WQdOKEgvGo97GplawSu5Qq8XA8BUezD2DzC3CEOgFbzOf-" },
    { name: "Fitness Gear", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEmDrGdLfIwA0XhRe8akzIq5_19R6qy8f6OQQ2SsdNh0Bdr3hmgVqzZMc0OdskpFldYarwSViE4nMzz0chEp4XcSp5eJr1QuAcYF8XyohE8tHMyLIIk0lFQlfQ9QmoQp-IsZTmIgjMYnHsT96rJB-dNMYk3dIhK4Rf7EOxtg4KicxgflERqInMjM-DLJ06JKkrb7aAD7WMiera2f139VgbFaepMCOf3pEaBET0EQqQmy479aU4yaCiadKx8iFD60lOVIPQJ9mPKYc2" }
  ];

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: userProfile.name,
      avatar: userProfile.avatar,
      time: "Just now",
      tag: selectedTag,
      content: newPostContent,
      image: selectedPresetImage,
      reactions: { fire: 0, strong: 0, clap: 0 },
      userReacted: { fire: false, strong: false, clap: false },
      comments: [],
      showComments: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setSelectedPresetImage("");
    triggerToast("✨ Share published to FitSync Feed!");
  };

  const handleReaction = (postId, reactionType) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const reacted = post.userReacted[reactionType];
          const updatedReactions = { ...post.reactions };
          updatedReactions[reactionType] = reacted 
            ? updatedReactions[reactionType] - 1 
            : updatedReactions[reactionType] + 1;
          
          const updatedUserReacted = { ...post.userReacted };
          updatedUserReacted[reactionType] = !reacted;

          return {
            ...post,
            reactions: updatedReactions,
            userReacted: updatedUserReacted
          };
        }
        return post;
      })
    );
  };

  const toggleComments = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post => 
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                author: userProfile.name,
                text: text,
                time: "Just now"
              }
            ]
          };
        }
        return post;
      })
    );

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
        {posts.map((post) => (
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
                    post.userReacted.fire 
                      ? "bg-red-500/10 border-red-500/30 text-red-400 font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${post.userReacted.fire ? "fill-red-400" : ""}`} />
                  <span>🔥 {post.reactions.fire}</span>
                </button>

                {/* Strong reaction */}
                <button
                  onClick={() => handleReaction(post.id, "strong")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                    post.userReacted.strong 
                      ? "bg-primary-container/10 border-primary-fixed/30 text-primary-fixed font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <span className="text-[12px]">💪</span>
                  <span>{post.reactions.strong}</span>
                </button>

                {/* Clap reaction */}
                <button
                  onClick={() => handleReaction(post.id, "clap")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer active:scale-95 ${
                    post.userReacted.clap 
                      ? "bg-secondary-container/10 border-secondary-fixed-dim/30 text-secondary-fixed-dim font-bold" 
                      : "bg-white/5 border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  <span className="text-[12px]">👏</span>
                  <span>{post.reactions.clap}</span>
                </button>
              </div>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-white transition-colors cursor-pointer bg-transparent border-none"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.comments.length} comments</span>
              </button>
            </div>

            {/* Comments block */}
            {post.showComments && (
              <div className="space-y-sm bg-background/30 rounded-xl p-md border border-white/5">
                {post.comments.length > 0 ? (
                  <div className="space-y-sm max-h-[200px] overflow-y-auto pr-xs">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-xs leading-normal">
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
