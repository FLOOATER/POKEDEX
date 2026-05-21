import type {
  Pokemon,
  PokemonListItem,
  PokemonSpecies,
  EvolutionChain,
  TypeResponse,
  GenerationResponse,
} from '../types/pokemon';

const BASE = 'https://pokeapi.co/api/v2';

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokéAPI error: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  const data = await get<{ results: PokemonListItem[] }>(`${BASE}/pokemon?limit=1025&offset=0`);
  return data.results;
}

export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  return get<Pokemon>(`${BASE}/pokemon/${idOrName}`);
}

export async function fetchSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  return get<PokemonSpecies>(`${BASE}/pokemon-species/${idOrName}`);
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  return get<EvolutionChain>(url);
}

export async function fetchPokemonByType(type: string): Promise<PokemonListItem[]> {
  const data = await get<TypeResponse>(`${BASE}/type/${type}`);
  return data.pokemon.map((entry) => entry.pokemon);
}

export async function fetchGeneration(id: number): Promise<GenerationResponse> {
  return get<GenerationResponse>(`${BASE}/generation/${id}`);
}

export function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

export function getOfficialArtwork(pokemon: Pokemon, shiny = false): string {
  const art = pokemon.sprites.other['official-artwork'];
  if (shiny) {
    // Prefer high-res shiny artwork, fall back to regular sprite shiny, then non-shiny
    return (
      art.front_shiny ??
      pokemon.sprites.front_shiny ??
      art.front_default ??
      pokemon.sprites.front_default ??
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
    );
  }
  return (
    art.front_default ??
    pokemon.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  );
}

export function getHomeSprite(pokemon: Pokemon, shiny = false): string {
  const home = pokemon.sprites.other?.home;
  if (shiny && home?.front_shiny) return home.front_shiny;
  if (home?.front_default) return home.front_default;
  return getOfficialArtwork(pokemon, shiny);
}
