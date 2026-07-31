# CLAUDE.md — Hybrid Athletic

## Project Overview

A bilingual (Arabic/English) mobile-first PWA fitness tracker. Users log daily workouts across a 4-day rotating program, track weights per exercise, and view progress over time.

## Tech Stack

- **React 18** + **Vite 5** (ESM, `"type": "module"`)
- **Plain JavaScript** (JSX, no TypeScript)
- **Tailwind CSS** via CDN (no PostCSS, no `tailwind.config.js`)
- No backend, no database — all state in localStorage

## Project Structure

```
/
├── index.html           # Vite root; loads Tailwind CDN + Google Fonts (Tajawal)
├── src/
│   └── App.jsx          # Entire application (~1,580 lines)
├── public/
│   ├── icon.png         # PWA icon 512×512 (orange dumbbell + lightning bolt)
│   ├── icon.svg         # SVG version of icon
│   ├── manifest.json    # PWA manifest
│   └── sw.js            # Service worker (cache name: hybrid-v4)
├── vite.config.js
└── package.json
```

No subdirectories under `src/`. Everything lives in `App.jsx`.

## App.jsx Architecture

### Key Constants (top of file)
| Constant | Purpose |
|---|---|
| `ACCENT` | `#FF7A1A` — orange brand color |
| `PROGRAM` | 4-day rotating workout plan (D1–D4) |
| `STR` | Full bilingual string table (Arabic + English) |
| `DATA_KEY` | `'ha_v1'` — localStorage key for workout data |
| `SETTINGS_KEY` | `'ha_settings_v1'` — localStorage key for settings |
| `INIT_DATA` | Default data shape: `{ di, sessions, weights }` |
| `INIT_SETTINGS` | Default settings: `{ lang, unit, exUnits }` |

### PROGRAM Structure
4 days in rotation: `D1` Strength Full Body A → `D2` Cardio Zone 2 → `D3` Hypertrophy Full Body B → `D4` HIIT VO2 Max. Each strength/hypertrophy day has `exercises[]` with `muscleAr`/`muscleEn` per exercise. Cardio days have `descAr`/`descEn` + `range`.

### State
- `data` — `{ di: number, sessions: [], weights: {} }` — persisted to `ha_v1`
- `settings` — `{ lang, unit, exUnits: {} }` — persisted to `ha_settings_v1`
- `session` — active workout session (in-memory only)
- `screen` — current screen name
- `selectedDay` — day object selected from the 4-day grid

### Screen Flow
| Screen | Description |
|---|---|
| `splash` | Logo + tagline on app open; tap to go home |
| `home` | 4-day grid, today's card, stats, recent sessions, undo skip |
| `dayDetail` | Exercise list with muscle targets for a selected day |
| `checkin` | Pre-workout check-in (energy/soreness/injury) |
| `workout` | Active workout: weight input, per-exercise unit toggle, set buttons |
| `cardio` | Cardio session screen |
| `done` | Session complete summary |
| `progress` | Progress charts/stats |
| `history` | Session history with delete per session |
| `settings` | Unit toggle (kg/lbs), language, reset data |

### Key Functions
| Function | Purpose |
|---|---|
| `doComplete()` | Finish session; saves `endTs: Date.now()` |
| `doSkip()` | Skip today; saves `ts: Date.now()` |
| `undoSkip()` | Remove last skipped session and roll back `di` |
| `deleteSessionById(id)` | Delete any session from history; decrements `di` |
| `award(team, pts)` | N/A (Who's Who only) |
| `fmtDateTime(ts)` | Format timestamp as Arabic locale date + time |
| `setLang(l)` | Set language and persist to settings |

### Per-Exercise Unit
Each exercise has an independent kg/lbs toggle stored in `settings.exUnits[exerciseName]`. Falls back to `settings.unit` (global default).

### Finish Session Button
Only appears when **all** exercises have all sets completed (`allDone === true`). Shown in red (`#ef4444`).

## Development Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Serve production build locally
```

## Deployment

- **GitHub repo:** `ffn1994/Hybrid-athletic` (branch: `main`)
- **Vercel:** auto-deploys on push to `main`
- **Production URL:** `https://hybrid-athletic.vercel.app`
- **Old URL (deprecated):** `https://hybrid-lime.vercel.app`

## Conventions

- **No TypeScript** — plain JS/JSX only
- **No separate CSS file** — Tailwind classes or inline styles
- **No component splitting** — everything stays in `App.jsx`
- **Add new strings to `STR`** — always provide both `ar` and `en`
- **Bump `sw.js` cache name** (`hybrid-v4` → `hybrid-v5` etc.) after significant changes to force cache refresh on user devices
- **RTL-safe** — Arabic is RTL (`dir="rtl"`), English is LTR; use `dir` prop/state throughout

## No Tests

No test files or test runner config. No tests need to be written or run.
