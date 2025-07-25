import type {Movie, Showtime, Theater, WeekdayDate} from "@/types/movie.ts";
import {useMemo} from "react";

const startTimes = ['14:00', '17:30', '21:00'];

function getWeekDatesFromToday(daysCount = 7): WeekdayDate[] {
    const today = new Date();

    return Array.from({length: daysCount}, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const label = `${date.toLocaleDateString('en-US', { weekday: 'long' })} - ${date.toLocaleDateString('en-GB')}`;
        const value = date.toISOString().slice(0, 10);

        console.log('from hook ', {label, value});

        return { label, value };
    });
}

function generateShowTimes(movies: Movie[], weekDates: WeekdayDate[]): Showtime[] {
    const occupied = new Map<string, boolean>();
    const all: Showtime[] = [];

    weekDates.forEach(({label}) => {
        startTimes.forEach((time) => {
            movies.forEach((movie) => {
                const freeTheaters: Theater[] = movie.theaters.filter((theater) => {
                    const key = `${label}-${time}-${theater.id}`;

                    return !occupied.has(key);
                });

                if (freeTheaters.length > 0) {
                    const randomIndex = Math.floor(Math.random() * freeTheaters.length);
                    const chosenTheater = freeTheaters[randomIndex];

                    occupied.set(`${label}-${time}-${chosenTheater.id}`, true);

                    all.push({
                        movieId: movie.id,
                        theaterId: chosenTheater.id,
                        date: label,
                        time
                    });
                }
            });
        });
    });

    return all;
}

export function useShowtimeData(movies: Movie[]) {
    const weekDates = useMemo(() => getWeekDatesFromToday(7), []);

    const showTimes = useMemo(() => generateShowTimes(movies, weekDates), [movies, weekDates]);

    return {weekDates, showTimes, startTimes};
}