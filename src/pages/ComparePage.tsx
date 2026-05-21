import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompareStore } from '../store';
import { usePokemon } from '../hooks/usePokemonData';
import { getOfficialArtwork } from '../api/pokeapi';
import { TYPE_COLORS, STAT_FULL_NAMES, MAX_COMPARE } from '../utils/constants';
import TypeBadge from '../components/ui/TypeBadge';

function PokemonColumn({ id, onRemove }: { id: number; onRemove: () => void }) {
  const { data: pokemon, isLoading } = usePokemon(id);

  if (isLoading || !pokemon) {
    return (
      <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl p-5 animate-pulse">
        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? '#A8A878';
  const totalStats = pokemon.stats.reduce((s, st) => s + st.base_stat, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
    >
      {/* Header */}
      <div
        className="relative p-5 flex flex-col items-center"
        style={{ background: `linear-gradient(135deg, ${typeColor}55 0%, ${typeColor}22 100%)` }}
      >
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-7 h-7 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors text-sm font-bold"
          aria-label={`Remove ${pokemon.name}`}
        >
          ×
        </button>
        <Link to={`/pokemon/${pokemon.id}`}>
          <img
            src={getOfficialArtwork(pokemon)}
            alt={pokemon.name}
            className="w-28 h-28 object-contain drop-shadow-lg hover:scale-105 transition-transform"
          />
        </Link>
        <p className="text-xs font-mono text-gray-500 mt-1">#{String(pokemon.id).padStart(4, '0')}</p>
        <Link
          to={`/pokemon/${pokemon.id}`}
          className="text-lg font-bold capitalize text-gray-900 dark:text-white hover:text-red-500 transition-colors mt-0.5"
        >
          {pokemon.name.replace(/-/g, ' ')}
        </Link>
        <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-gray-100 dark:border-gray-700">
        {[
          { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)}m` },
          { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)}kg` },
          { label: 'Base Exp', value: pokemon.base_experience ?? '—' },
          { label: 'Total Stats', value: totalStats },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{String(value)}</p>
          </div>
        ))}
      </div>

      {/* Abilities */}
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Abilities</p>
        <div className="flex flex-col gap-1">
          {pokemon.abilities.map((a) => (
            <div key={a.ability.name} className="flex items-center gap-2">
              <span className="capitalize text-sm text-gray-800 dark:text-gray-200">
                {a.ability.name.replace(/-/g, ' ')}
              </span>
              {a.is_hidden && (
                <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                  Hidden
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Base stats */}
      <div className="px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          Base Stats
        </p>
        <div className="space-y-2">
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-16 shrink-0 capitalize">
                {STAT_FULL_NAMES[s.stat.name] ?? s.stat.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right shrink-0">
                {s.base_stat}
              </span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((s.base_stat / 255) * 100, 100)}%`,
                    backgroundColor: typeColor,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 w-16 shrink-0">Total</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right shrink-0">
              {totalStats}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Compare</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Select up to {MAX_COMPARE} Pokémon to compare side by side
            </p>
          </div>
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex gap-4 mb-8 opacity-30">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 rounded-full border-4 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-gray-400 text-2xl">
                  +
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Pokémon selected</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Browse Pokémon and click the compare icon on any card to add them here.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Browse Pokémon
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 items-start flex-wrap md:flex-nowrap">
            {compareList.map((id) => (
              <PokemonColumn key={id} id={id} onRemove={() => removeFromCompare(id)} />
            ))}

            {/* Add more slot */}
            {compareList.length < MAX_COMPARE && (
              <Link
                to="/"
                className="flex-1 min-w-[180px] min-h-64 border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500 hover:border-red-400 hover:text-red-400 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  +
                </div>
                <span className="text-sm font-medium">Add Pokémon</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
