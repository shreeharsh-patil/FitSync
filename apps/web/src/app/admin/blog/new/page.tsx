import { BlogForm } from "../BlogForm";

export default function AdminBlogNewPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Create Blog Post</h1>
        <p className="text-muted-foreground mt-1">Write and publish new content.</p>
      </div>
      <BlogForm />
    </div>
  );
}
