import { Screen } from '@/pages/movie-details/components/seat-map/Screen.tsx';
import { SeatRows } from '@/pages/movie-details/components/seat-map/SeatRows.tsx';
import {
  TOTAL_SEATS,
  useSeatAvailability,
} from '@/pages/movie-details/seats-hook.ts';
import { useSeatsStore } from '@/store';
import type { Movie, Showtime } from '@/types/movie';
import { useCallback, useMemo } from 'react';
import { tss } from 'tss-react';

const SEATS_PER_ROW = 8;
const TOTAL_ROWS = TOTAL_SEATS / SEATS_PER_ROW;
const TICKET_PRICE = 10;

const seats = Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1);
const rows = Array.from({ length: TOTAL_ROWS }, (_, i) => i + 1);

type SeatMapProps = {
  movie: Movie;
  selectedDate: string;
  selectedTime: string;
  showTimes: Showtime[];
};

export function SeatMap({
  movie,
  selectedDate,
  selectedTime,
  showTimes,
}: SeatMapProps) {
  const selectedSeatsMap = useSeatsStore((s) => s.selectedSeats);
  const setSelectedSeats = useSeatsStore((s) => s.setSelectedSeats);
  const movieId = movie.id;
  const { classes } = useStyles();

  const theaterId = useMemo(() => {
    return (
      showTimes.find(
        (s) =>
          s.movieId === movieId &&
          s.date === selectedDate &&
          s.time === selectedTime,
      )?.theaterId ?? null
    );
  }, [showTimes, movieId, selectedDate, selectedTime]);

  const key = useMemo(() => {
    if (!theaterId) return null;
    return `${movieId}-${selectedDate}-${selectedTime}-${theaterId}`;
  }, [movieId, selectedDate, selectedTime, theaterId]);

  const { isSoldOut, availableCount, occupiedSeats } = useSeatAvailability(
    key || '',
  );

  const selectedSeats = useMemo(() => {
    return key ? selectedSeatsMap[key] || [] : [];
  }, [key, selectedSeatsMap]);

  const totalPrice = useMemo(() => {
    return selectedSeats.length * TICKET_PRICE;
  }, [selectedSeats.length]);

  const toggleSelectedSeat = useCallback(
    (seat: number) => {
      if (!key) return;

      const current = selectedSeatsMap[key] || [];
      const updated = current.includes(seat)
        ? current.filter((s) => s !== seat)
        : [...current, seat];

      setSelectedSeats(key, updated);
    },
    [key, selectedSeatsMap, setSelectedSeats],
  );

  const handleSeatToggle = useCallback(
    (seat: number) => {
      if (!occupiedSeats.includes(seat)) {
        toggleSelectedSeat(seat);
      }
    },
    [occupiedSeats, toggleSelectedSeat],
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
      <Screen />

      <SeatRows
        rows={rows}
        seats={seats}
        seatsPerRow={SEATS_PER_ROW}
        selectedSeats={selectedSeats}
        currentOccupied={occupiedSeats}
        toggleSelectedSeat={handleSeatToggle}
        availableCount={availableCount}
      />

      <div>
        <p>Ticket Summary:</p>
        <p>Date: {selectedDate || 'Not selected'}</p>
        <p>Time: {selectedTime || 'Not selected'}</p>
        <p>Movie: {movie.title}</p>
        <p>
          Selected seats:{' '}
          {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
        </p>
        <p>Total price: ${totalPrice}</p>
      </div>
    </div>
  );
}

const useStyles = tss.create({
  cinema: {
    maxWidth: '350px',
    marginInline: 'auto',
    marginBlockEnd: '18px',
    perspective: '400px',
    display: 'grid',
    placeItems: 'center',
    rowGap: '24px',
  },
  seatsContainer: {
    display: 'grid',
    gridTemplateColumns: '24px auto',
    columnGap: '8px',
  },
  rowNumbers: {
    display: 'grid',
    gridTemplateRows: 'repeat(8, min-content)',
    justifyContent: 'center',
  },
  rowNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '24px',
    userSelect: 'none',
    color: '#333',
    textAlign: 'center',
  },
  availableSeats: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  seats: {
    display: 'grid',
    rowGap: '6px',
    columnGap: '6px',
    gridTemplateColumns: 'repeat(8, min-content)',
    alignItems: 'center',
  },
});
