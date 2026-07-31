# R-SYNC

**Find your perfect next transition.** An intelligent DJ transition assistant —
BPM compatibility, harmonic (Camelot Wheel) matching, genre, energy, and AI-explained
recommendations, built on Next.js 15 + React 19.

## Milestone 1: scaffold, design system, landing page ✅

- Full project scaffold: `package.json`, TypeScript, Tailwind, ESLint, Prettier, Next config
- Design token system in `tailwind.config.ts` (colors, radii, shadows, motion) — see comment block at the top of that file
- Complete landing page: sticky nav, hero with animated Camelot Wheel + search bar, features, how it works, screenshots, testimonials, pricing, FAQ, footer
- `src/lib/utils.ts` includes the `cn()` class helper and a working `getCompatibleKeys()` Camelot compatibility function, ready to be reused by the real recommendation engine

## Milestone 2: component library ✅

- `components.json` — shadcn/ui CLI config, so `npx shadcn add <component>` pulls in anything
  else you need later, pre-wired to the R-SYNC tokens
- Core primitives in `src/components/ui/`: `button`, `card`, `input`, `badge`, `label`,
  `separator`, `skeleton` (shimmer, not a flat pulse), `dialog`, `select`, `tabs`, `tooltip`,
  `slider`, `checkbox` — each restyled to the brand palette, not stock shadcn defaults
- Two domain composites in `src/components/track/`: `MatchScore` (the animated circular
  "98% Match" ring) and `TrackCard` (the actual recommendation card from the brief — artwork,
  BPM/key/genre badges, match score, and the "why it works" reasons list)
- `/style-guide` route — every primitive rendered together in one page, since this sandbox
  can't run a browser to screenshot-verify. Open this first after `npm install`.

## Milestone 3: auth ✅

- `ClerkProvider` wired into the root layout with the `dark` base theme, plus a full custom
  `appearance` config in `src/lib/clerk-appearance.ts` so Clerk's hosted forms match the
  R-SYNC tokens instead of looking like a bolted-on widget
- `src/middleware.ts` — real route protection via `clerkMiddleware`. Marketing pages, `/login`,
  `/signup`, and `/style-guide` stay public; everything else (starting with `/dashboard`)
  requires a session
- `/login` and `/signup` — Clerk's `<SignIn>` / `<SignUp>` inside a branded split-screen
  `AuthShell` (Camelot Wheel accent panel + form), using Clerk's catch-all route convention
  (`/login/[[...rest]]`)
- Navbar is now auth-aware: `Log in` / `Sign up free` when signed out, `Dashboard` +
  `UserButton` (avatar menu with sign out) when signed in
- `/dashboard` — minimal protected page that reads the real Clerk session server-side and
  displays it, so you can confirm end-to-end that protection and env vars are working before
  the real dashboard (milestone 8) gets built out

**To actually run this milestone** you need real Clerk keys — sign up at
[dashboard.clerk.com](https://dashboard.clerk.com), create an application, and drop the
publishable/secret key into `.env.local` (see `.env.example`). Without them the app will
throw on boot, since `ClerkProvider` requires a publishable key.

## Milestone 4: search experience ✅

- `src/lib/mock-data.ts` — 16-track mock dataset with full metadata (BPM, Camelot key, musical
  key, energy, danceability, popularity, mood, vocal/explicit flags) standing in for the real
  database until milestone 9. Swap `searchTracks()`/`getTrackById()` for real API calls later
  without touching any component.
- `/search` — the real search page: functional search bar with live autocomplete (matching
  tracks, recent searches via a persisted Zustand store, trending tracks, popular search
  chips), a full filters sidebar (key mode incl. harmonic-compatible, BPM range, genre,
  energy, popularity, release year, vocal/instrumental, hide explicit), sorting (Best Match,
  Energy, Popularity, Newest, Oldest, BPM), and skeleton loading states wired through a real
  TanStack Query call with simulated latency
- `/track/[id]` — full track detail page: artwork, all metadata fields from the brief,
  animated waveform placeholder, energy/danceability/popularity meters, and a related-tracks
  list. "Find transitions" links to `/recommendations` (next milestone)
- The landing page hero search bar is now wired up — typing and hitting Search/Enter takes
  you to `/search?q=...` with that query pre-loaded
- `/search` and `/track/*` are public routes (added to the middleware allowlist) — matches the
  brief's Free plan including unlimited search

## Milestone 5: recommendation engine UI ✅

- `src/lib/recommendation-engine.ts` — a real, transparent scoring algorithm: harmonic key
  (35 pts — same key beats compatible Camelot beats nothing), BPM proximity (30 pts, tapering
  by how far off), genre/subgenre (15 pts), energy similarity (15 pts), and a "frequently
  mixed together" popularity signal (5 pts). Every point that's awarded also pushes a
  human-readable reason onto the list — the "why this works" copy isn't hardcoded, it's
  generated from the same comparison that produced the score.
- `/recommendations?from=<trackId>` — takes a reference track, scores it against the full
  mock library, and renders results with the `TrackCard` + `MatchScore` components already
  built in milestone 2. Sortable by Best Match, Energy, Popularity, Newest, Oldest, BPM.
- No reference track yet? The page falls back to a track picker (search bar + a few quick-pick
  cards) instead of an empty page.
- `TrackCard`'s artwork and title now link through to `/track/[id]`, matching how
  `TrackResultCard` already behaved — small consistency fix from milestone 4.
- `src/components/shared/SortSelect.tsx` — pulled the sort dropdown out into a generic
  component so `/search` and `/recommendations` share one implementation instead of two
  copies drifting apart.

## Milestone 6: AI Assistant ✅

- `src/lib/ai-assistant.ts` — prompt interpretation + vibe-matching logic. Keyword patterns
  (sunset/opening, dark/underground, festival/peak time, closing/wind down, "surprise me")
  map to an energy range, mood set, and genre lean; every track is then scored against that
  profile and given real, generated reasons — not canned copy. The function signature
  (`getAIRecommendations(prompt) → { interpretation, matches }`) is the seam: swap the body
  for a real Anthropic Messages API call later (server-side, using the `AI_API_KEY` env var
  already in `.env.example`) and nothing in the UI has to change — see the comment above the
  function for exactly what that call should look like.
- `/assistant` — the dedicated AI mode from the brief: chat-style interface, the five example
  prompts as tappable chips, a typing/thinking loading state, and results rendered as compact
  match cards with the AI's explanation attached. Multi-turn — you can keep describing
  different moments in the same session.
- Protected by middleware by default (not on the public allowlist) since AI recommendations
  is a Premium-tier feature per the pricing page — real plan gating comes with billing, not
  yet built, but auth-gating it now is the correct default in the meantime.
- Cross-linked with `/recommendations` in both directions, and added to the signed-in navbar.

## Milestone 7: Rekordbox import ✅

- `src/lib/key-conversion.ts` — converts Rekordbox's `Tonality` field (which can be plain
  Camelot, or standard notation like `F#m`/`Abmaj`/`A Minor` depending on the user's Rekordbox
  settings) into a consistent Camelot code, so imported tracks work with the same harmonic
  logic as the rest of the app.
- `src/lib/rekordbox-import.ts` — parses a Rekordbox XML export client-side with `DOMParser`
  (nothing is uploaded to a server — stated explicitly in the UI), plus `computeLibraryStats()`
  which produces track count, genre distribution, key coverage, a BPM histogram, an energy
  distribution, and a count of harmonically compatible track pairs across the whole library.
  Energy is a documented heuristic (BPM percentile within the library) since Rekordbox doesn't
  export a real energy value — flagged clearly in the code as a placeholder for real audio
  analysis later.
- `/import` — drag-and-drop (or click) XML upload with a parsing state and an inline error
  message for malformed files, then a stats preview before continuing to the full library.
- `/library` — the "My Library" page: full analytics dashboard (genre bars, key coverage,
  BPM histogram) plus the complete imported track list.
- The recommendation engine now takes an optional owned-library boost: any candidate track
  matching something in your imported library (by title + artist) gets a score bump and an
  "Already in your library" reason pushed to the front — the actual "prioritize what I own"
  behavior the brief asked for, wired through `useLibraryStore` on `/recommendations`.
- Persisted via Zustand (`localStorage`), added `/import` and `/library` to the navbar.

## Milestone 8: dashboard, crates, set planner, profile — the app shell ✅

This milestone also fixed a real gap from earlier ones: `/search`, `/track`, `/library`,
`/import`, and `/assistant` had **no persistent navigation at all** once you were on them —
only in-page links. Fixing that properly meant building the shell now rather than bolting
tab-specific headers onto four more pages.

- **Restructured routing**: `dashboard`, `search`, `track`, `recommendations`, `assistant`,
  `import`, and `library` all moved into an `(app)` route group (URLs are unchanged — Next.js
  route groups don't affect paths) so they share one layout instead of each rolling its own.
- `src/components/app-shell/AppSidebar.tsx` + `AppMobileNav.tsx` — a persistent left sidebar
  on desktop (Dashboard, Search, AI Assistant, My Library, Crates, Set Planner, Profile) and a
  bottom tab bar on mobile, per the brief's "feels like a native app" requirement.
- **Dashboard**, rebuilt from the milestone-3 stub into the real thing: stat cards (library
  size, crate count, set planner count, recent searches), favorite genre/key/BPM pulled from
  your imported library, a recent-searches list, a saved-crates preview, and quick actions.
  Every number on this page is real, derived from the actual Zustand stores — nothing here is
  a hardcoded placeholder.
- **Crates** (`/crates`, `/crates/[id]`) — create crates (with the brief's suggested names —
  Warm Up, Peak Time, Closing, Festival, Warehouse, Beach, Sunset — as one-tap starters),
  native HTML5 drag-and-drop reordering, rename, delete, and a "send this whole crate to the
  set planner" action.
- **Set Planner** (`/planner`) — drag-to-reorder track list, an SVG energy-curve chart, a
  Camelot key + BPM progression strip, and real transition warnings (key clash, big BPM jump,
  sudden energy spike/drop) between adjacent tracks — each with a one-click "insert this track
  to fix it" suggestion pulled from the catalog (`src/lib/set-planner-engine.ts`).
- **Profile** (`/profile`) — bio, DJ preferences (again pulled from your real imported
  library), saved crates, recent activity, a Subscription tab, and an **Account** tab
  embedding Clerk's own `<UserProfile>` component (avatar, email, security) — no need to
  rebuild account management by hand.
- The "Add to crate" buttons on `TrackCard`/`TrackResultCard`/the track detail page were
  inert placeholders before this milestone — they're now a real `AddTrackMenu` dropdown
  (add to any crate, create a new one inline, or add straight to the set planner). Also added
  the `dropdown-menu` and `textarea` primitives to the component library to support this.

## Milestone 9: Prisma schema + database wiring ✅

**What's actually live** (real Postgres queries when `DATABASE_URL` is set):

- `prisma/schema.prisma` — full schema: `Track` (the shared catalog), `User` (synced from
  Clerk), `Crate`/`CrateTrack`, `SetPlan`/`SetPlanTrack`, `SavedTrack`, `RecentSearch`,
  `ImportedLibraryTrack`, with a `Plan` enum for Free/Premium.
- `src/lib/data/tracks.ts` — the data-access layer. This is the important part: it exposes
  the exact same shape (`Track[]`, `getTrackByIdAsync`, `searchTracksAsync`) whether or not a
  database is connected. **Without `DATABASE_URL` set, it transparently falls back to the
  16-track mock dataset** — the app boots and works with zero setup, same as every prior
  milestone. Set `DATABASE_URL`, run `npm run db:push && npm run db:seed`, and every one of
  these calls hits real Postgres instead, with no UI code changes required.
  `isLiveDatabase` is exported if you ever need to branch on which mode you're in.
- `GET /api/tracks` (list/search) and `GET /api/tracks/[id]` — thin routes over that layer, so
  client components (`/search`, `/recommendations`, `/assistant`) can reach it too, not just
  server components.
- **`/search`, `/track/[id]`, `/recommendations`, and `/assistant`** were all switched over
  to call this layer instead of importing the static `MOCK_TRACKS` array directly — this is
  the actual "connect to real data" swap for the app's core discovery flow.
- `src/app/api/webhooks/clerk/route.ts` — a real, svix-verified webhook that upserts `User`
  rows on `user.created`/`user.updated`/`user.deleted`, so DB-backed features have a real user
  row to foreign-key against. Needs `CLERK_WEBHOOK_SECRET` (see `.env.example`) and a webhook
  configured in the Clerk dashboard pointing at `/api/webhooks/clerk`.
- `prisma/seed.ts` seeds the identical 16 tracks used by the mock fallback, so switching to a
  real database doesn't change the demo experience at all.

**What's modeled in the schema but *not yet wired*** — crates, set plans, saved tracks, recent
searches, and imported libraries still read/write through Zustand + `localStorage` (as built
in milestones 4–8), not these new Prisma tables. I did not want to rush a partial rewrite of
five working, drag-and-drop-dependent features I have no way to test in this environment —
that's a real, scoped follow-up (wiring each store's actions to server actions against the
tables that already exist for them), not a loose end I forgot. `set-planner-engine.ts`'s
bridge-track suggestions still pull from the static mock array for the same reason — it's a
secondary feature layered on top of the set planner, not the core catalog.

## Milestone 10: performance + deployment prep ✅

I can't run Lighthouse or a real browser in this environment, so rather than claim scores I
can't produce, this was a code-level audit with concrete, verifiable fixes:

**SEO**
- Root layout now uses a title template (`%s | R-SYNC`) so per-page titles compose correctly.
- `/track/[id]` gets real per-track `generateMetadata` (title, description, Open Graph, Twitter
  card) plus `MusicRecording` JSON-LD structured data — this is the page most worth indexing
  and sharing, so it's the one that got full treatment.
- `src/app/sitemap.ts` — dynamic, includes every track via the same data layer from Milestone
  9 (works against the live DB or the mock fallback). `src/app/robots.ts` allows the
  marketing/search/track pages, disallows the authenticated app shell and `/api/`.
- `src/app/manifest.ts` + `src/app/icon.svg` — web app manifest and a real favicon (previously
  missing entirely).

**Performance**
- The profile avatar now uses `next/image` instead of a raw `<img>` (added `img.clerk.com` to
  the allowed image domains in `next.config.mjs`).
- Clerk's `<UserProfile>` (a large, iframe-heavy component) is now lazy-loaded via
  `next/dynamic` with `ssr: false` — it's only fetched when someone actually opens the Account
  tab, not on every `/profile` visit.
- `next.config.mjs`: `poweredByHeader: false`.
- Added `loading.tsx` for `/track/[id]` — Next.js streams this in instantly while the server
  component fetches, instead of a blank screen.

**Reliability / production-readiness**
- Branded `not-found.tsx` (previously Next's default unstyled 404).
- Root `error.tsx` and an app-shell-scoped `(app)/error.tsx` — the latter keeps the sidebar
  visible on error instead of falling all the way back to a blank crash page.

**Honest gaps** — worth knowing about rather than discovering later:
- The client-rendered app pages (`/dashboard`, `/search`, `/crates`, `/planner`, `/profile`,
  `/library`, `/import`, `/assistant`) don't have individual `<title>` tags — client components
  can't export Next's `metadata`, so they currently inherit the root default. The real fix is
  converting each to a thin server wrapper with `generateMetadata` around the interactive
  client content, which is a real but mechanical follow-up, not attempted here to avoid
  touching eight already-working pages in the very last milestone.
- No Lighthouse run, no real bundle-size measurement, no image assets to optimize beyond the
  one avatar (everything else is CSS gradients by design — there's no real audio/artwork CDN
  yet). All of this needs a real `npm run build` and a deployed URL to actually measure.

## Deploying

This is a standard Next.js 15 app — [Vercel](https://vercel.com) is the natural fit (built by
the same team, zero-config for App Router).

1. Push this to a Git repo, import it in Vercel.
2. Set environment variables in the Vercel project settings (see `.env.example` for the full
   list): `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `DATABASE_URL` (optional —
   omit it and the app runs on the mock dataset), `CLERK_WEBHOOK_SECRET` (only if you wire up
   the webhook), `UPLOADTHING_TOKEN` / `AI_API_KEY` (not yet consumed by any code path, but
   present for when those integrations land).
3. If using a database: run `npx prisma db push && npx prisma db seed` once, pointed at your
   production `DATABASE_URL`, before or right after the first deploy.
4. In the Clerk dashboard: add your production domain, and if using the webhook, point it at
   `https://yourdomain.com/api/webhooks/clerk`.
5. Update `metadataBase` in `src/app/layout.tsx` and the hardcoded `https://rsync.app` URLs in
   `sitemap.ts`/`robots.ts` to your actual domain.

## Getting it running locally

**Without a database** (runs entirely on the bundled mock dataset):
```bash
npm install
cp .env.example .env.local   # Clerk keys required — see Milestone 3 note
npm run dev
```

**With a real database:**
```bash
npm install
cp .env.example .env.local
# fill in DATABASE_URL (any Postgres — Neon, Supabase, Railway, local all work)
npm run db:push      # creates the tables from schema.prisma
npm run db:seed      # loads the 16 demo tracks
npm run dev
```

`npm run db:studio` opens Prisma Studio if you want to browse the data directly.

Note: this environment has no network access, so `npm install`, a real build, and any actual
performance measurement all need to happen in your own environment — this milestone is the
one where "please verify locally" matters most, since its entire premise (performance,
crawlability) is something I structurally cannot check from here.

## Roadmap — all 10 milestones complete

1. ~~Project structure + design system + landing page~~ ✅
2. ~~Design system component library~~ ✅
3. ~~Auth~~ ✅
4. ~~Search experience~~ ✅
5. ~~Recommendation engine UI~~ ✅
6. ~~AI Assistant~~ ✅
7. ~~Rekordbox import~~ ✅
8. ~~Dashboard, Saved Crates, Set Planner, Profile~~ ✅
9. ~~Prisma schema + database wiring~~ ✅
10. ~~Performance pass + deployment prep~~ ✅

The original brief's scope is fully built. Natural next steps beyond it: wiring crates/set
plans/saved tracks/recent searches to the Prisma tables that already model them (currently
localStorage-backed — see Milestone 9's notes), real audio preview + artwork once there's a
content source, billing/plan-gating for the Free/Premium split, and per-page metadata on the
client-rendered app pages (see Milestone 10's honest gaps above).

Say which milestone to build next, or if priorities have changed.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui ·
Framer Motion · Prisma · PostgreSQL · Clerk · UploadThing · Zustand · TanStack Query · Zod
