import json
import re
from urllib.parse import urlparse, urlunparse
from bs4 import BeautifulSoup
from collections import Counter

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
    "does", "did", "will", "would", "could", "should", "may", "might", "shall",
    "this", "that", "these", "those", "it", "its", "we", "our", "you", "your", "he",
    "she", "they", "their", "by", "from", "as", "if", "not", "no", "so", "up", "out",
}


def normalize_url(url: str) -> str:
    if "://" not in url:
        url = "https://" + url
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    normalized = parsed._replace(scheme="https", netloc=host)
    return urlunparse(normalized)


def extract_tags(soup: BeautifulSoup, url: str) -> list[str]:
    """Extract 3-5 meaningful tags from page content."""
    # Gather candidate text from meta keywords, headings, and body
    candidates = []

    # 1. Meta keywords
    meta_kw = soup.find("meta", attrs={"name": re.compile(r"keywords", re.I)})
    if meta_kw and meta_kw.get("content"):
        candidates += [k.strip().lower() for k in meta_kw["content"].split(",")]

    # 2. Meta description words
    meta_desc = soup.find("meta", attrs={"name": re.compile(r"description", re.I)})
    if meta_desc and meta_desc.get("content"):
        candidates += re.findall(r"\b[a-z][a-z]{3,}\b", meta_desc["content"].lower())

    # 3. Heading text (h1-h3)
    for tag in soup.find_all(["h1", "h2", "h3"]):
        candidates += re.findall(r"\b[a-z][a-z]{3,}\b", tag.get_text().lower())

    # 4. Domain as a tag
    domain_match = re.search(r"(?:https?://)?(?:www\.)?([^/]+)", url)
    if domain_match:
        domain_parts = domain_match.group(1).split(".")
        candidates += [p for p in domain_parts if len(p) > 3 and p not in ("com", "org", "net", "edu", "gov", "io")]

    # Filter stopwords, deduplicate, pick top by frequency
    filtered = [w for w in candidates if w not in STOPWORDS and len(w) > 3 and w.isalpha()]
    freq = Counter(filtered)
    top = [word for word, _ in freq.most_common(5)]

    # Ensure at least 3 tags — fallback to domain segments
    if len(top) < 3 and domain_match:
        top.append(domain_match.group(1).split(".")[0])

    return list(dict.fromkeys(top))[:5]  # deduplicated, max 5
