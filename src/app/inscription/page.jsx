"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiLoader, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const { register, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirect);
    }
  }, [isLoggedIn, router, redirect]);

  // Gérer les changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Vérifier la force du mot de passe
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
    
    // Vérifier si les mots de passe correspondent
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: "Les mots de passe ne correspondent pas"
        });
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: "Les mots de passe ne correspondent pas"
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: ""
        });
      }
    }
  };
  
  // Vérifier la force du mot de passe
  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) {
      strength += 1;
    }
    
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      strength += 1;
    }
    
    if (password.match(/[0-9]/)) {
      strength += 1;
    }
    
    if (password.match(/[^a-zA-Z0-9]/)) {
      strength += 1;
    }
    
    setPasswordStrength(strength);
  };
  
  // Obtenir la couleur de la force du mot de passe
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'bg-gray-300 dark:bg-gray-600';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };
  
  // Obtenir le texte de la force du mot de passe
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return '';
      case 1:
        return 'Faible';
      case 2:
        return 'Moyen';
      case 3:
        return 'Bon';
      case 4:
        return 'Excellent';
      default:
        return '';
    }
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est obligatoire";
    }
    
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit comporter au moins 6 caractères";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est obligatoire";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await register({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        router.push(redirect);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si déjà connecté, ne rien afficher pendant la redirection
  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium mb-1">Prénom</label>
              <div className={`relative rounded-md shadow-sm ${errors.prenom ? 'ring-2 ring-red-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                  placeholder=""
                />
              </div>
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="nom" className="block text-sm font-medium mb-1">Nom</label>
              <div className={`relative rounded-md shadow-sm ${errors.nom ? 'ring-2 ring-red-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                  placeholder=""
                />
              </div>
              {errors.nom && (
                <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <div className={`relative rounded-md shadow-sm ${errors.email ? 'ring-2 ring-red-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                placeholder=""
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
            <div className={`relative rounded-md shadow-sm ${errors.password ? 'ring-2 ring-red-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Force du mot de passe:</p>
                  <p className={`text-xs font-medium ${
                    passwordStrength === 1 ? 'text-red-500' :
                    passwordStrength === 2 ? 'text-orange-500' :
                    passwordStrength === 3 ? 'text-yellow-500' :
                    passwordStrength === 4 ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {getPasswordStrengthText()}
                  </p>
                </div>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength * 25}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <FiCheckCircle className={`mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheckCircle className={`mr-1 ${formData.password.match(/[a-z]/) && formData.password.match(/[A-Z]/) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Majuscules et minuscules</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheckCircle className={`mr-1 ${formData.password.match(/[0-9]/) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Au moins un chiffre</span>
                  </div>
                  <div className="flex items-center">
                    <FiCheckCircle className={`mr-1 ${formData.password.match(/[^a-zA-Z0-9]/) ? 'text-green-500' : 'text-gray-400'}`} />
                    <span>Au moins un caractère spécial</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
            <div className={`relative rounded-md shadow-sm ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 py-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex items-center mt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
            />
          
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Inscription en cours...
              </>
            ) : (
              'S\'inscrire'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vous avez déjà un compte ?{' '}
            <Link href={`/connexion${redirect !== '/' ? `?redirect=${redirect}` : ''}`}>
              <span className="font-medium text-amber-500 hover:text-amber-600">
                Se connecter
              </span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
