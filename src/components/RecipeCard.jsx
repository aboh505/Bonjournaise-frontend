"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiHeart, FiUser } from 'react-icons/fi';
import StarRating from './StarRating';
import SafeImage from './SafeImage';
import toast from 'react-hot-toast';
import { getRecipeImageUrl } from '../utils/imageUtils';

const RecipeCard = ({ recipe, isStatic = false }) => {
  const [isFavorite, setIsFavorite] = useState(recipe.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est connecté
  const isLoggedIn = typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Veuillez vous connecter pour ajouter des recettes aux favoris');
      return;
    }

    try {
      setIsLoading(true);
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error('Erreur lors de l\'ajout/suppression des favoris', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu du contenu de la carte
  const CardContent = () => (
    <>
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 relative h-48">
          <div className="w-full h-full">
            {/* Si nous avons une URL d'image valide, utiliser SafeImage */}
            {getRecipeImageUrl(recipe.photo) ? (
              <SafeImage
                src={getRecipeImageUrl(recipe.photo)}
                alt={recipe.titre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : recipe.image && recipe.image.startsWith('/') ? (
              /* Si nous avons une image locale statique */
              <Image
                src={recipe.image}
                alt={recipe.titre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              /* Si nous n'avons pas d'image, afficher un placeholder */
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="text-gray-400 text-sm font-medium">Aucune image</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isFavorite 
              ? 'bg-amber-500 text-white' 
              : 'bg-white/70 text-gray-700'
          } hover:bg-amber-500 hover:text-white transition-colors duration-300`}
        >
          <FiHeart
            className={isFavorite ? 'fill-current' : ''}
            size={18}
          />
        </button>
        {recipe.difficulte && (
          <span className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            {recipe.difficulte}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500 flex items-center">
            <FiClock className="mr-1" /> {recipe.tempsPreparation} min
          </div>
          <StarRating rating={recipe.noteMoyenne || 0} />
        </div>
        <h3 className="font-semibold text-lg mb-1 text-gray-800">
          {recipe.titre}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <FiUser className="mr-1" />
          <span>Par {recipe.auteur ? `${recipe.auteur.prenom || ''} ${recipe.auteur.nom || ''}`.trim() || 'Utilisateur anonyme' : 'Utilisateur anonyme'}</span>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      {isStatic ? (
        // Version statique pour la page d'accueil (non cliquable)
        <div className="cursor-default">
          <CardContent />
        </div>
      ) : (
        // Version cliquable pour la page des recettes
        <Link href={`/recettes/${recipe._id || recipe.id}`}>
          <CardContent />
        </Link>
      )}
    </motion.div>
  );
};

export default RecipeCard;
