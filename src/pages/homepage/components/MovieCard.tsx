import type {Movie} from "@/types/movie.ts";
import {Link} from "react-router";

export function MovieCard({movie}: { movie: Movie }) {
    const {title, poster_path: cover, release_date, runtime: duration, genres, vote_average: rating} = movie;
    const year = new Date(release_date).getFullYear();

    return (
        <Link className="bg-gray-800 text-white p-4 rounded flex flex-col" key={movie.id}
              to={`/movie/${movie.id}`}>
            <li>
                <div className='w-full aspect-[2/3] max-w-[300px] md:max-w-full mx-auto overflow-hidden rounded'>
                    <img
                        src={`https://image.tmdb.org/t/p/w500${cover}`}
                        alt={title}
                        className="w-full h-auto object-cover"
                    />
                </div>

                <h2 className="mt-2 text-base md:text-lg font-semibold">{title} ({year})</h2>

                <p>Rating: {rating.toFixed(1)}</p>
                <p>Duration: {duration} min</p>

                <ul className='flex gap-2 align-items-center flex-wrap mt-2'>
                    {genres.map(({id, name}) => (
                        <li key={id} className="inline-block bg-gray-700 px-2 py-1 rounded">
                            {name}
                        </li>
                    ))}
                </ul>
            </li>
        </Link>
    )
}