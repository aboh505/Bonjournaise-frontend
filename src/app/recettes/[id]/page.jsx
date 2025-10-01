"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiClock, FiHeart, FiUser, FiEdit, FiMessageCircle, FiChevronRight, FiChevronDown, FiChevronUp, FiEye, FiEyeOff } from 'react-icons/fi';
import StarRating from '../../../components/StarRating';
import SafeImage from '../../../components/SafeImage';
import { recettesApi, commentairesApi } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { getRecipeImageUrl } from '../../../utils/imageUtils';

// Composant pour afficher un commentaire
const CommentItem = ({ comment, isCurrentUser, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.contenu || '');
  
  const handleSaveEdit = () => {
    if (editText.trim() === '') return;
    if (comment._id) {
      onEdit(comment._id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
            {comment.utilisateur ? `${comment.utilisateur.prenom?.charAt(0) || ''}${comment.utilisateur.nom?.charAt(0) || '?'}` : '?'}
          </div>
          <div>
            <p className="font-medium">{comment.utilisateur ? `${comment.utilisateur.prenom || ''} ${comment.utilisateur.nom || ''}`.trim() || 'Utilisateur inconnu' : 'Utilisateur inconnu'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {comment.dateCreation ? new Date(comment.dateCreation).toLocaleDateString() : 'Date inconnue'}
            </p>
          </div>
        </div>
        {isCurrentUser && (
          <div className="space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveEdit} 
                  className="text-xs text-amber-500 hover:text-amber-600"
                >
                  Enregistrer
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.contenu);
                  }} 
                  className="text-xs text-gray-500 hover:text-gray-600"
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => onDelete(comment._id)} 
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Supprimer
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm"
            rows="3"
          />
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{comment.contenu || 'Aucun contenu'}</p>
        )}
      </div>
    </div>
  );
};

export default function RecipeDetail() {
  // Extraire l'ID de la recette de l'URL
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  
  // Formater correctement l'ID pour les requêtes
  const id = params?.id;
  
  console.log('ID extrait des paramètres URL:', id);
  console.log('Type de l\'ID:', typeof id);
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(true);

  // Charger les détails de la recette et les commentaires
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      
      try {
        // Vérifier que l'ID est valide (au moins pour éviter les erreurs évidentes)
        if (!id || id === 'undefined' || id === 'null' || id === '[id]') {
          throw new Error('ID de recette non valide');
        }
        
        // Nécessaire pour MongoDB: s'assurer que l'ID est une chaîne valide
        // MongoDB ObjectIds sont généralement des chaînes hexadécimales de 24 caractères
        const isValidMongoId = id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
        console.log('ID valide pour MongoDB?', isValidMongoId);
        
        // Utiliser une ID test connue si nous sommes en développement et l'URL n'est pas valide
        // Cela nous permettra de voir l'interface même si les liens ne sont pas bons
        const testId = "68d3c179fe79ecbdac4d751e"; // ID d'une recette existante dans la base de données
        
        let recipeData = null;
        let commentsData = [];
        
        // Choisir quel ID utiliser
        const recipeId = isValidMongoId ? id : testId;
        console.log(`Utilisation de l'ID pour la requête: ${recipeId}`);
        
        try {
          // Utiliser l'ID valide pour MongoDB
          const recipeResponse = await recettesApi.getById(recipeId);
          
          // Vérifier si les données sont dans data.data (format API) ou directement dans data
          if (recipeResponse.data) {
            // Vérifions si les données sont dans recipeResponse.data.data
            if (recipeResponse.data.data) {
              recipeData = recipeResponse.data.data;
            } else if (recipeResponse.data.success !== false) {
              // Sinon utiliser directement recipeResponse.data
              recipeData = recipeResponse.data;
            }
          }
          
          // Récupérer les commentaires
          const commentsResponse = await commentairesApi.getByRecette(recipeId);
          commentsData = commentsResponse.data.data || [];
          
          // Mettre à jour l'URL si nécessaire
          if (!isValidMongoId) {
            window.history.replaceState(null, '', `/recettes/${recipeId}`);
            console.log('URL mise à jour avec un ID valide:', recipeId);
          }
        } catch (apiError) {
          console.error(`Erreur lors de la récupération des données (${recipeId}):`, apiError);
          // On continue vers le fallback
        }
        
        if (recipeData) {
          // Des données ont été récupérées avec succès
          setRecipe(recipeData);
          setComments(commentsData);
          
          if (isLoggedIn) {
            setIsFavorite(recipeData.isFavorite || false);
            setUserRating(recipeData.userRating || 0);
          }
        } else {
      // Aucune donnée récupérée, afficher un message d'erreur
      setError('Impossible de charger les détails de cette recette.');
      setRecipe(null);
      setComments([]);
    }
        
      } catch (err) {
        console.error('Erreur lors du chargement de la recette:', err);
        setError('Une erreur est survenue lors du chargement de la recette.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  // Gérer l'ajout aux favoris
  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.error('Veuillez vous connecter pour ajouter des recettes à vos favoris');
      return;
    }

    try {
      // Appel à l'API
      await recettesApi.toggleFavorite(id);
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (error) {
      toast.error('Une erreur est survenue');
      console.error('Erreur lors de la modification des favoris', error);
    }
  };

  // Gérer la notation
  const handleRating = async (rating) => {
    if (!isLoggedIn) {
      toast.error('Veuillez vous connecter pour noter cette recette');
      return;
    }

    try {
      // Appel à l'API
      const response = await recettesApi.rate(id, rating);
      
      setUserRating(rating);
      
      // Mettre à jour la note moyenne avec la réponse de l'API
      if (response && response.data) {
        setRecipe(prev => ({
          ...prev,
          noteMoyenne: response.data.noteMoyenne || prev.noteMoyenne,
          nombreAvis: response.data.nombreAvis || prev.nombreAvis
        }));
      } else {
        // Fallback si l'API ne renvoie pas ces informations
        setRecipe(prev => ({
          ...prev,
          noteMoyenne: ((prev.noteMoyenne * prev.nombreAvis) + rating) / (prev.nombreAvis + (userRating === 0 ? 1 : 0)),
          nombreAvis: userRating === 0 ? prev.nombreAvis + 1 : prev.nombreAvis
        }));
      }
      
      toast.success('Merci pour votre évaluation !');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la notation');
      console.error('Erreur lors de la notation', error);
    }
  };

  // Gérer l'ajout d'un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Veuillez vous connecter pour ajouter un commentaire');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      setSubmittingComment(true);
      
      // Appel à l'API pour créer un nouveau commentaire
      const response = await commentairesApi.create(id, { contenu: newComment });
      
      if (response && response.data) {
        // Si l'API répond correctement, on utilise le commentaire renvoyé
        setComments([response.data, ...comments]);
      } else {
        // Fallback si l'API ne répond pas correctement
        const newCommentObj = {
          _id: Date.now().toString(),
          contenu: newComment,
          dateCreation: new Date().toISOString(),
          utilisateur: {
            _id: user?.id,
            nom: user?.nom,
            prenom: user?.prenom
          }
        };
        
        setComments([newCommentObj, ...comments]);
      }
      
      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'ajout du commentaire');
      console.error('Erreur lors de l\'ajout du commentaire', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Gérer la modification d'un commentaire
  const handleEditComment = async (commentId, newContent) => {
    try {
      // Appel à l'API pour modifier un commentaire
      await commentairesApi.update(commentId, { contenu: newContent });
      
      setComments(comments.map(comment => 
        comment._id === commentId ? { ...comment, contenu: newContent } : comment
      ));
      
      toast.success('Commentaire modifié avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la modification du commentaire');
      console.error('Erreur lors de la modification du commentaire', error);
    }
  };

  // Gérer la suppression d'un commentaire
  const handleDeleteComment = async (commentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

    try {
      // Appel à l'API pour supprimer un commentaire
      await commentairesApi.delete(commentId);
      
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Commentaire supprimé avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression du commentaire');
      console.error('Erreur lors de la suppression du commentaire', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 flex justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            Retourner aux recettes
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      {/* Bouton retour */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-amber-500 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Retour aux recettes
        </button>
      </div>
      
      {/* En-tête de la recette */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">{recipe.titre}</h1>
          
          {/* Boutons d'action */}
          <div className="flex space-x-3">
            {/* Bouton Modifier (visible uniquement pour l'auteur) */}
            {isLoggedIn && user?.id === recipe.auteur?._id && (
              <Link 
                href={`/recettes/${recipe._id}/modifier`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="mr-1" /> Modifier
              </Link>
            )}
            
            {/* Bouton Favoris */}
            <button 
              onClick={handleToggleFavorite}
              disabled={!isLoggedIn || loading}
              className={`flex items-center px-4 py-2 rounded-lg ${(
                isFavorite 
                  ? 'bg-amber-500 text-white' 
                  : 'border border-amber-500 text-amber-500'
              )} transition-colors`}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
              <span className="ml-1">{isFavorite ? 'Sauvegardé' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <FiClock className="mr-1" /> {recipe.tempsPreparation + (recipe.tempsCuisson || 0)} min
          </div>
          <div className="flex items-center">
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
              {recipe.difficulte}
            </span>
          </div>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              {recipe.typeCuisine}
            </span>
          </div>
          {Array.isArray(recipe.regimeAlimentaire) ? recipe.regimeAlimentaire.map(regime => (
            <div key={regime} className="flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                {regime}
              </span>
            </div>
          )) : null}
          <div className="flex items-center">
            <FiUser className="mr-1" /> Par {recipe.auteur ? `${recipe.auteur.prenom || ''} ${recipe.auteur.nom || ''}`.trim() || 'Utilisateur anonyme' : 'Utilisateur anonyme'}
          </div>
          <div className="flex items-center">
            <span>{recipe.dateCreation ? new Date(recipe.dateCreation).toLocaleDateString() : 'Date inconnue'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarRating rating={recipe.noteMoyenne} />
            <span className="ml-2 text-gray-500 dark:text-gray-400">({recipe.nombreAvis} avis)</span>
          </div>
        </div>
      </div>
      
      {/* Image et description */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-3 relative h-[400px] rounded-xl overflow-hidden">
          <div className="w-full h-full">
            {/* Si nous avons une URL d'image valide de l'API, utiliser SafeImage */}
            {getRecipeImageUrl(recipe.photo) ? (
              <SafeImage 
                src={getRecipeImageUrl(recipe.photo)}
                alt={recipe.titre} 
                fill
                className="object-cover" 
                priority
              />
            ) : recipe.image && recipe.image.startsWith('/') ? (
              /* Si nous avons une image locale statique */
              <Image 
                src={recipe.image}
                alt={recipe.titre} 
                fill
                className="object-cover" 
                priority
              />
            ) : (
              /* Si nous n'avons pas d'image, afficher un placeholder */
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="text-gray-400 text-lg font-medium">Aucune image disponible pour cette recette</span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl h-full">
            <h2 className="text-xl font-semibold mb-4">À propos de cette recette</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{recipe.description}</p>
            {recipe.calories && (
              <div className="flex items-center justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-gray-600 dark:text-gray-400">Calories par portion</span>
                <span className="font-medium">{recipe.calories} kcal</span>
              </div>
            )}
            {isLoggedIn && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm mb-2 font-medium">Notez cette recette:</p>
                <StarRating 
                  rating={userRating} 
                  interactive={true} 
                  onRatingChange={handleRating} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Ingrédients et étapes de préparation */}
      {/* Détails de la recette (affichage complet) */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Détails complets de la recette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>ID:</strong> {recipe._id}</p>
            <p><strong>Titre:</strong> {recipe.titre}</p>
            <p><strong>Auteur:</strong> {recipe.auteur ? `${recipe.auteur.prenom || ''} ${recipe.auteur.nom || ''}`.trim() : 'Non spécifié'}</p>
            <p><strong>Date de création:</strong> {recipe.dateCreation ? new Date(recipe.dateCreation).toLocaleDateString() : 'Non spécifiée'}</p>
            <p><strong>Difficulté:</strong> {recipe.difficulte || 'Non spécifiée'}</p>
            <p><strong>Type de cuisine:</strong> {recipe.typeCuisine || 'Non spécifié'}</p>
            <p><strong>Temps de préparation:</strong> {recipe.tempsPreparation ? `${recipe.tempsPreparation} min` : 'Non spécifié'}</p>
            <p><strong>Temps de cuisson:</strong> {recipe.tempsCuisson ? `${recipe.tempsCuisson} min` : 'Non spécifié'}</p>
          </div>
          <div>
            <p><strong>Calories:</strong> {recipe.calories ? `${recipe.calories} kcal` : 'Non spécifié'}</p>
            <p><strong>Note moyenne:</strong> {recipe.noteMoyenne ? recipe.noteMoyenne : 'Aucune'}</p>
            <p><strong>Nombre d'avis:</strong> {recipe.nombreAvis || 0}</p>
            <p><strong>Régimes alimentaires:</strong> {Array.isArray(recipe.regimeAlimentaire) && recipe.regimeAlimentaire.length > 0 ? recipe.regimeAlimentaire.join(', ') : 'Aucun'}</p>
            <p><strong>Nom de fichier photo:</strong> {recipe.photo || 'Aucune photo'}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              Ingrédients
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm font-normal">
                ({Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0})
              </span>
            </h2>
            <ul className="space-y-3">
              {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, index) => (
                <li 
                  key={index} 
                  className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-3"></span>
                  <span className="flex-1 text-gray-700 dark:text-gray-300">
                    {ingredient.nom}
                  </span>
                  {ingredient.quantite && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {ingredient.quantite} {ingredient.unite}
                    </span>
                  )}
                </li>
              )) : <li className="text-gray-500 dark:text-gray-400 py-2">Aucun ingrédient disponible</li>}
            </ul>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-6">
              {Array.isArray(recipe.etapes) ? recipe.etapes.map((etape, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex"
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-gray-700 dark:text-gray-300">{etape}</p>
                  </div>
                </motion.li>
              )) : <li className="text-gray-500 dark:text-gray-400 py-3">Aucune instruction disponible</li>}
            </ol>
          </div>
        </div>
      </div>
      
      {/* Commentaires */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FiMessageCircle className="mr-2" />
            Commentaires
            <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm font-normal">
              ({comments.length})
            </span>
          </h2>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={showComments ? 'Masquer les commentaires' : 'Afficher les commentaires'}
          >
            {showComments ? 
              <FiEyeOff className="text-gray-500 dark:text-gray-400" size={20} /> : 
              <FiEye className="text-amber-500" size={20} />}
          </button>
        </div>
        
        {showComments && isLoggedIn ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="mb-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez votre expérience avec cette recette..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                rows="3"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment}
                className={`bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors ${
                  submittingComment ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submittingComment ? 'Envoi en cours...' : 'Publier un commentaire'}
              </button>
            </div>
          </form>
        ) : showComments ? (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Connectez-vous pour laisser un commentaire
            </p>
            <Link href="/connexion" className="text-amber-500 hover:text-amber-600 font-medium">
              Se connecter <FiChevronRight className="inline ml-1" />
            </Link>
          </div>
        ) : null}
        
        {showComments && (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {comments.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {comments.map((comment) => 
                  comment && comment._id ? (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      isCurrentUser={isLoggedIn && user?.id && comment.utilisateur && user.id === comment.utilisateur._id}
                      onDelete={handleDeleteComment}
                      onEdit={handleEditComment}
                    />
                  ) : null
                )}
              </motion.div>
            ) : (
              <p className="py-4 text-gray-500 dark:text-gray-400 text-center">
                Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
