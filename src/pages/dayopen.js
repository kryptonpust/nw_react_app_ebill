import React, { useState, useContext, useEffect } from 'react'
import { makeStyles, Button } from '@material-ui/core';
import RootContext from '../context/RootContext';
import Calendar from 'react-calendar';
import { NotificationManager } from 'react-notifications';
import 'react-calendar/dist/Calendar.css'
const fs = window.nw.require('fs');
const sqlite3 = window.nw.require('sqlite3').verbose();



export default function DayOpen() {
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            minHeight: '50vh',
            // backgroundColor: 'red'
            "& > *":
            {
                margin: "10px"
            }
        }
    }))()

    const [date, setDate] = useState(new Date());

    const [reopen, setReopen] = useState(false)

    const [filename, setFilename] = useState(null)

    useEffect(() => {
        async function getdata() {
            const filename = Buffer.from(date.toLocaleDateString()).toString('base64');
            setFilename(filename);
            if (fs.existsSync(window.path+`/backup/${filename}.sqlite`)) {
                setReopen(filename);
            }
        }
        getdata()
    }, [date])
    const context = useContext(RootContext)
    return (
        <div className={classes.root}>
            <Calendar
                value={date} />
            <Button variant="outlined" color="secondary"
                onClick={() => {
                        const val = date.toLocaleDateString();
                        window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [val, 'date'], (err) => {
                            if (err) {
                                NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                throw err;
                            }
                            // NotificationManager.success('Update Successful')
                            if (context.settings) {
                                context.updateSetting('date', val)
                            }
                        })

                        // window.db = new sqlite3.Database(`./backup/${filename}.sqlite`, (err) => {
                        //     if (err) {
                        //         console.error(err.message);
                        //     }
                        //     console.log('Connected to the backup database.');
                        //     // if (context.reloadSettings) {
                        //     //     context.reloadSettings()
                        //     // }else{
                        //     //     throw Error('Unable to Reload Settings')
                        //     // }
                        // });
                }}
            >{reopen ? 'Reopen This Day' : 'Open A New Day'}</Button>
            {/* {reopen  && <Button variant="outlined" color="secondary"
                onClick={() => {
                    
                }}
            >Reopen This Day</Button>} */}
        </div>
    )
}
