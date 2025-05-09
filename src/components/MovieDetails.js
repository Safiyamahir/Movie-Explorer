import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { api } from '../api';
import { MovieContext } from '../MovieContext';

const MovieDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(MovieContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const data = await api.getMovieDetails(id);
        setMovie(data);
        // Set page title to movie title
        document.title = `${data.title} - Movie Explorer`;
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
    
    // Reset title when component unmounts
    return () => {
      document.title = 'Movie Explorer';
    };
  }, [id]);

  const goBack = () => {
    history.goBack();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="text-center p-8 max-w-md bg-red-100 dark:bg-red-900 rounded-lg shadow-lg">
          <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Movie Not Found</h2>
          <p className="text-red-600 dark:text-red-200 mb-4">{error || "We couldn't find the movie you're looking for."}</p>
          <button 
            onClick={goBack}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : null;

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Backdrop Image */}
      {backdropUrl && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${backdropUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <button 
              onClick={goBack}
              className="flex items-center text-white hover:text-yellow-500 transition mb-4"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Movies
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-lg italic text-yellow-400">{movie.tagline}</p>
            )}
          </div>
        </div>
      )}

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-8">
        {!backdropUrl && (
          <>
            <button 
              onClick={goBack}
              className="flex items-center mb-4 text-yellow-500 hover:text-yellow-600 transition"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Movies
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-lg italic text-yellow-500 mb-6">{movie.tagline}</p>
            )}
          </>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Left Column - Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'shadow-black/50' : 'shadow-gray-400/50'}`}>
              <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
            </div>
            
            {/* Movie Stats */}
            <div className={`mt-6 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    /10 ({movie.vote_count?.toLocaleString() || 0})
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Release Date</span>
                  <span className="font-medium">{formatDate(movie.release_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Runtime</span>
                  <span className="font-medium">{formatRuntime(movie.runtime)}</span>
                </div>
                {movie.budget > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
                    <span className="font-medium">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
                    <span className="font-medium">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
                {movie.status && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className="font-medium">{movie.status}</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Language</span>
                    <span className="font-medium">
                      {new Intl.DisplayNames(['en'], {type: 'language'}).of(movie.original_language)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div className="md:w-2/3 lg:w-3/4">
            {/* Overview */}
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="leading-relaxed">{movie.overview || 'No overview available.'}</p>
            </div>
            
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span 
                      key={genre.id} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
                <h2 className="text-xl font-semibold mb-4">Production</h2>
                <div className="flex flex-wrap gap-6">
                  {movie.production_companies.map(company => (
                    <div key={company.id} className="flex flex-col items-center">
                      {company.logo_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} 
                          alt={company.name}
                          className={`h-12 object-contain mb-2 ${darkMode ? 'bg-white rounded p-1' : ''}`}
                        />
                      ) : (
                        <div className={`h-12 w-24 flex items-center justify-center mb-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <span className="text-xs text-center">{company.name}</span>
                        </div>
                      )}
                      <span className="text-sm text-center">{company.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Information */}
            {movie.belongs_to_collection && (
              <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
                <h2 className="text-xl font-semibold mb-4">Part of Collection</h2>
                <p>{movie.belongs_to_collection.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;