import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    pushbtn: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        "&:hover":
        {
            boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
        }
    },
}));

let time;

export default function PushButton(props) {
    const [locked, setLocked] = React.useState(false);
    const [timer, setTimer] = React.useState(null)
    const handleButtonPress = function (e) {
        time = Date.now();
        setTimer(setTimeout(() => {
            setLocked(true)
            if (props.onLongClick) {
                props.onLongClick()
            }
        }, props.timeout ? parseFloat(props.timeout) : 1000))
    };
    const handleButtonRelease = function (e) {
        const elapsed = Date.now() - time
        if (elapsed < (props.timeout ? parseFloat(props.timeout) : 1000)) {
            clearTimeout(timer)
            if (props.singleClick) {
                props.singleClick()
            }
            if (locked) {
                setLocked(!locked)
            }
        }
    };

    const classes = useStyles();

    return (
        <Button
            variant="outlined"
            className={classes.pushbtn}
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
        >
            {locked ? "Unlock" : "Push"}
        </Button>
    );
}
