import {tss} from "tss-react";
import {clsx} from "clsx";


type SeatProps = {
    seat: number;
    isSelected: boolean;
    isOccupied: boolean;
    toggleSelectedSeat: (seat: number) => void;
    seatsPerRow: number;
};

export function Seat({
                         seat,
                         isSelected,
                         isOccupied,
                         toggleSelectedSeat,
                         seatsPerRow,
                     }: SeatProps) {
    const {classes} = useStyles();

    return (
        <span
            tabIndex={0}
            className={clsx(classes.seat, {
                [classes.selected]: isSelected,
                [classes.occupied]: isOccupied,
            })}
            onClick={() => !isOccupied && toggleSelectedSeat(seat)}
            onKeyDown={(e) => {
                if (!isOccupied && e.key === "Enter") {
                    toggleSelectedSeat(seat);
                }
            }}
        >
            {((seat - 1) % seatsPerRow) + 1}
        </span>
    );
}

const useStyles = tss.create({
    seatsContainer: {
        display: "grid",
        gridTemplateColumns: "24px auto",
        columnGap: "8px",
    },
    rowNumbers: {
        display: "grid",
        gridTemplateRows: "repeat(8, min-content)",
        justifyContent: "center",
    },
    rowNumber: {
        fontSize: "14px",
        fontWeight: "bold",
        lineHeight: "24px",
        userSelect: "none",
        color: "#333",
        textAlign: "center",
    },
    seats: {
        display: "grid",
        rowGap: "6px",
        columnGap: "6px",
        gridTemplateColumns: "repeat(8, min-content)",
        alignItems: "center",
    },
    seat: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#626262",
        width: "20px",
        height: "18px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        transition: "transform .3s ease-in-out",
        fontSize: "10px",
        color: "#fff",

        ['&:hover:not(.occupied)']: {
            cursor: "pointer",
            background: "#c1cec5",
            transform: "scale(1.2)",
        },
    },
    selected: {
        background: "#7bc47f",
    },
    occupied: {
        background: "#cfcfcf",
    },
    availableSeats: {
        textAlign: "center",
        fontSize: "12px",
        color: "#666",
        marginTop: "8px",
    },
});