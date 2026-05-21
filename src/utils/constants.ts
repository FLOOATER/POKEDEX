export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const TYPE_TEXT_COLORS: Record<string, string> = {
  normal: '#ffffff',
  fire: '#ffffff',
  water: '#ffffff',
  electric: '#333333',
  grass: '#ffffff',
  ice: '#333333',
  fighting: '#ffffff',
  poison: '#ffffff',
  ground: '#333333',
  flying: '#ffffff',
  psychic: '#ffffff',
  bug: '#ffffff',
  rock: '#ffffff',
  ghost: '#ffffff',
  dragon: '#ffffff',
  dark: '#ffffff',
  steel: '#333333',
  fairy: '#ffffff',
};

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

export const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

export const GENERATION_NAMES: Record<number, string> = {
  1: 'Generation I',
  2: 'Generation II',
  3: 'Generation III',
  4: 'Generation IV',
  5: 'Generation V',
  6: 'Generation VI',
  7: 'Generation VII',
  8: 'Generation VIII',
  9: 'Generation IX',
  0: 'Gigantamax',
};

export const STAT_DISPLAY_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.A',
  'special-defense': 'Sp.D',
  speed: 'SPD',
};

export const STAT_FULL_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

export const STAT_COLORS: Record<string, string> = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

export const MAX_STAT = 255;
export const PAGE_SIZE = 24;
export const MAX_COMPARE = 3;
