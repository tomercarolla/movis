import type {Movie} from "@/types/movie.ts";
import {Select} from "@/components";
import {useScheduleStore} from "@/store";
import {useShowtimeData} from "@/pages/movie-details/show-times-hook.ts";
import {useEffect} from "react";
import {useSeatAvailability} from "@/pages/movie-details/seats-hook.ts";

type BookTicketsProps = {
    movie: Movie;
}

export function BookTickets({movie}: BookTicketsProps) {
    const {
        schedule,
        setSchedule,
        setWeekDates,
        weekDates,
        selectedDate,
        selectedTime,
        selectDate,
        selectTime
    } = useScheduleStore();

    const {weekDates: computedDates, showTimes, startTimes} = useShowtimeData([movie]);

    useEffect(() => {
        setSchedule(showTimes);
        setWeekDates(computedDates);
    }, []);

    function buildSeatKey(date: string, time: string, theaterId: string) {
        return `${movie.id}-${date}-${time}-${theaterId}`;
    }

    const timeOptions = selectedDate
        ? startTimes.map((time) => {
            const show = schedule.find(
                (s) => s.movieId === movie.id && s.date === selectedDate && s.time === time
            );

            if (!show) {
                return { value: time, label: `${time} (Unavailable)`, disabled: true };
            }

            const seatKey = buildSeatKey(selectedDate, time, show.theaterId);
            const { isSoldOut } = useSeatAvailability(seatKey);

            return {
                value: time,
                label: isSoldOut ? `${time} (Sold Out)` : time,
                disabled: isSoldOut,
            };
        })
        : [];

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4">
                <Select className='max-w-[180px] w-full' value={selectedDate || ''} options={weekDates} onChange={selectDate} placeholder='Select a day'/>

                {selectedDate && (
                    <Select className='max-w-[180px] w-full' options={timeOptions} onChange={selectTime} placeholder='Select a hour'/>
                )}
            </div>

            {selectedDate && selectedTime && (
                <div className="mt-6 p-4 border border-muted rounded-md text-center text-muted-foreground">
                    {/* TODO: Seat map will be added here */}
                    Seat map will appear here after selecting day and time.
                </div>
            )}
        </>
    )
}