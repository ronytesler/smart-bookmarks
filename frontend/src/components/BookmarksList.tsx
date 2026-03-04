"use client";
import BookmarkCard from "@/components/BookmarkCard";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/lib/types";

interface BookmarksListProps {
  bookmarks: Bookmark[];
  hasMore: boolean;
  loadingMore: boolean;
  onDelete: (id: number) => void;
  onLoadMore: () => Promise<void>;
  loadMoreRef: React.RefObject<HTMLButtonElement | null>;
}

export default function BookmarksList({ bookmarks, hasMore, loadingMore, onDelete, onLoadMore, loadMoreRef }: BookmarksListProps) {
  if (bookmarks.length === 0) {
    return <p className="text-sm text-zinc-400">No bookmarks yet — add one above</p>;
  }

  return (
    <>
      <p className="text-xs text-zinc-400 uppercase tracking-wide mb-4">
        {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
      </p>
      <div className="divide-y divide-zinc-100">
        {bookmarks.map((b) => (
          <BookmarkCard key={b.id} bookmark={b} onDelete={onDelete} />
        ))}
      </div>
      {hasMore && (
        <Button
          ref={loadMoreRef}
          variant="outline"
          className="w-full mt-6"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading…" : "Load more"}
        </Button>
      )}
    </>
  );
}