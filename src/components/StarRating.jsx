"use client";

import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StarRating = ({ rating = 0, interactive = false, onRatingChange = () => {} }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (value) => {
    if (interactive) {
      onRatingChange(value);
    }
  };

  const renderStar = (value) => {
    // Pour le mode interactif, utiliser hoverRating pour le survol
    const filled = interactive 
      ? value <= (hoverRating || rating)
      : value <= rating;
    
    return (
      <motion.span
        key={value}
        whileHover={{ scale: interactive ? 1.2 : 1 }}
        className={`cursor-${interactive ? 'pointer' : 'default'}`}
        onMouseEnter={interactive ? () => setHoverRating(value) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        onClick={interactive ? () => handleStarClick(value) : undefined}
      >
        <FiStar 
          className={`${
            filled 
              ? 'text-amber-500 fill-amber-500' 
              : 'text-gray-300'
          } inline`} 
          size={interactive ? 24 : 16}
        />
      </motion.span>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {stars.map(renderStar)}
      {!interactive && rating > 0 && (
        <span className="ml-1 text-xs text-gray-500">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
