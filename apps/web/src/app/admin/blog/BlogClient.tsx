"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { deletePost } from "@/lib/admin-actions";

export function BlogClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await deletePost(id);
    if (res.success) {
      const mod = await import("@/lib/admin-actions");
      const refreshed = await mod.getPosts(page, statusFilter);
      setData(refreshed);
    }
  };

  const loadPage = async (p: number) => {
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getPosts(p, statusFilter);
    setData(refreshed);
    setPage(p);
  };

  const filterByStatus = async (status: string) => {
    setStatusFilter(status);
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getPosts(1, status);
    setData(refreshed);
    setPage(1);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Blog CMS</h1>
          <p className="text-muted-foreground mt-1">Create, edit and manage blog content.</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-secondary text-primary font-bold rounded-xl h-10">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "PUBLISHED", "DRAFT", "ARCHIVED"].map((s) => (
          <button
            key={s}
            onClick={() => filterByStatus(s)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
              statusFilter === s
                ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-white/5 text-muted-foreground border-transparent hover:bg-white/10"
            )}
          >
            {s === "ALL" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data.posts.map((post: any) => (
          <Card key={post.id} className="p-6 glass border-white/5 rounded-[2rem] hover:border-white/10 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                    post.status === "PUBLISHED" ? "bg-secondary/10 text-secondary" :
                    post.status === "DRAFT" ? "bg-yellow-400/10 text-yellow-400" :
                    "bg-white/5 text-muted-foreground"
                  )}>
                    {post.status}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{post.category}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {post.readingTimeMins || "?"} min read
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading truncate">{post.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span>By {post.author?.name || "Unknown"}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>{post.viewCount || 0} views</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {data.posts.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No posts found</p>
            <Link href="/admin/blog/new">
              <Button className="mt-4 bg-secondary text-primary font-bold rounded-xl">
                Create your first post
              </Button>
            </Link>
          </div>
        )}
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-muted-foreground">{data.total} posts total</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              disabled={page <= 1}
              onClick={() => loadPage(page - 1)}
              className="border-white/10 h-8 rounded-xl"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground font-bold px-2">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline" size="sm"
              disabled={page >= data.totalPages}
              onClick={() => loadPage(page + 1)}
              className="border-white/10 h-8 rounded-xl"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
