import {create} from "zustand";
import type {Movie} from "@/types/movie.ts";
import {persist} from "zustand/middleware";

type MovieStore = {
    movies: Movie[];
    setMovies: (movies: Movie[]) => void;
    getMovieById: (id: number) => Movie | undefined;
}

export const useMovieStore = create<MovieStore>()(
    persist<MovieStore>(
        (set, get) => ({
            movies: [],
            setMovies: (movies) => set({ movies }),
            getMovieById: (id) => get().movies.find((movie) => movie.id === id),
        }),
        {
            name: "movie-store",
        }
    )
);