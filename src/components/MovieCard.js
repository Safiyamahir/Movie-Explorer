import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { MovieContext } from '../MovieContext';

const MovieCard = ({ movie }) => {
  const history = useHistory();
  const { favorites, addToFavorites, removeFromFavorites } = useContext(MovieContext);
  const isFavorite = favorites.some(fav => fav.movieId === movie.id);
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300';
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div
      className="m-2 relative cursor-pointer"
      onClick={() => history.push(`/movie/${movie.id}`)}
    >
      <img src={posterUrl} alt={movie.title} className="w-48 h-72 object-cover rounded" />
      <h4 className="text-sm mt-1">{movie.title} ({year})</h4>
      <p className="text-xs">Rating: {movie.vote_average || 'N/A'}</p>
      <button
        className="absolute top-2 right-2 text-2xl"
        onClick={handleFavoriteToggle}
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default MovieCard;