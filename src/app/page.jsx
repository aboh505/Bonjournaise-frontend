import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import RecipeCard from '../components/RecipeCard'
import SafeImage from '../components/SafeImage'

// Données statiques pour les recettes populaires camerounaises (à remplacer par des appels API)  
const popularRecipes = [
  {
    id: 1,
    titre: "Ndolé",
    description: "Le Ndolé est un plat traditionnel camerounais à base de feuilles amères, de pâte d'arachide et de viande ou de poisson.",
    image: "/images/a2.jpg",
    tempsPreparation: 45,
    difficulte: "Moyen",
    noteMoyenne: 4.8,
    auteur: { nom: "Chef Pierre" }
  },
  {
    id: 2,
    titre: "Poulet DG",
    description: "Le Poulet DG (Directeur Général) est un plat prestigieux camerounais composé de poulet, de plantains mûrs et de légumes.",
    image: "/images/a3.jpg",
    tempsPreparation: 60,
    difficulte: "Moyen",
    noteMoyenne: 4.9,
    auteur: { nom: "Chef Tatiana" }
  },
  {
    id: 3,
    titre: "Eru",
    description: "L'Eru est un plat à base de feuilles de Gnetum africanum préparé avec de l'huile de palme, du poisson séché et de la viande.",
    image: "/images/a4.jpg",
    tempsPreparation: 40,
    difficulte: "Moyen",
    noteMoyenne: 4.7,
    auteur: { nom: "Chef Samuel" }
  },
  // {
  //   id: 4,
  //   titre: "Koki",
  //   description: "Le Koki est un gâteau de haricots à l'huile de palme, enveloppé dans des feuilles de bananier et cuit à la vapeur.",
  //   image: "/images/koki.jpg",
  //   tempsPreparation: 90,
  //   difficulte: "Difficile",
  //   noteMoyenne: 4.6,
  //   auteur: { nom: "Chef Marie" }
  // },
  // {
  //   id: 5,
  //   titre: "Mbongo Tchobi",
  //   description: "Le Mbongo Tchobi est un ragoût noir épicé préparé avec des épices grillées, du poisson ou de la viande.",
  //   image: "/images/mbongo-tchobi.jpg",
  //   tempsPreparation: 60,
  //   difficulte: "Difficile",
  //   noteMoyenne: 4.8,
  //   auteur: { nom: "Chef Jean" }
  // },
  // {
  //   id: 6,
  //   titre: "Sanga",
  //   description: "Le Sanga est un plat à base de maïs râpé et de feuilles vertes, préparé avec de l'huile de palme et de la viande.",
  //   image: "/images/sanga.jpg",
  //   tempsPreparation: 50,
  //   difficulte: "Moyen",
  //   noteMoyenne: 4.5,
  //   auteur: { nom: "Chef Claude" }
  // }
];

const categories = [
  { id: 1, nom: "Camerounaise", image: "/images/a7.jpg" },
  { id: 2, nom: "Végétarien", image: "/images/a5.jpg" },
  { id: 3, nom: "Facile", image: "/images/a6.jpg" },
  { id: 4, nom: "Rapide (< 30 min)", image: "/images/a7.jpg" }
];

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src="/images/a11.jpg" 
            // fallbackSrc="/images/a1.jpg"
            alt="Cuisine camerounaise" 
            fill 
            className="object-cover brightness-50" 
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">LaBonjournaise</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Découvrez et partagez les meilleures recettes de cuisine camerounaise
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/recettes" className="bg-amber-600 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors">
              Explorer les recettes
            </Link>
            <Link href="/ajouter-recette" className="bg-white hover:bg-gray-100 text-amber-600 px-6 py-3 rounded-lg transition-colors">
              Partager une recette
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explorer par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/recettes?categorie=${category.nom.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg h-40 md:h-52"
              >
                <Image 
                  src={category.image} 
                  alt={category.nom} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.nom}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recettes populaires */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Recettes populaires du Cameroun</h2>
            <Link href="/recettes" className="text-amber-500 hover:text-amber-600 flex items-center gap-1">
              Voir toutes <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} isStatic={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Section témoignages */}
      <section className="py-12 bg-amber-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Ce que disent nos utilisateurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl mr-4">
                  JD
                </div>
                <div>
                  <h3 className="font-semibold">Jean Dupont</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Chef amateur</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-200">
                "Grâce à SaveursDuKmer, j'ai pu retrouver les saveurs de mon enfance au Cameroun et les partager avec ma famille ici en France."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl mr-4">
                  SM
                </div>
                <div>
                  <h3 className="font-semibold">Sophie Martin</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Passionnée de cuisine</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-200">
                "J'ai découvert la richesse de la cuisine camerounaise grâce à cette plateforme. Les recettes sont détaillées et faciles à suivre."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 font-bold text-xl mr-4">
                  PK
                </div>
                <div>
                  <h3 className="font-semibold">Paul Kamga</h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm">Chef professionnel</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-200">
                "Une plateforme indispensable pour préserver et promouvoir notre patrimoine culinaire camerounais. Continuez ainsi !"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Partagez vos meilleures recettes</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Rejoignez notre communauté et partagez les saveurs qui vous tiennent à cœur.
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
