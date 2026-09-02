#!/usr/bin/env python3
"""Generate sitemap.xml and robots.txt for the static site.

Reads data/articles.js as the single source of truth for which article
pages exist and when they were last updated. Run after publishing or
editing an article:

    python website/scripts/generate_sitemap.py

Set SITE_URL below once the site's real domain is decided.
"""
import re
from datetime import date
from pathlib import Path

SITE_URL = "https://oseliocandido.tech"

WEBSITE_DIR = Path(__file__).resolve().parent.parent
ARTICLES_JS = WEBSITE_DIR / "data" / "articles.js"
SITEMAP_PATH = WEBSITE_DIR / "sitemap.xml"
ROBOTS_PATH = WEBSITE_DIR / "robots.txt"

ENTRY_RE = re.compile(r"\{\s*slug:.*?\n\s*\},?", re.S)
FIELD_RE = re.compile(r"(\w+):\s*'([^']*)'")
STATUS_RE = re.compile(r"status:\s*'([^']*)'")


def parse_articles() -> list[dict]:
    js = ARTICLES_JS.read_text(encoding="utf-8")
    articles_block = js.split("window.ARTICLES = [", 1)[1]

    articles = []
    for entry in ENTRY_RE.findall(articles_block):
        status_match = STATUS_RE.search(entry)
        status = status_match.group(1) if status_match else "published"
        if status == "planned":
            continue  # no page exists yet for planned stubs

        fields = dict(FIELD_RE.findall(entry))
        if "slug" not in fields:
            continue
        # `updated` (set by hand after a real content edit) wins over `date`
        # (original publish date) for <lastmod>, since that's the field that
        # should change when — and only when — the content actually changes.
        lastmod = fields.get("updated") or fields.get("date", "")
        articles.append({"slug": fields["slug"], "lastmod": lastmod})

    return articles


def build_sitemap(articles: list[dict]) -> str:
    today = date.today().isoformat()

    urls = [
        {"loc": f"{SITE_URL}/", "lastmod": today},
        {"loc": f"{SITE_URL}/blog/", "lastmod": today},
    ]
    for article in articles:
        urls.append({
            "loc": f"{SITE_URL}/blog/articles/{article['slug']}/",
            "lastmod": article["lastmod"] or today,
        })

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{u['loc']}</loc>")
        lines.append(f"    <lastmod>{u['lastmod']}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    lines.append("")
    return "\n".join(lines)


def build_robots() -> str:
    return (
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {SITE_URL}/sitemap.xml\n"
    )


def main() -> None:
    articles = parse_articles()
    SITEMAP_PATH.write_text(build_sitemap(articles), encoding="utf-8")
    ROBOTS_PATH.write_text(build_robots(), encoding="utf-8")

    print(f"sitemap.xml: {len(articles) + 2} URLs")
    print(f"robots.txt written")
    if SITE_URL == "https://example.com":
        print("\nWARNING: SITE_URL is still a placeholder — edit it at the top "
              "of this script once the real domain is known, then rerun.")


if __name__ == "__main__":
    main()
