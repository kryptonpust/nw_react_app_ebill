import React, { forwardRef, useImperativeHandle } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
const styledBy = (property, mapping) => (props) => mapping[props[property]];

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
        },
    },
    pushedbtn: {
        background: 'linear-gradient(90deg, #c21500, #ffc500)',
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
    animate: {
        background: 'linear-gradient(45deg, #DCE35B 30%, #45B649 90%)',
        boxShadow: '',
        animation: `$test 500ms linear infinite`
    },

    "@keyframes test": {
        "0%": {
            transform: "scale(1) rotate(0deg)"
        },
        "25%": {
            transform: "rotate(5deg)"
        },
        "50%": {
            transform: "rotate(-5deg)"
        },
        "75%": {
            transform: "rotate(5deg)"
        },
        "100%": {
            transform: "scale(1) rotate(0deg)"
        }
    }
}));

let time;
let longpress;
let singletimer;

export default forwardRef((props, ref) => {
    const [locked, setLocked] = React.useState(false);
    const [timer, setTimer] = React.useState(null)
    const [animation, setAnimation] = React.useState(false)
    useImperativeHandle(ref, () => ({
        animate() {
            setAnimation(true);
            setTimeout(()=>{
                setAnimation(false);
            },500)
        },
        activeLock() {
            setLocked(old => !old)
            setAnimation(true)
            if (props.onLongClick) {
                props.onLongClick()
            }
            setAnimation(false);
        },
        toggle() {
            console.log('from toogle')
            if (singletimer) {
                clearTimeout(singletimer);
                singletimer = setTimeout(() => {
                    clearTimeout(longpress)
                    if (props.singleClick) {
                        props.singleClick()
                    }
                    if (locked) {
                        setLocked(!locked)
                    }
                    singletimer = null;
                    longpress = null;
                    setAnimation(false)
                }, 50)
            }
            if (!longpress) {
                setAnimation(true)
                longpress = setTimeout(() => {
                    setLocked(old => !old)
                    console.log('performing long click')
                    if (props.onLongClick) {
                        props.onLongClick()
                    }
                    setAnimation(false);
                    if (singletimer) {
                        clearTimeout(singletimer)
                        singletimer = null;
                    }
                    setTimeout(() => {
                        longpress = null
                    }, 1000)
                }, props.timeout ? parseFloat(props.timeout) : 1000)
                singletimer = setTimeout(() => {
                    clearTimeout(longpress)
                    if (props.singleClick) {
                        props.singleClick()
                    }
                    if (locked) {
                        setLocked(!locked)
                    }
                    singletimer = null;
                    longpress = null;
                    setAnimation(false)
                }, 50)
            }
        }
    }));

    const handleButtonPress = function (e) {
        console.log('button pressed')
        time = Date.now();
        setAnimation(true);
        if (!timer) {
            setTimer(setTimeout(() => {
                setLocked(old => !old)
                if (props.onLongClick) {
                    props.onLongClick()
                }
                setTimer(null)
                setAnimation(false);
                if (singletimer) {
                    clearTimeout(singletimer)
                    singletimer = null;
                }
                setTimeout(() => {
                    longpress = null
                }, 1000)
            }, props.timeout ? parseFloat(props.timeout) : 1000))
        }
    };
    const handleButtonRelease = function (e) {
        const elapsed = Date.now() - time
        if (elapsed < (props.timeout ? parseFloat(props.timeout) : 1000)) {
            clearTimeout(timer)
            setTimer(null);
            if (props.singleClick) {
                props.singleClick()
            }
            if (locked) {
                setLocked(!locked)
            }
        }
        setAnimation(false)
    };

    const classes = useStyles({ anim: 'red', bg: 'red' });

    return (
        <Button
            ref={ref}
            variant="outlined"
            className={`${(locked ? classes.pushedbtn : classes.pushbtn)} ${animation ? classes.animate : null}`}
            onMouseDown={handleButtonPress}
            onMouseUp={handleButtonRelease}
        >
            {locked ? "Unlock" : "Push"}
        </Button>
    );
})
