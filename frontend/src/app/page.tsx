import { fetchBookmarks } from "@/app/actions";
import BookmarkList from "@/components/BookmarkList";
import Header from "@/components/Header";

export default async function Home() {
  let data = { items: [], pages: 0 };
  try {
    data = await fetchBookmarks(1);
  } catch {
    // backend not available, render empty state
  }

  return (
    <>
      <Header />
      <BookmarkList
        initialBookmarks={data.items}
        initialHasMore={data.pages > 1}
      />
    </>
  );
}