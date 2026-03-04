import json
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session

DATABASE_URL = "sqlite:///bookmarks.db"
engine = create_engine(DATABASE_URL)


class Bookmark(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str
    title: str
    tags: str  # stored as JSON string
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> dict:
        d = self.model_dump()
        d["tags"] = json.loads(d["tags"])
        return d


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
