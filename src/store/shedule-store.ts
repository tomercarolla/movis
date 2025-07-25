import {create} from "zustand";
import type {Showtime, WeekdayDate} from "@/types/movie.ts";
import {persist} from "zustand/middleware";

type ScheduleStore = {
    schedule: Showtime[];
    weekDates: WeekdayDate[];
    selectedDate: string | null;
    selectedTime: string | null;

    setSchedule: (s: Showtime[]) => void;
    setWeekDates: (d: WeekdayDate[]) => void;
    selectDate: (date: string) => void;
    selectTime: (time: string) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
    persist(
        (set) => ({
            schedule: [],
            weekDates: [],
            selectedDate: null,
            selectedTime: null,

            setSchedule: (schedule) => set({schedule}),
            setWeekDates: (dates) => set({weekDates: dates}),
            selectDate: (date) => set({ selectedDate: date, selectedTime: null }),
            selectTime: (time) => set({selectedTime: time}),
        }),
        {
            name: 'schedule-store',
            partialize: (state) => ({
                schedule: state.schedule,
                weekDates: state.weekDates,
                selectedDate: state.selectedDate,
                selectedTime: state.selectedTime,
            }),
        }
    )
)