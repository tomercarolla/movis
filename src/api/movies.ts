import { withApiKey } from '@/api/config.ts';
import type { Movie } from '@/types/movie.ts';
import { useQuery } from '@tanstack/react-query';

export const useMovies = () =>
  useQuery({
    queryKey: ['movies'],
    queryFn: () => fetchMovies(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

async function fetchMovies(): Promise<Movie[]> {
  const movies = await fetchNowPlayingMovies();

  return await Promise.all(
    movies.map(async (movie) => {
      const { runtime, genres } = await getMovieDetailsById(movie.id);

      const theaterCount = 1 + Math.floor(Math.random() * 3);
      const theaters = Array.from({ length: theaterCount }, (_, i) => ({
        id: `theater-${movie.id}-${i + 1}`,
        name: `Theater ${i + 1}`,
      }));

      return {
        ...movie,
        theaters,
        runtime,
        genres,
      };
    }),
  );
}

async function fetchNowPlayingMovies(): Promise<
  Omit<Movie, 'runtime' | 'genres' | 'theaters'>[]
> {
  const url = withApiKey('/movie/now_playing');
  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to fetch movies');

  const data = await response.json();

  return data.results;
}

async function getMovieDetailsById(
  movieId: number,
): Promise<Pick<Movie, 'runtime' | 'genres'>> {
  const url = withApiKey(`/movie/${movieId}`);
  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to fetch movie details');

  const data = await response.json();

  return {
    runtime: data.runtime,
    genres: data.genres,
  };
}
