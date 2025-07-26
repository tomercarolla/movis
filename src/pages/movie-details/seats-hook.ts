import {useSeatsStore} from "@/store";
import {useEffect, useState} from "react";

export const TOTAL_SEATS = 64;

function generateRandomOccupiedSeats(): number[] {
    const shouldBeSoldOut = Math.random() < 0.2; // 20% chance to be sold out

    if (shouldBeSoldOut) {
        return Array.from({length: TOTAL_SEATS}, (_, i) => i + 1);
    }

    const seatsCount = 4 + Math.floor(Math.random() * 8); // 4-12 seats
    const occupied = new Set<number>();

    while (occupied.size < seatsCount) {
        const seat = 1 + Math.floor(Math.random() * TOTAL_SEATS);

        occupied.add(seat);
    }

    return Array.from(occupied);
}

export function useSeatAvailability(key: string) {
    const {
        soldOutShows,
        occupiedSeats,
        setOccupiedSeats,
        markShowAsSoldOut,
    } = useSeatsStore((state) => ({
        soldOutShows: state.soldOutShows,
        occupiedSeats: state.occupiedSeats,
        setOccupiedSeats: state.setOccupiedSeats,
        markShowAsSoldOut: state.markShowAsSoldOut,
    }));

    const [generated, setGenerated] = useState(false);

    useEffect(() => {
        if (!occupiedSeats[key] && !generated) {
            const seats = generateRandomOccupiedSeats();

            setOccupiedSeats(key, seats);

            if (seats.length === TOTAL_SEATS) {
                markShowAsSoldOut(key);
            }

            setGenerated(true);
        }
    }, [key, occupiedSeats, generated, setOccupiedSeats, markShowAsSoldOut]);

    const occupied = occupiedSeats[key];
    const occupiedCount = occupied?.length ?? 0;
    const isSoldOut = soldOutShows.includes(key) || occupiedCount === TOTAL_SEATS;

    return {
        isSoldOut,
        occupiedCount: occupied?.length ?? 0,
        availableCount: TOTAL_SEATS - (occupied?.length ?? 0)
    };
}