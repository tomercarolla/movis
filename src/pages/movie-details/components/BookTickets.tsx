import type {Movie} from "@/types/movie.ts";
import {Select} from "@/components";
import {useShowTimeData} from "@/pages/movie-details/show-times-hook.ts";
import {SeatMap} from "@/pages/movie-details/components/seat-map/SeatMap.tsx";
import {useState} from "react";

type BookTicketsProps = {
    movie: Movie;
}

export function BookTickets({movie}: BookTicketsProps) {
    const {weekDates, showTimes, getTimeOptions} = useShowTimeData(movie);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleSelectDate = (date: string | null) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const timeOptions = selectedDate ? getTimeOptions(selectedDate) : [];

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Select
                    className='max-w-[200px] w-full'
                    value={selectedDate || ''}
                    options={weekDates}
                    onChange={handleSelectDate}
                    placeholder='Select a day'
                />

                {selectedDate && (
                    <Select
                        className='max-w-[180px] w-full'
                        value={selectedTime || ''}
                        options={timeOptions}
                        onChange={setSelectedTime}
                        placeholder='Select a hour'
                    />
                )}
            </div>

            {selectedDate && selectedTime && (
                <SeatMap
                    movieId={movie.id}
                    showTimes={showTimes}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                />
            )}
        </>
    )
}