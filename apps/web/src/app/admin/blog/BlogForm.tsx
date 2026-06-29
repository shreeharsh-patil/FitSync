"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPost, updatePost } from "@/lib/admin-actions";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export function BlogForm({ post }: { post?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "Wellness",
    featuredImageUrl: post?.featuredImageUrl || "",
    tags: post?.tags || "",
    metaTitle: post?.metaTitle || "",
    metaDescription: post?.metaDescription || "",
    status: post?.status || "DRAFT",
    readingTimeMins: post?.readingTimeMins || 5,
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !post) {
      setForm((prev) => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.title || !form.slug || !form.excerpt || !form.content || !form.category) {
      setError("Title, slug, excerpt, content, and category are required");
      setSaving(false);
      return;
    }

    const data = {
      ...form,
      readingTimeMins: Number(form.readingTimeMins),
    };

    const res = post
      ? await updatePost(post.id, data)
      : await createPost(data);

    setSaving(false);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter post title"
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Slug *
            </label>
            <Input
              value={form.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="post-url-slug"
              className="h-10 bg-white/5 border-white/10 rounded-xl font-mono text-xs focus:border-secondary/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40"
            >
              <option value="Wellness">Wellness</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Training">Training</option>
              <option value="Recovery">Recovery</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Reading Time (mins)
            </label>
            <Input
              type="number"
              value={form.readingTimeMins}
              onChange={(e) => handleChange("readingTimeMins", parseInt(e.target.value) || 5)}
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Featured Image URL
            </label>
            <Input
              value={form.featuredImageUrl}
              onChange={(e) => handleChange("featuredImageUrl", e.target.value)}
              placeholder="https://..."
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Excerpt *
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            rows={3}
            placeholder="Brief summary of the post..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Content (Markdown) *
          </label>
          <textarea
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={16}
            placeholder="Write your post content in markdown..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40 font-mono resize-y"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Tags (comma separated)
            </label>
            <Input
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="fitness, health, workout"
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Meta Title
            </label>
            <Input
              value={form.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              placeholder="SEO title"
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Meta Description
            </label>
            <Input
              value={form.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              placeholder="SEO description"
              className="h-10 bg-white/5 border-white/10 rounded-xl focus:border-secondary/40"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-xs font-bold text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Link href="/admin/blog">
            <Button type="button" variant="ghost" className="border-white/10 border rounded-xl h-10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-secondary text-primary font-bold rounded-xl h-10 px-8"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
