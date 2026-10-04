# Sujit Wagh · Portfolio

Personal portfolio for a Data & AI Engineer, with an AI assistant grounded in the site's own content.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Radix/shadcn-style primitives · Framer Motion · React Three Fiber · Google Gemini API (chat, structured output and embeddings) · Zod.

## Features

- **Ask Sujit**: a streaming chat assistant that answers only from portfolio content, cites the section it used, declines off-topic questions and says "I don't know" instead of guessing.
- **Job-fit analyzer**: paste a job description to get a match score, matching skills, gaps and the most relevant projects, returned as validated JSON.
- **Semantic search**: Gemini embeddings are built at build time into `src/data/embeddings.json` and searched by cosine similarity. It falls back to BM25 keyword search automatically when there is no key or index.
- **Intent greeting**: the hero line adapts to the visitor's stated reason for visiting, picked from fixed options with no free text.
- Command palette (Ctrl/Cmd + K), architecture playground, skill map, MDX case studies and notes, contact form with honeypot, timing check and optional Turnstile.
- SEO: metadata API, dynamic OG images, `sitemap.xml`, `robots.txt`, JSON-LD Person schema. Plausible analytics behind a flag.

## Editing content

Everything you edit lives in `content/`. You shouldn't need to touch components.

| File                      | What it controls                                                                 |
| ------------------------- | -------------------------------------------------------------------------------- |
| `content/site.ts`         | Name, role, positioning, about, education, achievements, links                   |
| `content/experience.ts`   | Timeline and the BFAL / Saarloha / KSSL / BFL entity cards                       |
| `content/skills.ts`       | Skill groups, depth (1–3) and which skills are used together                     |
| `content/architecture.ts` | Architecture playground nodes                                                    |
| `content/projects/*.mdx`  | One case study per file (frontmatter + Problem / Architecture / Stack / Outcome) |
| `content/blog/*.mdx`      | Notes                                                                            |

Projects support a few display fields in their frontmatter: `tagline` (the one line shown on the card), `metric` and `metricLabel` (the big number on the card cover), `icon` (one of `server`, `archive`, `boxes`, `key`, `settings`, `lock`, `map`, `scan`, `layers`, `workflow`, `trophy`, `code`), and `hidden: true` to keep an unfinished project off the site. The full write-up only appears on the project's own page.

To **add a project**, copy any file in `content/projects/`, rename it (the filename becomes the URL slug), edit the frontmatter and body, and rebuild. The chat, search and job-fit analyzer pick it up automatically after `npm run build`. In `next dev` they read the content live with keyword search.

Search the repo for `[PLACEHOLDER` to find everything still waiting for your input. The AI is told to treat placeholder text as unknown.

## Local development

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local      # add GEMINI_API_KEY
npm run dev                      # http://localhost:3000
```

### No API key yet? Use mock AI mode

```bash
echo "AI_MOCK=true" >> .env.local
npm run dev
```

The chat and job-fit analyzer then work end to end without calling Gemini:

- **Chat:** runs the real retrieval over your content, then streams an answer quoting the top sources, with citation chips.
- **Job-fit:** returns a keyword-overlap score, matching skills, gaps and relevant projects, in the same JSON shape the real model returns.
- **Labelling:** both panels show a **mock mode** badge.

Remove the flag (or set `AI_MOCK=false`) once you add `GEMINI_API_KEY`. Never enable it on a public deployment.

Other scripts:

```bash
npm run embeddings   # rebuild src/data/embeddings.json without a full build
npm run build        # runs embeddings, then next build
npm start            # serve the production build
npm run lint && npm run typecheck && npm run format:check
```

## Environment variables

See `.env.example` for the full list. Only `NEXT_PUBLIC_SITE_URL` and `GEMINI_API_KEY` are needed for the AI features. Get a key at https://aistudio.google.com/apikey. Without the key, the site still works and the AI panels show a "not configured" message.

API keys are read only on the server (`src/lib/ai/gemini.ts` imports `server-only`). Never give a secret a `NEXT_PUBLIC_` prefix.

**Models.** Text features use `gemini-3.5-flash-lite` by default (fast and cheap). For better answers set `GEMINI_MODEL=gemini-3.8-flash`. Semantic search uses `gemini-embedding-001`; embeddings are built during `npm run build` when the key is present. **Privacy:** on Gemini's free tier, Google may use prompts and responses to improve its products, so use a paid-tier key once the site is public. Rate limits are set in each route under `src/app/api/*`:

| Endpoint | Limit per IP      |
| -------- | ----------------- |
| chat     | 20 per 10 minutes |
| job-fit  | 6 per 10 minutes  |
| greeting | 10 per 10 minutes |
| search   | 60 per minute     |
| contact  | 3 per hour        |

## Deploy to Vercel

1. Push the repo to GitHub and import it at vercel.com/new. The framework is detected automatically.
2. In **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL`, `GEMINI_API_KEY`, and any optional variables (`GEMINI_MODEL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, Turnstile, Plausible).
3. **Add Upstash Redis** (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, available from the Vercel Marketplace). Serverless instances don't share memory, so without Redis the rate limit only applies per instance.
4. Deploy. `vercel.json` pins the region to Mumbai (`bom1`) and gives the AI routes 60 seconds.

## Self-host with Docker + Caddy (HTTPS)

On a server with Docker and a DNS A record pointing at it:

```bash
git clone <your-repo> portfolio && cd portfolio
cp .env.example .env            # fill in values, including DOMAIN and ACME_EMAIL
docker compose up -d --build
```

- **Caddy:** gets and renews Let's Encrypt certificates for `DOMAIN` automatically and doesn't buffer the streaming chat.
- **API key at build time:** `GEMINI_API_KEY` from `.env` is passed to the build as a BuildKit secret (for embeddings), so it never ends up in an image layer. The running container reads it from `.env` too.
- **Rate limiting:** the in-memory limiter is correct for a single container.

To update: `git pull && docker compose up -d --build`.

**Nginx instead of Caddy:** run only the app container (`docker compose up -d web`, and publish port 3000 to 127.0.0.1). Then use `deploy/nginx.conf` with certbot. The comments at the top of that file explain the setup.

## CI

`.github/workflows/ci.yml` runs the format check, lint, typecheck and production build on every push and pull request, then checks that the Docker image builds.

## Project structure

```
content/            # your content (TS + MDX)
scripts/            # build-embeddings.ts (prebuild)
src/app/            # routes, API handlers, server action, SEO routes, OG images
src/components/     # ui/, layout/, sections/, ai/, motion/, three/
src/lib/            # content loaders, corpus, AI (retrieval, prompts, schemas), rate limit
deploy/             # Caddyfile, nginx.conf
```
