import {Screen} from "@/pages/movie-details/components/seat-map/Screen.tsx";
import {keyframes, tss} from "tss-react";
import {TOTAL_SEATS} from "@/pages/movie-details/seats-hook.ts";
import {useState} from "react";
import {clsx} from "clsx";

const seats = Array.from({length: TOTAL_SEATS}, (_, i) => i + 1);
const seatsPerRow = 8;
const totalRows = TOTAL_SEATS / seatsPerRow;
const rows = Array.from({length: totalRows}, (_, i) => i + 1);

export function SeatMap() {
    const {classes} = useStyles();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    function handleSelectedState(seat) {
        console.log('handleSelectedState seat ', seat);
        const isSelected = selectedSeats.includes(seat);
        if (isSelected) {
            setSelectedSeats(
                selectedSeats.filter((selectedSeat) => selectedSeat !== seat)
            );
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    }

    console.log('selectedSeats ', selectedSeats)

    return (
        <div className={classes.cinema}>
            <Screen/>

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
                        const seatNumberInRow = ((seat - 1) % seatsPerRow) + 1;
                        const isSelected = selectedSeats.includes(seat);
                        const isOccupied = occupiedSeats.includes(seat);

                        return (
                            <span
                                key={seat}
                                tabIndex={0}
                                className={clsx(classes.seat, {
                                    selected: isSelected,
                                    occupied: isOccupied,
                                })}
                                onClick={() => {
                                    if (!isOccupied) {
                                        handleSelectedState(seat)
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (!isOccupied && e.key === 'Enter') {
                                        handleSelectedState(seat)
                                    }
                                }}
                            >
                            {seatNumberInRow}
                        </span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
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
