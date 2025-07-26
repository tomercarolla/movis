import {tss} from "tss-react";

export function Screen() {
    const {classes} = useStyles();

    return <div className={classes.screen}/>
}

const useStyles = tss.create({
    screen: {
        height: '70px',
        background: 'white',
        width: '100%',
        transform: 'rotateX(-30deg) scale(1.1)',
        boxShadow: '0 3px 10px 2px'
    }
});