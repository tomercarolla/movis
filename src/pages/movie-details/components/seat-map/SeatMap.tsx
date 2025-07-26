import {Screen} from "@/pages/movie-details/components/seat-map/Screen.tsx";
import {TOTAL_SEATS, useSeatAvailability} from "@/pages/movie-details/seats-hook.ts";
import {useCallback, useMemo} from "react";
import {useSeatsStore} from "@/store";
import {SeatRows} from "@/pages/movie-details/components/seat-map/SeatRows.tsx";
import {tss} from "tss-react";
import type {Movie, Showtime} from "@/types/movie";

const seats = Array.from({length: TOTAL_SEATS}, (_, i) => i + 1);
const seatsPerRow = 8;
const totalRows = TOTAL_SEATS / seatsPerRow;
const rows = Array.from({length: totalRows}, (_, i) => i + 1);

type SeatMapProps = {
    movie: Movie;
    selectedDate: string;
    selectedTime: string;
    showTimes: Showtime[];
};

export function SeatMap({movie, selectedDate, selectedTime, showTimes}: SeatMapProps) {
    const selectedSeatsMap = useSeatsStore((s) => s.selectedSeats);
    const movieId = movie.id;
    const {classes} = useStyles();

    const theaterId = useMemo(() => {
        return (
            showTimes.find(
                (s) =>
                    s.movieId === movieId &&
                    s.date === selectedDate &&
                    s.time === selectedTime
            )?.theaterId ?? null
        );
    }, [showTimes, movieId, selectedDate, selectedTime]);

    const key = useMemo(() => {
        if (!theaterId) return null;
        return `${movieId}-${selectedDate}-${selectedTime}-${theaterId}`;
    }, [movieId, selectedDate, selectedTime, theaterId]);

    const {isSoldOut, availableCount, occupiedSeats} = useSeatAvailability(key || '');

    const selectedSeats = key ? selectedSeatsMap[key] || [] : [];

    const toggleSelectedSeat = useCallback(
        (seat: number) => {
            if (!key) return;

            useSeatsStore.setState((state) => {
                const current = state.selectedSeats[key] || [];
                const updated = current.includes(seat)
                    ? current.filter((s) => s !== seat)
                    : [...current, seat];

                return {
                    selectedSeats: {
                        ...state.selectedSeats,
                        [key]: updated,
                    },
                };
            });
        },
        [key]
    );

    if (!theaterId || !key) return null;

    if (isSoldOut) {
        return (
            <div className="text-center text-destructive font-semibold my-6">
                This showtime is sold out. Please select a different time.
            </div>
        );
    }

    return (
        <div className={classes.cinema}>
            <Screen/>

            <SeatRows
                rows={rows}
                seats={seats}
                seatsPerRow={seatsPerRow}
                selectedSeats={selectedSeats}
                currentOccupied={occupiedSeats}
                toggleSelectedSeat={(seat) => {
                    if (!occupiedSeats.includes(seat)) {
                        toggleSelectedSeat(seat);
                    }
                }}
                availableCount={availableCount}
            />

            <div>
                <p>Ticket Summary:</p>
                <p>Date: {selectedDate || 'Not selected'}</p>
                <p>Time: {selectedTime || 'Not selected'}</p>
                <p>Movie: {movie.title}</p>
                <p>Selected seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                <p>Total price: ${selectedSeats.length * 10}</p>
            </div>
        </div>
    )
}

const useStyles = tss.create({
    cinema: {
        maxWidth: '350px',
        marginInline: 'auto',
        marginBlockEnd: '18px',
        perspective: '400px',
        display: 'grid',
        placeItems: 'center',
        rowGap: '24px'
    },
    seatsContainer: {
        display: 'grid',
        gridTemplateColumns: '24px auto',
        columnGap: '8px',
    },
    rowNumbers: {
        display: 'grid',
        gridTemplateRows: 'repeat(8, min-content)',
        justifyContent: 'center'
    },
    rowNumber: {
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '24px',
        userSelect: 'none',
        color: '#333',
        textAlign: 'center'
    },
    availableSeats: {
        textAlign: "center",
        fontSize: "12px",
        color: "#666",
        marginTop: "8px",
    },
    seats: {
        display: 'grid',
        rowGap: '6px',
        columnGap: '6px',
        gridTemplateColumns: 'repeat(8, min-content)',
        alignItems: 'center',
    },
});
