import React, { useState, useEffect, useContext } from 'react'
import { Paper, Button, makeStyles } from '@material-ui/core'
import FileCopyRoundedIcon from '@material-ui/icons/FileCopyRounded';
import DetailsView from '../DetailView';
import { FormatDate } from '../utils';
import RootContext from '../context/RootContext';
const sqlite3 = window.nw.require('sqlite3').verbose();
const createCsvWriter = window.nw.require('csv-writer').createObjectCsvWriter;


const fs = window.nw.require('fs');
export default function View() {
    const context = useContext(RootContext)

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
            setBackups(res.sort((a, b) => new Date(b) - new Date(a)))
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
                        if (context.settings.date!== val.toString() ) {
                            return (<PreRecord name={val} key={idx} onChange={(val) => {
                                setdate(val);
                            }} />)
                        }

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
        {/* <Button variant="contained" color="secondary" size="small"
        onClick={() => {
            const filename = Buffer.from(props.name).toString('base64');
            const db = new sqlite3.Database(`./backup/${filename}.sqlite`, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the database.');
            });
            db.all("SELECT * from tmp", (err, row) => {
                if (err) {
                    throw err;
                }
                var myCsv = "Col1,Col2,Col3\nval1,val2,val3";

                window.open('data:text/csv;charset=utf-8,' + escape(myCsv));
            })
        }}
        >Upload File
        </Button> */}
        <input
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            nwsaveas={`Ebill_${props.name.toString()}.csv`}
            onChange={e => {
                const savepath = e.target.value.toString()
                if (savepath) {
                    const filename = Buffer.from(props.name).toString('base64');
                    const db = new sqlite3.Database(`./backup/${filename}.sqlite`, (err) => {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('Connected to the database.');
                    });
                    db.all("SELECT id,meter_no,amount,vat,rev,date from tmp", (err, row) => {
                        if (err) {
                            throw err;
                        }
                        const csvWriter = createCsvWriter({
                            path: savepath,
                            header: [
                                { id: 'id', title: 'id' },
                                { id: 'meter_no', title: 'meter_no' },
                                { id: 'amount', title: 'amount' },
                                // {id: 'vamount', title: 'vamount'},
                                { id: 'vat', title: 'vat' },
                                { id: 'rev', title: 'rev' },
                                { id: 'date', title: 'date' },
                            ]
                        });
                        csvWriter.writeRecords(row)
                            .then(() => {
                                console.log('Exported directory: ', savepath)
                            })
                    })
                }
            }}
        />
        <label htmlFor="raised-button-file">
            <Button variant="contained" component="span" color="secondary" size="small">
                Export
            </Button>
        </label>
    </Paper>)
}