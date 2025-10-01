/**
 * Utilitaires pour la gestion des URLs d'images
 */

// URL de base pour les uploads
const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000/uploads';

/**
 * Construit une URL complète pour une image de recette
 * @param {string} photo - Nom ou chemin de la photo
 * @returns {string|null} URL complète de l'image ou null si pas d'image
 */
export const getRecipeImageUrl = (photo) => {
  if (!photo) {
    return null; // Aucune image par défaut, retourne null
  }

  // Si c'est déjà une URL complète, la retourner telle quelle
  if (typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('/'))) {
    return photo;
  }

  // Construire l'URL complète
  return `${UPLOADS_URL}/recettes/${photo}`;
};

/**
 * Construit une URL complète pour une photo de profil utilisateur
 * @param {string} photo - Nom ou chemin de la photo
 * @param {string} defaultImage - Image par défaut si photo est vide
 * @returns {string} URL complète de l'image
 */
export const getUserImageUrl = (photo, defaultImage = '/images/default-user.svg') => {
  if (!photo) {
    return defaultImage;
  }

  // Si c'est déjà une URL complète, la retourner telle quelle
  if (typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('/'))) {
    return photo;
  }

  // Construire l'URL complète
  return `${UPLOADS_URL}/users/${photo}`;
};

/**
 * Vérifie si une URL est valide pour une image
 * @param {string} url - URL à vérifier
 * @returns {boolean} - true si l'URL est valide
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Vérifier si c'est un nom de fichier simple (comme "default.jpg")
  if (/^[\w-]+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url)) {
    // Pour Next.js Image, nous avons besoin d'une URL complète, pas juste un nom de fichier
    return false;
  }
  
  try {
    // Vérifier si l'URL est relative (commence par '/')
    if (url.startsWith('/')) {
      return true;
    }
    
    // Si l'URL contient "localhost" ou commence par "http", on vérifie que c'est une URL valide
    if ((url.includes('localhost') || url.startsWith('http'))) {
      // Vérifions que l'URL est valide en la construisant
      new URL(url);
      return true;
    }
    
    // Pour les autres cas, c'est probablement une URL invalide pour Next.js Image
    return false;
  } catch (e) {
    return false;
  }
};

export default {
  getRecipeImageUrl,
  getUserImageUrl,
  isValidImageUrl
};
