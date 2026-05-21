import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  fetchAllPokemon,
  fetchPokemon,
  fetchSpecies,
  fetchEvolutionChain,
  fetchPokemonByType,
  extractIdFromUrl,
} from '../api/pokeapi';
import { GENERATION_RANGES, PAGE_SIZE } from '../utils/constants';
import { useFilterStore } from '../store';
import type { PokemonListItem } from '../types/pokemon';

export function useAllPokemon() {
  return useQuery({
    queryKey: ['all-pokemon'],
    queryFn: fetchAllPokemon,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function usePokemon(idOrName: string | number) {
  return useQuery({
    queryKey: ['pokemon', String(idOrName)],
    queryFn: () => fetchPokemon(idOrName),
    staleTime: 1000 * 60 * 30,
    enabled: !!idOrName,
  });
}

export function useSpecies(idOrName: string | number) {
  return useQuery({
    queryKey: ['species', String(idOrName)],
    queryFn: () => fetchSpecies(idOrName),
    staleTime: 1000 * 60 * 30,
    enabled: !!idOrName,
  });
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchEvolutionChain(url!),
    staleTime: 1000 * 60 * 30,
    enabled: !!url,
  });
}

export function usePokemonByType(type: string | null) {
  return useQuery({
    queryKey: ['type', type],
    queryFn: () => fetchPokemonByType(type!),
    staleTime: 1000 * 60 * 30,
    enabled: !!type,
  });
}

export function useFilteredPokemon() {
  const { search, types, generation, sortBy, sortDir } = useFilterStore();
  const { data: allPokemon, isLoading: allLoading } = useAllPokemon();

  const primaryType = types.length > 0 ? types[0] : null;
  const { data: typePokemon, isLoading: typeLoading } = usePokemonByType(primaryType);

  const secondaryType = types.length > 1 ? types[1] : null;
  const { data: secondaryTypePokemon } = usePokemonByType(secondaryType);

  const filteredList = useMemo<PokemonListItem[]>(() => {
    if (!allPokemon) return [];

    let list = allPokemon.filter((p) => {
      const id = extractIdFromUrl(p.url);
      return id >= 1 && id <= 1025;
    });

    if (generation) {
      const [min, max] = GENERATION_RANGES[generation];
      list = list.filter((p) => {
        const id = extractIdFromUrl(p.url);
        return id >= min && id <= max;
      });
    }

    if (types.length > 0 && typePokemon) {
      const typeSet = new Set(typePokemon.map((p) => p.name));
      list = list.filter((p) => typeSet.has(p.name));

      if (types.length > 1 && secondaryTypePokemon) {
        const secondarySet = new Set(secondaryTypePokemon.map((p) => p.name));
        list = list.filter((p) => secondarySet.has(p.name));
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => {
        const id = extractIdFromUrl(p.url).toString();
        return p.name.includes(q) || id === q || id.padStart(4, '0') === q;
      });
    }

    if (sortBy === 'name') {
      list = [...list].sort((a, b) =>
        sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    } else if (sortBy === 'id') {
      list = [...list].sort((a, b) => {
        const diff = extractIdFromUrl(a.url) - extractIdFromUrl(b.url);
        return sortDir === 'asc' ? diff : -diff;
      });
    }

    return list;
  }, [allPokemon, typePokemon, secondaryTypePokemon, generation, types, search, sortBy, sortDir]);

  return {
    filteredList,
    isLoading: allLoading || (types.length > 0 && typeLoading),
  };
}

export function useInfiniteFilteredPokemon() {
  const { filteredList, isLoading } = useFilteredPokemon();

  return useInfiniteQuery({
    queryKey: ['infinite-filtered', filteredList.map((p) => p.name).join(',')],
    queryFn: ({ pageParam }) => {
      const start = (pageParam as number) * PAGE_SIZE;
      return Promise.resolve(filteredList.slice(start, start + PAGE_SIZE));
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) => {
      const loaded = allPages.flat().length;
      return loaded < filteredList.length ? allPages.length : undefined;
    },
    enabled: !isLoading,
    staleTime: 0,
  });
}
