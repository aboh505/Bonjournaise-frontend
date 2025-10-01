// "use client";

// import React from 'react';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

// export default function About() {
//   return (
//     <main className="bg-[#0f1a0b]">
//       {/* Hero Section avec image des dattes */}
//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <div className="relative w-full h-full">
//             {/* Image de fond avec overlay vert foncé */}
//             <Image 
//               src="/images/a1.jpg" 
//               alt="Dattes fraîches" 
//               fill 
//               style={{ objectFit: 'cover' }}
//               className="opacity-40"
//               priority
//             />
//             <div className="absolute inset-0 bg-[#0f1a0b]/50" />
//             {/* Feuilles décoratives */}
//             <Image 
//               src="/images/default-placeholder.svg" 
//               alt="Décoration" 
//               width={200}
//               height={200}
//               className="absolute top-10 left-10 opacity-50"
//             />
//             <Image 
//               src="/images/default-placeholder.svg" 
//               alt="Décoration" 
//               width={200}
//               height={200}
//               className="absolute bottom-10 right-10 rotate-180 opacity-50"
//             />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white font-serif">DATE FRUIT FACTORY</h1>
//             <p className="text-xl md:text-2xl text-[#d1b883] mb-10">Délicieux et Nutritif pour Votre Import</p>
//             <div className="flex justify-center">
//               <button className="bg-[#d1b883] text-[#0f1a0b] px-8 py-3 rounded-md font-bold flex items-center hover:bg-[#c2a972] transition-colors">
//                 Découvrir nos produits
//                 <FiArrowRight className="ml-2" />
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Section Avantages */}
//       <section className="py-24 bg-[#152010]">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-12 text-center text-white font-serif">Conçu pour votre plaisir gustatif</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="flex items-start">
//                 <div className="w-12 h-12 rounded-full bg-[#d1b883] flex items-center justify-center mr-4">
//                   <FiCheckCircle className="text-[#0f1a0b] text-xl" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold mb-2 text-white">Qualité supérieure</h3>
//                   <p className="text-gray-300">Nos dattes sont soigneusement sélectionnées pour garantir une qualité exceptionnelle et un goût incomparable.</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Section Notre Galerie */}
//       <section className="py-24">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-2 text-center text-white font-serif">Notre Collection Premium</h2>
//           <p className="text-[#d1b883] text-center mb-12">Découvrez notre sélection de produits de qualité</p>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((item) => (
//               <div key={item} className="bg-[#1c2c16] rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
//                 <div className="h-48 relative">
//                   <Image 
//                     src="/images/default-recipe.svg"
//                     alt="Produit de dattes" 
//                     fill 
//                     style={{ objectFit: 'contain' }}
//                     className="p-4 bg-[#273e21]"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-2 text-white">Dattes Premium</h3>
//                   <p className="text-gray-300 text-sm mb-4">Dattes fraîches et délicieuses, parfaites pour tous les moments de la journée.</p>
//                   <button className="bg-[#d1b883] text-[#0f1a0b] px-4 py-2 rounded-md font-bold text-sm">Voir détails</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//             {[5, 6, 7, 8].map((item) => (
//               <div key={item} className="bg-[#1c2c16] rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
//                 <div className="h-48 relative">
//                   <Image 
//                     src="/images/default-recipe.svg"
//                     alt="Produit de dattes" 
//                     fill 
//                     style={{ objectFit: 'contain' }}
//                     className="p-4 bg-[#273e21]"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold mb-2 text-white">{item === 5 ? 'Chocolat aux dattes' : item === 6 ? 'Fleurs de datte' : item === 7 ? 'Dattes fourrées' : 'Datte biologique'}</h3>
//                   <p className="text-gray-300 text-sm mb-4">Un délice irrésistible pour tous les amateurs de saveurs douces et exotiques.</p>
//                   <button className="bg-[#d1b883] text-[#0f1a0b] px-4 py-2 rounded-md font-bold text-sm">Voir détails</button>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="text-center mt-12">
//             <button className="bg-transparent border-2 border-[#d1b883] text-[#d1b883] px-8 py-3 rounded-md font-bold hover:bg-[#d1b883] hover:text-[#0f1a0b] transition-colors">
//               Voir tous les produits
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Section Rencontrez l'équipe */}
//       <section className="py-24 bg-[#1d2f19]">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-2 text-center text-white font-serif">Meet Our Team</h2>
//           <p className="text-[#d1b883] text-center mb-12">Dévouée à la qualité et à l'excellence</p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[1, 2, 3].map((item) => (
//               <div key={item} className="bg-[#273e21] rounded-lg overflow-hidden p-6 text-center">
//                 <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative">
//                   <Image 
//                     src='/images/default-avatar.svg'
//                     alt="Membre de l'équipe" 
//                     fill 
//                     style={{ objectFit: 'contain' }}
//                   />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2 text-white">Expert en Dattes</h3>
//                 <p className="text-[#d1b883] mb-3">Responsable Qualité</p>
//                 <p className="text-gray-300 text-sm">Passionné par la qualité et le goût authentique des meilleures dattes du monde.</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Section Témoignages */}
//       <section className="py-24">
//         <div className="container mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-12 text-center text-white font-serif">Ce que nos clients disent</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-[#1c2c16] rounded-lg p-6 relative">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-full overflow-hidden relative mr-4">
//                   <Image 
//                     src="/images/default-avatar.svg"
//                     alt="Client" 
//                     fill 
//                     style={{ objectFit: 'contain' }}
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Client Satisfait</h3>
//                   <p className="text-[#d1b883] text-sm">Client fidèle</p>
//                 </div>
//               </div>
//               <p className="text-gray-300">"Les dattes sont d'une qualité exceptionnelle. Le goût est incomparable et le service client est impeccable. Je recommande vivement !"</p>
//             </div>

//             <div className="bg-[#1c2c16] rounded-lg p-6 relative">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-full overflow-hidden relative mr-4">
//                   <Image 
//                     src="/images/default-avatar.svg"
//                     alt="Client" 
//                     fill 
//                     style={{ objectFit: 'contain' }}
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">Client Heureux</h3>
//                   <p className="text-[#d1b883] text-sm">Acheteur régulier</p>
//                 </div>
//               </div>
//               <p className="text-gray-300">"J'ai découvert ces dattes lors d'un voyage et je suis ravi de pouvoir en commander en ligne. La qualité est toujours au rendez-vous."</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Section Call to Action */}
//       <section className="py-24 bg-[#d1b883] relative overflow-hidden">
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="md:w-1/2 mb-8 md:mb-0">
//               <h2 className="text-4xl font-bold mb-4 text-[#0f1a0b] font-serif">Prêt à goûter l'excellence ?</h2>
//               <p className="text-[#2d3a28] text-lg mb-6">Rejoignez des milliers de clients satisfaits et découvrez la différence Date Fruit Factory.</p>
//               <button className="bg-[#0f1a0b] text-white px-8 py-3 rounded-md font-bold flex items-center hover:bg-[#1a2917] transition-colors">
//                 Commander maintenant
//                 <FiArrowRight className="ml-2" />
//               </button>
//             </div>
//             <div className="md:w-1/3">
//               <div className="relative w-full h-64 rounded-lg overflow-hidden">
//                 <Image 
//                   src="/images/default-recipe.svg"
//                   alt="Produits de dattes" 
//                   fill 
//                   style={{ objectFit: 'contain' }}
//                   className="p-4 bg-[#273e21]"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
//             <Image 
//               src="/images/default-placeholder.svg"
//               alt="Motif décoratif" 
//               fill 
//               style={{ objectFit: 'contain' }}
//             />
//         </div>
//       </section>

//       {/* Section Newsletter */}
//       <section className="py-16 bg-[#152010]">
//         <div className="container mx-auto px-4">
//           <div className="max-w-2xl mx-auto text-center">
//             <h2 className="text-3xl font-bold mb-4 text-white font-serif">Abonnez-vous à notre newsletter</h2>
//             <p className="text-gray-300 mb-8">Recevez nos dernières offres et actualités directement dans votre boîte mail.</p>
//             <form className="flex flex-col md:flex-row gap-4 justify-center">
//               <input 
//                 type="email" 
//                 placeholder="Votre adresse email" 
//                 className="px-4 py-3 rounded-md bg-[#0f1a0b] border border-[#2d3a28] text-white focus:outline-none focus:ring-2 focus:ring-[#d1b883] md:w-96"
//               />
//               <button 
//                 type="submit" 
//                 className="bg-[#d1b883] text-[#0f1a0b] px-6 py-3 rounded-md font-bold hover:bg-[#c2a972] transition-colors"
//               >
//                 S'abonner
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
