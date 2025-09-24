"use client";

import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les appels API avec état de chargement et gestion des erreurs
 * @param {Function} apiFunction - Fonction API à appeler
 * @param {Array} deps - Dépendances pour le useEffect (quand recharger)
 * @param {any} initialData - Données initiales avant chargement
 * @returns {Array} [data, loading, error, refetch] - Données, état de chargement, erreur et fonction pour recharger
 */
export const useApi = (apiFunction, deps = [], initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, deps);
  
  const refetch = () => {
    fetchData();
  };
  
  return [data, loading, error, refetch];
};

/**
 * Hook personnalisé pour gérer un formulaire
 * @param {Object} initialValues - Valeurs initiales du formulaire
 * @param {Function} onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {Function} validate - Fonction de validation (optionnelle)
 * @returns {Object} - Objet contenant values, errors, handleChange, handleSubmit
 */
export const useForm = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Marquer ce champ comme touché
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true
      });
    }
    
    // Si la validation existe et que le champ a été touché, valider ce champ spécifique
    if (validate && touched[name]) {
      const fieldErrors = validate({ ...values, [name]: value });
      setErrors({
        ...errors,
        [name]: fieldErrors[name] || ''
      });
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Valider le champ lorsqu'il perd le focus
    if (validate) {
      const fieldErrors = validate(values);
      setErrors({
        ...errors,
        [name]: fieldErrors[name] || ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider tout le formulaire
    let formErrors = {};
    if (validate) {
      formErrors = validate(values);
      setErrors(formErrors);
    }
    
    // Si aucune erreur ou pas de validation, soumettre
    if (!validate || Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      await onSubmit(values);
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
};
