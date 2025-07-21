import {useMovies} from "@/api/movies.ts";

export default function Component() {
    const {data: movies, isLoading, error} = useMovies();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading movies: {error.message}</div>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies?.map(movie => (
                <div key={movie.id} className="bg-gray-800 text-white p-4 rounded shadow">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-auto rounded"
                    />
                    <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
                    <p>Rating: {movie.vote_average}</p>
                </div>
            ))}
        </div>
    )
}