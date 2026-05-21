import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useThemeStore, useFavoritesStore, useCompareStore } from '../../store';

export default function Navbar() {
  const { isDark, toggle } = useThemeStore();
  const { favorites } = useFavoritesStore();
  const { compareList } = useCompareStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    // If numeric, go to pokemon by id
    const num = parseInt(q);
    if (!isNaN(num) && num >= 1 && num <= 1025) {
      navigate(`/pokemon/${num}`);
    } else {
      navigate(`/?q=${encodeURIComponent(q)}`);
    }
    setSearch('');
  }

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center">
      <div className="max-w-screen-xl mx-auto px-4 w-full flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white shrink-0">
          <img src="/pokeball.svg" alt="" className="w-7 h-7" />
          <span className="hidden sm:inline">Pokédex</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or #..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl border border-transparent focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 text-gray-900 dark:text-white placeholder-gray-400 transition"
            />
          </div>
        </form>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            Browse
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={favorites.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden md:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {favorites.length > 99 ? '99+' : favorites.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                isActive
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden md:inline">Compare</span>
            {compareList.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {compareList.length}
              </span>
            )}
          </NavLink>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
