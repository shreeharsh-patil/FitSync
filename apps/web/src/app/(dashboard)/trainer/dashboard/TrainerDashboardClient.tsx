"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Dumbbell,
  MessageSquare,
  Clock,
  Star,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  User,
  Edit3,
  Activity,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  createTrainingPackage,
  createTimeSlot,
  deleteTimeSlot,
  sendMessage,
} from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TrainerDashboardClientProps {
  trainer: any;
  stats: any;
  clients: any[];
  bookings: any[];
  user: any;
}

export function TrainerDashboardClient({
  trainer,
  stats,
  clients,
  bookings,
  user,
}: TrainerDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "clients" | "packages" | "schedule" | "messages"
  >("overview");

  // Package creation state
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [pkgName, setPkgName] = useState("");
  const [pkgDesc, setPkgDesc] = useState("");
  const [pkgSessions, setPkgSessions] = useState(4);
  const [pkgPrice, setPkgPrice] = useState(99);
  const [pkgWeeks, setPkgWeeks] = useState(4);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgSuccess, setPkgSuccess] = useState(false);

  // Time slot creation
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotDay, setSlotDay] = useState(1);
  const [slotStart, setSlotStart] = useState("09:00");
  const [slotEnd, setSlotEnd] = useState("10:00");
  const [slotLoading, setSlotLoading] = useState(false);

  // Message state
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Profile editing
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileBio, setProfileBio] = useState(trainer.bio || "");
  const [profileSpecialties, setProfileSpecialties] = useState(
    trainer.specialties ? JSON.parse(trainer.specialties).join(", ") : ""
  );
  const [profileCerts, setProfileCerts] = useState(
    trainer.certifications ? JSON.parse(trainer.certifications).join(", ") : ""
  );
  const [profileExperience, setProfileExperience] = useState(trainer.experience || 0);
  const [profileRate, setProfileRate] = useState(trainer.hourlyRate || 0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleCreatePackage = async () => {
    if (!pkgName || !pkgSessions || !pkgPrice) return;
    setPkgLoading(true);
    const res = await createTrainingPackage(trainer.id, {
      name: pkgName,
      description: pkgDesc,
      sessions: pkgSessions,
      price: pkgPrice,
      durationWeeks: pkgWeeks,
    });
    if (res.success) {
      setPkgSuccess(true);
      setTimeout(() => {
        setShowPackageModal(false);
        setPkgSuccess(false);
        setPkgName("");
        setPkgDesc("");
        setPkgSessions(4);
        setPkgPrice(99);
        setPkgWeeks(4);
      }, 1500);
    } else {
      alert(res.error || "Failed to create package");
    }
    setPkgLoading(false);
  };

  const handleCreateSlot = async () => {
    setSlotLoading(true);
    const res = await createTimeSlot(trainer.id, {
      dayOfWeek: slotDay,
      startTime: slotStart,
      endTime: slotEnd,
    });
    if (res.success) {
      setShowSlotModal(false);
      setSlotDay(1);
      setSlotStart("09:00");
      setSlotEnd("10:00");
    } else {
      alert(res.error || "Failed to create slot");
    }
    setSlotLoading(false);
  };

  const handleDeleteSlot = async (slotId: string) => {
    const res = await deleteTimeSlot(slotId);
    if (!res.success) alert(res.error || "Failed to delete slot");
  };

  const handleSendMessage = async () => {
    if (!selectedClient || !messageText.trim()) return;
    setMessageLoading(true);
    const res = await sendMessage(user.id, selectedClient.user.id, messageText);
    if (res.success) {
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
        setMessageText("");
      }, 1500);
    } else {
      alert(res.error || "Failed to send message");
    }
    setMessageLoading(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "clients", label: "Clients", icon: Users },
    { id: "packages", label: "Packages", icon: Dumbbell },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold font-heading tracking-tight text-white">
            Trainer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your clients, packages, and schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/trainer/${trainer.id}`}>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 rounded-xl font-bold"
            >
              View Public Profile
            </Button>
          </Link>
          <Button
            onClick={() => setShowProfileModal(true)}
            variant="outline"
            className="border-white/10 hover:bg-white/5 rounded-xl font-bold gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/40 p-1 rounded-xl border border-white/5 overflow-x-auto gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs h-9 px-4 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-background text-secondary shadow-md border border-white/5"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <tab.icon className="h-4 w-4 mr-1.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-heading text-white">
                {stats?.clientCount || 0}
              </p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                Active Clients
              </p>
            </Card>
            <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-heading text-white">
                {stats?.totalBookings || 0}
              </p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                Total Bookings
              </p>
            </Card>
            <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-yellow-400/15 flex items-center justify-center text-yellow-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-heading text-white">
                ${stats?.totalRevenue || 0}
              </p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                Revenue
              </p>
            </Card>
            <Card className="p-6 glass border-white/5 rounded-[2rem] space-y-3">
              <div className="h-10 w-10 rounded-xl bg-green-400/15 flex items-center justify-center text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold font-heading text-white">
                {stats?.completionRate || 0}%
              </p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                Completion Rate
              </p>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading">Recent Bookings</h2>
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b: any) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden">
                        {b.user?.avatarUrl || b.user?.image ? (
                          <Image
                            src={b.user.avatarUrl || b.user.image}
                            alt={b.user?.name || ""}
                            width={40}
                            height={40}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-white/50" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {b.user?.name || "Client"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.package?.name} - {new Date(b.dateTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        b.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-400"
                          : b.status === "CONFIRMED"
                          ? "bg-blue-500/10 text-blue-400"
                          : b.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No bookings yet.</p>
            )}
          </Card>
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === "clients" && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading">Client List</h2>
            <span className="text-sm text-muted-foreground font-bold">
              {clients.length} client{clients.length !== 1 ? "s" : ""}
            </span>
          </div>
          {clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map((client: any) => (
                <div
                  key={client.user.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                        {client.user?.avatarUrl || client.user?.image ? (
                          <Image
                            src={client.user.avatarUrl || client.user.image}
                            alt={client.user?.name || ""}
                            width={48}
                            height={48}
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-white/50" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {client.user?.name || "Client"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {client.package?.name} &middot; {client.bookingCount} booking{client.bookingCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedClient(client);
                          setActiveTab("messages");
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-secondary hover:bg-secondary/10 rounded-xl"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {client.latestProgress && (
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t border-white/5 pt-4">
                      {client.latestProgress.weight && (
                        <span className="font-bold">
                          Last weight: {client.latestProgress.weight} kg
                        </span>
                      )}
                      <span>
                        Last session: {new Date(client.lastSession).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No clients yet. Share your profile to get started.</p>
            </div>
          )}
        </Card>
      )}

      {/* Packages Tab */}
      {activeTab === "packages" && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading">Your Packages</h2>
            <Button
              onClick={() => setShowPackageModal(true)}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl gap-2 shadow-lg shadow-secondary/10"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </Button>
          </div>
          {trainer.packages?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainer.packages.map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold font-heading text-white">{pkg.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        pkg.isActive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pkg.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-bold">{pkg.sessions} sessions</span>
                      <span className="font-bold">{pkg.durationWeeks} weeks</span>
                    </div>
                    <span className="text-xl font-bold font-heading text-secondary">
                      ${pkg.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No packages created yet.</p>
              <Button
                onClick={() => setShowPackageModal(true)}
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Package
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-heading">Available Time Slots</h2>
            <Button
              onClick={() => setShowSlotModal(true)}
              className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl gap-2 shadow-lg shadow-secondary/10"
            >
              <Plus className="h-4 w-4" />
              Add Slot
            </Button>
          </div>
          {trainer.timeSlots?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trainer.timeSlots.map((slot: any) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {DAY_NAMES[slot.dayOfWeek]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {slot.isBooked && (
                      <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                        Booked
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="h-7 w-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No time slots set. Add your availability.</p>
              <Button
                onClick={() => setShowSlotModal(true)}
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Time Slot
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold font-heading">
            {selectedClient
              ? `Message ${selectedClient.user?.name || "Client"}`
              : "Message a Client"}
          </h2>
          {selectedClient ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                  {selectedClient.user?.avatarUrl || selectedClient.user?.image ? (
                    <Image
                      src={selectedClient.user.avatarUrl || selectedClient.user.image}
                      alt={selectedClient.user?.name || ""}
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <User className="h-6 w-6 text-white/50" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">
                    {selectedClient.user?.name || "Client"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedClient.package?.name}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedClient(null)}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-muted-foreground hover:text-white"
                >
                  Change
                </Button>
              </div>

              {messageSent ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <p className="font-bold text-white">Message Sent!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-secondary/40 text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={messageLoading || !messageText.trim()}
                    className="bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                  >
                    {messageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    Send Message
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {clients.length > 0 ? (
                clients.map((client: any) => (
                  <div
                    key={client.user.id}
                    onClick={() => setSelectedClient(client)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 transition-all cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                      {client.user?.avatarUrl || client.user?.image ? (
                        <Image
                          src={client.user.avatarUrl || client.user.image}
                          alt={client.user?.name || ""}
                          width={48}
                          height={48}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6 text-white/50" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{client.user?.name || "Client"}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.package?.name}
                      </p>
                    </div>
                    <MessageSquare className="h-5 w-5 text-secondary ml-auto" />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No clients to message yet.
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Create Package Modal */}
      <AnimatePresence>
        {showPackageModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
                <button
                  onClick={() => {
                    setShowPackageModal(false);
                    setPkgSuccess(false);
                  }}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {pkgSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-white">Package Created!</h3>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-secondary" />
                        Create Package
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Define a new training package for your clients.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Package Name
                        </label>
                        <Input
                          value={pkgName}
                          onChange={(e) => setPkgName(e.target.value)}
                          placeholder="e.g. 4-Week Strength Builder"
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Description
                        </label>
                        <textarea
                          value={pkgDesc}
                          onChange={(e) => setPkgDesc(e.target.value)}
                          placeholder="Describe what this package includes..."
                          className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                            Sessions
                          </label>
                          <Input
                            type="number"
                            value={pkgSessions}
                            onChange={(e) => setPkgSessions(parseInt(e.target.value) || 1)}
                            className="h-12 bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                            Duration (weeks)
                          </label>
                          <Input
                            type="number"
                            value={pkgWeeks}
                            onChange={(e) => setPkgWeeks(parseInt(e.target.value) || 1)}
                            className="h-12 bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Price ($)
                        </label>
                        <Input
                          type="number"
                          value={pkgPrice}
                          onChange={(e) => setPkgPrice(parseFloat(e.target.value) || 0)}
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowPackageModal(false)}
                        className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePackage}
                        disabled={pkgLoading || !pkgName}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                      >
                        {pkgLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Create Package"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Time Slot Modal */}
      <AnimatePresence>
        {showSlotModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
                <button
                  onClick={() => setShowSlotModal(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    Add Time Slot
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Set your weekly availability for client bookings.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                      Day of Week
                    </label>
                    <select
                      value={slotDay}
                      onChange={(e) => setSlotDay(parseInt(e.target.value))}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-secondary/40"
                    >
                      {DAY_NAMES.map((day, idx) => (
                        <option key={idx} value={idx} className="bg-[#0f172a] text-white">
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                        Start Time
                      </label>
                      <Input
                        type="time"
                        value={slotStart}
                        onChange={(e) => setSlotStart(e.target.value)}
                        className="h-12 bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                        End Time
                      </label>
                      <Input
                        type="time"
                        value={slotEnd}
                        onChange={(e) => setSlotEnd(e.target.value)}
                        className="h-12 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSlotModal(false)}
                    className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSlot}
                    disabled={slotLoading}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                  >
                    {slotLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add Slot"
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg"
            >
              <Card className="glass border-white/10 p-8 space-y-6 relative rounded-[2.5rem] shadow-2xl">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {profileSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-white">Profile Updated!</h3>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-secondary" />
                        Edit Trainer Profile
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Update your professional profile.
                      </p>
                    </div>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Bio
                        </label>
                        <textarea
                          value={profileBio}
                          onChange={(e) => setProfileBio(e.target.value)}
                          placeholder="Tell clients about yourself..."
                          className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Specialties (comma-separated)
                        </label>
                        <Input
                          value={profileSpecialties}
                          onChange={(e) => setProfileSpecialties(e.target.value)}
                          placeholder="e.g. Strength Training, HIIT, Yoga"
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Certifications (comma-separated)
                        </label>
                        <Input
                          value={profileCerts}
                          onChange={(e) => setProfileCerts(e.target.value)}
                          placeholder="e.g. NASM-CPT, ACE, CSCS"
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                            Experience (years)
                          </label>
                          <Input
                            type="number"
                            value={profileExperience}
                            onChange={(e) => setProfileExperience(parseInt(e.target.value) || 0)}
                            className="h-12 bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                            Hourly Rate ($)
                          </label>
                          <Input
                            type="number"
                            value={profileRate}
                            onChange={(e) => setProfileRate(parseFloat(e.target.value) || 0)}
                            className="h-12 bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowProfileModal(false)}
                        className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          setProfileLoading(true);
                          const { updateTrainerProfile } = await import("@/lib/actions");
                          const res = await updateTrainerProfile(trainer.id, {
                            bio: profileBio,
                            specialties: JSON.stringify(
                              profileSpecialties.split(",").map((s: string) => s.trim()).filter(Boolean)
                            ),
                            certifications: JSON.stringify(
                              profileCerts.split(",").map((s: string) => s.trim()).filter(Boolean)
                            ),
                            experience: profileExperience || undefined,
                            hourlyRate: profileRate || undefined,
                          });
                          if (res.success) {
                            setProfileSuccess(true);
                            setTimeout(() => {
                              setShowProfileModal(false);
                              setProfileSuccess(false);
                            }, 1500);
                          } else {
                            alert(res.error || "Failed to update");
                          }
                          setProfileLoading(false);
                        }}
                        disabled={profileLoading}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                      >
                        {profileLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
