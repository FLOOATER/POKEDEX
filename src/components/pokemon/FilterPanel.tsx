import { motion, AnimatePresence } from 'framer-motion';
import { useFilterStore } from '../../store';
import { POKEMON_TYPES, TYPE_COLORS } from '../../utils/constants';
import type { SortOption } from '../../types/pokemon';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'id', label: 'Number' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
  { value: 'total-stats', label: 'Base Stats' },
];

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { types, generation, sortBy, sortDir, toggleType, setGeneration, setSort, resetFilters } = useFilterStore();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 overflow-y-auto lg:sticky lg:top-16 lg:z-auto lg:h-auto lg:max-h-[calc(100vh-5rem)] shadow-xl lg:shadow-none"
          >
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Reset all
                </button>
              </div>

              {/* Sort */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                  Sort by
                </h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (sortBy === opt.value) {
                          setSort(opt.value, sortDir === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSort(opt.value, 'asc');
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        sortBy === opt.value
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && (
                        <span className="text-xs">
                          {sortDir === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Type filter */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                  Type {types.length > 0 && <span className="text-red-500">({types.length})</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POKEMON_TYPES.map((type) => {
                    const active = types.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-150 ${
                          active ? 'ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 scale-105' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: TYPE_COLORS[type],
                          color: 'white',
                          outlineColor: active ? TYPE_COLORS[type] : undefined,
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Generation filter */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
                  Generation
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6,7,8,9].map((g) => {
                    const active = generation === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setGeneration(active ? null : g)}
                        className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          active
                            ? 'bg-red-500 text-white scale-105'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        Gen {g}
                      </button>
                    );
                  })}
                </div>

                {/* Gigantamax / special forms */}
                <div className="mt-2">
                  <button
                    onClick={() => setGeneration(generation === 0 ? null : 0)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 ${
                      generation === 0
                        ? 'bg-purple-500 text-white scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    ⚡ Gigantamax Forms
                  </button>
                </div>
              </section>

              <button
                onClick={onClose}
                className="lg:hidden w-full py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
