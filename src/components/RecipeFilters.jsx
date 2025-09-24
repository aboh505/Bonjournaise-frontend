"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Hook personnalisé pour gérer les media queries de manière sécurisée avec SSR
function useMediaQuery(query) {
  // Par défaut, nous supposons que nous ne sommes pas dans un navigateur
  const [matches, setMatches] = useState(false);
  
  // Cette approche garantit que le hook est toujours appelé de la même manière
  useEffect(() => {
    // Sécurité pour le rendu côté serveur
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia(query);
      // Mettre à jour l'état initial
      setMatches(media.matches);

      // Créer un gestionnaire pour les changements
      const listener = () => setMatches(media.matches);
      window.addEventListener('resize', listener);
      
      // Nettoyer
      return () => window.removeEventListener('resize', listener);
    }
  }, [query]); // Dépendance uniquement de la requête

  return matches;
}

const RecipeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Détecter directement si l'écran est de taille moyenne ou plus grande
  // useMediaQuery gère maintenant en interne la vérification du navigateur
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  // Récupérer les valeurs actuelles des filtres depuis l'URL
  const currentFilters = {
    categorie: searchParams.get('categorie') || '',
    difficulte: searchParams.get('difficulte') || '',
    regime: searchParams.get('regime') || '',
    tempsMax: searchParams.get('tempsMax') || '',
    caloriesMax: searchParams.get('caloriesMax') || '',
    ingredients: searchParams.get('ingredients') || '',
  };
  
  const [filters, setFilters] = useState(currentFilters);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construire les nouveaux paramètres de recherche
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    // Conserver les autres paramètres qui pourraient exister
    const q = searchParams.get('q');
    if (q) params.append('q', q);
    
    // Rediriger avec les nouveaux filtres
    router.push(`/recettes?${params.toString()}`);
    
    // Fermer le panneau de filtres sur mobile
    setIsFilterOpen(false);
  };
  
  const resetFilters = () => {
    setFilters({
      categorie: '',
      difficulte: '',
      regime: '',
      tempsMax: '',
      caloriesMax: '',
      ingredients: '',
    });
    
    // Conserver uniquement le paramètre de recherche texte s'il existe
    const q = searchParams.get('q');
    if (q) {
      router.push(`/recettes?q=${q}`);
    } else {
      router.push('/recettes');
    }
    
    setIsFilterOpen(false);
  };

  return (
    <div className="mb-6">
      {/* Bouton pour ouvrir/fermer les filtres sur mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
        >
          <FiFilter />
          <span>Filtres</span>
          <FiChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Filtres pour desktop et mobile (quand ouvert) */}
      <AnimatePresence>
        {(isFilterOpen || (!isFilterOpen && isDesktop)) && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="overflow-hidden md:overflow-visible bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent rounded-lg shadow-md md:shadow-none mt-2 md:mt-0 p-4 md:p-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="categorie" className="block text-sm font-medium mb-1">Catégorie de cuisine</label>
                <select
                  id="categorie"
                  name="categorie"
                  value={filters.categorie}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Toutes les cuisines</option>
                  <option value="camerounaise">Camerounaise</option>
                  <option value="africaine">Africaine</option>
                  <option value="occidentale">Occidentale</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulte" className="block text-sm font-medium mb-1">Difficulté</label>
                <select
                  id="difficulte"
                  name="difficulte"
                  value={filters.difficulte}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Toutes les difficultés</option>
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="regime" className="block text-sm font-medium mb-1">Régime alimentaire</label>
                <select
                  id="regime"
                  name="regime"
                  value={filters.regime}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Tous les régimes</option>
                  <option value="Végétarien">Végétarien</option>
                  <option value="Végétalien">Végétalien</option>
                  <option value="Sans gluten">Sans gluten</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tempsMax" className="block text-sm font-medium mb-1">Temps de préparation max (min)</label>
                <input
                  type="number"
                  id="tempsMax"
                  name="tempsMax"
                  value={filters.tempsMax}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: 30"
                />
              </div>
              
              <div>
                <label htmlFor="caloriesMax" className="block text-sm font-medium mb-1">Calories max</label>
                <input
                  type="number"
                  id="caloriesMax"
                  name="caloriesMax"
                  value={filters.caloriesMax}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: 500"
                />
              </div>
              
              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium mb-1">Ingrédients (séparés par des virgules)</label>
                <input
                  type="text"
                  id="ingredients"
                  name="ingredients"
                  value={filters.ingredients}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: poulet, gingembre, ail"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-amber-500"
              >
                <FiX className="mr-1" /> Réinitialiser
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeFilters;
