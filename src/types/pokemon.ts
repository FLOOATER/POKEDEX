export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: NamedResource;
}

export interface PokemonAbility {
  slot: number;
  is_hidden: boolean;
  ability: NamedResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedResource;
}

export interface PokemonMove {
  move: NamedResource;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NamedResource;
    version_group: NamedResource;
  }[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  species: NamedResource;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedResource;
  version: NamedResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  base_happiness: number | null;
  capture_rate: number;
  color: NamedResource;
  flavor_text_entries: FlavorTextEntry[];
  generation: NamedResource;
  growth_rate: NamedResource;
  habitat: NamedResource | null;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  evolution_chain: { url: string };
  genera: { genus: string; language: NamedResource }[];
  names: { name: string; language: NamedResource }[];
}

export interface EvolutionDetail {
  min_level: number | null;
  trigger: NamedResource;
  item: NamedResource | null;
  held_item: NamedResource | null;
  known_move: NamedResource | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  time_of_day: string;
  location: NamedResource | null;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: NamedResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface TypePokemonEntry {
  pokemon: NamedResource;
  slot: number;
}

export interface TypeResponse {
  name: string;
  pokemon: TypePokemonEntry[];
}

export interface GenerationResponse {
  name: string;
  pokemon_species: NamedResource[];
}

export type SortOption = 'id' | 'name' | 'height' | 'weight' | 'total-stats';

export interface FilterState {
  search: string;
  types: string[];
  generation: number | null;
  sortBy: SortOption;
  sortDir: 'asc' | 'desc';
}
