import { Link } from 'react-router-dom';
import { usePokemon } from '../../hooks/usePokemonData';
import { getOfficialArtwork } from '../../api/pokeapi';
import TypeBadge from '../ui/TypeBadge';
import type { EvolutionChainLink, EvolutionDetail } from '../../types/pokemon';

interface EvolutionNodeProps {
  link: EvolutionChainLink;
}

function EvolutionCondition({ details }: { details: EvolutionDetail[] }) {
  if (!details || details.length === 0) return null;
  const d = details[0];

  // Build label using explicit variable to avoid TypeScript narrowing conflicts
  let label = '';
  const itemName = d.item?.name ?? null;
  const heldItemName = d.held_item?.name ?? null;
  const knownMoveName = d.known_move?.name ?? null;
  const triggerName = d.trigger?.name ?? '';

  if (d.min_level) label = `Lv. ${d.min_level}`;
  else if (itemName) label = itemName.replace(/-/g, ' ');
  else if (heldItemName) label = `Hold ${heldItemName.replace(/-/g, ' ')}`;
  else if (knownMoveName) label = `Move: ${knownMoveName.replace(/-/g, ' ')}`;
  else if (d.min_happiness) label = `Friendship ${d.min_happiness}`;
  else if (triggerName === 'level-up') label = 'Level up';
  else if (triggerName === 'trade') label = 'Trade';
  else label = triggerName.replace(/-/g, ' ');

  if (d.time_of_day) label += ` (${d.time_of_day})`;

  return (
    <div className="flex flex-col items-center gap-1 mx-2">
      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      {label && (
        <span className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-16 leading-tight capitalize">
          {label}
        </span>
      )}
    </div>
  );
}

function EvolutionPokemonCard({ speciesName }: { speciesName: string }) {
  const { data: pokemon, isLoading } = usePokemon(speciesName);

  if (isLoading || !pokemon) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  const artwork = getOfficialArtwork(pokemon);

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden group-hover:ring-2 ring-red-400 transition-all">
        <img src={artwork} alt={pokemon.name} className="w-16 h-16 object-contain drop-shadow" loading="lazy" />
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400 font-mono">#{String(pokemon.id).padStart(3, '0')}</p>
        <p className="text-sm font-semibold capitalize text-gray-800 dark:text-gray-200 group-hover:text-red-500 transition-colors">
          {pokemon.name.replace(/-/g, ' ')}
        </p>
        <div className="flex gap-1 justify-center mt-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  );
}

function EvolutionNode({ link }: EvolutionNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center flex-wrap justify-center gap-1">
        <EvolutionPokemonCard speciesName={link.species.name} />

        {link.evolves_to.length > 0 && (
          <div className="flex flex-col gap-4 items-center">
            {link.evolves_to.map((evo) => (
              <div key={evo.species.name} className="flex items-center gap-1">
                <EvolutionCondition details={evo.evolution_details} />
                <EvolutionNode link={evo} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface EvolutionChainProps {
  chain: EvolutionChainLink;
}

export default function EvolutionChainDisplay({ chain }: EvolutionChainProps) {
  const hasEvolutions = chain.evolves_to.length > 0;

  if (!hasEvolutions) {
    return (
      <div className="text-center py-8">
        <EvolutionPokemonCard speciesName={chain.species.name} />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">This Pokémon does not evolve.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center overflow-x-auto py-4">
      <EvolutionNode link={chain} />
    </div>
  );
}
