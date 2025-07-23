export type Movie = {
    id: number;
    title: string;
    vote_average: number;
    genres: Genre[];
    poster_path: string | null;
    overview: string;
    release_date: string;
    runtime: number | null;
}

export type Genre = {
    id: number;
    name: string;
}