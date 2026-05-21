import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import CompareDrawer from './components/pokemon/CompareDrawer';
import HomePage from './pages/HomePage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import ComparePage from './pages/ComparePage';
import FavoritesPage from './pages/FavoritesPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </AnimatePresence>
      <CompareDrawer />
    </div>
  );
}
