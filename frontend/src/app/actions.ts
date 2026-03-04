"use server";

import { API, PAGE_SIZE } from "@/lib/constants";
import { Bookmark } from "@/lib/types";

export async function fetchBookmarks(page: number): Promise<{ items: Bookmark[]; pages: number }> {
  const res = await fetch(`${API}/bookmarks?page=${page}&page_size=${PAGE_SIZE}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load bookmarks");
  return res.json();
}

export async function createBookmark(url: string): Promise<Bookmark> {
  const res = await fetch(`${API}/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || "Failed to add bookmark");
  }
  return res.json();
}

export async function deleteBookmark(id: number): Promise<void> {
  const res = await fetch(`${API}/bookmarks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete bookmark");
}