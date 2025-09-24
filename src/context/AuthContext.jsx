"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../utils/api';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Vérifier si l'utilisateur est authentifié au chargement de l'app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier si le token est expiré
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expiré, déconnexion
            handleLogout();
          } else {
            // Token valide, récupérer le profil
            const response = await authApi.getProfile();
            setUser(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error during authentication initialization', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login({ email, password });
      const { token, data } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      toast.success('Connexion réussie !');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      const { token, data } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      toast.success('Inscription réussie !');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
    toast.success('Déconnexion réussie');
  };

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authApi.updateProfile(profileData);
      const updatedUser = response.data.data;
      
      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profil mis à jour avec succès !');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: updateUserProfile,
        isLoggedIn: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
