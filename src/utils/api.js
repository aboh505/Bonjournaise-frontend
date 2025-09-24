import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est expiré ou invalide (401)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Rediriger vers la page de connexion si nous ne sommes pas déjà sur cette page
        if (window.location.pathname !== '/connexion') {
          window.location.href = '/connexion?session=expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Fonctions API pour les recettes
export const recettesApi = {
  getAll: (params) => api.get('/recettes', { params }),
  getById: (id) => api.get(`/recettes/${id}`),
  create: (data) => api.post('/recettes', data),
  update: (id, data) => api.put(`/recettes/${id}`, data),
  delete: (id) => api.delete(`/recettes/${id}`),
  search: (params) => api.get('/recettes/recherche', { params }),
  rate: (id, rating) => api.put(`/recettes/${id}/noter`, { note: rating }),
  toggleFavorite: (id) => api.put(`/recettes/${id}/favoris`),
  getFavorites: () => api.get('/recettes/favoris'),
  getUserRecipes: () => api.get('/utilisateurs/me/recettes'),
  uploadPhoto: (id, formData) => api.put(`/recettes/${id}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Fonctions API pour l'authentification
export const authApi = {
  register: (data) => api.post('/auth/inscription', data),
  login: (data) => api.post('/auth/connexion', data),
  logout: () => api.get('/auth/deconnexion'),
  getProfile: () => api.get('/auth/profil'),
  updateProfile: (data) => api.put('/auth/profil', data),
  updatePassword: (data) => api.put('/auth/password', data),
  updateProfilePhoto: (formData) => api.put('/auth/profil/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Fonctions API pour les commentaires
export const commentairesApi = {
  getByRecette: (recetteId) => api.get(`/recettes/${recetteId}/commentaires`),
  create: (recetteId, data) => api.post(`/recettes/${recetteId}/commentaires`, data),
  update: (id, data) => api.put(`/commentaires/${id}`, data),
  delete: (id) => api.delete(`/commentaires/${id}`)
};

// Fonctions API pour les catégories
export const categoriesApi = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`)
};

export default api;
