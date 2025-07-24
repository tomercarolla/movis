import {create} from "zustand/react";
import type {Movie, Showtime} from "@/types/movie.ts";
import {persist} from "zustand/middleware/persist";

const startTimes = ['14:00', '17:30', '21:00'];

function getWeekDatesFromToday(): string[] {
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);

        date.setDate(today.getDate() + i);

        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    });
}

function generateRandomShowtimes(movies: Movie[]): Showtime[] {
    const dates = getWeekDatesFromToday();
    const schedule: Showtime[] = [];
    const occupiedSlots = new Map<string, boolean>();

    dates.forEach((date) => {
        startTimes.forEach((time) => {
            movies.forEach((movie) => {
                const freeTheater = movie.theaters.find((theater) => {
                    const key = `${date}-${time}-${theater.id}`;

                    return !occupiedSlots.has(key);
                });

                if (freeTheater) {
                    schedule.push({
                        movieId: movie.id,
                        theaterId: freeTheater.id,
                        date,
                        time
                    })

                    occupiedSlots.set(`${date}-${time}-${freeTheater.id}`, true);
                }
            })
        })
    })

    return schedule;
}

type ScheduleStore = {
    schedule: Showtime[];
    generateSchedule: (movies: Movie[]) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
    persist(
        (set) => ({
            schedule: [],

            generateSchedule: (movies) => {
                const schedule = generateRandomShowtimes(movies);

                set({ schedule });
            }
        }),
        {
            name: 'schedule-storage'
        }
    )
)