# Smart Bookmark Manager

Save bookmarks with extracted titles and tags.

## Prerequisites

- Python 3.11+
- Node.js 18+

## Quick Start (< 2 minutes)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

## Architecture

- **Backend**: FastAPI + SQLite. Tag extraction uses word-frequency analysis across meta keywords, meta description, and
  heading tags — no external ML API needed, works offline.
- **Frontend**: React + TypeScript + Next.js + Tailwind + shadcn.
- **Storage**: Single SQLite file (`backend/bookmarks.db`), auto-created on first run.


## What I'd add with another hour
- Right now tag extraction is frequency-based heuristics, which works well for content-rich pages but degrades on SPAs or
JS-rendered sites. With another hour I'd add a lightweight LLM call (e.g. Claude via API) as a fallback when the
heuristic produces fewer than 3 confident tags — pass it the title + meta description and ask for 3–5 topic tags.
- analytics
- error reporting - client and server
- unit tests
- ui tests
- use async orm.
- use environment variables for some of the variables.
- fix pagination. doesn't work well when adding and removing bookmarks.
- use a class for the pagination response instead of defining the json in the return statement.
- limit page size, for performance and security.
- use migrations, alembic for example.
- extract tags from non-static pages.
- users, so each user has his own urls and can delete only them.
- add cache for the metadata, if frequent requests for the same bookmarks happen.
- keep deleted bookmarks as rows with active=False, or as a log, or in a separate table.
- unreachable urls (unknown schema, unreachable domain, etc.) - do we want to allow them? warn about them? etc.
- make sure we really want to change http to https.
- better detect already existing bookmarks (for example, now a.com and a.com/ are not the same)
- add search, filters, sorting (for the bookmarks display).
- let the user edit the tags of the bookmarks.
- add animations - mark the new loaded bookmarks for some milliseconds so the user can easily see the new loaded
  bookmarks; scroll to the end of the page after loading new bookmarks.
- add favicon
- set focus on the input after adding a new bookmark, so the user can more easily add a new bookmark.