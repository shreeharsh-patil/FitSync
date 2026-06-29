"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  User,
  Dumbbell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  followTrainer,
  unfollowTrainer,
  bookSession,
  addTestimonial,
} from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TrainerProfileClientProps {
  trainer: any;
  currentUserId: string;
  isFollowing: boolean;
  publicWorkouts: any[];
  existingReview: any;
}

export function TrainerProfileClient({
  trainer,
  currentUserId,
  isFollowing: initialFollowing,
  publicWorkouts,
  existingReview,
}: TrainerProfileClientProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);

  const specialties: string[] = trainer.specialties
    ? JSON.parse(trainer.specialties)
    : [];
  const certifications: string[] = trainer.certifications
    ? JSON.parse(trainer.certifications)
    : [];

  const handleFollow = async () => {
    setFollowLoading(true);
    if (following) {
      const res = await unfollowTrainer(currentUserId, trainer.id);
      if (res.success) setFollowing(false);
    } else {
      const res = await followTrainer(currentUserId, trainer.id);
      if (res.success) setFollowing(true);
    }
    setFollowLoading(false);
  };

  const handleBookSession = async () => {
    if (!selectedPackage || !bookingDate || !bookingTime) return;
    setBookingLoading(true);
    const dateTime = new Date(`${bookingDate}T${bookingTime}`);
    const res = await bookSession(
      currentUserId,
      trainer.id,
      selectedPackage.id,
      dateTime
    );
    if (res.success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setSelectedPackage(null);
        setBookingDate("");
        setBookingTime("");
      }, 2000);
    } else {
      alert(res.error || "Booking failed");
    }
    setBookingLoading(false);
  };

  const handleAddReview = async () => {
    if (!reviewContent.trim()) return;
    setReviewLoading(true);
    const res = await addTestimonial(
      trainer.id,
      currentUserId,
      reviewContent,
      reviewRating
    );
    if (res.success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSuccess(false);
        setReviewContent("");
        setReviewRating(5);
      }, 2000);
    } else {
      alert(res.error || "Failed to add review");
    }
    setReviewLoading(false);
  };

  const displayTimeSlots = showAllTimeSlots
    ? trainer.timeSlots
    : trainer.timeSlots?.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Trainer Header */}
      <div className="relative">
        <div className="h-56 w-full rounded-[2.5rem] bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-6 px-8 -mt-24 relative z-10">
          <div className="h-44 w-44 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-2xl relative shrink-0">
            <div className="h-full w-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center">
              {trainer.user?.avatarUrl || trainer.user?.image ? (
                <Image
                  src={trainer.user.avatarUrl || trainer.user.image}
                  alt={trainer.user?.name || "Trainer"}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              ) : (
                <User className="h-20 w-20 text-white/50" />
              )}
            </div>
          </div>
          <div className="flex-1 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 w-full">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-heading tracking-tight text-white">
                {trainer.user?.name || "Trainer"}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= Math.round(trainer.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-bold text-muted-foreground ml-1">
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount} reviews)
                  </span>
                </div>
                {trainer.hourlyRate && (
                  <span className="flex items-center gap-1 text-sm font-bold text-secondary">
                    <DollarSign className="h-4 w-4" />
                    ${trainer.hourlyRate}/hr
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={following ? "outline" : "default"}
                className={`rounded-xl font-bold h-11 ${
                  following
                    ? "border-white/10 hover:bg-white/5"
                    : "bg-secondary hover:bg-secondary/90 text-primary shadow-lg shadow-secondary/15"
                }`}
              >
                {followLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : following ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
              <Button
                onClick={() => setShowReviewModal(true)}
                variant="outline"
                className="border-white/10 hover:bg-white/5 rounded-xl font-bold h-11 gap-2"
                disabled={!!existingReview}
              >
                <MessageSquare className="h-4 w-4" />
                {existingReview ? "Reviewed" : "Review"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading">About</h2>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-muted-foreground leading-relaxed font-medium">
                {trainer.bio || "No bio provided."}
              </p>
            </div>
            {trainer.experience && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4 text-secondary" />
                <span className="font-bold">
                  {trainer.experience}+ years of experience
                </span>
              </div>
            )}
          </Card>

          {/* Specialties & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {specialties.length > 0 ? (
                  specialties.map((s: string) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specialties listed.</p>
                )}
              </div>
            </Card>
            <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {certifications.length > 0 ? (
                  certifications.map((c: string) => (
                    <span
                      key={c}
                      className="px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No certifications listed.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Training Packages */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-secondary" />
              Training Packages
            </h2>
            {trainer.packages?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainer.packages.map((pkg: any) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -4 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-secondary/30 transition-all group"
                  >
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-secondary transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {pkg.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="space-y-1">
                        <span className="text-2xl font-bold font-heading text-secondary">
                          ${pkg.price}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{pkg.sessions} sessions</span>
                          <span>{pkg.durationWeeks} weeks</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowBookingModal(true);
                        }}
                        size="sm"
                        className="bg-secondary hover:bg-secondary/90 text-primary font-bold rounded-xl shadow-lg shadow-secondary/10"
                      >
                        Book
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No packages available yet.</p>
            )}
          </Card>

          {/* Public Workouts */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-accent" />
              Public Workouts
            </h2>
            {publicWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {publicWorkouts.map((w: any) => (
                  <Link key={w.id} href={`/workout/${w.id}`}>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all group cursor-pointer">
                      <h3 className="font-bold text-white group-hover:text-accent transition-colors">
                        {w.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="font-bold uppercase tracking-wider">
                          {w.difficulty}
                        </span>
                        <span>{w.daysPerWeek} days/wk</span>
                        <span>{w.exercises?.length || 0} exercises</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No public workouts yet.</p>
            )}
          </Card>

          {/* Testimonials */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Client Reviews
            </h2>
            {trainer.testimonials?.length > 0 ? (
              <div className="space-y-4">
                {trainer.testimonials.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center overflow-hidden">
                        {t.user?.avatarUrl || t.user?.image ? (
                          <Image
                            src={t.user.avatarUrl || t.user.image}
                            alt={t.user?.name || "User"}
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
                          {t.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i <= t.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Availability */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-secondary" />
              <h2 className="text-xl font-bold font-heading">Availability</h2>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  trainer.isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-bold text-muted-foreground">
                {trainer.isAvailable ? "Available for sessions" : "Currently unavailable"}
              </span>
            </div>
            {trainer.timeSlots?.length > 0 && (
              <div className="space-y-2">
                {displayTimeSlots?.map((slot: any) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm font-bold ${
                      slot.isBooked
                        ? "bg-white/5 border-white/5 text-muted-foreground line-through"
                        : "bg-secondary/5 border-secondary/20 text-secondary"
                    }`}
                  >
                    <span>{DAY_NAMES[slot.dayOfWeek]}</span>
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
                {trainer.timeSlots?.length > 8 && (
                  <Button
                    onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
                    variant="ghost"
                    className="w-full text-xs font-bold text-secondary hover:bg-secondary/10 rounded-xl"
                  >
                    {showAllTimeSlots ? "Show Less" : `Show All (${trainer.timeSlots.length})`}
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-8 glass border-white/5 rounded-[2.5rem] space-y-6">
            <h2 className="text-xl font-bold font-heading">Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">
                  Followers
                </span>
                <span className="text-lg font-bold font-heading text-white">
                  {trainer._count?.followers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">
                  Reviews
                </span>
                <span className="text-lg font-bold font-heading text-white">
                  {trainer._count?.testimonials || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-muted-foreground">
                  Packages
                </span>
                <span className="text-lg font-bold font-heading text-white">
                  {trainer.packages?.length || 0}
                </span>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/5 rounded-[2.5rem] space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-white">
                Ready to train?
              </h2>
              <p className="text-sm text-muted-foreground">
                Book a session with {trainer.user?.name?.split(" ")[0] || "this trainer"} and start your transformation.
              </p>
            </div>
            <Button
              onClick={() => {
                if (trainer.packages?.length > 0) {
                  setSelectedPackage(trainer.packages[0]);
                  setShowBookingModal(true);
                }
              }}
              disabled={!trainer.packages?.length}
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold h-14 rounded-2xl text-base shadow-xl shadow-secondary/10"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book a Session
            </Button>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedPackage && (
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
                    setShowBookingModal(false);
                    setBookingSuccess(false);
                  }}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {bookingSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-white">
                      Session Booked!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your session has been booked. Check your messages for confirmation.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-secondary" />
                        Book Session
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedPackage.name} - ${selectedPackage.price}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Date
                        </label>
                        <Input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Time
                        </label>
                        <Input
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="h-12 bg-white/5 border-white/10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowBookingModal(false)}
                        className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBookSession}
                        disabled={bookingLoading || !bookingDate || !bookingTime}
                        className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-bold h-12 rounded-xl shadow-lg shadow-secondary/10 gap-2"
                      >
                        {bookingLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Confirm Booking"
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

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
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
                    setShowReviewModal(false);
                    setReviewSuccess(false);
                  }}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {reviewSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto">
                      <Star className="h-10 w-10 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-white">
                      Review Submitted!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for your feedback.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-accent" />
                        Write a Review
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Share your experience with {trainer.user?.name?.split(" ")[0] || "this trainer"}.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Rating
                        </label>
                        <div className="flex items-center gap-2 px-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <button
                              key={i}
                              onClick={() => setReviewRating(i)}
                              className="transition-all hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  i <= reviewRating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">
                          Your Review
                        </label>
                        <textarea
                          placeholder="What was your experience like?"
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          className="w-full h-28 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/40 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowReviewModal(false)}
                        className="flex-1 border-white/10 border h-12 rounded-xl font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddReview}
                        disabled={reviewLoading || !reviewContent.trim()}
                        className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-accent/10 gap-2"
                      >
                        {reviewLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Submit Review"
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
