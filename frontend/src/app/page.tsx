import { fetchBookmarks } from "@/app/actions";
import BookmarkList from "@/components/BookmarkList";
import Header from "@/components/Header";
import ErrorBanner from "@/components/ErrorBanner";

export default async function Home() {
  let data = { items: [], pages: 0 };
  let backendError = false;
  try {
    data = await fetchBookmarks(1);
  } catch {
    backendError = true;
  }

  return (
    <>
      <Header />
      {backendError && (
        <ErrorBanner message="Could not connect to the server. Please try again later." />
      )}
      <BookmarkList
        initialBookmarks={data.items}
        initialHasMore={data.pages > 1}
      />
    </>
  );
}