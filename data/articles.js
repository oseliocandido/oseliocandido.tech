/* Single source of truth for the article index.
   Loaded as a plain script (not fetch), but pages now use clean URLs
   (blog/articles/<slug>/) so viewing the site needs a local server, not file://
   (e.g. `python -m http.server` from website/).
   status: "published" | "in-progress" | "planned"
   discipline: one of DISCIPLINES below. tags: free-form, lowercase, kebab-case.
   date: original publish date. updated: set by hand after a real content
   edit — sitemap <lastmod> prefers this over date when present. */

window.DISCIPLINES = [
    { slug: 'data-engineering', label: 'Data Engineering' },
    { slug: 'backend', label: 'Backend Engineering' },
    { slug: 'frontend-ux', label: 'Frontend & UX' },
    { slug: 'devops', label: 'DevOps & CI/CD' },
    { slug: 'architecture', label: 'Architecture & Design' },
    { slug: 'ai-engineering', label: 'AI-Assisted Engineering' }
];

window.ARTICLES = [
    /* ── Published ─────────────────────────────────────────── */
    {
        slug: 'modular-etl-notebook-refactor',
        title: 'Breaking Apart a Monolithic ETL Codebase: Folder-Per-Entity Instead of File-Per-Layer',
        desc: 'A 639-line file defining every bus-layer table, and a 394-line script transforming all of them. Restructuring by domain entity instead of technical layer — the data-engineering mirror of a modular monolith.',
        date: '2026-09-02',
        readTime: 10,
        discipline: 'architecture',
        tags: ['databricks', 'code-quality'],
        status: 'published',
        featured: false
    },
    {
        slug: 'alembic-against-unity-catalog',
        title: 'Alembic Against a Lakehouse: Making Schema Migrations Work with Unity Catalog',
        desc: 'Version control and audit trail are the obvious wins. The real pain point was recreating identical schema objects across workspaces without a folder of DDL notebooks — what it took to get there with Alembic against Unity Catalog.',
        date: '2026-09-02',
        readTime: 15,
        discipline: 'data-engineering',
        tags: ['alembic', 'databricks', 'migrations'],
        status: 'published',
        featured: true
    },
    {
        slug: 'dependency-vulnerability-pipeline',
        title: 'Dependency Vulnerabilities as a Pipeline, Not a One-Off Fire Drill',
        desc: 'A shared GitLab CI/CD component, a private index that quarantines new releases for 7 days and CVE-flagged ones after a 14-day grace period, and a Teams webhook so the alerts get seen. How manual patch-when-noticed became a pipeline.',
        date: '2026-09-02',
        readTime: 10,
        discipline: 'devops',
        tags: ['ci-cd', 'security'],
        status: 'published',
        featured: false
    },
    {
        slug: 'medallion-architecture-multi-country',
        title: 'Medallion Architecture in Practice: Lessons from Building a Department Analytics Domain from Scratch',
        desc: 'A full star-schema HR domain — 30+ KPIs across 4+ markets — built layer by layer on Databricks, plus the multi-country schema lessons learned scaling it from 1 to 6 countries.',
        date: '2026-03-05',
        readTime: 18,
        discipline: 'data-engineering',
        tags: ['databricks'],
        status: 'published',
        featured: true
    },
    {
        slug: 'excel-to-databricks-ingestion',
        title: 'Excel to Databricks: Building a Metadata-Driven Ingestion Framework',
        desc: 'Filling a Databricks platform gap: building exact-once Excel ingestion with configurable load strategies.',
        date: '2026-06-30',
        readTime: 13,
        discipline: 'data-engineering',
        tags: ['databricks'],
        status: 'published',
        featured: false
    },
    {
        slug: 'asset-bundle-environment-promotion',
        title: 'One Workspace, Many Environments: Isolating Databricks Deployments Without Physical Separation',
        desc: 'Eight deployment tiers share one Databricks workspace — per-tier Terraform state, pause status, and permission templating do the isolation that separate infrastructure would otherwise provide.',
        date: '2025-11-03',
        readTime: 13,
        discipline: 'devops',
        tags: ['ci-cd', 'databricks'],
        status: 'published',
        featured: false
    },
    {
        slug: 'bundle-permissions-validate',
        title: "Databricks Asset Bundles: Making Permissions a Bundle-Level Contract",
        desc: "A missing reader group on one job led to centralizing access in the bundle's top-level permissions block — and to being precise about what bundle validate actually checks versus what centralizing the grant protects against.",
        date: '2025-12-12',
        readTime: 10,
        discipline: 'devops',
        tags: ['ci-cd'],
        status: 'published',
        featured: false
    },
    {
        slug: 'reusable-job-clusters',
        title: 'Sizing Compute as Code: Reusable Job Clusters for Databricks Pipelines',
        desc: 'Replacing a shared all-purpose cluster with three sized, ephemeral job-cluster presets defined as DAB complex variables — the sizing rationale, the Spot-with-fallback tradeoff, and what it took to make notebook initialization portable.',
        date: '2026-01-27',
        readTime: 12,
        discipline: 'data-engineering',
        tags: ['performance', 'databricks', 'cost'],
        status: 'published',
        featured: false
    },

    /* ── From the ERP / SaaS build ─────────────────────────── */
    {
        slug: 'mfa-totp-rfc6238',
        title: 'Adding TOTP-Based MFA Without Making Login Miserable',
        desc: 'Choosing TOTP over SMS, push, and passkeys; modeling login as an explicit state machine; trusted-device bearer tokens; and the enrollment, rate-limiting, and recovery details that make or break an MFA implementation.',
        date: '2026-09-02',
        readTime: 12,
        discipline: 'backend',
        tags: ['auth', 'security'],
        status: 'published',
        featured: true
    },
    {
        slug: 'tanstack-query-caching',
        title: "Designing a Trustworthy Frontend Cache with TanStack Query",
        desc: "Why refiltering a list shouldn't refetch it, and why invalidating that cache after a write still has to be scoped: query keys built from filter params, and invalidation that targets exactly what changed.",
        date: '2026-07-15',
        readTime: 11,
        discipline: 'frontend-ux',
        tags: ['react', 'tanstack-query', 'caching'],
        status: 'published',
        featured: false
    },
    {
        slug: 'domain-errors-http',
        title: 'Domain Errors That Speak HTTP: One Exception Base, Three Handlers',
        desc: 'Business rules raise domain exceptions; three global handlers translate them to HTTP. How routers stay thin when every error already knows its status code.',
        date: '2026-07-15',
        readTime: 10,
        discipline: 'backend',
        tags: ['fastapi', 'ddd'],
        status: 'published',
        featured: false
    },
    {
        slug: 'nginx-leaky-bucket-rate-limiting',
        title: 'Leaky Buckets at the Edge: Rate Limiting Login and Contact Endpoints in Nginx',
        desc: 'Leaky-bucket rate limits on the login and contact endpoints with nginx limit_req — the alternatives considered, the config, and the blind spot worth naming.',
        date: '2026-07-15',
        readTime: 7,
        discipline: 'devops',
        tags: ['nginx', 'security'],
        status: 'published',
        featured: false
    },
    {
        slug: 'nginx-config-walkthrough',
        title: 'Reading an Nginx Config Line by Line: TLS, Headers, Caching, and SPA Routing',
        desc: 'Content-hashed build assets cached for a year, HTML that stays revalidated, and the security headers and surface-reduction directives that cost nothing to keep on.',
        date: '2026-07-15',
        readTime: 11,
        discipline: 'devops',
        tags: ['nginx', 'caching'],
        status: 'published',
        featured: false
    },
    {
        slug: 'alembic-migrations',
        title: 'Migrations as Code: Six Advantages of Version-Controlled Database Changes',
        desc: 'From schema drift to versioned code: how Alembic tracks history with alembic_version, the async-to-sync URL trick in env.py, single-head validation in CI, and a real drop-table migration with a full downgrade.',
        date: '2026-07-15',
        readTime: 7,
        discipline: 'backend',
        tags: ['alembic', 'migrations', 'postgres', 'sqlalchemy'],
        status: 'published',
        featured: false
    },
    {
        slug: 'why-orm',
        title: 'Why Use an ORM (and What It Costs)',
        desc: 'Identity maps, unit-of-work, and the mapper layer that keeps domain entities free of SQLAlchemy — plus where the ORM ends and raw query services begin.',
        date: '2026-07-15',
        readTime: 7,
        discipline: 'backend',
        tags: ['sqlalchemy'],
        status: 'published',
        featured: false
    },
    {
        slug: 'password-hashing-upgrade',
        title: 'Hashes That Upgrade Themselves: verify_and_update on Login',
        desc: "CryptContext with deprecated=\"auto\" re-hashes a user's password to the newest algorithm the moment they log in — algorithm migration with no reset campaign.",
        date: '2026-07-15',
        readTime: 7,
        discipline: 'backend',
        tags: ['security'],
        status: 'published',
        featured: false
    },
    {
        slug: 'async-connection-pools-fastapi',
        title: 'Connection Pools in Async FastAPI: Sizing asyncpg + SQLAlchemy for a Real Product',
        desc: 'Pool size, overflow, and session-per-request in an async stack — what breaks under load, what the defaults hide, and the numbers that actually mattered in production.',
        date: '2026-07-15',
        readTime: 9,
        discipline: 'backend',
        tags: ['fastapi', 'postgres'],
        status: 'published',
        featured: true
    },
    {
        slug: 'cookie-auth-csrf-2fa',
        title: 'Stateful Sessions in Redis Instead of JWT: Why I Skipped Tokens',
        desc: 'Sliding-TTL sessions in Redis, double-submit CSRF bound to the session, and the revocation requirement that made stateless JWT the wrong default for a B2B SaaS.',
        date: '2026-07-15',
        readTime: 9,
        discipline: 'backend',
        tags: ['auth', 'security'],
        status: 'published',
        featured: false
    },
    {
        slug: 'empty-states-are-a-feature',
        title: 'Empty States Are a Feature: UX Decisions From Building an ERP Frontend',
        desc: 'Two different kinds of empty — no data yet vs. no filter match — and the one backend field (total) that makes it possible to tell them apart and show the right CTA.',
        date: '2026-07-15',
        readTime: 6,
        discipline: 'frontend-ux',
        tags: ['react', 'tanstack-query'],
        status: 'published',
        featured: true
    },
    {
        slug: 'modular-monolith-ddd',
        title: 'Designing a Modular Monolith: Architecture, Trade-offs, and Lessons Learned',
        desc: 'Domain, application, infrastructure, presentation — walked through with the real folder structure and real code of a purchase-orders module, not architecture theory.',
        date: '2026-07-15',
        readTime: 16,
        discipline: 'architecture',
        tags: ['ddd', 'fastapi'],
        status: 'published',
        featured: false
    },
    {
        slug: 'unit-of-work-domain-events',
        title: 'Unit of Work and Domain Events: Where Should a Transaction End?',
        desc: 'Three places a side effect can run relative to a database commit — inside the transaction, after it, or on a queue — and why dispatching after commit, off the request path, was the trade actually made.',
        date: '2026-07-15',
        readTime: 8,
        discipline: 'backend',
        tags: ['ddd', 'fastapi'],
        status: 'published',
        featured: false
    },
    {
        slug: 'docker-compose-dev-to-production',
        title: 'Docker Compose From Dev to Production: Sharing Infrastructure Without Sharing Everything',
        desc: 'A shared infra base with Postgres and Redis, a dev override that runs the app natively, and a production override with a loopback-only API and secrets injected by CI/CD.',
        date: '2026-07-15',
        readTime: 7,
        discipline: 'devops',
        tags: ['nginx'],
        status: 'published',
        featured: false
    },
    {
        slug: 'postgres-backups-docker-compose',
        title: 'Database Backups as Code: PostgreSQL Dumps with Docker Compose',
        desc: 'Postgres backups as a versioned Compose profile — a disposable pg_dump container, date-partitioned S3 keys, and the honest gap: restore has never actually been exercised.',
        date: '2026-07-15',
        readTime: 5,
        discipline: 'devops',
        tags: ['postgres'],
        status: 'published',
        featured: false
    }
];
