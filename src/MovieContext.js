import React, { createContext, useState, useEffect } from 'react';
import { api } from './api';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
  const [genres, setGenres] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simple login state

  // Fetch genres on app load
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await api.getGenres();
        setGenres(genreList);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }

    // Check if user is "logged in" (simplified for frontend-only)
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('favorites');
    }
  }, [favorites]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addToFavorites = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, { id: movie.id, movieId: movie.id, movieTitle: movie.title, ...movie }]);
    }
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  const getGenreName = (genreId) => {
    const genre = genres.find(g => g.id === parseInt(genreId));
    return genre ? genre.name : 'Unknown';
  };

  const contextValue = {
    trendingMovies,
    setTrendingMovies,
    searchResults,
    setSearchResults,
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    darkMode,
    toggleDarkMode,
    genres,
    getGenreName,
    isLoggedIn,
    setIsLoggedIn
  };

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};