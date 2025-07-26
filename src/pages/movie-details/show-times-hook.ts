import type {Movie, Showtime, WeekdayDate} from "@/types/movie.ts";
import {useMemo} from "react";
import {useSeatsStore} from "@/store";
import {TOTAL_SEATS} from "@/pages/movie-details/seats-hook.ts";

const startTimes = ['14:00', '17:30', '21:00'];

function getWeekDatesFromToday(daysCount = 7): WeekdayDate[] {
    const today = new Date();

    return Array.from({length: daysCount}, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const label = `${date.toLocaleDateString('en-US', {weekday: 'long'})} - ${date.toLocaleDateString('en-GB')}`;
        const value = date.toISOString().slice(0, 10);

        return {label, value};
    });
}

function generateShowTimes(movie: Movie, weekDates: WeekdayDate[]): Showtime[] {
    const occupied = new Map<string, boolean>();
    const all: Showtime[] = [];

    weekDates.forEach(({ label, value }) => {
        startTimes.forEach((time) => {
            const freeTheaters = movie.theaters.filter((theater) => {
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
                    date: value,
                    time
                });
            }
        });
    });

    return all;
}

export function useShowTimeData(movie: Movie) {
    const weekDates = useMemo(() => getWeekDatesFromToday(7), []);
    const showTimes = useMemo(() => generateShowTimes(movie, weekDates), [movie, weekDates]);

    const occupiedSeats = useSeatsStore((s) => s.occupiedSeats);

    const getTimeOptions = (date: string) => {
        return startTimes.map((time) => {
            const show = showTimes.find(
                (s) => s.date === date && s.time === time && s.movieId === movie.id
            );

            const key = show ? `${movie.id}-${date}-${time}-${show.theaterId}` : null;
            const isSoldOut = key ? (occupiedSeats[key]?.length ?? 0) === TOTAL_SEATS : false;

            return {
                value: time,
                label: isSoldOut ? `${time} (Sold out)` : time,
                disabled: isSoldOut ? true : undefined
            };
        });
    };

    return {weekDates, showTimes, startTimes, getTimeOptions};
}