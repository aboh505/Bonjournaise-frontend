"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { isValidImageUrl } from '../utils/imageUtils';

// La fonction isValidImageUrl est maintenant importée depuis imageUtils

// Ce composant gère les images avec une gestion des erreurs
const SafeImage = ({ src, alt, fill = false, className = "", ...props }) => {
  const [error, setError] = useState(false);
  const [validatedSrc, setValidatedSrc] = useState(null);
  
  // Valider l'URL de l'image à chaque changement de source
  useEffect(() => {
    // Réinitialiser les états
    setError(false);
    
    // Vérifier si la source est valide
    if (!src) {
      setError(true);
      return;
    }

    // Vérifier si c'est une URL valide pour Next.js Image
    try {
      if (isValidImageUrl(src)) {
        setValidatedSrc(src);
      } else {
        // Si l'URL n'est pas valide pour Next.js, on utilise une image par défaut
        setError(true);
      }
    } catch (e) {
      // En cas d'erreur, marquer comme erreur
      setError(true);
    }
  }, [src]);
  
  // Si on a une erreur, on ne rend rien
  if (error) {
    return null;
  }
  
  // Protection supplémentaire pour s'assurer que l'URL est bien valide
  try {
    // Pour les URLs absolues, vérifions qu'elles sont bien construites
    if (validatedSrc.startsWith('http')) {
      new URL(validatedSrc);
    }
    
    // Sinon, on rend l'image
    return (
      <Image
        src={validatedSrc}
        alt={alt || 'Image'}
        fill={fill}
        className={className}
        onError={() => {
          setError(true);
        }}
        {...props}
      />
    );
  } catch (e) {
    // Si l'URL est invalide, ne rien afficher
    return null;
  }
};

export default SafeImage;
