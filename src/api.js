import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = {
  getTrendingMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  },
  
  searchMovies: async (query, page = 1, filters = {}) => {
    try {
      let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      
      // Add filters to the URL if they exist
      if (filters.year) {
        url += `&year=${filters.year}`;
      }
      
      if (filters.genreId) {
        url += `&with_genres=${filters.genreId}`;
      }
      
      if (filters.rating) {
        // TMDB uses vote_average for ratings
        url += `&vote_average.gte=${filters.rating}`;
      }
      
      const response = await axios.get(url);
      return {
        results: response.data.results || [],
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      return { results: [], total_pages: 1 };
    }
  },
  
  discoverMovies: async (page = 1, filters = {}) => {
    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;
      
      // Add filters to the URL
      if (filters.year) {
        url += `&primary_release_year=${filters.year}`;
      }
      
      if (filters.genreId) {
        url += `&with_genres=${filters.genreId}`;
      }
      
      if (filters.rating) {
        url += `&vote_average.gte=${filters.rating}`;
      }
      
      if (filters.sortBy) {
        url += `&sort_by=${filters.sortBy}`;
      }
      
      const response = await axios.get(url);
      return {
        results: response.data.results || [],
        total_pages: response.data.total_pages || 1
      };
    } catch (error) {
      console.error('Error discovering movies:', error);
      return { results: [], total_pages: 1 };
    }
  },
  
  getMovieDetails: async (movieId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },
  
  getGenres: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      return response.data.genres || [];
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  }
};