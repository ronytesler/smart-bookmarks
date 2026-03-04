"use client";
import { useState, useRef } from "react";
import { fetchBookmarks, createBookmark, deleteBookmark } from "@/app/actions";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import ErrorBanner from "@/components/ErrorBanner";
import BookmarksList from "@/components/BookmarksList";
import DeleteDialog from "@/components/DeleteDialog";
import { Bookmark } from "@/lib/types";

interface Props {
  initialBookmarks: Bookmark[];
  initialHasMore: boolean;
}

export default function BookmarkList({ initialBookmarks, initialHasMore }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  async function fetchMore(pageNum: number) {
    setLoadingMore(true);
    try {
      const data = await fetchBookmarks(pageNum);
      setBookmarks((prev) => [...prev, ...data.items]);
      setHasMore(pageNum < data.pages);
      setPage(pageNum);
      setTimeout(() => {
        loadMoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    } catch {
      setError("Could not load bookmarks.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const bookmark = await createBookmark(url.trim());
      setBookmarks((prev) => [bookmark, ...prev]);
      setUrl("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    setConfirmDeleteId(null);
    const previous = bookmarks; // save current state
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteBookmark(id);
    } catch {
      setBookmarks(previous); // restore bookmark list on failure
      setError("Delete failed.");
    }
  }

  return (
    <>
      <AddBookmarkForm url={url} adding={adding} onChange={setUrl} onSubmit={addBookmark} />
      {error && <ErrorBanner message={error} />}
      <BookmarksList
        bookmarks={bookmarks}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onDelete={setConfirmDeleteId}
        onLoadMore={() => fetchMore(page + 1)}
        loadMoreRef={loadMoreRef}
      />
      <DeleteDialog
          open={confirmDeleteId !== null}
          title="Remove bookmark?"
          description="This cannot be undone."
          onCancel={() => setConfirmDeleteId(null)}
          onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        />
    </>
  );
}