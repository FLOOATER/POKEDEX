import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FilterState, SortOption } from '../types/pokemon';
import { MAX_COMPARE } from '../utils/constants';

// ── Theme ────────────────────────────────────────────────────────────────────

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: prefersDark,
      toggle: () => {
        const next = !get().isDark;
        set({ isDark: next });
        document.documentElement.classList.toggle('dark', next);
      },
    }),
    { name: 'pokedex-theme' }
  )
);

// ── Favorites ────────────────────────────────────────────────────────────────

interface FavoritesStore {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (id) => get().favorites.includes(id),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
    }),
    { name: 'pokedex-favorites' }
  )
);

// ── Compare ──────────────────────────────────────────────────────────────────

interface CompareStore {
  compareList: number[];
  inCompare: (id: number) => boolean;
  toggleCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()((set, get) => ({
  compareList: [],
  inCompare: (id) => get().compareList.includes(id),
  toggleCompare: (id) => {
    const { compareList } = get();
    if (compareList.includes(id)) {
      set({ compareList: compareList.filter((c) => c !== id) });
    } else if (compareList.length < MAX_COMPARE) {
      set({ compareList: [...compareList, id] });
    }
  },
  removeFromCompare: (id) =>
    set((s) => ({ compareList: s.compareList.filter((c) => c !== id) })),
  clearCompare: () => set({ compareList: [] }),
}));

// ── Filters ──────────────────────────────────────────────────────────────────

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  toggleType: (type: string) => void;
  setGeneration: (gen: number | null) => void;
  setSort: (sortBy: SortOption, sortDir?: 'asc' | 'desc') => void;
  resetFilters: () => void;
  activeFilterCount: () => number;
}

const defaultFilters: FilterState = {
  search: '',
  types: [],
  generation: null,
  sortBy: 'id',
  sortDir: 'asc',
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...defaultFilters,
  setSearch: (search) => set({ search }),
  toggleType: (type) =>
    set((s) => ({
      types: s.types.includes(type)
        ? s.types.filter((t) => t !== type)
        : [...s.types, type],
    })),
  setGeneration: (generation) => set({ generation }),
  setSort: (sortBy, sortDir) =>
    set((s) => ({ sortBy, sortDir: sortDir ?? s.sortDir })),
  resetFilters: () => set(defaultFilters),
  activeFilterCount: () => {
    const { types, generation, sortBy } = get();
    return types.length + (generation ? 1 : 0) + (sortBy !== 'id' ? 1 : 0);
  },
}));
