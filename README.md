# Star Wars Universe

A React application that lets you explore characters from the Star Wars universe using the [SWAPI (Star Wars API)](https://swapi.dev/).

## Features

- **Homepage** — Paginated list of all Star Wars characters with list/grid view toggle
- **Character Details** — Full profile including films, homeworld, and species
- **Search** — Live search as you type, powered by SWAPI's search endpoint
- **Favourites** — Save characters to a persistent sidebar (stored in `localStorage`)
- **Search History** — Autocomplete dropdown showing your recent searches (also persisted)
- **Mobile Favourites** — Slide-in drawer accessible via the header on small screens

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI (functional components + hooks) |
| TypeScript | Static typing throughout |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling (CSS-first config) |
| Axios | HTTP client with a shared `apiClient` instance |
| react-icons | Icon library (Font Awesome + Game Icons) |
| Vite | Build tool / dev server |

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

Check your versions:
```bash
node -v
npm -v
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd starwars-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header/          # Search bar with autocomplete history
│   ├── Sidebar/         # Persistent favourites list (desktop fixed + mobile drawer)
│   ├── CharacterCard/   # Reusable character card with favourite toggle
│   ├── Pagination/      # Page navigation with page number buttons
│   ├── ViewToggle/      # List / grid view switcher (desktop only)
│   └── Layout/          # Page layout wrapper (header + sidebar + main)
├── context/
│   └── AppContext.tsx   # Global state (favourites + search history)
├── hooks/
│   └── useDebounce.ts   # Generic debounce hook
├── pages/
│   ├── HomePage/        # Paginated character list
│   ├── CharacterDetails/# Full character profile
│   └── SearchResults/   # Live search results
├── services/
│   └── api.ts           # Axios instance + typed SWAPI fetch functions
├── types/
│   └── index.ts         # Shared TypeScript interfaces (Character, Film, Planet, etc.)
└── index.css            # Tailwind v4 entry (@import + @theme tokens)
```

## Tailwind Theme Tokens

Custom design tokens are defined in `src/index.css` under `@theme` and map directly to Tailwind utility classes:

| Token | Class examples |
|---|---|
| `--color-surface` | `bg-surface`, `text-surface` |
| `--color-accent` | `text-accent`, `border-accent`, `bg-accent` |
| `--color-danger` | `text-danger`, `bg-danger/10` |
| `--color-muted` | `text-muted` |
| `--spacing-header` (68 px) | `h-header`, `pt-header`, `top-header` |
| `--spacing-sidebar` (260 px) | `w-sidebar`, `ml-sidebar` |
| `--font-orbitron` | `font-orbitron` |
| `--animate-fade-in` | `animate-fade-in` |

## API

All data is sourced from [swapi.dev](https://swapi.dev/). No API key is required.

| Endpoint | Usage |
|---|---|
| `GET /api/people/?page=N` | Paginated character list |
| `GET /api/people/:id/` | Single character details |
| `GET /api/people/?search=query` | Character search |

## Notes

- Favourites and search history are saved to `localStorage` and persist across page reloads.
- The search bar debounces input by 400 ms before firing the API request.
- Films, homeworld, and species on the details page are all fetched in parallel via `Promise.all`.
- The axios instance (`apiClient`) uses `https://swapi.dev/api` as its base URL and applies a 10-second timeout to all requests.
