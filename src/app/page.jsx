"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiStar, FiPlus, FiBookOpen, FiUsers, FiCalendar, FiTruck } from 'react-icons/fi'
import { BsBookmarkStar } from 'react-icons/bs'
import RecipeCard from '../components/RecipeCard'
import SafeImage from '../components/SafeImage'
import { recettesApi } from '../utils/api'
import { getRecipeImageUrl } from '../utils/imageUtils'

// Catégories pour la page d'accueil
const categories = [
  { id: 1, nom: "Camerounaise", image: "/images/a7.jpg" },
  { id: 2, nom: "Végétarien", image: "/images/a5.jpg" },
  { id: 3, nom: "Facile", image: "/images/a6.jpg" },
  { id: 4, nom: "Rapide (< 30 min)", image: "/images/a7.jpg" }
];

function HomePage() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les recettes populaires au chargement de la page
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Rechercher les recettes avec le meilleur rating, limité à 3 pour les populaires
        const popularResponse = await recettesApi.getAll({ 
          sort: '-noteMoyenne', 
          limit: 3 
        });
        
        // Récupérer d'autres recettes pour la section principale
        const featuredResponse = await recettesApi.getAll({
          sort: '-dateCreation',
          limit: 1
        });
        
        if (popularResponse.data?.data) {
          setPopularRecipes(popularResponse.data.data);
        }
        
        if (featuredResponse.data?.data && featuredResponse.data.data.length > 0) {
          setFeaturedRecipes(featuredResponse.data.data);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      
      
      {/* Hero Section avec plat principal */}
      <div className="container mx-auto  mt-8  px-4 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Texte principal */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-4xl font-serif italic font-semibold text-gray-800">
            La patience et la passion  de cuisiner.<br />Là où chaque plat raconte une histoire de saveurs!
            </h2>
            <p className="text-lg mb-8 text-gray-600 max-w-lg">
              Découvrez notre collection de recettes authentiques camerounaises préparées par nos chefs et membres passionnés
            </p>
            <div className="flex gap-4">
             
              <Link 
                href="/ajouter-recette" 
                className="bg-white border border-gray-300 hover:border-amber-500 text-gray-800 px-6 py-3 rounded-lg transition duration-300"
              >
                Partager une recette
              </Link>
            </div>
          </div>
          
          {/* Image du plat principal */}
          <div className="lg:w-1/2 order-1 lg:order-2 relative">
            {loading ? (
              <div className="rounded-full h-[400px] w-[400px] overflow-hidden mx-auto bg-gray-200 animate-pulse"></div>
            ) : featuredRecipes && featuredRecipes[0] ? (
              <div className="rounded-full h-[400px] w-[400px] overflow-hidden mx-auto border-8 border-white shadow-xl">
                {getRecipeImageUrl(featuredRecipes[0].photo) ? (
                  <img 
                    src={getRecipeImageUrl(featuredRecipes[0].photo)} 
                    alt={featuredRecipes[0].titre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="/images/a2.jpg" 
                    alt="Cuisine camerounaise"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-full h-[400px] w-[400px] overflow-hidden mx-auto border-8 border-white shadow-xl">
                <img 
                  src="/images/a2.jpg" 
                  alt="Cuisine camerounaise"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Section plats populaires */}
      <div className="container mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-2">Top Recettes</h2>
          <p className="text-gray-600">Nos recettes les plus appréciées</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            // État de chargement
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse p-4">
                <div className="h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500 p-8 bg-red-50 rounded-lg">
              Une erreur est survenue lors du chargement des recettes.
            </div>
          ) : popularRecipes.length > 0 ? (
            popularRecipes.map((recipe, index) => (
              <div key={recipe._id} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl overflow-hidden shadow-lg p-4">
                <div className="flex justify-center">
                  <div className="h-52 w-52 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                    {getRecipeImageUrl(recipe.photo) ? (
                      <img 
                        src={getRecipeImageUrl(recipe.photo)} 
                        alt={recipe.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-200 text-amber-800">
                        Pas d'image
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="text-yellow-600 font-bold">{recipe.noteMoyenne?.toFixed(1) || '0.0'}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{recipe.titre}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {recipe.description?.substring(0, 60)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">
                      {recipe.tempsPreparation + (recipe.tempsCuisson || 0)}m
                    </div>
                    <Link href={`/recettes/${recipe._id}`} className="bg-amber-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
                      <FiPlus />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
              Aucune recette disponible pour le moment.
            </div>
          )}
        </div>
      </div>
      
      {/* Section pour une recette spécifique */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="rounded-3xl shadow-xl w-full overflow-hidden bg-gradient-to-r from-amber-50 to-amber-100 p-6">
            <svg
              viewBox="0 0 500 400"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Plat principal - bol */}
              <ellipse cx="250" cy="230" rx="150" ry="70" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
              <ellipse cx="250" cy="210" rx="130" ry="60" fill="#f97316" opacity="0.2" />
              
              {/* Ndolé - Plat vert */}
              <ellipse cx="250" cy="200" rx="120" ry="55" fill="#4ade80" opacity="0.7" />

              {/* Viande et crevettes */}
              <circle cx="210" cy="190" r="15" fill="#b91c1c" opacity="0.8" />
              <circle cx="240" cy="180" r="12" fill="#b91c1c" opacity="0.8" />
              <circle cx="270" cy="195" r="10" fill="#b91c1c" opacity="0.8" />
              
              {/* Crevettes */}
              <path d="M280,175 Q290,165 300,175 Q310,185 320,175" stroke="#f97316" strokeWidth="4" fill="none" />
              <path d="M290,195 Q300,185 310,195 Q320,205 330,195" stroke="#f97316" strokeWidth="4" fill="none" />
              
              {/* Arachides */}
              <circle cx="220" cy="160" r="6" fill="#d97706" />
              <circle cx="235" cy="155" r="6" fill="#d97706" />
              <circle cx="250" cy="165" r="6" fill="#d97706" />
              <circle cx="265" cy="155" r="6" fill="#d97706" />
              <circle cx="280" cy="160" r="6" fill="#d97706" />
              
              {/* Épices et garnitures */}
              <circle cx="200" cy="175" r="4" fill="#fbbf24" />
              <circle cx="190" cy="195" r="4" fill="#fbbf24" />
              <circle cx="220" cy="210" r="4" fill="#fbbf24" />
              <circle cx="260" cy="220" r="4" fill="#fbbf24" />
              <circle cx="290" cy="210" r="4" fill="#fbbf24" />
              <circle cx="310" cy="190" r="4" fill="#fbbf24" />
              
              {/* Vapeur */}
              <path d="M220,145 Q230,130 240,140 Q250,120 260,135 Q270,125 280,140" stroke="#d1d5db" strokeWidth="2" fill="none" opacity="0.6" />
              
              {/* Cuillère */}
              <path d="M350,220 L380,170" stroke="#94a3b8" strokeWidth="6" fill="none" />
              <ellipse cx="390" cy="160" rx="15" ry="10" fill="#94a3b8" transform="rotate(-30, 390, 160)" />
              
              
            </svg>
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Les Meilleurs Ingrédients<br />Pour Vos Plats</h2>
            <p className="text-gray-700 mb-6">
            Un plat réussi commence toujours par le choix des meilleurs produits. Un bon riz, des légumes frais, une viande tendre ou un poisson bien conservé : ce sont eux qui donnent toute leur richesse aux saveurs. Les épices et les condiments, quant à eux, apportent de la personnalité et réveillent les papilles.
              <br /><br />
              Choisir les bons ingrédients, c’est aussi faire attention à leur origine. Favoriser les produits locaux, de saison, c’est respecter la nature, soutenir les producteurs, et garantir une fraîcheur incomparable.
            </p>
            <Link 
              href="/recettes" 
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
            >
              Découvrir la recette <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Section services */}
      <div className="container mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Nos services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 rounded-full p-4 mb-3">
              <FiBookOpen size={24} className="text-amber-600" />
            </div>
            <span className="text-gray-700 font-medium">Cours en ligne</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 rounded-full p-4 mb-3">
              <BsBookmarkStar size={24} className="text-amber-600" />
            </div>
            <span className="text-gray-700 font-medium">Recettes exclusives</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 rounded-full p-4 mb-3">
              <FiUsers size={24} className="text-amber-600" />
            </div>
            <span className="text-gray-700 font-medium">Communauté</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 rounded-full p-4 mb-3">
              <FiTruck size={24} className="text-amber-600" />
            </div>
            <span className="text-gray-700 font-medium">Menu complet</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
