import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { MovieContext } from '../MovieContext';
import { api } from '../api';
import MovieCard from './MovieCard';
import Favorites from './Favourites'; // Note: Corrected import (Favourites -> Favorites)
import FilterPanel from './FilterPanel';

const Home = () => {
  const { 
    trendingMovies, 
    setTrendingMovies, 
    searchResults, 
    setSearchResults, 
    darkMode, 
    toggleDarkMode, 
    clearFavorites,
    setIsLoggedIn 
  } = useContext(MovieContext);
  
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [filters, setFilters] = useState({});
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [discoveredMovies, setDiscoveredMovies] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        if (trendingMovies.length === 0) {
          const movies = await api.getTrendingMovies();
          setTrendingMovies(movies);
        }
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrending();
  }, [trendingMovies.length, setTrendingMovies]);

  useEffect(() => {
    const applyFilters = async () => {
      setPage(1);
      
      const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== undefined && value !== '');
      setIsFiltering(hasActiveFilters);
      
      if (!hasActiveFilters) {
        setFilteredMovies([]);
        setDiscoveredMovies([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        if (activeTab === 'search' && query.trim()) {
          const data = await api.searchMovies(query, 1, filters);
          setSearchResults(data.results || []);
          setHasMore((data.total_pages || 1) > 1);
        } else {
          const data = await api.discoverMovies(1, {
            ...filters,
            sortBy: 'popularity.desc'
          });
          setDiscoveredMovies(data.results || []);
          setHasMore((data.total_pages || 1) > 1);
          if (activeTab !== 'search' && !query.trim()) {
            setActiveTab('discover');
          }
        }
      } catch (error) {
        console.error('Error applying filters:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    applyFilters();
  }, [filters, activeTab, query, setSearchResults]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await api.searchMovies(query, 1, filters);
      setSearchResults(data.results || []);
      setPage(1);
      setHasMore((data.total_pages || 1) > 1);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      
      if (activeTab === 'search') {
        const data = await api.searchMovies(query, nextPage, filters);
        setSearchResults(prev => [...prev, ...(data.results || [])]);
        setHasMore(nextPage < (data.total_pages || 1));
      } else if (activeTab === 'discover') {
        const data = await api.discoverMovies(nextPage, {
          ...filters,
          sortBy: 'popularity.desc'
        });
        setDiscoveredMovies(prev => [...prev, ...(data.results || [])]);
        setHasMore(nextPage < (data.total_pages || 1));
      }
      
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    clearFavorites();
    setIsLoggedIn(false);
    history.push('/');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'search' && query && searchResults.length === 0) {
      handleSearch({ preventDefault: () => {} });
    } else if (tab === 'trending' || tab === 'favorites') {
      setDiscoveredMovies([]);
      setIsFiltering(false);
      setFilters({});
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    setIsFiltering(false);
    setDiscoveredMovies([]);
    if (activeTab === 'discover') {
      setActiveTab('trending');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-black' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-yellow-500 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2-2h12v8H4V4zm6 10a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Movie Explorer</h1>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={toggleDarkMode}
                className={`px-3 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-800 text-yellow-500 hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition`}
              >
                {darkMode ? (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                    Light
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    Dark
                  </>
                )}
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className={`w-full pl-10 pr-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition`}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a movie..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="flex mt-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`pb-2 px-4 text-sm font-medium ${activeTab === 'trending' ? 'border-b-2 border-yellow-500 text-yellow-500' : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} transition`}
              onClick={() => switchTab('trending')}
            >
              Trending
            </button>
            <button
              className={`pb-2 px-4 text-sm font-medium ${activeTab === 'favorites' ? 'border-b-2 border-yellow-500 text-yellow-500' : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} transition`}
              onClick={() => switchTab('favorites')}
            >
              My Favorites
            </button>
            {isFiltering && (
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === 'discover' ? 'border-b-2 border-yellow-500 text-yellow-500' : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} transition`}
                onClick={() => switchTab('discover')}
              >
                Filtered
              </button>
            )}
            {searchResults.length > 0 && (
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === 'search' ? 'border-b-2 border-yellow-500 text-yellow-500' : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} transition`}
                onClick={() => switchTab('search')}
              >
                Search Results
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <FilterPanel onFilterChange={handleFilterChange} darkMode={darkMode} />
          
          {isFiltering && (
            <button
              onClick={clearFilters}
              className={`px-3 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>
        
        {isLoading && searchResults.length === 0 && trendingMovies.length === 0 && discoveredMovies.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}

        {activeTab === 'search' && searchResults.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Search Results for "{query}"
              {isFiltering && <span className="text-sm text-yellow-500 ml-2">(Filtered)</span>}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Trending Movies</h2>
            {trendingMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {trendingMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : !isLoading && (
              <p className="text-center py-10 text-gray-500">No trending movies available.</p>
            )}
          </div>
        )}
        
        {activeTab === 'discover' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Filtered Movies</h2>
            {discoveredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {discoveredMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : !isLoading && (
              <p className="text-center py-10 text-gray-500">No movies match your filter criteria.</p>
            )}
            {hasMore && discoveredMovies.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="mt-4">
            <Favorites />
          </div>
        )}
      </main>
      
      <footer className={`py-6 ${darkMode ? 'bg-black text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">Movie Explorer © {new Date().getFullYear()} | Discover your next favorite film</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;