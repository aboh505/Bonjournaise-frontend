"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Fonction pour vérifier si une URL est valide
const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Vérifier si l'URL est relative (commence par '/')
    if (url.startsWith('/')) return true;
    
    // Vérifier si c'est une URL absolue valide
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Ce composant gère les images avec un fallback en cas d'erreur de chargement ou d'URL invalide
const SafeImage = ({ src, alt, fill = false, className = "", fallbackSrc = "/images/default-placeholder.jpg", ...props }) => {
  const [error, setError] = useState(false);
  const [validatedSrc, setValidatedSrc] = useState(fallbackSrc);
  
  // Valider l'URL de l'image à chaque changement de source
  useEffect(() => {
    if (isValidImageUrl(src)) {
      setValidatedSrc(src);
      setError(false);
    } else {
      setValidatedSrc(fallbackSrc);
      setError(true);
    }
  }, [src, fallbackSrc]);
  
  return (
    <Image
      src={error ? fallbackSrc : validatedSrc}
      alt={alt || 'Image'}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default SafeImage;
