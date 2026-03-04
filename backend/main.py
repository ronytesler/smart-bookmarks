from fastapi import FastAPI, Request
from routes.bookmarks import router as bookmarks_router

from models import init_db

app = FastAPI(title="Smart Bookmark Manager")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # notify error
    pass

# add the bookmarks router
app.include_router(bookmarks_router)

init_db()
