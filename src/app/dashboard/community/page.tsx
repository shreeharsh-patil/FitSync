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

  const fetchPosts = async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/posts", { signal });
      const json = await res.json();
      setPosts(json.posts || []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      console.error(e);
    }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const abort = new AbortController();
    fetchPosts(abort.signal);
    return () => abort.abort();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || posting) return;
    setPosting(true);
    try {
      await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newPost.trim() }) });
      setNewPost("");
      fetchPosts();
    } catch (e) { console.error(e); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  const getAvatar = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-text-secondary text-sm font-semibold mb-1"><Users className="h-4 w-4" />Community</div>
        <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-text-primary">Feed</h1>
        <p className="text-text-secondary text-sm mt-1">Connect with athletes and share your journey.</p>
      </motion.div>

      {/* Create Post */}
      <div className="rounded-2xl bg-bg-card border border-border p-5">
        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your workout, achievement, or question..."
          className="w-full bg-transparent text-text-primary text-sm resize-none h-20 focus:outline-none placeholder:text-text-muted" />
        <div className="flex justify-end pt-4 border-t border-border">
          <button onClick={handlePost} disabled={!newPost.trim() || posting}
            className="px-5 py-2.5 bg-accent-coral text-white font-bold text-sm rounded-xl disabled:opacity-50 flex items-center gap-2">
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-accent-coral" /></div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl bg-bg-card border border-border p-16 text-center text-text-muted text-sm">
          No posts yet. Be the first to share!
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, idx) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              className="rounded-xl bg-bg-card border border-border p-5 hover:border-border-hover transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-accent-coral/15 flex items-center justify-center text-xs font-bold text-accent-coral">
                  {post.userId?.name ? getAvatar(post.userId.name) : "??"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-text-primary">{post.userId?.name || "Unknown"}</span>
                    <span className="text-xs text-text-muted">{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-xs text-text-muted">
                <button onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-1.5 transition-colors ${post.likedBy?.length ? "text-accent-coral" : "hover:text-accent-coral"}`}>
                  <Heart className={`h-4 w-4 ${post.likedBy?.length ? "fill-accent-coral" : ""}`} />
                  {post.likes || 0}
                </button>
                <button className="flex items-center gap-1.5 hover:text-accent-coral transition-colors">
                  <MessageSquare className="h-4 w-4" />{post.comments?.length || 0}
                </button>
                <button className="flex items-center gap-1.5 hover:text-accent-coral transition-colors">
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
