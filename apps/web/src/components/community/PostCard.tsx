"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Flame,
  Heart,
  Share2,
  MessageSquare,
  Trash2,
  Youtube,
  Play,
} from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

interface Comment {
  author: string;
  avatar: string;
  content: string;
  time: string;
}

interface PostCardProps {
  post: {
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
  };
  currentUserInitials: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onDelete?: (postId: string) => void;
  onToggleComments: (postId: string) => void;
  commentsExpanded: boolean;
  isCurrentUserPost?: boolean;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export function PostCard({
  post,
  currentUserInitials,
  onLike,
  onComment,
  onDelete,
  onToggleComments,
  commentsExpanded,
  isCurrentUserPost,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mediaUrls = post.mediaUrls || [];
  const youtubeId = extractYouTubeId(post.content);
  const vimeoId = extractVimeoId(post.content);
  const hasVideoEmbed = youtubeId || vimeoId;

  const handleCommentSubmit = useCallback(() => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  }, [commentText, onComment, post.id]);

  return (
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
        {isCurrentUserPost && onDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(post.id)}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap">{post.content}</p>

      {post.achievementBadge && (
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-2xl p-4 border border-yellow-500/20 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Flame className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-yellow-300">{post.achievementBadge.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Achievement Unlocked</p>
          </div>
        </div>
      )}

      {post.workoutCard && (
        <div className="bg-gradient-to-br from-secondary/10 to-accent/5 rounded-2xl p-4 border border-secondary/20 flex items-center gap-4 group cursor-pointer hover:border-secondary/40 transition-all">
          <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
            <Flame className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-white group-hover:text-secondary transition-colors">
              {post.workoutCard.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {post.workoutCard.meta} &bull; {post.workoutCard.exercises} exercises
            </p>
          </div>
          <Play className="h-5 w-5 text-secondary/60 group-hover:text-secondary transition-colors" />
        </div>
      )}

      {post.workoutName && !post.workoutCard && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4 group cursor-pointer hover:border-secondary/20 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-white group-hover:text-secondary transition-colors">
              {post.workoutName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{post.workoutMeta}</p>
          </div>
        </div>
      )}

      {hasVideoEmbed && (
        <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video bg-black/40">
          {youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {vimeoId && (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title="Vimeo video"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      {mediaUrls.length > 0 && (
        <div className={mediaUrls.length === 1 ? "" : "grid grid-cols-2 gap-2"}>
          {mediaUrls.map((url, idx) => {
            const isVideo = isVideoUrl(url);
            return isVideo ? (
              <video
                key={idx}
                src={url}
                controls
                className="rounded-2xl w-full max-h-80 object-cover border border-white/5"
              />
            ) : (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="cursor-pointer focus:outline-none"
              >
                <img
                  src={url}
                  alt={`Media ${idx + 1}`}
                  className="rounded-2xl w-full max-h-80 object-cover border border-white/5 hover:opacity-90 transition-opacity"
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-6 pt-2 border-t border-white/5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
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
          onClick={() => onToggleComments(post.id)}
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

      {commentsExpanded && (
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
              {currentUserInitials}
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCommentSubmit(); }}
                className="bg-white/5 h-8 border-none text-xs"
              />
              <Button
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className="h-8 bg-secondary text-primary font-bold text-xs rounded-lg px-4 shadow-md shadow-secondary/15"
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={mediaUrls}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : mediaUrls.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev! < mediaUrls.length - 1 ? prev! + 1 : 0))}
        />
      )}
    </Card>
  );
}
