import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePokemon, useSpecies, useEvolutionChain } from '../hooks/usePokemonData';
import { useFavoritesStore, useCompareStore } from '../store';
import { getOfficialArtwork } from '../api/pokeapi';
import { TYPE_COLORS, MAX_COMPARE } from '../utils/constants';
import TypeBadge from '../components/ui/TypeBadge';
import StatBar from '../components/ui/StatBar';
import EvolutionChainDisplay from '../components/pokemon/EvolutionChain';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Tab = 'about' | 'stats' | 'evolution' | 'moves';

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('about');
  const [shiny, setShiny] = useState(false);

  const { data: pokemon, isLoading, isError } = usePokemon(id ?? '');
  const { data: species } = useSpecies(pokemon?.id ?? '');
  const { data: evoChain } = useEvolutionChain(species?.evolution_chain?.url);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { inCompare, toggleCompare, compareList } = useCompareStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl font-bold text-gray-900 dark:text-white">Pokémon not found</p>
        <Link to="/" className="text-red-500 hover:text-red-600 font-medium">← Back to Pokédex</Link>
      </div>
    );
  }

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const typeColor = TYPE_COLORS[primaryType] ?? '#A8A878';
  const artwork = getOfficialArtwork(pokemon, shiny);
  const favorite = isFavorite(pokemon.id);
  const comparing = inCompare(pokemon.id);
  const canCompare = compareList.length < MAX_COMPARE || comparing;

  const flavorText = species?.flavor_text_entries
    .filter((e) => e.language.name === 'en')
    .slice(-1)[0]?.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ') ?? '';

  const genus = species?.genera.find((g) => g.language.name === 'en')?.genus ?? '';

  const totalStats = pokemon.stats.reduce((s, stat) => s + stat.base_stat, 0);

  const levelUpMoves = pokemon.moves
    .filter((m) => m.version_group_details.some((d) => d.move_learn_method.name === 'level-up'))
    .map((m) => ({
      name: m.move.name,
      level: Math.max(
        0,
        ...m.version_group_details
          .filter((d) => d.move_learn_method.name === 'level-up')
          .map((d) => d.level_learned_at)
      ),
    }))
    .sort((a, b) => a.level - b.level);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'stats', label: 'Stats' },
    { key: 'evolution', label: 'Evolution' },
    { key: 'moves', label: 'Moves' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${typeColor}cc 0%, ${typeColor}55 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle at 80% 50%, white 0%, transparent 60%)` }}
        />

        {/* Nav */}
        <div className="max-w-4xl mx-auto px-4 pt-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center gap-2">
            {/* Shiny toggle */}
            <button
              onClick={() => setShiny((s) => !s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                shiny
                  ? 'bg-yellow-400 text-yellow-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label="Toggle shiny"
            >
              ✨ Shiny
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(pokemon.id)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                className={`w-5 h-5 ${favorite ? 'fill-red-400 text-red-400' : 'fill-none text-white'}`}
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Compare */}
            {canCompare && (
              <button
                onClick={() => toggleCompare(pokemon.id)}
                className={`p-2 rounded-lg transition-colors ${
                  comparing
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
                aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Pokemon identity */}
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-0 flex flex-col md:flex-row items-center md:items-end gap-4">
          <div className="text-center md:text-left text-white">
            <p className="text-sm font-mono opacity-80 mb-1">#{String(pokemon.id).padStart(4, '0')}</p>
            <h1 className="text-4xl md:text-5xl font-extrabold capitalize mb-3">
              {pokemon.name.replace(/-/g, ' ')}
            </h1>
            {genus && <p className="text-sm opacity-80 mb-3">{genus}</p>}
            <div className="flex gap-2 justify-center md:justify-start flex-wrap">
              {pokemon.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} size="lg" />
              ))}
            </div>
          </div>

          <motion.img
            key={artwork}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring' }}
            src={artwork}
            alt={pokemon.name}
            className="w-44 h-44 md:w-56 md:h-56 object-contain drop-shadow-2xl md:ml-auto"
          />
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 bg-black/10 backdrop-blur-sm rounded-t-2xl p-1 w-fit mt-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === t.key
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* About */}
          {tab === 'about' && (
            <div className="space-y-6">
              {flavorText && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{flavorText}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Pokédex Data</h2>
                  <dl className="space-y-3">
                    {[
                      { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
                      { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                      { label: 'Base Exp', value: pokemon.base_experience ?? '—' },
                      {
                        label: 'Capture Rate',
                        value: species
                          ? `${species.capture_rate} (${Math.round((species.capture_rate / 255) * 100)}%)`
                          : '—',
                      },
                      { label: 'Happiness', value: species?.base_happiness ?? '—' },
                      { label: 'Growth Rate', value: species?.growth_rate.name.replace(/-/g, ' ') ?? '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center">
                        <dt className="w-32 text-sm text-gray-500 dark:text-gray-400 capitalize">{label}</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white capitalize">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Abilities */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Abilities</h2>
                  <div className="space-y-2">
                    {pokemon.abilities.map((a) => (
                      <div key={a.ability.name} className="flex items-center gap-3">
                        <span className="capitalize text-sm font-medium text-gray-900 dark:text-white">
                          {a.ability.name.replace(/-/g, ' ')}
                        </span>
                        {a.is_hidden && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                            Hidden
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Classification */}
                  {species && (
                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                      {species.is_legendary && (
                        <span className="text-xs px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-semibold">
                          Legendary
                        </span>
                      )}
                      {species.is_mythical && (
                        <span className="text-xs px-2.5 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full font-semibold">
                          Mythical
                        </span>
                      )}
                      {species.is_baby && (
                        <span className="text-xs px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-semibold">
                          Baby
                        </span>
                      )}
                      {species.habitat && (
                        <span className="text-xs px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold capitalize">
                          {species.habitat.name.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {tab === 'stats' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Base Stats</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: <span className="font-bold text-gray-900 dark:text-white text-base">{totalStats}</span>
                </div>
              </div>
              <div className="space-y-3">
                {pokemon.stats.map((s) => (
                  <StatBar
                    key={s.stat.name}
                    statName={s.stat.name}
                    value={s.base_stat}
                  />
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Min', value: pokemon.stats.reduce((m, s) => Math.min(m, s.base_stat), 999) },
                  { label: 'Average', value: Math.round(totalStats / pokemon.stats.length) },
                  { label: 'Max', value: pokemon.stats.reduce((m, s) => Math.max(m, s.base_stat), 0) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evolution */}
          {tab === 'evolution' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Evolution Chain</h2>
              {evoChain ? (
                <EvolutionChainDisplay chain={evoChain.chain} />
              ) : (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}

          {/* Moves */}
          {tab === 'moves' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Moves by Level Up</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                {levelUpMoves.length} moves learned by leveling
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left pb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 pr-4">Lv.</th>
                      <th className="text-left pb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Move</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelUpMoves.map((m, i) => (
                      <tr
                        key={m.name}
                        className={`border-b border-gray-50 dark:border-gray-700/50 ${
                          i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-700/20'
                        }`}
                      >
                        <td className="py-2.5 pr-4 font-mono text-gray-500 dark:text-gray-400 w-12">
                          {m.level === 0 ? '—' : m.level}
                        </td>
                        <td className="py-2.5 capitalize font-medium text-gray-900 dark:text-gray-100">
                          {m.name.replace(/-/g, ' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TM / Egg moves summary */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4 text-center text-sm">
                {[
                  { label: 'Level Up', count: levelUpMoves.length },
                  {
                    label: 'TM / HM', count: pokemon.moves.filter((m) =>
                      m.version_group_details.some((d) => d.move_learn_method.name === 'machine')
                    ).length,
                  },
                  {
                    label: 'Egg Moves', count: pokemon.moves.filter((m) =>
                      m.version_group_details.some((d) => d.move_learn_method.name === 'egg')
                    ).length,
                  },
                ].map(({ label, count }) => (
                  <div key={label}>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{label}</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Prev / Next navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-10 flex justify-between items-center">
        {pokemon.id > 1 ? (
          <Link
            to={`/pokemon/${pokemon.id - 1}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-500 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            #{String(pokemon.id - 1).padStart(4, '0')}
          </Link>
        ) : <span />}

        {pokemon.id < 1025 && (
          <Link
            to={`/pokemon/${pokemon.id + 1}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-500 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            #{String(pokemon.id + 1).padStart(4, '0')}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
