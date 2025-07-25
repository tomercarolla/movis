import {create} from "zustand";
import {persist} from "zustand/middleware";

const TOTAL_SEATS = 20;

const generateRandomOccupiedSeats = (): number[] => {
    const seatCount = 4 + Math.floor(Math.random() * 5); // 4-8 seats
    const occupied = new Set<number>();

    while (occupied.size < seatCount) {
        const seat = 1 + Math.floor(Math.random() * TOTAL_SEATS);

        occupied.add(seat);
    }

    return Array.from(occupied);
}

type SeatKey = string; // format: movieId-date-time-theaterId

type SeatsStore = {
    occupiedSeats: Record<SeatKey, number[]>;
    selectedSeats: Record<SeatKey, number[]>;
    soldOutShows: SeatKey[];

    getOccupiedSeats: (key: SeatKey) => number[];
    toggleSelectedSeat: (key: SeatKey, seat: number) => void;

    getSelectedSeats: (key: SeatKey) => number[];
    getSelectedCountByMovie: (movieId: number) => number;
    markShowAsSoldOut: (key: SeatKey) => void;
}

export const useSeatsStore = create<SeatsStore>()(
    persist((set, get) => ({
            occupiedSeats: {},
            selectedSeats: {},
            soldOutShows: [],

            getOccupiedSeats: (key) => {
                const isSoldOut = get().soldOutShows.includes(key);

                if (isSoldOut) {
                    return Array.from({length: TOTAL_SEATS}, (_, i) => i + 1)
                }

                const existingSeats = get().occupiedSeats[key];

                if (existingSeats) return existingSeats;

                const generateOccupiedSeats = generateRandomOccupiedSeats();

                set((state) => ({
                    occupiedSeats: {
                        ...state.occupiedSeats,
                        [key]: generateOccupiedSeats
                    }
                }))

                return generateOccupiedSeats;
            },

            getSelectedSeats: (key) => get().selectedSeats[key] || [],

            toggleSelectedSeat: (key, seat) => {
                const currentSeat = get().getSelectedSeats(key);
                const isSelected = currentSeat.includes(seat);

                const updateSeat = isSelected ? currentSeat.filter((s) => s !== seat) : [...currentSeat, seat];

                set((state) => ({
                    ...state.selectedSeats,
                    [key]: updateSeat
                }))
            },

            getSelectedCountByMovie: (movieId) => {
                return Object.entries(get().selectedSeats)
                    .filter(([key]) => key.startsWith(`${movieId}-`))
                    .reduce((acc, [_, seats]) => acc + seats.length, 0);
            },

            markShowAsSoldOut: (key) => {
                set((state) => ({
                    soldOutShows: [...new Set([...state.soldOutShows, key])]
                }))
            }
        }),
        {
            name: 'seats-storage',
            partialize: (state) => ({
                selectedSeats: state.selectedSeats,
                soldOutShows: state.soldOutShows
            })
        }
    )
)