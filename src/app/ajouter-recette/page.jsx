"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiInfo, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { recettesApi, categoriesApi } from '../../utils/api';

// Liste des types de cuisine (à remplacer par un appel API en production)
const typesOfCuisine = [
  "Camerounaise",
  "Africaine",
  "Occidentale",
  "Fusion"
];

// Liste des régimes alimentaires
const regimesAlimentaires = [
  "Végétarien",
  "Végétalien",
  "Sans gluten",
  "Sans lactose",
  "Aucun"
];

// Niveaux de difficulté
const niveauxDifficulte = [
  "Facile",
  "Moyen",
  "Difficile"
];

export default function AddRecipePage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    ingredients: [{ nom: "", quantite: "", unite: "" }],
    etapes: [""],
    tempsPreparation: "",
    tempsCuisson: "",
    difficulte: "",
    typeCuisine: "",
    regimeAlimentaire: [],
    calories: "",
    photo: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!isLoggedIn) {
        toast.error('Vous devez être connecté pour ajouter une recette');
        router.push('/connexion?redirect=/ajouter-recette');
      }
    }
  }, [isLoggedIn, router]);

  // Gestion des changements de champs simples
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  // Gestion des ingrédients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
    
    // Effacer l'erreur pour les ingrédients
    if (errors.ingredients) {
      setErrors({
        ...errors,
        ingredients: ""
      });
    }
  };
  
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { nom: "", quantite: "", unite: "" }]
    });
  };
  
  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };
  
  // Gestion des étapes
  const handleEtapeChange = (index, value) => {
    const newEtapes = [...formData.etapes];
    newEtapes[index] = value;
    setFormData({
      ...formData,
      etapes: newEtapes
    });
    
    // Effacer l'erreur pour les étapes
    if (errors.etapes) {
      setErrors({
        ...errors,
        etapes: ""
      });
    }
  };
  
  const addEtape = () => {
    setFormData({
      ...formData,
      etapes: [...formData.etapes, ""]
    });
  };
  
  const removeEtape = (index) => {
    const newEtapes = [...formData.etapes];
    newEtapes.splice(index, 1);
    setFormData({
      ...formData,
      etapes: newEtapes
    });
  };
  
  // Gestion des régimes alimentaires (cases à cocher)
  const handleRegimeChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        regimeAlimentaire: [...formData.regimeAlimentaire, value]
      });
    } else {
      setFormData({
        ...formData,
        regimeAlimentaire: formData.regimeAlimentaire.filter(regime => regime !== value)
      });
    }
  };
  
  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file
      });
      
      // Créer une URL pour l'aperçu
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      
      // Effacer l'erreur pour l'image
      if (errors.photo) {
        setErrors({
          ...errors,
          photo: ""
        });
      }
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation des champs obligatoires
    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est obligatoire";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire";
    }
    
    // Validation des ingrédients
    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "Au moins un ingrédient est obligatoire";
    } else {
      const hasEmptyIngredient = formData.ingredients.some(
        ing => !ing.nom.trim() || !ing.quantite.trim()
      );
      if (hasEmptyIngredient) {
        newErrors.ingredients = "Tous les ingrédients doivent avoir un nom et une quantité";
      }
    }
    
    // Validation des étapes
    if (formData.etapes.length === 0) {
      newErrors.etapes = "Au moins une étape est obligatoire";
    } else {
      const hasEmptyEtape = formData.etapes.some(etape => !etape.trim());
      if (hasEmptyEtape) {
        newErrors.etapes = "Les étapes ne peuvent pas être vides";
      }
    }
    
    // Validation des champs numériques
    if (!formData.tempsPreparation) {
      newErrors.tempsPreparation = "Le temps de préparation est obligatoire";
    } else if (isNaN(formData.tempsPreparation) || formData.tempsPreparation <= 0) {
      newErrors.tempsPreparation = "Le temps de préparation doit être un nombre positif";
    }
    
    if (formData.tempsCuisson && (isNaN(formData.tempsCuisson) || formData.tempsCuisson < 0)) {
      newErrors.tempsCuisson = "Le temps de cuisson doit être un nombre positif";
    }
    
    if (formData.calories && (isNaN(formData.calories) || formData.calories < 0)) {
      newErrors.calories = "Les calories doivent être un nombre positif";
    }
    
    // Validation des sélections
    if (!formData.difficulte) {
      newErrors.difficulte = "Veuillez sélectionner un niveau de difficulté";
    }
    
    if (!formData.typeCuisine) {
      newErrors.typeCuisine = "Veuillez sélectionner un type de cuisine";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier si l'utilisateur est connecté
      if (!isLoggedIn || !localStorage.getItem('token')) {
        toast.error("Vous devez être connecté pour ajouter une recette");
        router.push('/connexion?redirect=/ajouter-recette');
        return;
      }
      
      // Préparation des données de la recette pour l'API
      const recetteData = {
        ...formData,
        tempsPreparation: parseInt(formData.tempsPreparation),
        tempsCuisson: formData.tempsCuisson ? parseInt(formData.tempsCuisson) : undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        // S'assurer que regimeAlimentaire est un tableau et filtrer les valeurs vides
        regimeAlimentaire: Array.isArray(formData.regimeAlimentaire) ? formData.regimeAlimentaire.filter(Boolean) : []
      };
      
      // Ne pas envoyer la photo dans le même objet JSON
      const photoFile = formData.photo;
      delete recetteData.photo;
      
      console.log('Données envoyées à l\'API:', JSON.stringify(recetteData, null, 2));
      
      // Utiliser une approche try/catch alternative pour déboguer les erreurs
      let response;
      try {
        // Appel à l'API pour créer la recette
        response = await recettesApi.create(recetteData);
        console.log('Réponse API reçue:', response.data);
      } catch (apiError) {
        console.error('Détails de l\'erreur API:', apiError.response?.data || apiError.message);
        throw apiError;
      }
      
      // Récupération de l'ID de la recette créée (MongoDB utilise _id)
      const recetteId = response.data.data._id;
      
      console.log('Recette créée avec succès, ID:', recetteId);
      
      // Si une photo est présente, l'envoyer
      if (photoFile) {
        try {
          const formDataObj = new FormData();
          formDataObj.append('file', photoFile);
          await recettesApi.uploadPhoto(recetteId, formDataObj);
          console.log('Photo téléchargée avec succès');
        } catch (photoError) {
          console.error('Erreur lors du téléchargement de la photo:', photoError);
          // Ne pas bloquer le processus si l'upload de la photo échoue
          toast.error("La recette a été créée mais l'upload de la photo a échoué");
        }
      }
      
      toast.success("Recette ajoutée avec succès !");
      
      // Redirection vers la page de détail de la recette nouvellement créée
      router.push(`/recettes/${recetteId}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la recette:', error.message || error);
      
      if (error.response?.status === 401) {
        toast.error("Vous n'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.");
        router.push('/connexion?redirect=/ajouter-recette');
      } else {
        toast.error(error.response?.data?.message || "Une erreur est survenue lors de l'ajout de la recette");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Ajouter une recette</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        {/* Informations générales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div>
              <label htmlFor="titre" className="block text-sm font-medium mb-1">Titre de la recette *</label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.titre ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              />
              {errors.titre && (
                <p className="mt-1 text-sm text-red-500">{errors.titre}</p>
              )}
            </div>
            
            {/* Type de cuisine */}
            <div>
              <label htmlFor="typeCuisine" className="block text-sm font-medium mb-1">Type de cuisine *</label>
              <select
                id="typeCuisine"
                name="typeCuisine"
                value={formData.typeCuisine}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.typeCuisine ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              >
                <option value="">Sélectionner un type de cuisine</option>
                {typesOfCuisine.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.typeCuisine && (
                <p className="mt-1 text-sm text-red-500">{errors.typeCuisine}</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 border ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          {/* Temps et difficulté */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label htmlFor="tempsPreparation" className="block text-sm font-medium mb-1">Temps de préparation (minutes) *</label>
              <input
                type="number"
                id="tempsPreparation"
                name="tempsPreparation"
                value={formData.tempsPreparation}
                onChange={handleChange}
                min="1"
                className={`w-full p-3 border ${
                  errors.tempsPreparation ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              />
              {errors.tempsPreparation && (
                <p className="mt-1 text-sm text-red-500">{errors.tempsPreparation}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="tempsCuisson" className="block text-sm font-medium mb-1">Temps de cuisson (minutes)</label>
              <input
                type="number"
                id="tempsCuisson"
                name="tempsCuisson"
                value={formData.tempsCuisson}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 border ${
                  errors.tempsCuisson ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              />
              {errors.tempsCuisson && (
                <p className="mt-1 text-sm text-red-500">{errors.tempsCuisson}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="difficulte" className="block text-sm font-medium mb-1">Niveau de difficulté *</label>
              <select
                id="difficulte"
                name="difficulte"
                value={formData.difficulte}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  errors.difficulte ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              >
                <option value="">Sélectionner un niveau</option>
                {niveauxDifficulte.map((niveau) => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
              {errors.difficulte && (
                <p className="mt-1 text-sm text-red-500">{errors.difficulte}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Photo de la recette */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Photo de la recette</h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 rounded-lg text-center">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {previewImage ? (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Aperçu de la recette"
                  className="h-64 mx-auto object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData({ ...formData, photo: null });
                  }}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Supprimer l'image
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FiUpload size={36} className="mb-2 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 mb-1">
                  Cliquez pour télécharger une photo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  JPG, PNG ou GIF, max 5 Mo
                </span>
              </label>
            )}
          </div>
        </div>
        
        {/* Ingrédients */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ingrédients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center text-amber-500 hover:text-amber-600"
            >
              <FiPlus className="mr-1" /> Ajouter un ingrédient
            </button>
          </div>
          
          {errors.ingredients && (
            <p className="mt-1 mb-4 text-sm text-red-500">{errors.ingredients}</p>
          )}
          
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-col md:flex-row mb-4 gap-4">
              <div className="flex-grow md:w-1/2">
                <label htmlFor={`ingredient-nom-${index}`} className="sr-only">Nom de l'ingrédient</label>
                <input
                  type="text"
                  id={`ingredient-nom-${index}`}
                  placeholder="Nom de l'ingrédient"
                  value={ingredient.nom}
                  onChange={(e) => handleIngredientChange(index, 'nom', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor={`ingredient-quantite-${index}`} className="sr-only">Quantité</label>
                <input
                  type="text"
                  id={`ingredient-quantite-${index}`}
                  placeholder="Quantité"
                  value={ingredient.quantite}
                  onChange={(e) => handleIngredientChange(index, 'quantite', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              
              <div className="md:w-1/4">
                <label htmlFor={`ingredient-unite-${index}`} className="sr-only">Unité</label>
                <input
                  type="text"
                  id={`ingredient-unite-${index}`}
                  placeholder="Unité (g, ml, etc.)"
                  value={ingredient.unite}
                  onChange={(e) => handleIngredientChange(index, 'unite', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700 p-3"
                disabled={formData.ingredients.length === 1}
              >
                <FiTrash2 />
                <span className="sr-only">Supprimer l'ingrédient</span>
              </button>
            </div>
          ))}
        </div>
        
        {/* Étapes de préparation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Étapes de préparation</h2>
            <button
              type="button"
              onClick={addEtape}
              className="flex items-center text-amber-500 hover:text-amber-600"
            >
              <FiPlus className="mr-1" /> Ajouter une étape
            </button>
          </div>
          
          {errors.etapes && (
            <p className="mt-1 mb-4 text-sm text-red-500">{errors.etapes}</p>
          )}
          
          {formData.etapes.map((etape, index) => (
            <div key={index} className="flex mb-4 gap-4">
              <div className="flex-shrink-0 mt-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-grow">
                <label htmlFor={`etape-${index}`} className="sr-only">Étape {index + 1}</label>
                <textarea
                  id={`etape-${index}`}
                  placeholder={`Étape ${index + 1}`}
                  value={etape}
                  onChange={(e) => handleEtapeChange(index, e.target.value)}
                  rows="2"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeEtape(index)}
                className="text-red-500 hover:text-red-700 p-3"
                disabled={formData.etapes.length === 1}
              >
                <FiTrash2 />
                <span className="sr-only">Supprimer l'étape</span>
              </button>
            </div>
          ))}
        </div>
        
        {/* Informations nutritionnelles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Informations nutritionnelles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium mb-1">Calories par portion</label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="0"
                placeholder="Optionnel"
                className={`w-full p-3 border ${
                  errors.calories ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
              />
              {errors.calories && (
                <p className="mt-1 text-sm text-red-500">{errors.calories}</p>
              )}
            </div>
            
            <div>
              <p className="block text-sm font-medium mb-2">Régime alimentaire</p>
              <div className="space-y-2">
                {regimesAlimentaires.map((regime) => (
                  <label key={regime} className="flex items-center">
                    <input
                      type="checkbox"
                      name="regimeAlimentaire"
                      value={regime}
                      checked={formData.regimeAlimentaire.includes(regime)}
                      onChange={handleRegimeChange}
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">{regime}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Note d'information */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8 flex">
          <FiInfo className="text-blue-500 mr-3 flex-shrink-0 mt-1" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            En publiant votre recette, vous acceptez qu'elle soit visible par tous les utilisateurs de SaveursDuKmer.
            Vous pourrez la modifier ou la supprimer à tout moment depuis votre profil.
          </p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Publication en cours...
              </>
            ) : (
              'Publier la recette'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
