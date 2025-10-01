"use client";

import React, { useState, useEffect } from 'react';
import { recettesApi } from '../../utils/api';
import { getRecipeImageUrl } from '../../utils/imageUtils';
import Link from 'next/link';

export default function TestImagesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await recettesApi.getAll({ limit: 10 });
        
        if (response.data && response.data.data) {
          console.log('Recettes récupérées:', response.data.data);
          setRecipes(response.data.data);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des recettes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test d'affichage des images de recettes</h1>
      
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        Retour à l'accueil
      </Link>
      
      {loading ? (
        <p>Chargement des recettes...</p>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded text-red-800">
          <p>Erreur: {error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <p>Aucune recette trouvée.</p>
      ) : (
        <>
          <p className="mb-4">{recipes.length} recettes récupérées.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map(recipe => (
              <div key={recipe._id} className="border p-4 rounded-lg">
                <h2 className="font-bold text-xl mb-2">{recipe.titre}</h2>
                
                <div className="mb-4">
                  <strong>Photo (données brutes):</strong>
                  <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-auto">
                    {JSON.stringify(recipe.photo, null, 2) || 'Aucune photo'}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <strong>URL de l'image:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-auto">
                    {getRecipeImageUrl(recipe.photo) || 'Aucune URL d\'image générée'}
                  </pre>
                </div>
                
                <div className="h-64 relative mb-4 bg-gray-200">
                  {getRecipeImageUrl(recipe.photo) ? (
                    <img 
                      src={getRecipeImageUrl(recipe.photo)} 
                      alt={recipe.titre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Erreur de chargement pour l'image: ${getRecipeImageUrl(recipe.photo)}`);
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><span class="text-red-500">Erreur de chargement de l\'image</span></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Aucune image</span>
                    </div>
                  )}
                </div>
                
                <Link 
                  href={`/recettes/${recipe._id}`} 
                  className="text-amber-600 hover:text-amber-800 font-medium"
                >
                  Voir la recette
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
