# oseliocandido.tech

Source for [oseliocandido.tech](https://oseliocandido.tech) — a personal portfolio and engineering blog. Static HTML/CSS/JS, no build step or framework.

## Structure

```
index.html                  # Landing page (hero, about, contact)
blog/
├── index.html               # Article index (client-side filter/tag UI)
└── articles/<slug>/index.html   # One folder per article
data/
└── articles.js              # Article metadata (title, date, tags, discipline, status) — drives the blog index
css/
├── style.css                 # Base styles
├── components.css            # Shared components (nav, cards, filters)
└── article.css                # Article page layout
scripts/
├── generate_sitemap.py       # Regenerates sitemap.xml + robots.txt from data/articles.js
└── update_reading_time.py    # Recomputes each article's reading time from its word count
deploy/
└── nginx/oseliocandido.tech.conf   # Production nginx server config
```

## Adding an article

1. Create `blog/articles/<slug>/index.html` (copy the structure of an existing article).
2. Add an entry to `data/articles.js` (title, date, tags, discipline, status).
3. Run the maintenance scripts:
   ```bash
   python scripts/update_reading_time.py
   python scripts/generate_sitemap.py
   ```

## Local preview

Any static file server works, e.g.:

```bash
python -m http.server 8000
```

## Deployment

Served by nginx using the config in `deploy/nginx/oseliocandido.tech.conf`. `google6da285a56b66c217.html` is a Google Search Console site-verification file — keep it in place.
