import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePokemon } from '../../hooks/usePokemonData';
import { useFavoritesStore, useCompareStore } from '../../store';
import { getOfficialArtwork, extractIdFromUrl } from '../../api/pokeapi';
import { TYPE_COLORS, MAX_COMPARE } from '../../utils/constants';
import TypeBadge from '../ui/TypeBadge';
import { SkeletonCard } from '../ui/LoadingSpinner';
import type { PokemonListItem } from '../../types/pokemon';

interface PokemonCardProps {
  item: PokemonListItem;
  index?: number;
}

export default function PokemonCard({ item, index = 0 }: PokemonCardProps) {
  const id = extractIdFromUrl(item.url);
  const { data: pokemon, isLoading, isError } = usePokemon(id);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { inCompare, toggleCompare, compareList } = useCompareStore();
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) return <SkeletonCard />;
  if (isError || !pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? '#A8A878';
  const artwork = getOfficialArtwork(pokemon);
  const favorite = isFavorite(pokemon.id);
  const comparing = inCompare(pokemon.id);
  const canAddMore = compareList.length < MAX_COMPARE || comparing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 cursor-pointer"
    >
      {/* Favorite button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(pokemon.id); }}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-4 h-4 transition-colors ${favorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-400'}`}
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Compare button */}
      {canAddMore && (
        <button
          onClick={(e) => { e.preventDefault(); toggleCompare(pokemon.id); }}
          className={`absolute top-2 left-2 z-10 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 ${
            comparing
              ? 'bg-blue-500 text-white opacity-100'
              : 'bg-white/80 dark:bg-gray-900/80 text-gray-400'
          }`}
          aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      )}

      <Link to={`/pokemon/${pokemon.id}`}>
        {/* Card top: colored background with sprite */}
        <div
          className="relative h-36 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${typeColor}55 0%, ${typeColor}22 100%)` }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, ${typeColor} 0%, transparent 60%)`,
            }}
          />
          {!imgLoaded && (
            <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          )}
          <img
            src={artwork}
            alt={pokemon.name}
            className={`w-28 h-28 object-contain drop-shadow-lg transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'} absolute`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Card bottom: info */}
        <div className="px-4 pb-4 pt-3">
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mb-0.5">
            #{String(pokemon.id).padStart(4, '0')}
          </p>
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
