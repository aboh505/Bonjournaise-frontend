"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiInfo, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import { recettesApi } from '../../../../utils/api';

// Listes des options (identiques à celles de la page d'ajout)
const typesOfCuisine = ["Camerounaise", "Africaine", "Occidentale", "Fusion"];
const regimesAlimentaires = ["Végétarien", "Végétalien", "Sans gluten", "Sans lactose", "Aucun"];
const niveauxDifficulte = ["Facile", "Moyen", "Difficile"];

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const { isLoggedIn, user } = useAuth();
  const recipeId = params?.id;
  
  // États
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
  
  const [originalPhoto, setOriginalPhoto] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Récupérer les données de la recette lors du chargement
  useEffect(() => {
    const fetchRecipeData = async () => {
      if (!recipeId) return;

      try {
        setIsLoading(true);
        const response = await recettesApi.getById(recipeId);
        
        // Récupérer les données de la recette
        let recipeData;
        if (response.data && response.data.data) {
          recipeData = response.data.data;
        } else if (response.data && response.data.success !== false) {
          recipeData = response.data;
        }

        if (!recipeData) {
          toast.error("Impossible de charger les détails de la recette");
          router.push('/recettes');
          return;
        }

        // Vérifier si l'utilisateur est l'auteur de la recette
        if (recipeData.auteur && recipeData.auteur._id !== user?.id && user?.role !== 'admin') {
          toast.error("Vous n'êtes pas autorisé à modifier cette recette");
          router.push(`/recettes/${recipeId}`);
          return;
        }

        // Mettre à jour le formulaire avec les données existantes
        setFormData({
          titre: recipeData.titre || "",
          description: recipeData.description || "",
          ingredients: Array.isArray(recipeData.ingredients) && recipeData.ingredients.length > 0 
            ? recipeData.ingredients 
            : [{ nom: "", quantite: "", unite: "" }],
          etapes: Array.isArray(recipeData.etapes) && recipeData.etapes.length > 0
            ? recipeData.etapes
            : [""],
          tempsPreparation: recipeData.tempsPreparation?.toString() || "",
          tempsCuisson: recipeData.tempsCuisson?.toString() || "",
          difficulte: recipeData.difficulte || "",
          typeCuisine: recipeData.typeCuisine || "",
          regimeAlimentaire: Array.isArray(recipeData.regimeAlimentaire)
            ? recipeData.regimeAlimentaire
            : [],
          calories: recipeData.calories?.toString() || "",
          photo: null // L'utilisateur peut choisir de télécharger une nouvelle photo
        });

        // Stocker le nom de la photo originale pour référence
        if (recipeData.photo) {
          setOriginalPhoto(recipeData.photo);
          // Définir l'URL de prévisualisation pour la photo existante
          setPreviewImage(`http://localhost:5000/uploads/recettes/${recipeData.photo}`);
        }

      } catch (error) {
        console.error("Erreur lors du chargement de la recette:", error);
        toast.error("Erreur lors du chargement de la recette");
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchRecipeData();
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      toast.error('Vous devez être connecté pour modifier une recette');
      router.push('/connexion?redirect=' + encodeURIComponent(`/recettes/${recipeId}/modifier`));
    }
  }, [recipeId, isLoggedIn, router, user]);

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
      // Vérifications de base pour le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      
      // Limite de taille (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 2 Mo');
        return;
      }
      
      setFormData({
        ...formData,
        photo: file
      });
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Valider les champs obligatoires
    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    
    // Valider les ingrédients
    const validIngredients = formData.ingredients.filter(ing => ing.nom.trim() !== "");
    if (validIngredients.length === 0) {
      newErrors.ingredients = "Au moins un ingrédient est requis";
    }
    
    // Valider les étapes
    const validEtapes = formData.etapes.filter(etape => etape.trim() !== "");
    if (validEtapes.length === 0) {
      newErrors.etapes = "Au moins une étape est requise";
    }
    
    // Valider le temps de préparation
    if (!formData.tempsPreparation.trim()) {
      newErrors.tempsPreparation = "Le temps de préparation est requis";
    } else if (isNaN(formData.tempsPreparation) || parseInt(formData.tempsPreparation) <= 0) {
      newErrors.tempsPreparation = "Le temps doit être un nombre positif";
    }
    
    // Valider la difficulté
    if (!formData.difficulte) {
      newErrors.difficulte = "Le niveau de difficulté est requis";
    }
    
    // Valider le type de cuisine
    if (!formData.typeCuisine) {
      newErrors.typeCuisine = "Le type de cuisine est requis";
    }
    
    // Calories (optionnel mais doit être positif si spécifié)
    if (formData.calories && (isNaN(formData.calories) || parseInt(formData.calories) < 0)) {
      newErrors.calories = "Les calories doivent être un nombre positif";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour la mise à jour
      const recetteData = {
        titre: formData.titre,
        description: formData.description,
        ingredients: formData.ingredients.filter(ing => ing.nom.trim() !== ""),
        etapes: formData.etapes.filter(etape => etape.trim() !== ""),
        tempsPreparation: parseInt(formData.tempsPreparation),
        tempsCuisson: formData.tempsCuisson ? parseInt(formData.tempsCuisson) : 0,
        difficulte: formData.difficulte,
        typeCuisine: formData.typeCuisine,
        regimeAlimentaire: formData.regimeAlimentaire,
        calories: formData.calories ? parseInt(formData.calories) : undefined
      };
      
      // Mettre à jour la recette
      const updatedRecipe = await recettesApi.update(recipeId, recetteData);
      
      // Si une nouvelle photo est fournie, la télécharger
      if (formData.photo) {
        try {
          const formDataObj = new FormData();
          formDataObj.append('file', formData.photo);
          await recettesApi.uploadPhoto(recipeId, formDataObj);
          toast.success('Photo de la recette mise à jour avec succès');
        } catch (photoError) {
          console.error('Erreur lors de la mise à jour de la photo:', photoError);
          toast.error("La recette a été mise à jour mais l'upload de la photo a échoué");
        }
      }
      
      toast.success('Recette mise à jour avec succès');
      
      // Rediriger vers la page de détail de la recette
      router.push(`/recettes/${recipeId}`);
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la recette:', error);
      toast.error(error.response?.data?.message || "Une erreur est survenue lors de la mise à jour de la recette");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Afficher un état de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-lg">Chargement de la recette...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Modifier la recette</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        {/* Informations de base */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-3 border ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700`}
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="tempsPreparation" className="block text-sm font-medium mb-1">Temps de préparation (min) *</label>
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
              <label htmlFor="tempsCuisson" className="block text-sm font-medium mb-1">Temps de cuisson (min)</label>
              <input
                type="number"
                id="tempsCuisson"
                name="tempsCuisson"
                value={formData.tempsCuisson}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="difficulte" className="block text-sm font-medium mb-1">Difficulté *</label>
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
          
          <div className="mt-4">
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
              <option value="">Sélectionner un type</option>
              {typesOfCuisine.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.typeCuisine && (
              <p className="mt-1 text-sm text-red-500">{errors.typeCuisine}</p>
            )}
          </div>
        </div>
        
        {/* Photo de la recette */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Photo de la recette</h2>
          
          <div className="flex items-center space-x-6">
            {previewImage && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden">
                {/* eslint-disable @next/next/no-img-element */}
                <img 
                  src={previewImage} 
                  alt="Aperçu de l'image" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="photo" className="flex items-center px-4 py-3 bg-amber-50 dark:bg-gray-700 text-amber-600 dark:text-amber-400 rounded-md cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors">
                <FiUpload className="mr-2" />
                {originalPhoto ? 'Changer la photo' : 'Ajouter une photo'}
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Formats acceptés : JPG, PNG, GIF. Taille max : 2 Mo
              </p>
              {originalPhoto && !formData.photo && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Photo actuelle : {originalPhoto}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Ingrédients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ingrédients *</h2>
          
          {errors.ingredients && (
            <p className="mb-2 text-sm text-red-500">{errors.ingredients}</p>
          )}
          
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex mb-3 items-center">
              <div className="flex-1 mr-2">
                <input
                  type="text"
                  placeholder="Nom de l'ingrédient"
                  value={ingredient.nom}
                  onChange={(e) => handleIngredientChange(index, 'nom', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              <div className="w-20 mr-2">
                <input
                  type="text"
                  placeholder="Qnt"
                  value={ingredient.quantite}
                  onChange={(e) => handleIngredientChange(index, 'quantite', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                />
              </div>
              <div className="w-24 mr-2">
                <input
                  type="text"
                  placeholder="Unité"
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
          
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 flex items-center text-sm text-amber-600 hover:text-amber-700"
          >
            <FiPlus className="mr-1" /> Ajouter un ingrédient
          </button>
        </div>
        
        {/* Étapes de préparation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Étapes de préparation *</h2>
          
          {errors.etapes && (
            <p className="mb-2 text-sm text-red-500">{errors.etapes}</p>
          )}
          
          {formData.etapes.map((etape, index) => (
            <div key={index} className="flex mb-3 items-start">
              <div className="flex-shrink-0 pt-3 mr-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={etape}
                  onChange={(e) => handleEtapeChange(index, e.target.value)}
                  placeholder={`Étape ${index + 1}`}
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
          
          <button
            type="button"
            onClick={addEtape}
            className="mt-2 flex items-center text-sm text-amber-600 hover:text-amber-700"
          >
            <FiPlus className="mr-1" /> Ajouter une étape
          </button>
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
            En modifiant votre recette, toutes les informations précédentes seront écrasées par ces nouvelles valeurs.
            Les commentaires et notations existantes resteront inchangés.
          </p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/recettes/${recipeId}`)}
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
                Mise à jour en cours...
              </>
            ) : (
              'Mettre à jour la recette'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
