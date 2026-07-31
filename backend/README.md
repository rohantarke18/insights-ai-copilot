# iNSIGHTS Backend — Integration-Ready Build

This is the completed backend: Person C's platform module (which only had
hardcoded stub data and an empty DB schema) is now wired to a real SQLite
database, and the Search/DeepSearch module has been built from scratch and
connected to Person B's planner module. Everything below has been tested
end-to-end.

## What changed from the submitted version

**Person C's module (platform) — was incomplete, now finished:**
- `src/db/schema.js` was an empty file (0 bytes) — no tables existed at all.
  Replaced with real `CREATE TABLE` statements for sessions, sources, plans,
  workspaces, and workspace_items.
- Added `src/db/connection.js` and `src/db/models/*.js` — real, tested CRUD
  functions used by all three modules.
- `src/modules/platform/service.js` previously ignored `userId` entirely and
  always returned the same 3 hardcoded objects. Now reads/writes the real DB
  — verified two different user IDs return different (correct) data.

**Search module (Search/DeepSearch) — built new:**
- `src/modules/search/providers/webSearch.js` — Tavily web search
- `src/modules/search/providers/githubSearch.js` — GitHub repo search
- `src/modules/search/providers/arxivSearch.js` — arXiv paper search
- `src/modules/search/summarizer.js` — Claude-generated citation-backed summary
- `src/modules/search/service.js` — orchestrates all three providers in
  parallel, assigns citation numbers, saves to DB
- **Bug found and fixed during testing:** GitHub's search API AND-matches
  every word in the query. Sending a full idea sentence like "Reduce food
  waste in college hostels using AI" returned **zero results** because
  filler words like "in"/"using" rarely co-occur in real repo text.
  `githubSearch.js` now strips stopwords and searches on the 5 most salient
  keywords instead — verified this returns genuinely relevant repos.
- **Resilience fix:** if the LLM summary call fails (bad/missing API key,
  rate limit, network blip) but search results were found, the session is
  now marked `"completed"` with a fallback summary — not `"failed"`. Losing
  a nicely-written paragraph is a much smaller problem than throwing away
  valid search results the user is waiting on.

**Person B's module (planner) — was solid, two small fixes:**
- `.env.example` was missing `ANTHROPIC_API_KEY`, even though the code
  requires it. Added.
- Swapped `fakeData.js` for real DB reads (`sessions`/`sources` tables) now
  that they actually exist. Also added caching: a generated plan is now
  saved to the `plans` table so navigating back to Project Hub doesn't
  re-call the LLM and risk a different answer each time.

**Server setup:**
- `server.js` now initializes the DB schema on boot and mounts all three
  modules (`platform`, `planner`, `search`).
- Added a `start` script to `package.json` (it was missing) and swapped
  `sqlite3` → `better-sqlite3` (simpler synchronous API, no callback hell,
  nothing in the old code actually used `sqlite3` anyway).

## How the flow works (important — matches the frontend exactly)

The frontend's mock `api.ts` treats `createResearchSession` as a **single
blocking call** that returns already-completed results — it does not poll a
"processing" status. So `POST /api/sessions` here does the same: it runs the
full search + summarize pipeline before responding. This means the request
can take 5–15 seconds, which is fine — the frontend's existing multi-step
loading UI ("Searching sources...", "Drafting...") already covers that wait.
**No frontend changes are needed.**

## Setup

```bash
cd backend
npm install
cp .env.example .env
# then fill in .env — see below for what's required vs optional
npm start
```

Server runs on `http://localhost:5000` (or whatever `PORT` you set).

## Environment variables — who needs to get what

| Variable | Required? | What breaks without it | Where to get it |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Project plans (502 error) and DeepSearch summaries fall back to plain "sources found, no summary" text | https://console.anthropic.com |
| `TAVILY_API_KEY` | Recommended | Web search results are skipped — GitHub + arXiv sources still work fine | https://tavily.com (free tier) |
| `GITHUB_TOKEN` | Optional | GitHub search rate-limits at 60 req/hour instead of 5000/hour — matters if multiple teammates test at once | https://github.com/settings/tokens (no scopes needed) |
| `DB_PATH` | No | Defaults to `./database.sqlite` | — |
| `PORT` | No | Defaults to `5000` | — |

**Get `ANTHROPIC_API_KEY` sorted first** — nothing that matters for the demo
(plans, summaries) works without it.

## Endpoints (all tested, exact shapes match `frontend/src/types.ts`)

```
POST   /api/sessions                              → ResearchSession
GET    /api/sessions/:sessionId/deepsearch         → DeepSearchResults
GET    /api/sessions/:sessionId/plan               → ProjectPlan
GET    /api/dashboard/:userId                      → DashboardData
GET    /api/workspaces/:userId                     → Workspace[]
POST   /api/workspaces                             → Workspace
POST   /api/workspaces/:workspaceId/save           → { success: true }
DELETE /api/workspaces/:workspaceId/items/:itemId  → { success: true }
GET    /api/health                                 → { status: "ok" }
```

## Testing checklist before the demo

Run these in order once `.env` is filled in:

1. `curl -X POST http://localhost:5000/api/sessions -H "Content-Type: application/json" -d '{"ideaText":"your idea here"}'`
   → should return `"status":"completed"` and `"sourcesCount"` > 0
2. Copy the `sessionId` from step 1, then:
   `curl http://localhost:5000/api/sessions/<sessionId>/deepsearch`
   → should show a real summary (not the fallback text) referencing `[1]`, `[2]`, etc.
3. `curl http://localhost:5000/api/sessions/<sessionId>/plan`
   → should return architecture/techStack/milestones — try 2-3 different
   idea texts and confirm the tech stack actually differs between them
4. `curl http://localhost:5000/api/dashboard/user-student-1`
   → stats should reflect however many sessions/sources/plans you just created
5. Point the frontend's `services/api.ts` base URL at `http://localhost:5000/api`
   and click through all 5 screens once, end to end, before the demo — don't
   discover a mismatch live on stage.

## Known limitations (be aware, not necessarily worth fixing before finale)

- No auth — everything defaults to a single `user-student-1`. Fine for a
  demo, not fine for production.
- arXiv search may occasionally 403/timeout depending on network — it
  degrades gracefully (just fewer sources), doesn't break anything.
- SQLite is a single file (`database.sqlite`) — fine for a demo, don't
  deploy multiple server instances against it concurrently.
