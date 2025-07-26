import { useMovies } from '@/api/movies.ts';
import { Loader } from '@/components';
import { AutoComplete } from '@/components/autocomplete/AutoComplete.tsx';
import { GenresMultiSelectFilter } from '@/pages/homepage/components/GenresMultiSelectFilter.tsx';
import { MovieCard } from '@/pages/homepage/components/MovieCard.tsx';
import {
  ratingRanges,
  RatingSelectFilter,
} from '@/pages/homepage/components/RatingSelectFilter.tsx';
import { useMovieStore } from '@/store';
import type { Genre, Movie } from '@/types/movie';
import { useDebouncedValue } from '@/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function Component() {
  const { data: movies, isLoading, error } = useMovies();
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [genresFilter, setGenresFilter] = useState<Genre[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [_, setSelectedValue] = useState<string>('');
  const debouncedSearchValue = useDebouncedValue(searchValue, 300);

  const setMovies = useMovieStore((state) => state.setMovies);

  useEffect(() => {
    if (movies) {
      setMovies(movies);
    }
  }, [movies, setMovies]);

  const filterByRating = useCallback(
    (movie: Movie, ratingFilter: string) =>
      ratingRanges[ratingFilter]?.(movie.vote_average) ?? true,
    [],
  );

  const filterByGenres = useCallback(
    (movie: Movie, selectedGenres: Genre[]) => {
      if (selectedGenres.length === 0) return true;

      return movie.genres.some((genre) =>
        selectedGenres.some((selected) => selected.id === genre.id),
      );
    },
    [],
  );

  const searchMovie = useCallback((movie: Movie, searchValue: string) => {
    if (!searchValue) return true;

    return movie.title.toLowerCase().includes(searchValue.toLowerCase());
  }, []);

  const filteredMovies = useMemo(() => {
    if (!movies) return [];

    return movies.filter(
      (movie) =>
        searchMovie(movie, debouncedSearchValue) &&
        filterByRating(movie, ratingFilter) &&
        filterByGenres(movie, genresFilter),
    );
  }, [
    movies,
    debouncedSearchValue,
    ratingFilter,
    genresFilter,
    searchMovie,
    filterByRating,
    filterByGenres,
  ]);

  const moviesTitles = useMemo(() => {
    return filteredMovies.map((movie) => ({
      id: movie.id.toString(),
      label: movie.title,
      value: movie.title,
    }));
  }, [filteredMovies]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading movies</div>;

  return (
    <section className="flex flex-col gap-6">
      <section className="flex gap-7 items-center justify-center flex-wrap">
        <AutoComplete
          onSelectedValueChange={setSelectedValue}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          items={moviesTitles}
          isLoading={isLoading}
          emptyMessage="No movies found."
        />

        <GenresMultiSelectFilter
          setSelectedGenres={setGenresFilter}
          selectedGenres={genresFilter}
        />

        <RatingSelectFilter setRatingFilter={setRatingFilter} />
      </section>

      {filteredMovies.length === 0 ? (
        <p className="text-center text-gray-400">
          No movies match your filters.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-0">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ul>
      )}
    </section>
  );
}
