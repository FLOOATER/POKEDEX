import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '../store';
import { usePokemon } from '../hooks/usePokemonData';
import { getOfficialArtwork } from '../api/pokeapi';
import { TYPE_COLORS } from '../utils/constants';
import TypeBadge from '../components/ui/TypeBadge';

function FavoriteCard({ id }: { id: number }) {
  const { data: pokemon } = usePokemon(id);
  const { toggleFavorite } = useFavoritesStore();

  if (!pokemon) return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm h-64 animate-pulse" />
  );

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
      whileHover={{ y: -4 }}
    >
      <button
        onClick={() => toggleFavorite(id)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 text-red-500 hover:scale-110 transition-transform"
        aria-label="Remove from favorites"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <Link to={`/pokemon/${pokemon.id}`}>
        <div
          className="h-36 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${typeColor}55 0%, ${typeColor}22 100%)` }}
        >
          <img
            src={getOfficialArtwork(pokemon)}
            alt={pokemon.name}
            className="w-28 h-28 object-contain drop-shadow-lg"
            loading="lazy"
          />
        </div>
        <div className="px-4 pb-4 pt-3">
          <p className="text-xs font-mono text-gray-400 mb-0.5">#{String(pokemon.id).padStart(4, '0')}</p>
          <h3 className="text-base font-bold capitalize text-gray-900 dark:text-white mb-2 truncate">
            {pokemon.name.replace(/-/g, ' ')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Favorites</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {favorites.length} saved Pokémon
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 opacity-20">
              <svg className="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Click the heart icon on any Pokémon card to save it here.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Browse Pokémon
            </Link>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {favorites.map((id) => (
              <FavoriteCard key={id} id={id} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
