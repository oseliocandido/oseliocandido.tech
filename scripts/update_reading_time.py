#!/usr/bin/env python3
"""Recompute each article's reading time from its body word count.

Deterministic, build-time reading-time generation: 200 words/minute,
rounded up, minimum 1 minute. Run this after editing any article's prose.

    python website/scripts/update_reading_time.py
"""
import math
import re
from pathlib import Path

WORDS_PER_MINUTE = 200

ARTICLES_DIR = Path(__file__).resolve().parent.parent / "blog" / "articles"
ARTICLES_JS = Path(__file__).resolve().parent.parent / "data" / "articles.js"

BODY_RE = re.compile(r'<article class="article-page__body">(.*?)</article>', re.S)
TAG_RE = re.compile(r"<[^>]+>")
WORD_RE = re.compile(r"\b[\w'-]+\b")
META_SPAN_RE = re.compile(r"<span>\d+ min read</span>")


def word_count(body_html: str) -> int:
    text = TAG_RE.sub(" ", body_html)
    return len(WORD_RE.findall(text))


def reading_time(words: int) -> int:
    return max(1, math.ceil(words / WORDS_PER_MINUTE))


def update_article(path: Path) -> tuple[str, int, int] | None:
    html = path.read_text(encoding="utf-8")
    body_match = BODY_RE.search(html)
    if not body_match:
        return None

    words = word_count(body_match.group(1))
    minutes = reading_time(words)

    new_html, n = META_SPAN_RE.subn(f"<span>{minutes} min read</span>", html, count=1)
    if n == 0:
        return None

    if new_html != html:
        path.write_text(new_html, encoding="utf-8")

    return path.parent.name, words, minutes


def update_articles_js(reading_times: dict[str, int]) -> None:
    if not ARTICLES_JS.exists():
        return

    js = ARTICLES_JS.read_text(encoding="utf-8")

    def replace_entry(match: re.Match) -> str:
        block = match.group(0)
        slug_match = re.search(r"slug:\s*'([^']+)'", block)
        if not slug_match:
            return block
        slug = slug_match.group(1)
        minutes = reading_times.get(slug)
        if minutes is None:
            return block

        if re.search(r"readTime:\s*\d+", block):
            block = re.sub(r"readTime:\s*\d+", f"readTime: {minutes}", block)
        else:
            block = re.sub(
                r"(date:\s*'[^']*',\n)",
                rf"\1        readTime: {minutes},\n",
                block,
                count=1,
            )
        return block

    entry_re = re.compile(r"\{\s*slug:.*?\n\s*\},?", re.S)
    new_js = entry_re.sub(replace_entry, js)

    if new_js != js:
        ARTICLES_JS.write_text(new_js, encoding="utf-8")


def main() -> None:
    reading_times: dict[str, int] = {}
    rows = []

    for path in sorted(ARTICLES_DIR.glob("*/index.html")):
        result = update_article(path)
        if result is None:
            continue
        slug, words, minutes = result
        reading_times[slug] = minutes
        rows.append((slug, words, minutes))

    update_articles_js(reading_times)

    width = max((len(slug) for slug, _, _ in rows), default=4)
    for slug, words, minutes in rows:
        print(f"{slug.ljust(width)}  {words:>5} words  ->  {minutes} min read")


if __name__ == "__main__":
    main()
