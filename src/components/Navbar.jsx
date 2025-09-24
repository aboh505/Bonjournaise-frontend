"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiHeart, FiSearch, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const { isLoggedIn, user, logout } = useAuth();

  // Effet pour gérer le scroll et changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Vérifier si le lien est actif
  const isActive = (path) => pathname === path;

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 py-3 bg-amber-700 shadow-md text-white`;

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Recettes', path: '/recettes' },
   
  ];

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            {/* Texte principal */}
            <span className="text-3xl font-serif italic font-bold text-white">🍲
              La<span className="text-amber-200">Bonjournaise</span>
            </span>
          </Link>


          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.filter(link => !(link.authRequired && !isLoggedIn)).map((link) => (
              <Link href={link.path} key={link.name}>
                <span className={`relative font-medium ${isActive(link.path) ? 'text-white font-bold' : 'text-amber-100'}`}>
                  {link.name}
                </span>
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link href="/profil">
                  <span className="flex items-center text-amber-100">
                    <FiUser className="mr-1" /> {user?.prenom || 'Profil'}
                  </span>
                </Link>
                <Link href="/profil?tab=favoris">
                  <span className="flex items-center text-amber-100">
                    <FiHeart className="mr-1" /> Favoris
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-amber-100 bg-amber-800 px-3 py-1 rounded-md"
                >
                  <FiLogOut className="mr-1" /> Déconnexion
                </button>
              </>
            ) : (
              <Link href="/connexion">
                <span className="flex items-center text-amber-100 bg-amber-800 px-3 py-1 rounded-md">
                  <FiLogIn className="mr-1" /> Connexion
                </span>
              </Link>
            )}

          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden pt-4 pb-2"
          >

            <div className="flex flex-col space-y-4">
              {navLinks.filter(link => !(link.authRequired && !isLoggedIn)).map((link) => (
                <Link href={link.path} key={link.name}>
                  <span
                    className={`block ${isActive(link.path)
                      ? 'font-semibold text-amber-600'
                      : 'text-gray-700 dark:text-gray-300'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </span>
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link href="/profil">
                    <span
                      className="flex items-center text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> {user?.prenom || 'Profil'}
                    </span>
                  </Link>
                  <Link href="/profil?tab=favoris">
                    <span
                      className="flex items-center text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiHeart className="mr-2" /> Favoris
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-gray-700 dark:text-gray-300"
                  >
                    <FiLogOut className="mr-2" /> Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/connexion">
                  <span
                    className="flex items-center text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiLogIn className="mr-2" /> Connexion
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
