import { useGenres } from '@/api/genres.ts';
import { MultiSelect } from '@/components/multi-select/MultiSelect.tsx';
import type { Genre } from '@/types/movie.ts';
import type { Dispatch, SetStateAction } from 'react';

type GenresMultiSelectFilterProps = {
  selectedGenres: Genre[];
  setSelectedGenres: Dispatch<SetStateAction<Genre[]>>;
};

export function GenresMultiSelectFilter({
  selectedGenres,
  setSelectedGenres,
}: GenresMultiSelectFilterProps) {
  const { data: genres } = useGenres();

  if (!genres) return null;

  return (
    <MultiSelect<Genre>
      options={genres}
      selectedValues={selectedGenres}
      onChange={setSelectedGenres}
      getOptionLabel={(genre) => genre.name}
      getOptionValue={(genre) => genre.id}
      placeholder="Filter by genres"
      emptyMessage="No genres found"
    />
  );
}
