"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, Heart, Share2, Loader2, Send } from "lucide-react";

interface PostData {
  _id: string;
  userId: { _id: string; name: string; image?: string };
  content: string;
  likes: number;
  likedBy: string[];
  comments: { content: string; createdAt: string }[];
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const json = await res.json();
      setPosts(json.posts || []);
    } catch (e) {
      console.error("Failed to fetch posts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost.trim() }),
      });
      setNewPost("");
      fetchPosts();
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const getAvatar = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-purple-400 text-sm font-bold mb-1"><Users className="h-4 w-4" />Community</div>
        <h1 className="text-4xl font-bold font-heading tracking-tight text-white">Feed</h1>
        <p className="text-muted-foreground mt-1">Connect with athletes and share your journey.</p>
      </motion.div>

      {/* Create Post */}
      <div className="glass rounded-[2rem] border-white/5 p-6">
        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your workout, achievement, or question..."
          className="w-full bg-transparent text-white text-sm resize-none h-20 focus:outline-none placeholder:text-muted-foreground/40" />
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button onClick={handlePost} disabled={!newPost.trim() || posting}
            className="px-6 py-2.5 bg-secondary text-primary font-bold rounded-xl disabled:opacity-50 flex items-center gap-2">
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Post
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-[2rem] border-white/5 p-16 text-center text-muted-foreground text-sm">
          No posts yet. Be the first to share!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className="glass rounded-2xl border-white/5 p-6 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-sm font-bold text-primary">
                  {post.userId?.name ? getAvatar(post.userId.name) : "??"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{post.userId?.name || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5 text-xs text-muted-foreground">
                <button onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.likedBy?.length ? "text-secondary" : "hover:text-secondary"}`}>
                  <Heart className={`h-4 w-4 ${post.likedBy?.length ? "fill-secondary" : ""}`} />
                  {post.likes || 0}
                </button>
                <button className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments?.length || 0}
                </button>
                <button className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                  <Share2 className="h-4 w-4" />Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
