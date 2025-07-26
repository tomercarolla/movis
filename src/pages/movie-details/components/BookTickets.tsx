import type {Movie} from "@/types/movie.ts";
import {Select} from "@/components";
import {useScheduleStore} from "@/store";
import {useShowTimeData} from "@/pages/movie-details/show-times-hook.ts";
import {useEffect} from "react";
import {SeatMap} from "@/pages/movie-details/components/seat-map/SeatMap.tsx";

type BookTicketsProps = {
    movie: Movie;
}

export function BookTickets({movie}: BookTicketsProps) {
    const {
        setSchedule,
        setWeekDates,
        weekDates,
        selectedDate,
        selectedTime,
        selectDate,
        selectTime
    } = useScheduleStore();

    const {weekDates: computedDates, showTimes, getTimeOptions} = useShowTimeData(movie);

    useEffect(() => {
        if (showTimes && computedDates) {
            setSchedule(showTimes);
            setWeekDates(computedDates);
        }
    }, [showTimes, computedDates, setSchedule, setWeekDates]);

    useEffect(() => {
        if (selectedDate) {
            const stillValid = weekDates.some((d) => d.value === selectedDate);
            if (!stillValid) {
                selectDate(null);
            }
        }
    }, [weekDates, selectedDate, selectDate]);

    console.log('movie ', movie);

    const timeOptions = selectedDate ? getTimeOptions(selectedDate) : [];

    console.log('timeOptions ', timeOptions)

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Select
                    className='max-w-[200px] w-full'
                    value={selectedDate || ''}
                    options={weekDates}
                    onChange={selectDate}
                    placeholder='Select a day'
                />

                {selectedDate && (
                    <Select
                        className='max-w-[180px] w-full'
                        value={selectedTime || ''}
                        options={timeOptions}
                        onChange={selectTime}
                        placeholder='Select a hour'
                    />
                )}
            </div>

            {selectedDate && selectedTime && (
                <SeatMap movieId={movie.id} />
            )}
        </>
    )
}