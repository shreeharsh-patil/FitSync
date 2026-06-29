"use client";

import { useRef, useEffect, useCallback } from "react";

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function InfiniteScrollTrigger({ onLoadMore, hasMore, loading }: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, loading]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
          <span className="text-xs font-mono uppercase tracking-widest">Loading more...</span>
        </div>
      )}
      {!loading && (
        <button
          onClick={onLoadMore}
          className="text-xs font-mono uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors"
        >
          Load more posts
        </button>
      )}
    </div>
  );
}
