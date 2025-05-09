# Movie Explorer

Movie Explorer is a web application that allows users to browse, search, and filter movies using the TMDb API. Users can log in, save movies to their favorites, toggle between light/dark modes, and apply filters like genre, year, or rating to discover movies.

## Features

- **User Authentication**: Sign up and log in to manage favorites.
- **Movie Browsing**: View trending movies, search for movies, and filter by criteria like genre, year, and rating.
- **Favorites**: Add/remove movies to a favorites list, stored per user.
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Works on desktop and mobile devices.

## Project Structure

- `src/`: Frontend source code (React).
- `public/`: Static assets for the frontend.
- `.env`: Environment variables

## Prerequisites

- **Node.js and npm**: Ensure Node.js (v14 or later) and npm are installed. Download from [nodejs.org](https://nodejs.org).
- **TMDb API Key**: Sign up at [themoviedb.org](https://themoviedb.org) to get an API key.

## Setup Instructions

### 1. Clone or Extract the Project

- If using GitHub:
```bash
git clone https://github.com/yourusername/Movie-Explorer.git
cd Movie-Explorer
```

- If using a ZIP file:
  - Extract movie-explorer.zip to a folder (e.g., movie-explorer).
  - Navigate to the folder:
```bash
cd path/to/movie-explorer
```

### 2. Install Frontend Dependencies

- In the root directory (movie-explorer/), install the Node.js packages:
```bash
npm install
```

### 3. Set Up Environment Variables

- Create a `.env` file in the root directory (movie-explorer/) for the frontend:
```bash
nano .env
```

- Add the following (replace with your TMDb API key):
```
REACT_APP_TMDB_API_KEY=your-tmdb-api-key-here
```

- Save and exit (Ctrl+O, Enter, Ctrl+X in nano).

### 4. Start the Frontend Server

- Open a new terminal (or use Ctrl+C to stop the backend temporarily, navigate back, and continue).
- From the root directory (movie-explorer/), run:
```bash
cd ..
npm start
```

- The app should open at http://localhost:3000 in your browser. If not, navigate to that URL manually.

### 5. Test the Application

- Sign up or log in with a username and password.
- Browse trending movies, search for movies, apply filters, and add movies to favorites.
- Switch between tabs ("Trending", "My Favorites", "Filtered", "Search Results") to verify functionality.
