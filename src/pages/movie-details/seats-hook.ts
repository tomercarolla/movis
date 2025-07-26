import {useSeatsStore} from "@/store";
import {useEffect, useRef} from "react";

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
    const occupied = useSeatsStore((s) => s.occupiedSeats[key] || []);
    const setOccupiedSeats = useSeatsStore((s) => s.setOccupiedSeats);

    const generatedKeysRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!key || generatedKeysRef.current.has(key)) return;

        if (occupied.length === 0) {
            const seats = generateRandomOccupiedSeats();
            setOccupiedSeats(key, seats);
        }

        generatedKeysRef.current.add(key);
    }, [key, occupied.length, setOccupiedSeats]);

    return {
        isSoldOut: occupied.length === TOTAL_SEATS,
        occupiedCount: occupied.length,
        availableCount: TOTAL_SEATS - occupied.length,
        occupiedSeats: occupied,
    };
}