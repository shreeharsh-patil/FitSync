"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export function SubscriptionsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadPage = async (p: number) => {
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getSubscriptions(p, statusFilter);
    setData(refreshed);
    setPage(p);
  };

  const filterByStatus = async (status: string) => {
    setStatusFilter(status);
    const mod = await import("@/lib/admin-actions");
    const refreshed = await mod.getSubscriptions(1, status);
    setData(refreshed);
    setPage(1);
  };

  const activeCount = data.subscriptions.filter((s: any) => s.status === "ACTIVE").length;
  const estimatedRevenue = activeCount * 29.99;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">Subscription Management</h1>
        <p className="text-muted-foreground mt-1">Overview of all subscription plans and billing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
              <p className="text-xl font-bold font-heading">{data.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Active</p>
              <p className="text-xl font-bold font-heading">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 glass border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Est. Monthly</p>
              <p className="text-xl font-bold font-heading">${estimatedRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "ACTIVE", "CANCELED", "PAST_DUE", "EXPIRED"].map((s) => (
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
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Plan</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Period End</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.subscriptions.map((sub: any) => (
                <tr key={sub.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/users/${sub.userId}`} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                        {sub.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{sub.user?.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">{sub.user?.email || ""}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold capitalize">{sub.plan}</span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-lg",
                      sub.status === "ACTIVE" ? "bg-secondary/10 text-secondary" :
                      sub.status === "PAST_DUE" ? "bg-yellow-400/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    )}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.subscriptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">{data.total} subscriptions total</p>
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
    </div>
  );
}
