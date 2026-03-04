"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/lib/types"


interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  return (
    <div className="py-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors block truncate"
        >
          {bookmark.title}
        </a>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{bookmark.url}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-zinc-300 hover:text-red-500 shrink-0"
        onClick={() => onDelete(bookmark.id)}
      >
        ✕
      </Button>
    </div>
  );
}