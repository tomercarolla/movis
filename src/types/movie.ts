export type Movie = {
    id: number;
    title: string;
    vote_average: number;
    genres: Genre[];
    poster_path: string | null;
    overview: string;
    release_date: string;
    runtime: number | null;
    theaters: Theater[];
}

export type Genre = {
    id: number;
    name: string;
}

export type Theater = {
    id: string
    name: string
}

export type Showtime = {
    movieId: number;
    theaterId: string;
    date: string;
    time: string;
}