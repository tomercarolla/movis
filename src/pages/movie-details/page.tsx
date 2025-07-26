import { LoaderMovieDetails } from '@/components';
import { Separator } from '@/components/ui/separator.tsx';
import { BookTickets } from '@/pages/movie-details/components/BookTickets.tsx';
import { useMovieStore } from '@/store';
import { useParams } from 'react-router';

export default function Component() {
  const { id } = useParams();

  const movie = useMovieStore((state) =>
    id ? state.getMovieById(Number(id)) : undefined,
  );

  if (!movie) return <LoaderMovieDetails />;

  const {
    title,
    poster_path: cover,
    release_date,
    runtime: duration,
    genres,
    vote_average: rating,
    overview,
  } = movie;
  const year = new Date(release_date).getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          src={`https://image.tmdb.org/t/p/w300${cover}`}
          alt={title}
          className="w-full sm:w-40 rounded-md object-cover shadow-md"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {title} ({year})
            </h1>
            <p className="max-w-150 mt-4 text-sm leading-relaxed text-foreground/90">
              {overview}
            </p>
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            <p>Rating: {rating.toFixed(1)}</p>
            <p>Duration: {`${duration} min`}</p>

            <ul className="flex gap-2 text-foreground align-items-center flex-wrap mt-2">
              {genres.map(({ id, name }) => (
                <li
                  key={id}
                  className="inline-block bg-gray-200 px-2 py-1 rounded"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        Available Theaters:
        <ul className="flex gap-2 align-items-center flex-wrap mt-2">
          {movie.theaters.map(({ id, name }) => (
            <li key={id} className="inline-block bg-gray-200 px-2 py-1 rounded">
              {name}
            </li>
          ))}
        </ul>
      </div>

      <Separator className="my-6" />

      <BookTickets movie={movie} />
    </div>
  );
}
