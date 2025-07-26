import {Screen} from "@/pages/movie-details/components/seat-map/Screen.tsx";
import {TOTAL_SEATS, useSeatAvailability} from "@/pages/movie-details/seats-hook.ts";
import {useCallback, useMemo} from "react";
import {useSeatsStore} from "@/store";
import {SeatRows} from "@/pages/movie-details/components/seat-map/SeatRows.tsx";
import {tss} from "tss-react";
import type { Showtime } from "@/types/movie";

const seats = Array.from({length: TOTAL_SEATS}, (_, i) => i + 1);
const seatsPerRow = 8;
const totalRows = TOTAL_SEATS / seatsPerRow;
const rows = Array.from({length: totalRows}, (_, i) => i + 1);

type SeatMapProps = {
    movieId: number;
    selectedDate: string;
    selectedTime: string;
    showTimes: Showtime[];
};

export function SeatMap({movieId, selectedDate, selectedTime, showTimes}: SeatMapProps) {
    const {setSelectedSeats} = useSeatsStore();
    const selectedSeatsMap = useSeatsStore((s) => s.selectedSeats);

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
            const isSelected = selectedSeats.includes(seat);
            const updated = isSelected
                ? selectedSeats.filter((s) => s !== seat)
                : [...selectedSeats, seat];
            setSelectedSeats(key, updated);
        },
        [key, setSelectedSeats]
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
