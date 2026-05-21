import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '../../store';
import { usePokemon } from '../../hooks/usePokemonData';
import { getOfficialArtwork } from '../../api/pokeapi';

function CompareItem({ id, onRemove }: { id: number; onRemove: () => void }) {
  const { data: pokemon } = usePokemon(id);

  if (!pokemon) return (
    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
  );

  return (
    <div className="relative flex flex-col items-center gap-1">
      <button
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 z-10 leading-none"
        aria-label={`Remove ${pokemon.name}`}
      >
        ×
      </button>
      <img
        src={getOfficialArtwork(pokemon)}
        alt={pokemon.name}
        className="w-12 h-12 object-contain drop-shadow"
      />
      <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300 max-w-14 truncate text-center">
        {pokemon.name.replace(/-/g, ' ')}
      </span>
    </div>
  );
}

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 px-5 py-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {compareList.map((id) => (
                <CompareItem
                  key={id}
                  id={id}
                  onRemove={() => removeFromCompare(id)}
                />
              ))}

              {/* Empty slots */}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs"
                >
                  +
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 ml-2">
              <Link
                to="/compare"
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors text-center"
              >
                Compare ({compareList.length})
              </Link>
              <button
                onClick={clearCompare}
                className="px-4 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
