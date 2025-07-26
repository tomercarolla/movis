import {keyframes, tss} from "tss-react";

type SeatRowsProps = {
    rows: number[];
    seats: number[];
    seatsPerRow: number;
    selectedSeats: number[];
    currentOccupied: number[];
    toggleSelectedSeat: (seat: number) => void;
    availableCount: number;
};

export function SeatRows({
                             rows,
                             seats,
                             seatsPerRow,
                             selectedSeats,
                             currentOccupied,
                             toggleSelectedSeat,
                             availableCount,
                         }: SeatRowsProps) {
    const {classes} = useStyles();

    return (
        <>
            <div className={classes.seatsContainer}>
                <div className={classes.rowNumbers}>
                    {rows.map((row) => (
                        <div key={row} className={classes.rowNumber}>
                            {row}
                        </div>
                    ))}
                </div>

                <div className={classes.seats}>
                    {seats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat);
                        const isOccupied = currentOccupied.includes(seat);

                        return (
                            <span
                                tabIndex={0}
                                className={`${classes.seat} ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
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
                    })}
                </div>
            </div>

            <p className={classes.availableSeats}>
                {availableCount} seats available
            </p>
        </>
    );
}

const seatAnimation = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
        visibility: visible;
    }

    100% {
        transform: scale(3);
        opacity: 0;
    }
`;

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
    seat: {
        '--seat-color': '#626262',
        '--seat-hover-color': '#c1cec5',
        '--seat-selected-color': '#7bc47f',
        '--seat-occupied-color': '#cfcfcf',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--seat-color)',
        width: '20px',
        height: '18px',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        transition: 'transform .3s ease-in-out',
        position: 'relative',
        top: '1px',
        fontSize: '10px',
        color: '#fff',

        ['&.selected']: {
            background: 'var(--seat-selected-color)',
        },
        ['&.selected::after']: {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '20px',
            height: '18px',
            borderRadius: '100%',
            background: 'transparent',
            border: '1px solid var(--seat-selected-color)',
            animation: `${seatAnimation} .8s`,
            visibility: 'hidden',
        },

        ['&.occupied']: {
            background: 'var(--seat-occupied-color)',
        },
        ['&:nth-of-type(8n + 2), &:nth-of-type(8n + 6)']: {
            marginInlineEnd: '12px'
        },
        ['&:not(.occupied):hover, &:not(.occupied):focus']: {
            cursor: 'pointer',
            background: 'var(--seat-hover-color)',
            transform: 'scale(1.2)',
        },
    }
});