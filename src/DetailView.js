import { Backdrop, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

import RootContext from './context/RootContext';
import logo from './images/logo.svg';
import { FormatDate } from './utils';

const sqlite3 = window.nw.require('sqlite3').verbose();

const paper = {
    'A4': {
        width: '210mm',
        height: '297mm',
    },
    'Legal': {
        width: '216mm',
        height: '356mm',
    }
}

function gendata(size) {
    let data = []
    for (let i = 0; i < size; i++) {
        // temp.push({ id: i + 100000, meter_no: i + 100000, amount: i + 100000, vat: i + 100000, rev: i + 100000 })
        data.push({ id: i, meter_no: i, amount: i, vat: i, rev: i })
    }
    return data;
}

function getpages(val, row_per_table = 40, table_per_page = 3) {
    const data = [...val]
    const temp1 = [], temp2 = []
    const pages = [], topSheet = [];
    const summery = { id: 0, amount: 0, vamount: 0, vat: 0, rev: 0, no_of_bill: 0 };
    let id = 1;
    while (data.length) {
        const values = data.splice(0, row_per_table);
        let amount = 0, vamount = 0, vat = 0, rev = 0;
        values.forEach((data) => {
            amount += data.amount;
            vamount += data.vamount;
            vat += data.vat;
            rev += data.rev;
            summery.no_of_bill++;
        })
        temp1.push({ id, values, amount, vamount, vat, rev })
        summery.id++;
        summery.amount += amount;
        summery.vamount += vamount;
        summery.vat += vat;
        summery.rev += rev;
        temp2.push({ id, amount, vamount, vat, rev })
        id++;
    }

    while (temp1.length) {
        pages.push(temp1.splice(0, table_per_page))
    }

    while (temp2.length) {
        topSheet.push(temp2.splice(0, 20))
    }

    return { pages, topSheet, summery }
}


export default function DetailsView(props) {
    const context = React.useContext(RootContext)
    const [isLoaing, setIsLoading] = useState(true);
    const [data, setData] = useState([])
    const [settings, setSettings] =
        useState(
            {
                paper_type: 'A4',
                font_size: 17,
                table_per_page: 3,
                row_per_table: 40,
                date: '',
            }
        )

    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            "@media print":
            {
                display: 'block',
                width: '100%',
            }
        },
        pagecontainer: {
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            "& > *": {
                marginBottom: '10px',
            },
            alignItems: 'center'
        },
        page: {
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            border: '1px solid sienna',
            width: paper[settings.paper_type].width,
            height: paper[settings.paper_type].height,
            backgroundColor: 'white',
            // margin: '10mm',
            "@media print":
            {
                width: 'auto',
                height: 'auto',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
                border: 'none',
            }
        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'aliceblue',
            position: 'relative',
            flexDirection: 'column',
            marginBottom: '2px'
        },
        content: {
            display: 'flex',
            /* background-color: red; */
            minHeight: '10px',
            justifyContent: 'center',
            flex: settings.table_per_page,
            "& > table": {
                border: '1px solid',
                borderCollapse: 'collapse',

            },
            "& > table > thead > tr > th": {
                border: '1px solid',
                fontSize: `${settings.font_size - 3}px`,
            },
            "& > table > tbody > tr > td": {
                border: '1px solid',
                fontSize: `${settings.font_size}px`,
                textAlign: 'center',
            },
            "& > table > tfoot > tr > td": {
                border: '1px solid',
                fontSize: `${settings.font_size}px`,
                textAlign: 'center',
                fontWeight: 'bold'
            }
        },

        logos: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '60px',
            "& > img": {
                width: '60px',
                height: '60px'
            }
        },
        titles: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }))();



    useEffect(() => {
        async function getdata() {
            if (props.date) {
            setSettings({...context.settings,date: props.date})

                const filename = Buffer.from(props.date).toString('base64');
                const db = new sqlite3.Database(window.path+`/backup/${filename}.sqlite`, (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Connected to the database.');
                });
                db.all("SELECT * from tmp", (err, row) => {
                    if (err) {
                        throw err;
                    }
                    db.close();
                    setData(row)
                    setIsLoading(false)
                })
            } else {
                setSettings(context.settings)
                window.db.all(`SELECT * from tmp`, (err, row) => {
                    if (err) {
                        NotificationManager.error('Failed!', 'Failed to retrive Table Data')
                        throw err;
                    }
                    // NotificationManager.info('Query Successful')
                    // setData(gendata(2200))
                    setData(row)
                    setIsLoading(false)

                })
            }
        }
        getdata()
    }, [context.settings, props.date])

    const shortcut = new window.nw.Shortcut({ key: "Ctrl+P" })



    useEffect(() => {
        window.nw.App.registerGlobalHotKey(shortcut);
        console.log('Printing Hot key registered')
        shortcut.on('active', function () {
            const win = window.nw.Window.get();
            win.print({ "autoprint": "false", "headerFooterEnabled": "false", "marginsType": 2 })
        });

        shortcut.on('failed', function (msg) {
            console.log(msg);
        });
        return function cleanup() {
            window.nw.App.unregisterGlobalHotKey(shortcut);
        }
    }, [shortcut])
    const pagedata = React.useMemo(() => {
        const val = getpages(data, settings.row_per_table, settings.table_per_page)
        return val;

    }, [data, settings.row_per_table, settings.table_per_page])

    console.log("Is loading value", isLoaing)
    if (isLoaing) {
        return (<Backdrop className={classes.backdrop} open={isLoaing}>
            <CircularProgress color="inherit" />
        </Backdrop>)
    } else if (data.length === 0) {
        return (<div className={classes.root}>
            <Paper style={{ padding: '20px', margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '70vw', height: '50vh' }}>
                <div style={{ color: 'red', fontSize: '10rem', fontWeight: 'bolder' }}>Sorry!!</div>
                <div style={{ fontSize: '3rem', fontWeight: 'bolder' }}>No Data to Show</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bolder' }}>Please Add Some Data!</div>
            </Paper>
        </div>)
    }

    else {
        return (
            <div className={classes.root}>
                {pagedata.topSheet.map((top, index) => {
                    return (<div className={classes.page} key={index}>
                        <div className={classes.content}>
                            <TopSheet data={top} showFooter={index === pagedata.topSheet.length - 1} date={settings.date} summery={index === 0 ? pagedata.summery : null} settings={settings} />
                        </div>
                    </div>)
                })}

                {pagedata.pages.map((page, idx) => {
                    return (
                        <div className={classes.page} key={idx}>
                            <div className={classes.header}>
                                <div className={classes.logos}>
                                    <img src={logo} alt="Logo" />
                                    <div className={classes.titles}>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', fontFamily: 'BookAntiqua' }}>{settings.title ? settings.title : 'undefined'}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'CalibriRegular' }}>{settings.sub_title ? settings.sub_title : 'undefined'}</div>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', left: '5px', display: 'flex' }}>
                                    <div>Page- </div>
                                    <div>{idx + 1}</div>
                                </div>
                                <div style={{ position: 'absolute', right: '5px', display: 'flex' }}>
                                    <div>{FormatDate(settings.date, settings.date_format)}</div>
                                </div>
                            </div>
                            <div className={classes.content}>
                                {page.map((val, index) => {
                                    return <CustomTable data={val.values} key={index} bno={val.id} sum={{ samount: val.amount, svat: val.vat, srev: val.rev }}
                                        date={settings.date} />
                                })}
                            </div>
                        </div>
                    )
                })
                }
            </div>
        )
    }
}




function CustomTable(props) {

    const classes = makeStyles(theme => ({
        root: {
            margin: '.5px',
            flex: 1,
            width: '100%',
            // border: '1px solid',
            // borderCollapse: 'collapse',
        },
        head: {
            backgroundColor: 'antiquewhite',

        }
    }))();
    return (
        <table className={classes.root}>
            <thead className={classes.head}>
                <tr>
                    <th colSpan="5">Bundle No {props.bno ? props.bno : 'undefined'}</th>
                </tr>
                <tr>
                    <th >SL</th>
                    <th>Meter No</th>
                    <th>Amount</th>
                    <th>Vat</th>
                    <th>Rev.</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map((val, index) => {
                    return (<tr key={index}>
                        <td>{val.id}</td>
                        <td>{val.meter_no}</td>
                        <td>{val.amount}</td>
                        <td>{val.vat}</td>
                        <td>{val.rev}</td>
                    </tr>)
                })}

            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="2">Bundle Total</td>
                    <td>{props.sum.samount}</td>
                    <td>{props.sum.svat}</td>
                    <td>{props.sum.srev}</td>
                </tr>
                {/* {props.onUpdate && props.onUpdate(props.bno - 1, amount, vat, rev)} */}
            </tfoot>
        </table>
    )
}



function TopSheet(props) {
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
        header: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
        },
        date:
        {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        },
        sum: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        table: {
            margin: '2rem',
            border: '1px solid',
            textAlign: 'center',
            borderCollapse: 'collapse',
            "& > thead": {
                backgroundColor: 'antiquewhite',
            },
            " & > thead > tr > th":
            {
                border: '1px solid',
            },
            " & > tbody > tr > td":
            {
                border: '1px solid',
            }
        },
        footer: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginRight: '1rem'

        },
        stamp: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginRight: '2rem',
            alignSelf: 'flex-end'
        },
        logos: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '100px',
            "& > img": {
                width: '80px',
                height: '80px',
                margin: '5px',

            }
        },
        titles: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }))()
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.logos}>
                    <img src={logo} alt="Logo" />
                    <div className={classes.titles}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'BookAntiqua' }}>{props.settings.title ? props.settings.title : 'undefined'}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'CalibriRegular' }}>{props.settings.sub_title ? props.settings.sub_title : 'undefined'}</div>
                    </div>
                </div>

                <hr style={{ width: '100%', height: '2px', border: '0.1px black dotted', margin: 0 }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '5px' }}>{props.settings.bill_title ? props.settings.bill_title : 'undefined'}</div>

            </div>
            <div className={classes.date}>
                {props.summery &&
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', margin: '5px', padding: '10px', border: '1px solid', borderRadius: '5px' }}>Top Sheet</div>
                }
                <div style={{ position: 'absolute', right: '1%' }}>{FormatDate(props.date, props.settings.date_format)}</div>
            </div>

            {props.summery && <div className={classes.sum}>
                <TwoRow title={"No of Bill"} value={props.summery.no_of_bill} />
                {/* <TwoRow title={"Bill Amount"} value={`Tk.${parseFloat(props.summery.vamount).toFixed(parseFloat(props.settings.precision_calculate))}/-`} titleValue={props.settings.ac_no} />
                <TwoRow title={"VAT Amount"} value={`Tk.${parseFloat(props.summery.vat).toFixed(parseFloat(props.settings.precision_calculate))}/-`} titleValue={props.settings.vat_account} /> */}
                <TwoRowTwoCol
                    title1={"Bill Amount"}
                    titleValue1={props.settings.ac_no}
                    title2={`Tk.${parseFloat(props.summery.vamount).toFixed(parseFloat(props.settings.precision_calculate))}/-`}
                    value1={"VAT Amount"}
                    titleValue2={props.settings.vat_account}
                    value2={`Tk.${parseFloat(props.summery.vat).toFixed(parseFloat(props.settings.precision_calculate))}/-`}
                />
                <TwoRow title={"Grand Total"} value={`Tk.${parseFloat(props.summery.amount).toFixed(parseFloat(props.settings.precision_calculate))}/-`} />
                <TwoRowTwoCol
                    title1={"No of Revenue."}
                    value1={parseInt(props.summery.rev) / parseInt(props.settings.revenue_amount)}
                    title2={"Revenue"}
                    value2={`Tk.${parseFloat(props.summery.rev).toFixed(parseFloat(props.settings.precision_calculate))}/-`}
                />
            </div>}
            <table className={classes.table}>
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Particulars(Bill Bundle)</th>
                        <th>Bill Amount</th>
                        <th>Vat Amount</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data && props.data.map((val, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{val.id}</td>
                                <td>Bundle No - {val.id}</td>
                                <td>{val.amount}</td>
                                <td>{val.vat}</td>
                                <td>{val.rev}</td>

                            </tr>)
                    })}
                </tbody>
            </table>
            {props.showFooter && <div className={classes.footer}>
                <h4>{props.settings.bill_end_title ? props.settings.bill_end_title : 'undefined'}</h4>
                <br></br>
                <p className={classes.stamp}>
                    <span style={{fontFamily: props.settings.user_name_font}}>{props.settings.user_name ? props.settings.user_name : 'undefined'}</span>
                    <br></br>
                    {props.settings.user_designation ? props.settings.user_designation : 'undefined'}
                    <br></br>
                    {props.settings.user_address ? props.settings.user_address : 'undefined'}
                </p>
            </div>}
        </div>
    )
}

export const Field = (props) => {
    const classes = makeStyles(theme => ({
        root:
        {
            border: '1px solid',
            borderCollapse: 'collapse',
            margin: '5px',
            padding: '5px',
            borderRadius: '5px',
            borderStyle: 'hidden',
            boxShadow: '0 0 0 1px',

            "& > tbody > tr >td":
            {
                padding: '10px',
                border: '1px solid',
                textAlign: 'center',
                height: '1.5rem',

            }
        },
    }))()
    return (
        <table className={classes.root}>
            {props.titleValue && <tbody>
                <tr>
                    <td rowSpan="2">{props.title}</td>
                    <td>{props.titleValue} </td>
                </tr>
                <tr>
                    <td>{props.value}</td>
                </tr>
            </tbody>}
            {!props.titleValue && <tbody>
                <tr>
                    <td >{props.title}</td>
                    <td>{props.value} </td>
                </tr>
            </tbody>}
        </table>)
}

const TwoRow = (props) => {
    const classes = makeStyles(theme => ({
        root:
        {
            border: '1px solid',
            borderCollapse: 'collapse',
            margin: '5px',
            padding: '5px',
            borderRadius: '5px',
            borderStyle: 'hidden',
            boxShadow: '0 0 0 1px',
            height: '10vh',
            overflow: 'visible',
            "& > tbody > tr >td":
            {
                padding: '10px',
                border: '1px solid',
                textAlign: 'center',
                height: '1.5rem',
            }
        },
    }))()
    return (
        <table className={classes.root}>
            <tbody>
                <tr>
                    <td >{props.title} <br></br><strong>{props.titleValue ? props.titleValue : ''}</strong></td>
                </tr>
                <tr>
                    <td>{props.value} </td>
                </tr>
            </tbody>
        </table>)
}

const TwoRowTwoCol = (props) => {
    const classes = makeStyles(theme => ({
        root:
        {
            border: '1px solid',
            borderCollapse: 'collapse',
            margin: '5px',
            padding: '5px',
            borderRadius: '5px',
            borderStyle: 'hidden',
            boxShadow: '0 0 0 1px',
            height: '10vh',
            overflow: 'visible',
            "& > tbody > tr >td":
            {
                padding: '10px',
                border: '1px solid',
                textAlign: 'center',
                height: '1.5rem',

            }
        },
    }))()
    return (
        <table className={classes.root}>
            <tbody>
                <tr>
                    <td >{props.title1} <br></br><strong>{props.titleValue1 ? props.titleValue1 : ''}</strong></td>
                    <td >{props.value1} <br></br><strong>{props.titleValue2 ? props.titleValue2 : ''}</strong></td>
                </tr>
                <tr>
                    <td>{props.title2} </td>
                    <td>{props.value2}</td>
                </tr>
            </tbody>
        </table>)
}