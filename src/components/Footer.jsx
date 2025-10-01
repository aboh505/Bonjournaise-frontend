import React from 'react';
import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
          <h3 className="text-2xl font-serif italic font-bold text-white tracking-wide">
          𝓛𝓪 <span className="text-amber-200">𝓑𝓸𝓷𝓳𝓸𝓾𝓻𝓷𝓪𝓲𝓼𝓮 </span>
            </h3>
            <p className="mb-4">
              Découvrez et partagez les meilleures recettes de cuisine camerounaise et africaine.
            </p>
           
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Catégories populaires</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/recettes?categorie=camerounaise">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Cuisine camerounaise
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recettes?categorie=africaine">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Cuisine africaine
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recettes?categorie=vegetarien">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Végétarien
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recettes?difficulte=facile">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Recettes faciles
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/recettes">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Toutes les recettes
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recettes?tri=populaires">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Recettes populaires
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recettes?tri=recentes">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Nouvelles recettes
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/chefs">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Chefs populaires
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Aide & Contact</h4>
            <ul className="space-y-2">
              <li>
               
              </li>
             
              <li>
                <Link href="/confidentialite">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Politique de confidentialité
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/conditions">
                  <span className="text-gray-300 hover:text-amber-500 transition-colors">
                    Conditions d'utilisation
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} LaBonjournaise - Tous droits réservés</p>
          <div className="mt-4 md:mt-0">
            Développé avec ❤️ pour la cuisine camerounaise
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
