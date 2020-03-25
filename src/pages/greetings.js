import React from 'react'
import { makeStyles, Grow, Slide } from '@material-ui/core'
import bg from '../images/bg.jpg'
import { Link } from 'react-router-dom'

export default function Greetings() {
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            flexDirection: 'column',
            overflow: 'hidden',

        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexGrow: 1
        },
        content: {
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexGrow: 1,

        },
        btn: {
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            textDecoration: 'none',
            height: '30vh',
            textAlign: 'center',
            fontSize: '5rem',
            padding: '10px',
            borderRadius: '5px',
            fontWeight: "bold",
            // border: '2px solid red',
            background: 'rgba(0,0,0,0.3)',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'serif',
            boxShadow: '0 1px 2px 4px rgba(255, 255, 255, 0.8)',
            " &:hover": {
                boxShadow: '0 2px 4px 8px #ff9800',

            }
        },
        footer:
        {
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            // flexGrow: 1,
            marginBottom: '10rem',
            "& > div":
            {
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                fontSize: '2rem',
                padding: '10px',
                backdropFilter: 'blur(15px)',
                // border: '1px solid red',
                // color: 'red'
            },
        },
        info: {
            position: 'fixed',
            backdropFilter: 'blur(20px)',

            "& > * ":
            {
                textAlign: 'center',

            }
        }
    }))()
    return (
        <div className={classes.root}>
            <div className={classes.header}>

            </div>
            <div className={classes.content}>
                <Grow in timeout={2000}>
                    <Link to="/home" className={classes.btn}>
                        Daily <br></br> Electricity Bill Register
                </Link>
                </Grow>

            </div>
            <div className={classes.footer}>
                <Slide direction="up" in timeout={2000}>
                    <div>
                        A Concept of <br></br> Electriciy Bill Calculation
                </div>
                </Slide>
            </div>

            <div className={classes.info} style={{ left: 0, bottom: 0 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    INSPIRED BY
                </div>
                <div style={{ color: 'red', fontSize: '1.2rem' }}>
                    Md. Maidul islam (Mahid)
                    
                    
                </div>
                <div>
                    2nd Officer
                </div>
                <div>
                RAKUB, Mollaparahat br.
                </div>
                <br></br>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    INSPIRED BY
                </div>
                <div style={{ color: 'red', fontSize: '1.2rem' }}>
                    Md. Sarwar Hossain
                </div>
                <div>
                    Assistant Professor
                </div>
                <div>
                    Dept of
                </div>
                <div>
                    Information and Communication Engineering(ICE)
                </div>
                <div>
                    Pabna University of Science and Technology(PUST)
                </div>

            </div>
            <div>
                <div className={classes.info} style={{ right: 0, bottom: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        DEVELOPED BY
                </div>
                    <div style={{ color: '#22e622', fontSize: '1.2rem' }}>
                        NAFIUL RONY
                </div>
                    <div>Email: nafiul.ice.pust@gmail.com</div>
                </div>
            </div>
        </div>)
}