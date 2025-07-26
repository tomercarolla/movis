import {create} from "zustand";
import {persist} from "zustand/middleware";

type SeatKey = string; // format: movieId-date-time-theaterId

type SeatsStore = {
    occupiedSeats: Record<SeatKey, number[]>;
    selectedSeats: Record<SeatKey, number[]>;

    setOccupiedSeats: (key: SeatKey, seats: number[]) => void;
    setSelectedSeats: (key: SeatKey, seats: number[]) => void;
    getSelectedSeats: (key: SeatKey) => number[];
}

export const useSeatsStore = create<SeatsStore>()(
    persist((set, get) => ({
            occupiedSeats: {},
            selectedSeats: {},

            setOccupiedSeats: (key, seats) => {
                set((state) => ({
                    occupiedSeats: {
                        ...state.occupiedSeats,
                        [key]: seats,
                    },
                }));
            },

            setSelectedSeats: (key, seats) => {
                set((state) => ({
                    selectedSeats: {
                        ...state.selectedSeats,
                        [key]: seats,
                    },
                }))
            },

            getSelectedSeats: (key) => get().selectedSeats[key] || [],
        }),
        {
            name: 'seats-storage',
            partialize: (state) => ({
                occupiedSeats: state.occupiedSeats,
                selectedSeats: state.selectedSeats
            })
        }
    )
)