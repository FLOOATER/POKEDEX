import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteFilteredPokemon, useFilteredPokemon } from '../hooks/usePokemonData';
import { useFilterStore } from '../store';
import PokemonCard from '../components/pokemon/PokemonCard';
import FilterPanel from '../components/pokemon/FilterPanel';
import LoadingSpinner, { SkeletonCard } from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { search, setSearch, activeFilterCount, resetFilters } = useFilterStore();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Sync URL search param on first load
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== search) setSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { filteredList, isLoading: listLoading } = useFilteredPokemon();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteFilteredPokemon();

  const allCards = data?.pages.flat() ?? [];
  const filterCount = activeFilterCount();

  // Infinite scroll via IntersectionObserver
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1, rootMargin: '200px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Filter sidebar */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto px-4 py-6 w-full">
        {/* Top toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              filterOpen || filterCount > 0
                ? 'bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-400'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {filterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/30 text-white text-xs flex items-center justify-center font-bold">
                {filterCount}
              </span>
            )}
          </button>

          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Pokémon..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 text-gray-900 dark:text-white placeholder-gray-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Result count */}
          <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {listLoading ? '...' : `${filteredList.length.toLocaleString()} Pokémon`}
          </span>

          {filterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {isLoading || listLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : allCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <img src="/pokeball.svg" alt="" className="w-20 h-20 opacity-20 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Pokémon found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {allCards.map((item, i) => (
                <PokemonCard key={item.name} item={item} index={i % 24} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="flex justify-center py-10">
              {isFetchingNextPage && <LoadingSpinner />}
              {!hasNextPage && allCards.length > 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  All {allCards.length} Pokémon loaded
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
