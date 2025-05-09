import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { MovieContext } from '../MovieContext';

const Login = () => {
  const history = useHistory();
  const { setIsLoggedIn } = useContext(MovieContext);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        // Simulate signup
        const existingUsername = localStorage.getItem('username');
        if (existingUsername && existingUsername === username) {
          setError('Username already exists');
        } else {
          localStorage.setItem('username', username.trim());
          localStorage.setItem('password', password.trim());
          setIsSignup(false);
          setError('Account created successfully! Please log in.');
        }
      } else {
        // Simulate login
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        if (!storedUsername || !storedPassword) {
          setError('No account found. Please sign up first.');
        } else if (
          username.trim() === storedUsername &&
          password.trim() === storedPassword
        ) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          history.push('/home');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      setError('An error occurred');
      console.error('Error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black bg-opacity-90">
      <div className="relative w-full max-w-md px-8 py-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-800">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 rounded-full p-3 shadow-lg">
          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2-2h12v8H4V4zm6 10a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Movie Explorer</h1>
        <h2 className="text-xl text-center text-yellow-500 mb-8">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className={`p-3 rounded-lg ${error.includes('successfully') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-yellow-500 hover:text-yellow-400 font-medium text-sm transition"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <span className="text-gray-500 text-sm">
            Discover your next favorite film
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;