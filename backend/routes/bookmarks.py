import json

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlmodel import Session, select, func

from models import Bookmark, get_session
from utils import extract_tags, normalize_url

router = APIRouter()


class BookmarkCreate(BaseModel):
    url: str


@router.post("/bookmarks", status_code=201)
async def create_bookmark(body: BookmarkCreate, session: Session = Depends(get_session)):
    url = body.url.strip()
    url = normalize_url(url)

    existing_bookmark = session.exec(select(Bookmark).where(Bookmark.url == url)).first()
    if existing_bookmark:
        raise HTTPException(status_code=409, detail="Bookmark already exists")

    title = url
    tags: list[str] = []
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            resp = await client.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"})
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "lxml")
            title_tag = soup.find("title")
            if title_tag and title_tag.string:
                title = title_tag.string.strip()[:300]
            tags = extract_tags(soup, url)
    except Exception:
        # notify error
        pass

    if not tags:
        tags = ["untagged"]

    bookmark = Bookmark(url=url, title=title, tags=json.dumps(tags))
    session.add(bookmark)
    session.commit()
    session.refresh(bookmark)

    return bookmark.to_dict()


@router.get("/bookmarks")
def list_bookmarks(
        session: Session = Depends(get_session),
        page: int = 1,
        page_size: int = 20,
):
    offset = (page - 1) * page_size
    bookmarks = session.exec(
        select(Bookmark).order_by(Bookmark.created_at.desc()).offset(offset).limit(page_size)
    ).all()
    total = session.exec(select(func.count(Bookmark.id))).one()

    return {
        "items": [b.to_dict() for b in bookmarks],
        "page": page,
        "page_size": page_size,
        "total": total,
        "pages": -(-total // page_size),  # ceiling division
    }


@router.delete("/bookmarks/{bookmark_id}", status_code=204)
def delete_bookmark(bookmark_id: int, session: Session = Depends(get_session)):
    bookmark = session.get(Bookmark, bookmark_id)
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    session.delete(bookmark)
    session.commit()
