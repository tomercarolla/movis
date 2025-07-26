# Movis 🎬

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js**: Version 20.0 or higher (recommended: 22.0+)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tomercarolla/movis.git
cd movis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

- **API Key**: You need a valid API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).
  Set it in your environment variables as `VITE_TMDB_API_KEY`. Duplicate the `.env.example` file and rename it to
  `.env`, then add your TMDB API key.

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another available port if 5173 is in use).

## 📝 Available Scripts

- **`npm run dev`** - Starts the development server with hot reload
- **`npm run test`** - Runs the test suite with Vitest