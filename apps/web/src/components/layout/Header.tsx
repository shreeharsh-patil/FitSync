"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "w-full fixed top-0 z-50 transition-all duration-500 px-6 lg:px-12",
        scrolled ? "h-20 bg-background/80 backdrop-blur-xl border-b border-white/5" : "h-24 bg-transparent"
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between">
        <Link className="flex items-center justify-center group" href="/">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 group-hover:bg-secondary/20 transition-all shadow-[0_0_15px_rgba(0,201,167,0.1)] group-hover:shadow-[0_0_20px_rgba(0,201,167,0.3)]"
          >
            <Activity className="h-6 w-6" />
          </motion.div>
          <span className="ml-3 text-2xl font-bold font-heading tracking-tighter text-white">
            FitSync
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10">
          {["Features", "Pricing", "Blog"].map((item) => (
            <Link
              key={item}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors relative group"
              href={`/${item.toLowerCase()}`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-secondary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login">
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-[0.2em] text-[10px] text-muted-foreground hover:text-white hover:bg-white/5"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-[0.2em] text-[10px] px-8 h-11 rounded-xl shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 fill-primary" />
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b border-white/5 p-8 space-y-8 shadow-2xl"
          >
            <nav className="flex flex-col gap-6">
              {["Features", "Pricing", "Blog"].map((item) => (
                <Link
                  key={item}
                  className="text-xl font-bold uppercase tracking-[0.2em] text-white hover:text-secondary transition-colors"
                  href={`/${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-4 pt-8 border-t border-white/5">
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full font-bold uppercase tracking-[0.2em] text-xs h-14 border-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold uppercase tracking-[0.2em] text-xs h-14"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
