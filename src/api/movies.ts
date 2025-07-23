import {useQuery} from "@tanstack/react-query";
import type {Movie} from "@/types/movie.ts";
import {withApiKey} from "@/api/config.ts";

export const useMovies = () => useQuery({
    queryKey: ['movies'],
    queryFn: () => fetchMovies(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
});

async function fetchMovies(): Promise<Movie[]> {
    const movies = await fetchNowPlayingMovies();

    return await Promise.all(
        movies.map(async (movie) => {
            const {runtime, genres} = await fetchMovieDetails(movie.id);

            return {
                ...movie,
                runtime,
                genres
            }
        })
    );
}

async function fetchNowPlayingMovies(): Promise<Omit<Movie, 'runtime'>[]> {
    const url = withApiKey('/movie/now_playing');
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch movies');

    const data = await response.json();

    return data.results;
}

async function fetchMovieDetails(movieId: number): Promise<Pick<Movie, 'runtime' | 'genres'>> {
    const url = withApiKey(`/movie/${movieId}`);
    const response = await fetch(url);

    if (!response.ok) throw new Error('Failed to fetch movie details');

    const data = await response.json();

    return {
        runtime: data.runtime,
        genres: data.genres
    };
}