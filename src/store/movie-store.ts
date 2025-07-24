import {create} from "zustand/react";
import type {Movie} from "@/types/movie.ts";

type MovieStore = {
    movies: Movie[];
    setMovies: (movies: Movie[]) => void;
    getMovieById: (id: number) => Movie | undefined;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
    movies: [],
    setMovies: (movies) => set({movies}),
    getMovieById: (id) => get().movies.find((movie) => movie.id === id)
}));