# oseliocandido.tech

Source for [oseliocandido.tech](https://oseliocandido.tech) — Oselio Candido's personal portfolio and engineering blog.

## Tech stack

Plain static HTML, CSS, and vanilla JavaScript. No framework, no build step, no bundler — pages are served as-is.

## Structure

```
index.html                     Portfolio homepage
blog/index.html                Article listing, with discipline/tag filtering
blog/articles/<slug>/index.html  One article per folder (clean URL)
css/style.css                  Base site styles
css/components.css             Shared UI components (nav, cards, filter pills, etc.)
css/article.css                Article page typography/layout
data/articles.js               Single source of truth for the article index
scripts/generate_sitemap.py    Regenerates sitemap.xml and robots.txt from articles.js
scripts/update_reading_time.py Recomputes each article's reading time from its word count
deploy/nginx/                  Host nginx config for production
robots.txt / sitemap.xml       Generated — do not hand-edit, see scripts above
```

## The article system

`data/articles.js` drives everything: `blog/index.html` renders its cards and filters directly from `window.ARTICLES`, and the sitemap generator reads the same file. Each entry has:

- `slug` — must match the folder name under `blog/articles/`
- `title`, `desc`, `date` — publish date (ISO)
- `updated` — set by hand only after a real content edit; sitemap `<lastmod>` prefers this over `date` when present
- `readTime` — minutes, kept in sync by `update_reading_time.py`
- `discipline` — one of the slugs in `window.DISCIPLINES` (data-engineering, backend, frontend-ux, devops, architecture, ai-engineering)
- `tags` — free-form, lowercase, kebab-case
- `status` — `published`, `in-progress`, or `planned` (planned entries render as a roadmap card with no page and are skipped by the sitemap)
- `featured` — boolean

### Adding a new article

1. Copy an existing folder under `blog/articles/` (e.g. `blog/articles/alembic-migrations/`) to `blog/articles/<new-slug>/index.html` and rewrite the content inside `<article class="article-page__body">`. Keep the surrounding `<nav>`/head/footer boilerplate — relative paths are `../../../` from an article page.
2. Add a matching entry to `window.ARTICLES` in `data/articles.js`.
3. Run `python scripts/update_reading_time.py` to compute and fill in `readTime`.
4. Run `python scripts/generate_sitemap.py` to regenerate `sitemap.xml` and `robots.txt`.

Since pages use clean URLs (`blog/articles/<slug>/`), viewing the site locally needs a server, not `file://` — e.g. `python -m http.server` from the repo root.

## Deployment

`deploy/nginx/oseliocandido.tech.conf` is the production nginx config: HTTPS-only, `www` → apex redirect, per-file-type caching (HTML always revalidates, CSS/JS short-cached, images/fonts cached longer), and a locked-down CSP/security-header set duplicated into every `location` block (nginx doesn't merge `add_header` across nesting levels).

Deploy syncs a server-side git clone into the actual web root (`/var/www/oseliocandido.tech`), keeping `.git/` and repo-only files out of what's served. See the comment block at the top of the nginx config for the one-time server setup steps.

`google6da285a56b66c217.html` is a Google Search Console site-verification file — keep it in place; Google periodically re-checks it to keep the property verified.
