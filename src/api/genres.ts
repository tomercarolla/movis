import { withApiKey } from '@/api/config.ts';
import type { Genre } from '@/types/movie.ts';
import { useQuery } from '@tanstack/react-query';

export const useGenres = () =>
  useQuery({
    queryKey: ['genres'],
    queryFn: () => fetchGenres(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

async function fetchGenres(): Promise<Genre[]> {
  const url = withApiKey('/genre/movie/list');
  const response = await fetch(url);

  if (!response.ok) throw new Error('Failed to fetch genres');

  const data = await response.json();

  return data.genres;
}
