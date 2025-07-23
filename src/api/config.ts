export const BASE_URL = 'https://api.themoviedb.org/3';
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const withApiKey = (path: string) => `${BASE_URL}${path}?api_key=${API_KEY}`;
