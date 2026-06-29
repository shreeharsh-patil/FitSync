import db from "@/lib/db";
import { notFound } from "next/navigation";
import { BlogForm } from "../../BlogForm";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground mt-1">Update "{post.title}"</p>
      </div>
      <BlogForm post={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}
