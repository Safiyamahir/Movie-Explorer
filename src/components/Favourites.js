import React, { useContext, useState, useEffect } from 'react';
import { MovieContext } from '../MovieContext';
import MovieCard from './MovieCard';
import { api } from '../api';

const Favorites = () => {
  const { favorites } = useContext(MovieContext);
  const [detailedFavorites, setDetailedFavorites] = useState([]);

  useEffect(() => {
    const fetchDetailedFavorites = async () => {
      if (favorites.length === 0) {
        setDetailedFavorites([]);
        return;
      }

      try {
        const movieDetailsPromises = favorites.map(fav => api.getMovieDetails(fav.movieId));
        const movieDetails = await Promise.all(movieDetailsPromises);
        const validMovies = movieDetails.filter(movie => movie !== null);
        setDetailedFavorites(validMovies);
      } catch (err) {
        console.error('Error fetching favorite movie details:', err);
        setDetailedFavorites(favorites); // Use local favorites as fallback
      }
    };

    fetchDetailedFavorites();
  }, [favorites]);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Favorites</h2>
      <div className="flex flex-wrap justify-center">
        {detailedFavorites.length > 0 ? (
          detailedFavorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-center">No favorites yet</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;