import {useQuery} from "@tanstack/react-query";

export type Movie = {
    id: number
    title: string
    vote_average: number
    genre_ids: number[]
    poster_path: string | null
    overview: string
    release_date: string
}

type MoviesResponse = {
    results: Movie[]
    page: number
    total_results: number
    total_pages: number
}

export const useMovies = () => useQuery({
    queryKey: ['movies'],
    queryFn: () => fetchMovies(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
});

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMovies(): Promise<Movie[]> {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch movies');

    const data: MoviesResponse = await response.json();

    return data.results
}