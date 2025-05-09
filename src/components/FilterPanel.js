import React, { useState, useEffect } from 'react';
import { api } from '../api';

const FilterPanel = ({ onFilterChange, darkMode }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate years from 1990 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
  
  // Ratings from 1 to 10
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await api.getGenres();
      setGenres(genreList);
    };
    
    fetchGenres();
  }, []);
  
  const handleApplyFilter = () => {
    const filters = {
      genreId: selectedGenre || null,
      year: selectedYear || null,
      rating: selectedRating || null
    };
    
    onFilterChange(filters);
    setIsOpen(false);
  };
  
  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    
    onFilterChange({});
    setIsOpen(false);
  };
  
  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-lg ${
          darkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-800 hover:bg-gray-100'
        } border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter Movies
        {(selectedGenre || selectedYear || selectedRating) && (
          <span className="ml-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute z-20 mt-2 p-4 rounded-lg shadow-lg w-64 sm:w-80 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={`w-full p-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`w-full p-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Minimum Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className={`w-full p-2 rounded border ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              <option value="">Any Rating</option>
              {ratings.map(rating => (
                <option key={rating} value={rating}>
                  {rating}+ Stars
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleClearFilters}
              className={`px-3 py-1 rounded ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Clear
            </button>
            <button
              onClick={handleApplyFilter}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;