import { Backdrop, Button, CircularProgress, makeStyles, Paper, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';

import RootContext from '../context/RootContext';

const fs = window.nw.require('fs');
const sqlite3 = window.nw.require('sqlite3').verbose();

export default function CloseDay() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState(0);
    const context = useContext(RootContext);
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            " & >* ": {
                margin: "20px"
            }
        },
        paper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            minWidth: '50vw',
            minHeight: '40vh',
            padding: '20px',
            " & >* ": {
                margin: "5px"
            }
        },
        btn: {
            background: 'linear-gradient(45deg, #2196F3 0%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            color: 'white',
            " &: hover": {
                boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)',

            }
        },
        big:
        {
            fontSize: '5rem'
        }
    }))()
    return (<div className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
            <h1>Today's Grand Total</h1>
            <TextField variant="outlined" type="number"
                onChange={(event) => {
                    setData(event.target.value)
                }}
                placeholder={`${context.settings.gtotal}`}
                inputProps={{ style: { textAlign: 'center' } }}
                InputProps={{
                    style: { color: 'red', fontSize: '2rem' },

                }}
            />
            {<Button className={classes.btn} variant="contained"
                disabled={parseFloat(context.settings.gtotal) !== parseFloat(data)}
                onClick={async () => {
                    setShow(true)
                    if (!fs.existsSync('./backup')) {
                        fs.mkdirSync('./backup')
                    }
                    if (context.reload) {
                        window.db.close()
                        window.nw.Window.get().reload()

                    } else {
                        window.db.close()
                        const filename = Buffer.from(context.settings.date).toString('base64');
                        fs.copyFile('./database.sqlite', `./backup/${filename}.sqlite`, (err) => {
                            if (err) throw err;
                            console.log('source.db was copied to destination.db');

                            const db = new sqlite3.Database('./database.sqlite', (err) => {
                                if (err) {
                                    console.error(err.message);
                                }
                                console.log('Connected to the database.');
                                db.serialize(() => {
                                    db.run(`UPDATE settings SET val=? WHERE name=?`, [null, 'date'])
                                        .run(`DELETE FROM tmp`, (err, row) => {
                                            window.nw.Window.get().reload()

                                        })
                                })
                            });


                        });
                    }

                }}
                size="large"
            >Close This Day</Button>}
            <Backdrop style={{ zIndex: 100 }} open={show}>
                <CircularProgress />
            </Backdrop>
        </Paper>
    </div>)
}