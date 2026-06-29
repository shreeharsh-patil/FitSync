"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { uploadPostImage } from "@/lib/actions";

interface PostComposerProps {
  avatarInitials: string;
  displayName: string;
  onSubmit: (content: string, mediaUrls: string[]) => Promise<void>;
}

export function PostComposer({ avatarInitials, onSubmit }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadPostImage("temp", formData);
      if (result.success && result.url) {
        setMediaUrls((prev) => [...prev, result.url]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeMedia = (idx: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(content, mediaUrls);
      setContent("");
      setMediaUrls([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 glass border-white/5 rounded-[2rem]">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-secondary flex shrink-0 items-center justify-center font-bold text-primary shadow-lg shadow-secondary/15">
          {avatarInitials}
        </div>
        <div className="flex-1 space-y-4">
          <Input
            placeholder="Share your hypertrophy PRs, routine reviews, or energy metrics..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-white/5 border-none h-12 text-sm focus-visible:ring-secondary/40 text-white placeholder:text-muted-foreground"
          />

          {mediaUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Upload ${idx + 1}`}
                    className="h-20 w-20 rounded-xl object-cover border border-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-white gap-2 font-bold hover:bg-white/5 rounded-xl"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                {uploading ? "Uploading..." : "Add Photo"}
              </Button>
            </div>
            <Button
              type="submit"
              disabled={(!content.trim() && mediaUrls.length === 0) || submitting}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl px-8 h-10 shadow-lg shadow-secondary/15"
            >
              {submitting ? "Posting..." : "Post to Feed"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
