import { Select } from '@/components/select/Select.tsx';
import type { Dispatch, SetStateAction } from 'react';

const ratingOptions = [
  { label: 'All ratings', value: 'all' },
  { label: '9+', value: '9' },
  { label: '8-8.9', value: '8' },
  { label: '7-7.9', value: '7' },
  { label: '6-6.9', value: '6' },
  { label: 'Below 6', value: 'below6' },
];

export const ratingRanges: Record<string, (rating: number) => boolean> = {
  '9': (rating) => rating >= 9,
  '8': (rating) => rating >= 8 && rating < 9,
  '7': (rating) => rating >= 7 && rating < 8,
  '6': (rating) => rating >= 6 && rating < 7,
  below6: (rating) => rating < 6,
  all: () => true,
};

type RatingSelectFilterProps = {
  setRatingFilter: Dispatch<SetStateAction<string>>;
};

export function RatingSelectFilter({
  setRatingFilter,
}: RatingSelectFilterProps) {
  return (
    <Select
      onChange={setRatingFilter}
      options={ratingOptions}
      placeholder="Filter by rating"
    />
  );
}
