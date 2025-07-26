import type { Genre, Movie } from '@/types/movie.ts';

// Base movie fixtures
export const matrixMovie: Movie = {
  id: 1,
  title: 'The Matrix',
  vote_average: 8.7,
  genres: [
    { id: 28, name: 'Action' },
    { id: 878, name: 'Science Fiction' },
  ],
  poster_path: null,
  overview: '',
  release_date: '1999-03-31',
  runtime: null,
  theaters: [],
};

export const inceptionMovie: Movie = {
  id: 2,
  title: 'Inception',
  vote_average: 8.2,
  genres: [
    { id: 28, name: 'Action' },
    { id: 53, name: 'Thriller' },
  ],
  poster_path: null,
  overview: '',
  release_date: '2010-07-16',
  runtime: null,
  theaters: [],
};

export const notebookMovie: Movie = {
  id: 3,
  title: 'The Notebook',
  vote_average: 7.8,
  genres: [
    { id: 10749, name: 'Romance' },
    { id: 18, name: 'Drama' },
  ],
  poster_path: null,
  overview: '',
  release_date: '2004-06-25',
  runtime: null,
  theaters: [],
};

export const badMovie: Movie = {
  id: 4,
  title: 'Bad Movie',
  vote_average: 5.2,
  genres: [{ id: 35, name: 'Comedy' }],
  poster_path: null,
  overview: '',
  release_date: '2020-01-01',
  runtime: null,
  theaters: [],
};

export const mockMovies: Movie[] = [
  matrixMovie,
  inceptionMovie,
  notebookMovie,
  badMovie,
];

// Mock movie sets for specific test scenarios
export const moviesForRatingFilter: Movie[] = [matrixMovie, badMovie];

export const moviesForGenreFilter: Movie[] = [matrixMovie, notebookMovie];

export const moviesForNoResults: Movie[] = [matrixMovie];

// Mock genres
export const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 878, name: 'Science Fiction' },
];

export const genresForRatingFilter: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
];

export const genresForGenreFilter: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
];

export const genresForNoResults: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
];
