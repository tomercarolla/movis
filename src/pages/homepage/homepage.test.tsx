import { useGenres } from '@/api/genres';
import { useMovies } from '@/api/movies';
import Component from '@/pages/homepage/page';
import {
  genresForGenreFilter,
  genresForNoResults,
  genresForRatingFilter,
  mockGenres,
  mockMovies,
  moviesForGenreFilter,
  moviesForNoResults,
  moviesForRatingFilter,
} from '@/testing/fixtures/movies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi, type Mock } from 'vitest';

vi.mock('@/api/movies');
vi.mock('@/api/genres');

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe('Component - Movie List', () => {
  it('renders movies in the document', () => {
    (useMovies as unknown as Mock).mockReturnValue({
      data: mockMovies,
      isLoading: false,
      error: null,
    });

    (useGenres as unknown as Mock).mockReturnValue({
      data: mockGenres,
      isLoading: false,
      error: null,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('The Matrix (1999)')).toBeInTheDocument();
    expect(screen.getByText('Inception (2010)')).toBeInTheDocument();
    expect(screen.getByText('The Notebook (2004)')).toBeInTheDocument();
    expect(screen.getByText('Bad Movie (2020)')).toBeInTheDocument();
  });

  it('filters movies by rating', async () => {
    (useMovies as unknown as Mock).mockReturnValue({
      data: moviesForRatingFilter,
      isLoading: false,
      error: null,
    });

    (useGenres as unknown as Mock).mockReturnValue({
      data: genresForRatingFilter,
      isLoading: false,
      error: null,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('The Matrix (1999)')).toBeInTheDocument();
    expect(screen.getByText('Bad Movie (2020)')).toBeInTheDocument();

    const ratingFilter = screen.getByText('Filter by rating');
    fireEvent.click(ratingFilter);

    await waitFor(() => {
      const option = screen.getByText('8-8.9');
      fireEvent.click(option);
    });

    await waitFor(() => {
      expect(screen.getByText('The Matrix (1999)')).toBeInTheDocument();
      expect(screen.queryByText('Bad Movie (2020)')).not.toBeInTheDocument();
    });
  });

  it('filters movies by genres', async () => {
    (useMovies as unknown as Mock).mockReturnValue({
      data: moviesForGenreFilter,
      isLoading: false,
      error: null,
    });

    (useGenres as unknown as Mock).mockReturnValue({
      data: genresForGenreFilter,
      isLoading: false,
      error: null,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('The Matrix (1999)')).toBeInTheDocument();
    expect(screen.getByText('The Notebook (2004)')).toBeInTheDocument();

    const genreFilter = screen.getByText('Filter by genres');
    fireEvent.click(genreFilter);

    await waitFor(() => {
      const options = screen.getAllByText('Romance');
      const dropdownOption = options.find(
        (option) => option.tagName === 'LABEL',
      );
      fireEvent.click(dropdownOption!);
    });

    await waitFor(() => {
      expect(screen.queryByText('The Matrix (1999)')).not.toBeInTheDocument();
      expect(screen.getByText('The Notebook (2004)')).toBeInTheDocument();
    });
  });

  it('shows no results message when no movies match filters', async () => {
    (useMovies as unknown as Mock).mockReturnValue({
      data: moviesForNoResults,
      isLoading: false,
      error: null,
    });

    (useGenres as unknown as Mock).mockReturnValue({
      data: genresForNoResults,
      isLoading: false,
      error: null,
    });

    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Component />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const genreFilter = screen.getByText('Filter by genres');
    fireEvent.click(genreFilter);

    await waitFor(() => {
      const option = screen.getByLabelText('Comedy');
      fireEvent.click(option);
    });

    await waitFor(() => {
      expect(
        screen.getByText('No movies match your filters.'),
      ).toBeInTheDocument();
      expect(screen.queryByText('The Matrix (1999)')).not.toBeInTheDocument();
    });
  });
});
