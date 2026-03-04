"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  url: string;
  adding: boolean;
  onChange: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddBookmarkForm({ url, adding, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-8">
      <Input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => onChange(e.target.value)}
        disabled={adding}
        className="flex-1"
      />
      <Button type="submit" disabled={adding || !url.trim()}>
        {adding ? "Saving…" : "Add"}
      </Button>
    </form>
  );
}