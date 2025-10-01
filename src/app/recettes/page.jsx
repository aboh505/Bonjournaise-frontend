"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import RecipeCard from '../../components/RecipeCard';
import RecipeFilters from '../../components/RecipeFilters';
import Pagination from '../../components/Pagination';
import { recettesApi } from '../../utils/api';

// Données fallback au cas où l'API ne répond pas
const fallbackRecettes = [
  {
    _id: 1,
    titre: "Ndolé",
    description: "Le Ndolé est un plat traditionnel camerounais à base de feuilles amères, de pâte d'arachide et de viande ou de poisson.",
    image: "/images/a2.jpg",
    tempsPreparation: 45,
    difficulte: "Moyen",
    noteMoyenne: 4.8,
    auteur: { nom: "Chef Pierre", prenom: "" }
  },
  {
    _id: 2,
    titre: "Poulet DG",
    description: "Le Poulet DG (Directeur Général) est un plat prestigieux camerounais composé de poulet, de plantains mûrs et de légumes.",
    image: "/images/a3.jpg",
    tempsPreparation: 60,
    difficulte: "Moyen",
    noteMoyenne: 4.9,
    auteur: { nom: "Tatiana", prenom: "Chef" }
  },
  {
    _id: 3,
    titre: "Eru",
    description: "L'Eru est un plat à base de feuilles de Gnetum africanum préparé avec de l'huile de palme, du poisson séché et de la viande.",
    image: "/images/a4.jpg",
    tempsPreparation: 40,
    difficulte: "Moyen",
    noteMoyenne: 4.7,
    auteur: { nom: "Samuel", prenom: "Chef" }
  }
];

function RecipesList() {
  const searchParams = useSearchParams();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [totalRecipes, setTotalRecipes] = useState(0);
  
  // Obtenir les paramètres de l'URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const categoryFilter = searchParams.get('categorie') || '';
  const difficultyFilter = searchParams.get('difficulte') || '';
  const dietFilter = searchParams.get('regime') || '';
  
  // Charger les recettes en fonction des filtres
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        
        // Appel à l'API
        const params = {
          page: currentPage,
          limit: 9,
          typeCuisine: categoryFilter || undefined,
          difficulte: difficultyFilter || undefined,
          regimeAlimentaire: dietFilter || undefined,
          q: searchTerm || undefined
        };
        
        try {
          const response = await recettesApi.search(params);
          console.log('Données des recettes reçues de l\'API:', response.data.data);
          setRecipes(response.data.data);
          setTotalRecipes(response.data.total);
        } catch (apiError) {
          console.error('Erreur API, utilisation des données de fallback:', apiError);
          
          // Fallback avec filtrage client-side en cas d'échec de l'API
          let filteredRecipes = [...fallbackRecettes];
          
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredRecipes = filteredRecipes.filter(recipe => 
              recipe.titre.toLowerCase().includes(term) || 
              recipe.description.toLowerCase().includes(term)
            );
          }
          
          if (categoryFilter) {
            filteredRecipes = filteredRecipes.filter(recipe => 
              recipe.typeCuisine?.toLowerCase() === categoryFilter.toLowerCase()
            );
          }
          
          if (difficultyFilter) {
            filteredRecipes = filteredRecipes.filter(recipe => 
              recipe.difficulte === difficultyFilter
            );
          }
          
          setRecipes(filteredRecipes);
          setTotalRecipes(filteredRecipes.length);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des recettes:', err);
        setError('Une erreur est survenue lors du chargement des recettes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams, searchTerm, currentPage, categoryFilter, difficultyFilter, dietFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construire l'URL avec les paramètres existants + le terme de recherche
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Revenir à la page 1 lors d'une nouvelle recherche
    
    // Redirection vers la nouvelle URL (fait dans le navigateur, pas de rerender)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    // Déclencher un événement pour informer Next.js du changement d'URL
    window.dispatchEvent(new Event('popstate'));
  };
  
  // Calcul du nombre total de pages
  const totalPages = Math.ceil(totalRecipes / 9); // 9 recettes par page

  // Titre de la page en fonction des filtres
  const getPageTitle = () => {
    if (categoryFilter) {
      return `Recettes de cuisine ${categoryFilter}`;
    }
    if (difficultyFilter) {
      return `Recettes ${difficultyFilter.toLowerCase()}s`;
    }
    if (dietFilter) {
      return `Recettes ${dietFilter}`;
    }
    if (searchTerm) {
      return `Résultats pour "${searchTerm}"`;
    }
    return "Toutes les recettes";
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{getPageTitle()}</h1>
        
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des recettes..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
            />
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </form>
        
        {/* Filtres */}
        <RecipeFilters />
      </div>
      
      {/* Résultats de recherche */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/recettes'}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Aucune recette trouvée</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Essayez de modifier vos critères de recherche ou de consulter toutes les recettes.
          </p>
          <button 
            onClick={() => window.location.href = '/recettes'}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Voir toutes les recettes
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {totalRecipes} recette{totalRecipes > 1 ? 's' : ''} trouvée{totalRecipes > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <motion.div 
                key={recipe._id || recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl="/recettes" 
          />
        </>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 pt-24 pb-12 flex justify-center items-center min-h-[50vh]">Chargement des recettes...</div>}>
      <RecipesList />
    </Suspense>
  );
}
