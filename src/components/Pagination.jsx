"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, baseUrl = '' }) => {
  const searchParams = useSearchParams();
  
  // Fonction pour générer l'URL avec les paramètres actuels mais en changeant la page
  const getPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    return `${baseUrl}?${params.toString()}`;
  };
  
  // Détermine les pages à afficher (toujours afficher la première, la dernière et quelques autour de la page actuelle)
  const getPageNumbers = () => {
    const pages = [];
    
    // Toujours ajouter la première page
    pages.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajouter les points de suspension au début si nécessaire
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Ajouter les pages autour de la page courante
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Ajouter les points de suspension à la fin si nécessaire
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Ajouter la dernière page si elle n'est pas déjà ajoutée
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Si une seule page, ne pas afficher la pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center my-8" aria-label="Pagination">
      <ul className="flex space-x-2 items-center">
        {/* Bouton précédent */}
        <li>
          <Link
            href={currentPage > 1 ? getPageUrl(currentPage - 1) : '#'}
            className={`${
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'hover:text-amber-500'
            } flex items-center justify-center p-2 rounded-md transition-colors`}
            aria-disabled={currentPage === 1}
          >
            <FiChevronLeft className="h-5 w-5" />
            <span className="sr-only">Page précédente</span>
          </Link>
        </li>
        
        {/* Pages numérotées */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Link
                href={getPageUrl(page)}
                className={`px-3 py-1 rounded-md ${
                  page === currentPage
                    ? 'bg-amber-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        
        {/* Bouton suivant */}
        <li>
          <Link
            href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
            className={`${
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'hover:text-amber-500'
            } flex items-center justify-center p-2 rounded-md transition-colors`}
            aria-disabled={currentPage === totalPages}
          >
            <span className="sr-only">Page suivante</span>
            <FiChevronRight className="h-5 w-5" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
