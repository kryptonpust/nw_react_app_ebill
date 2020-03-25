import React, { useState, useEffect, useContext } from 'react'
import { Paper, Button, makeStyles } from '@material-ui/core'
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import DetailsView from '../DetailView';
import { FormatDate } from '../utils';
import RootContext from '../context/RootContext';

const fs = window.nw.require('fs');
export default function View() {

    const [backups, setBackups] = useState([])
    const [date, setdate] = useState('');
    useEffect(() => {
        async function getdata() {
            if (!fs.existsSync('./backup')) {
                fs.mkdirSync('./backup')
            }
            const res = await fs.readdirSync('./backup').map((val) => {
                const temp = Buffer.from(val.split('.')[0], 'base64').toString('ascii');
                return temp;
            });
            setBackups(res)
        }
        getdata()
    }, [])

    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            "@media print":
            {
                width: '100%'
            }
        },
        paper: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '20px',
            margin: '20px',
            minHeight: '50vh',
            minWidth: '80vw',
        },
        proot: {
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid red',
            flexGrow: 1,
            width: '100%',
            margin: '50px',

        },
        header: {
            background: 'grey',
            fontSize: '2rem',
            fontWeight: 'bold',
            padding: '10px'
        },
        records: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: '10px',
            // border: '2px solid aliceblue',
        },
        backbtn: {
            margin: '1rem',
            "@media print":
            {
                display: 'none'
            }
        }
    }))()
    return (<div className={classes.root}>
        {date && <Button className={classes.backbtn} variant="contained" color="secondary" onClick={() => {
            setdate('')
        }}>Back</Button>}
        {date && <DetailsView date={date} />}
        {!date && <Paper className={classes.paper}>
            <div className={classes.proot}>
                <div className={classes.header}>
                    Previous Records
                </div>
                <div className={classes.records}>
                    {backups.map((val, idx) => {
                        return (<PreRecord name={val} key={idx} onChange={(val) => {
                            setdate(val);
                        }} />)
                    })}
                </div>
            </div>
        </Paper>}
    </div>)
}


const PreRecord = (props) => {
    const context = useContext(RootContext)
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '10px',
            padding: '10px',
            "& > *":
            {
                margin: theme.spacing(1),
            }
        },
    }))()
    return (<Paper className={classes.root} elevation={3}>
        <FileCopyRoundedIcon fontSize="large" />
        <div>{props.name ? FormatDate(props.name, context.settings.date_format) : 'undefined'}</div>
        <Button variant="contained" color="primary" size="small" onClick={() => {
            props.onChange(props.name);
        }}>Open</Button>
    </Paper>)
}