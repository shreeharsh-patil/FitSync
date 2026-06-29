"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Search,
  Plus,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Loader2,
} from "lucide-react";
import {
  deleteExercise,
  createExercise,
  updateExercise,
} from "@/lib/admin-actions";

const categories = ["ALL", "STRENGTH", "CARDIO", "FLEXIBILITY", "BALANCE"];
const difficulties = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export function ExercisesClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "STRENGTH",
    muscleGroups: "",
    equipment: "",
    instructions: "",
    difficulty: "BEGINNER",
    videoUrl: "",
    gifUrl: "",
  });

  const loadPage = async (p: number) => {
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getExercises(p, search, category);
    setData(refreshed);
    setPage(p);
  };

  const handleSearch = async () => {
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getExercises(1, search, category);
    setData(refreshed);
    setPage(1);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({
      name: "",
      category: "STRENGTH",
      muscleGroups: "",
      equipment: "",
      instructions: "",
      difficulty: "BEGINNER",
      videoUrl: "",
      gifUrl: "",
    });
    setShowForm(true);
  };

  const openEdit = (ex: any) => {
    setEditId(ex.id);
    setForm({
      name: ex.name,
      category: ex.category,
      muscleGroups: ex.muscleGroups,
      equipment: ex.equipment,
      instructions: ex.instructions,
      difficulty: ex.difficulty,
      videoUrl: ex.videoUrl || "",
      gifUrl: ex.gifUrl || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.muscleGroups || !form.equipment || !form.instructions) return;
    setSaving(true);
    const res = editId
      ? await updateExercise(editId, form as any)
      : await createExercise(form as any);
    setSaving(false);
    if (res.success) {
      setShowForm(false);
      const mod = await import("@/lib/admin-actions");
      const refreshed = await mod.getExercises(page, search, category);
      setData(refreshed);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exercise?")) return;
    const res = await deleteExercise(id);
    if (res.success) {
      const mod = await import("@/lib/admin-actions");
      const refreshed = await mod.getExercises(page, search, category);
      setData(refreshed);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">Exercise Database</h1>
          <p className="text-muted-foreground mt-1">{data.total} exercises in library.</p>
        </div>
        <Button onClick={openCreate} className="bg-secondary text-primary font-bold rounded-xl h-10">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or muscle group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-10 bg-white/5 border-white/10 rounded-xl text-sm focus:border-secondary/40"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); }}
          className="h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-muted-foreground focus:outline-none focus:border-secondary/40"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
          ))}
        </select>
        <Button onClick={handleSearch} className="h-10 bg-secondary text-primary font-bold rounded-xl">
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.exercises.map((ex: any) => (
          <Card key={ex.id} className="p-5 glass border-white/5 rounded-[2rem] hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(ex)} className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white">
                  <Edit3 className="h-3 w-3" />
                </button>
                <button onClick={() => handleDelete(ex.id)} className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-sm truncate">{ex.name}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-secondary/10 text-secondary uppercase tracking-wider">
                {ex.category}
              </span>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent uppercase tracking-wider">
                {ex.difficulty}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">
              {ex.muscleGroups}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1">
              {ex.equipment}
            </p>
          </Card>
        ))}
      </div>

      {data.exercises.length === 0 && (
        <div className="text-center py-16">
          <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No exercises found</p>
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-muted-foreground">{data.total} exercises total</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => loadPage(page - 1)} className="border-white/10 h-8 rounded-xl">
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground font-bold px-2">Page {page} of {data.totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => loadPage(page + 1)} className="border-white/10 h-8 rounded-xl">
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl glass border-white/10 p-8 space-y-6 rounded-[2.5rem] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-heading">{editId ? "Edit Exercise" : "New Exercise"}</h2>
              <button onClick={() => setShowForm(false)} className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm">
                  {categories.filter(c => c !== "ALL").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-sm">
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Muscle Groups</label>
                <Input value={form.muscleGroups} onChange={(e) => setForm({ ...form, muscleGroups: e.target.value })} placeholder="Chest, Triceps" className="h-10 bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Equipment</label>
                <Input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="Barbell, Bench" className="h-10 bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Instructions</label>
                <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={6} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-secondary/40 resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Video URL</label>
                <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="h-10 bg-white/5 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GIF URL</label>
                <Input value={form.gifUrl} onChange={(e) => setForm({ ...form, gifUrl: e.target.value })} className="h-10 bg-white/5 border-white/10 rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="border-white/10 border rounded-xl h-10">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-secondary text-primary font-bold rounded-xl h-10">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
