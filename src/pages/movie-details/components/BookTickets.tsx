import type {Movie} from "@/types/movie.ts";
import {Select} from "@/components";
import {useScheduleStore} from "@/store";
import {useShowtimeData} from "@/pages/movie-details/show-times-hook.ts";
import {useEffect} from "react";
import {SeatMap} from "@/pages/movie-details/components/seat-map/SeatMap.tsx";

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

    useEffect(() => {
        if (selectedDate) {
            const stillValid = weekDates.some((d) => d.value === selectedDate);
            if (!stillValid) {
                selectDate(null);
            }
        }
    }, [weekDates, selectedDate]);

    console.log('movie ', movie);

    // function buildSeatKey(date: string, time: string, theaterId: string) {
    //     return `${movie.id}-${date}-${time}-${theaterId}`;
    // }

    // const seatKeys = useMemo(() => {
    //     if (!selectedDate) return [];
    //
    //     return startTimes
    //         .map((time) => {
    //             const show = schedule.find(
    //                 (s) => s.movieId === movie.id && s.date === selectedDate && s.time === time
    //             );
    //
    //             if (!show) return null;
    //
    //             return {
    //                 time,
    //                 seatKey: buildSeatKey(selectedDate, time, show.theaterId),
    //             };
    //         })
    //         .filter(Boolean) as { time: string; seatKey: string }[];
    // }, [selectedDate, schedule, startTimes, movie.id]);

    // const seatAvailability = seatKeys.map(({ seatKey }) =>
    //     useSeatAvailability(seatKey)
    // );
    //
    // const soldOutMap = useMemo(() => {
    //     const map = new Map<string, boolean>();
    //     seatKeys.forEach(({ time }, i) => {
    //         map.set(time, seatAvailability[i].isSoldOut);
    //     });
    //     return map;
    // }, [seatAvailability, seatKeys]);

    // const timeOptions = useMemo(() => {
    //     if (!selectedDate) return [];
    //
    //     return startTimes.map((time) => {
    //         const show = schedule.find(
    //             (s) => s.movieId === movie.id && s.date === selectedDate && s.time === time
    //         );
    //
    //         if (!show) {
    //             return { value: time, label: `${time} (Unavailable)`, disabled: true };
    //         }
    //
    //         const isSoldOut = soldOutMap.get(time) ?? false;
    //
    //         return {
    //             value: time,
    //             label: isSoldOut ? `${time} (Sold Out)` : time,
    //             disabled: isSoldOut,
    //         };
    //     });
    // }, [selectedDate, startTimes, schedule, soldOutMap, movie.id]);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Select
                    className='max-w-[180px] w-full'
                    value={selectedDate || ''}
                    options={weekDates}
                    onChange={selectDate}
                    placeholder='Select a day'
                />

                {/*{selectedDate && (*/}
                {/*    <Select*/}
                {/*        className='max-w-[180px] w-full'*/}
                {/*        options={timeOptions}*/}
                {/*        onChange={selectTime}*/}
                {/*        placeholder='Select a hour'*/}
                {/*    />*/}
                {/*)}*/}
            </div>

            <SeatMap />

            {selectedDate && selectedTime && (
                <div className="mt-6 p-4 border border-muted rounded-md text-center text-muted-foreground">
                    {/* TODO: Seat map will be added here */}
                    Seat map will appear here after selecting day and time.
                </div>
            )}
        </>
    )
}