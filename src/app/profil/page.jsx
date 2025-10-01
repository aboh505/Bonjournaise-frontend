"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiHeart, FiUser, FiLogOut, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { recettesApi, authApi } from '../../utils/api';
import RecipeCard from '../../components/RecipeCard';
import SafeImage from '../../components/SafeImage';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('mes-recettes');
  const [recettes, setRecettes] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    photo: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  
  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isLoggedIn) {
        toast.error('Vous devez être connecté pour accéder à votre profil');
        router.push('/connexion?redirect=/profil');
      }
    }
  }, [isLoggedIn, router]);

  // Charger les données de l'utilisateur
  useEffect(() => {
    if (user) {
      setProfileData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        photo: user.photo || null
      });
    }
  }, [user]);

  // Charger les recettes et les favoris de l'utilisateur
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchUserContent = async () => {
      try {
        setLoading(true);
        
        // Récupération des recettes de l'utilisateur connecté
        try {
          // Essayer d'abord avec l'endpoint spécifique getUserRecipes
          try {
            const userRecipesResponse = await recettesApi.getUserRecipes();
            console.log('Récupération des recettes utilisateur (API spécifique):', userRecipesResponse.data);
            
            if (userRecipesResponse.data.success !== false) {
              setRecettes(userRecipesResponse.data.data || []);
            } else {
              throw new Error(userRecipesResponse.data.message || 'Erreur API');
            }
          } catch (specificApiError) {
            // Si l'endpoint spécifique échoue, utiliser l'API générique avec un filtre
            console.log('L\'endpoint spécifique a échoué, utilisation de l\'API générique');
            const userRecipesResponse = await recettesApi.getAll({ auteur: user.id });
            console.log('Récupération des recettes utilisateur (API générique):', userRecipesResponse.data);
            
            if (userRecipesResponse.data.success !== false) {
              setRecettes(userRecipesResponse.data.data || []);
            } else {
              console.error('Erreur lors de la récupération des recettes utilisateur:', userRecipesResponse.data.message);
              setRecettes([]);
            }
          }
        } catch (recettesError) {
          console.error('Erreur lors de la récupération des recettes utilisateur:', recettesError);
          setRecettes([]);
        }
        
        // Récupération des favoris
        try {
          const userFavoritesResponse = await recettesApi.getFavorites();
          console.log('Récupération des favoris:', userFavoritesResponse.data);
          
          if (userFavoritesResponse.data.success !== false) {
            // Marquer les recettes comme favorites
            const favoritesWithFlag = userFavoritesResponse.data.data?.map(recipe => ({
              ...recipe,
              isFavorite: true
            })) || [];
            
            setFavoris(favoritesWithFlag);
          } else {
            console.error('Erreur lors de la récupération des favoris:', userFavoritesResponse.data.message);
            setFavoris([]);
          }
        } catch (favorisError) {
          console.error('Erreur lors de la récupération des favoris:', favorisError);
          setFavoris([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
        toast.error("Une erreur est survenue lors du chargement de vos données");
      } finally {
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [isLoggedIn, user?.id]);

  // Gérer le changement des champs du profil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Gérer le changement de la photo de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        photo: file
      });
      
      // Créer une URL pour l'aperçu
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Gérer la sauvegarde du profil
  const handleSaveProfile = async () => {
    try {
      // Appel à l'API pour mettre à jour le profil
      const success = await updateProfile({
        nom: profileData.nom,
        prenom: profileData.prenom,
        email: profileData.email
      });
      
      // Mise à jour de la photo de profil si une nouvelle photo a été sélectionnée
      if (success && profileData.photo) {
        console.log('Mise à jour de la photo de profil');
        try {
          // Créer un objet FormData pour l'upload de la photo
          const formData = new FormData();
          formData.append('file', profileData.photo);
          
          // Appel à l'API pour télécharger la photo
          await authApi.updateProfilePhoto(formData);
          
          // Force le rechargement du profil utilisateur pour afficher la nouvelle photo
          const updatedProfile = await authApi.getProfile();
          if (updatedProfile?.data?.data) {
            // Mettre à jour l'objet utilisateur dans localStorage
            localStorage.setItem('user', JSON.stringify(updatedProfile.data.data));
          }
          
          // Actualiser la page pour afficher la nouvelle photo
          window.location.reload();
          toast.success("Photo de profil mise à jour avec succès !");
        } catch (photoError) {
          console.error('Erreur lors de la mise à jour de la photo de profil:', photoError);
          toast.error("Erreur lors de la mise à jour de la photo de profil");
        }
      }
      
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil");
    }
  };

  // Gérer la suppression d'une recette
  const handleDeleteRecipe = async (recetteId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return;

    try {
      // Appel à l'API pour supprimer la recette
      await recettesApi.delete(recetteId);
      
      // Mise à jour locale de la liste des recettes
      // Utiliser _id qui est l'ID MongoDB ou id comme fallback
      setRecettes(recettes.filter(recette => (recette._id || recette.id) !== recetteId));
      
      toast.success("Recette supprimée avec succès");
      
      // Si la recette était également dans les favoris, la supprimer aussi
      setFavoris(favoris.filter(recette => (recette._id || recette.id) !== recetteId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la recette:', error);
      toast.error("Une erreur est survenue lors de la suppression de la recette");
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
    }
  };

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* Section profil */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo de profil */}
          <div className="md:w-1/4">
            <div className="relative">
              <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-amber-100 dark:border-amber-900">
                {/* Si nous avons une image, l'afficher avec SafeImage */}
                {(previewImage || user.photo) ? (
                  <SafeImage
                    src={previewImage || user.photo}
                    alt={`${user.prenom} ${user.nom}`}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                ) : (
                  /* Sinon, utiliser l'image par défaut avec Image standard */
                  <Image
                    src="/images/default-avatar.svg"
                    alt={`${user.prenom} ${user.nom}`}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="photo"
                  className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-0 md:translate-x-0 md:right-0 bg-amber-500 hover:bg-amber-600 p-2 rounded-full text-white cursor-pointer"
                >
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <FiUpload size={16} />
                </label>
              )}
            </div>
            
            {isEditing ? (
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center space-y-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-amber-500 hover:text-amber-600"
                >
                  <FiEdit className="mr-1" /> Modifier le profil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <FiLogOut className="mr-1" /> Se déconnecter
                </button>
              </div>
            )}
          </div>
          
          {/* Informations du profil */}
          <div className="md:w-3/4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium mb-1">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={profileData.prenom}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={profileData.nom}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {user.prenom} {user.nom}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                  <FiUser className="mr-2" /> {user.email}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                    <p className="font-semibold">{recettes.length}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Recettes publiées</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg">
                    <p className="font-semibold">{favoris.length}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Recettes favorites</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Bienvenue sur votre profil ! Ici, vous pouvez gérer vos recettes et accéder à vos favoris.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('mes-recettes')}
          className={`py-4 px-6 border-b-2 font-medium ${
            activeTab === 'mes-recettes'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:border-amber-500'
          }`}
        >
          Mes Recettes
        </button>
        <button
          onClick={() => setActiveTab('favoris')}
          className={`py-4 px-6 border-b-2 font-medium ${
            activeTab === 'favoris'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-amber-500 hover:border-amber-500'
          }`}
        >
          Favoris
        </button>
      </div>
      
      {/* Contenu des onglets */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      ) : (
        <>
          {/* Mes Recettes */}
          {activeTab === 'mes-recettes' && (
            <div>
              {recettes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiPlus size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune recette publiée</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Vous n'avez pas encore publié de recettes. Partagez votre première recette !
                  </p>
                  <Link href="/ajouter-recette">
                    <span className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg inline-block">
                      Ajouter une recette
                    </span>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-6">
                    <Link href="/ajouter-recette">
                      <span className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg inline-flex items-center">
                        <FiPlus className="mr-2" /> Ajouter une recette
                      </span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recettes.map(recette => (
                      <div key={recette._id || recette.id} className="relative">
                        <RecipeCard recipe={recette} />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Link href={`/recettes/${recette._id || recette.id}/modifier`}>
                            <span className="bg-white/70 dark:bg-gray-800/70 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-amber-500 hover:text-white transition-colors">
                              <FiEdit size={16} />
                            </span>
                          </Link>
                          <button
                            onClick={() => handleDeleteRecipe(recette._id || recette.id)}
                            className="bg-white/70 dark:bg-gray-800/70 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Favoris */}
          {activeTab === 'favoris' && (
            <div>
              {favoris.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiHeart size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune recette en favoris</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Explorez les recettes et ajoutez-les à vos favoris pour les retrouver facilement.
                  </p>
                  <Link href="/recettes">
                    <span className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg inline-block">
                      Explorer les recettes
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {favoris.map(favori => (
                    <RecipeCard key={favori._id || favori.id} recipe={favori} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
