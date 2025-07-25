import {create} from "zustand";
import {persist} from "zustand/middleware";

type SeatKey = string; // format: movieId-date-time-theaterId

type SeatsStore = {
    occupiedSeats: Record<SeatKey, number[]>;
    selectedSeats: Record<SeatKey, number[]>;
    soldOutShows: SeatKey[];

    setOccupiedSeats: (key: SeatKey, seats: number[]) => void;
    toggleSelectedSeat: (key: SeatKey, seat: number) => void;
    markShowAsSoldOut: (key: SeatKey) => void;

    getSelectedSeats: (key: SeatKey) => number[];
    getSelectedCountByMovie: (movieId: number) => number;
}

export const useSeatsStore = create<SeatsStore>()(
    persist((set, get) => ({
            occupiedSeats: {},
            selectedSeats: {},
            soldOutShows: [],

            setOccupiedSeats: (key, seats) => {
                set((state) => ({
                    occupiedSeats: {
                        ...state.occupiedSeats,
                        [key]: seats,
                    },
                }));
            },

            toggleSelectedSeat: (key, seat) => {
                const currentSeat = get().getSelectedSeats(key);
                const isSelected = currentSeat.includes(seat);

                const updateSeat = isSelected ? currentSeat.filter((s) => s !== seat) : [...currentSeat, seat];

                set((state) => ({
                    ...state.selectedSeats,
                    [key]: updateSeat
                }))
            },

            markShowAsSoldOut: (key) => {
                set((state) => ({
                    soldOutShows: [...new Set([...state.soldOutShows, key])]
                }))
            },

            getSelectedSeats: (key) => get().selectedSeats[key] || [],

            getSelectedCountByMovie: (movieId) => {
                return Object.entries(get().selectedSeats)
                    .filter(([key]) => key.startsWith(`${movieId}-`))
                    .reduce((acc, [_, seats]) => acc + seats.length, 0);
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