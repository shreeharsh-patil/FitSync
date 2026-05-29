"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-50">
      <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link className="flex items-center justify-center group" href="/">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Activity className="h-6 w-6" />
          </div>
          <span className="ml-3 text-2xl font-bold font-heading tracking-tighter">
            FitSync
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/blog"
          >
            Blog
          </Link>
        </nav>

        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-widest text-xs"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-widest text-xs px-6">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={cn(
          "md:hidden absolute top-20 left-0 right-0 bg-background border-b border-white/5 p-6 space-y-6 transition-all duration-300 origin-top",
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-4">
          <Link
            className="text-lg font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/features"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            className="text-lg font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/pricing"
            onClick={() => setIsMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            className="text-lg font-bold uppercase tracking-widest hover:text-secondary transition-colors"
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
        </nav>
        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full font-bold uppercase tracking-widest text-xs h-12"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-widest text-xs h-12"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
