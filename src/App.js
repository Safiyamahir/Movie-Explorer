import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MovieContext, MovieProvider } from './MovieContext';
import Home from './components/Home';
import Login from './components/Login';
import MovieDetails from './components/MovieDetails';
import Favorites from './components/Favourites';
import './App.css';

const AppContent = () => {
  return (
    <MovieContext.Consumer>
      {({ darkMode }) => {
        const lightTheme = createTheme({ palette: { mode: 'light' } });
        const darkTheme = createTheme({ palette: { mode: 'dark' } });

        return (
          <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
              <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/home" component={Home} />
                <Route path="/movie/:id" component={MovieDetails} />
                <Route path="/favorites" component={Favorites} />
              </Switch>
            </div>
          </ThemeProvider>
        );
      }}
    </MovieContext.Consumer>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
};

export default App;