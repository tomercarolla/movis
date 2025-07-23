import {Loader, RatingFilterSelect, ratingRanges} from "@/components";
import {MovieCard} from "@/pages/homepage/components/MovieCard.tsx";
import {useState} from "react";
import {useMovies} from "@/api/movies.ts";
import type { Movie } from "@/types/movie";

export default function Component() {
    const {data: movies, isLoading, error} = useMovies();
    const [ratingFilter, setRatingFilter] = useState('all');

    if (isLoading) return <Loader/>;
    if (error) return <div>Error loading movies</div>;

    const filterByRating = (movie: Movie, ratingFilter: string) =>
        ratingRanges[ratingFilter]?.(movie.vote_average) ?? true;

    const filteredMovies = movies?.filter((movie) =>
        filterByRating(movie, ratingFilter)
    );

    console.log('filteredMovies ', filteredMovies)

    return (
        <section className='flex flex-col gap-6'>
            <section className='flex gap-7 items-center justify-center'>
                <RatingFilterSelect onChange={setRatingFilter} />
            </section>

            {filteredMovies?.length === 0 ? (
                <p className="text-center text-gray-400">No movies match your filters.</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2 sm:px-0">
                    {filteredMovies?.map((movie) => (
                        <li key={movie.id} className="bg-gray-800 text-white p-4 rounded flex flex-col">
                            <MovieCard movie={movie}/>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}