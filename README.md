# Pokédex

A modern, full-featured Pokédex built with React, TypeScript, Tailwind CSS, and the PokéAPI.

## Features

- **Browse** all 1,025 Pokémon with infinite scroll
- **Search** by name or Pokédex number
- **Filter** by type (multi-select) and generation (I–IX)
- **Sort** by number, name, height, weight, or base stats
- **Detail pages** with official artwork, types, abilities, base stats, evolution chain, and move list
- **Shiny toggle** on detail pages
- **Compare** up to 3 Pokémon side by side
- **Favorites** system using localStorage
- **Dark / Light mode** with system preference detection
- **Mobile-first** responsive design
- **Smooth animations** via Framer Motion

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| State management | Zustand v4 |
| Animations | Framer Motion v10 |
| Build tool | Vite v5 |
| Data source | [PokéAPI](https://pokeapi.co) |

## Architecture

```
src/
├── api/          pokeapi.ts          — PokéAPI fetch functions
├── components/
│   ├── layout/   Navbar              — Sticky nav with search + dark toggle
│   ├── pokemon/  Card, Filter, Evo,  — Pokémon-specific components
│   │             Compare drawer
│   └── ui/       TypeBadge, StatBar, — Reusable primitives
│                 LoadingSpinner
├── hooks/        usePokemonData.ts   — React Query hooks + filter logic
├── pages/        Home, Detail,       — Route-level page components
│                 Compare, Favorites
├── store/        index.ts            — Zustand slices (theme, fav, compare, filters)
├── types/        pokemon.ts          — TypeScript interfaces for PokéAPI
└── utils/        constants.ts        — Type colors, gen ranges, stat names
```

**Data strategy:** One request fetches all 1,025 Pokémon names (cached indefinitely). Filters run client-side on this list. Each card lazily fetches its own detail data (sprite + types) via React Query, which caches results for 30 minutes.

## Setup

### Prerequisites

- Node.js 18+ and npm

### Install & run

```bash
cd pokedex
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

## Usage tips

- **Hover** a card to reveal the ❤️ favorite and 📊 compare buttons
- **Click the compare icon** on up to 3 Pokémon → a drawer appears at the bottom → click **Compare** to see them side by side
- On the detail page, click **✨ Shiny** to toggle shiny artwork
- Use **← →** navigation at the bottom of detail pages to browse sequentially
- The filter sidebar is a slide-in panel on mobile; a persistent sidebar on desktop
