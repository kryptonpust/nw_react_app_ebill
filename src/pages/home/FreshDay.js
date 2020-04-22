import React, { useEffect, useRef, useState, useContext } from 'react'
import RootContext from '../../context/RootContext';
import { makeStyles, Paper, TextField, InputAdornment, Button } from '@material-ui/core';
import CustomTable from './CustomTable';
import Summery from './Summery';
import { NotificationManager } from 'react-notifications';
import PushButton from './PushButton';
import { calculaterev, calculatevat } from '../../utils'
const resetInput = {
  sl: '',
  meter: '',
  bill: '',
  vat: '',
  rev: '',
}
export default function FreshDay() {
  const tableEl = useRef(null);
  const [len, setLen] = useState(0);
  const [enablesl, setEnableSl] = useState(false);
  const [summery, setSummery] = useState({
    amount: 0,
    vamount: 0,
    vat: 0,
    rev: 0
  })
  const [inputs, setInputs] = useState(resetInput)
  const [pushed, setPushed] = useState(false);

  const slRef = useRef();
  const meterRef = useRef();
  const billRef = useRef();
  const vatRef = useRef();
  const revRef = useRef();
  const pushRef = useRef();

  const context = useContext(RootContext);
  useEffect(() => {
    function getdata() {
      window.db.each(`SELECT count(*) as res,coalesce(sum(amount), 0) as samount,coalesce(sum(vamount), 0) as vamount,coalesce(sum(vat), 0) as svat,coalesce(sum(rev), 0) as srev from tmp`, (err, row) => {
        if (err) {
          // throw err;
          NotificationManager.error('Failed!', 'Failed to retrive Table Data')
        }
        if (row.res > 0) {
          // NotificationManager.warning('Please close the day to fresh start', 'Day Exist', 10000)
        } else {
          NotificationManager.success('Welcome!', 'New Day')
        }
        setLen(row.res)
        setInputs({
          sl: row.res + 1,
          meter: '',
          bill: '',
          vat: '',
          rev: ''
        })
        setSummery({ amount: row.samount, vamount: row.vamount, vat: row.svat, rev: row.srev })
      })
    }
    if (!enablesl) {
      getdata();
    }
  }, [enablesl])

  const editShortcut = new window.nw.Shortcut({ key: "Ctrl+E" })
  const pushShortcut = new window.nw.Shortcut({ key: "Ctrl+space" })


  useEffect(() => {
    window.nw.App.registerGlobalHotKey(editShortcut);
    console.log('Edit Hot key registered')

    window.nw.App.registerGlobalHotKey(pushShortcut);
    console.log('Push Hot key registered')


    editShortcut.on('active', function () {
      setEnableSl(old => !old)
      if (slRef) {
        slRef.current.focus()
      }
    });

    editShortcut.on('failed', function (msg) {
      console.log(msg);
    });

    pushShortcut.on('active', function () {
      if (pushRef) {
        pushRef.current.activeLock()
      }
    });

    pushShortcut.on('failed', function (msg) {
      console.log(msg);
    });
    return function cleanup() {
      window.nw.App.unregisterGlobalHotKey(editShortcut);
      window.nw.App.unregisterGlobalHotKey(pushShortcut);

    }
  }, [editShortcut, pushShortcut])

  const classes = makeStyles(theme => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      // marginTop: '20px',
      "& > *": {
        margin: '20px',
      }
    },
    editbtnnormal: {
      background: '#fbb034',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      fontSize: '1.5rem',
      fontWeight: 'bold',
      padding: '0 30px',
      "&:hover":
      {
        background: '#fbb034',
        boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
      },
    },
    editbtnactive: {
      background: '#DD3069',
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
        background: '#DD3069',
        boxShadow: '0 6px 10px 4px rgba(255, 105, 135, .3)',
      }
    },

    input: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'sticky',
      top: '180px',
      zIndex: 100,
    },
    fields:
    {
      display: 'flex',
      flexDirection: 'row',
      // flexWrap: 'wrap',
      padding: '20px',
      " & > *": {
        margin: '10px'
      }
    }
  }))();
  return (
    <div className={classes.root}>
      <Paper className={classes.input} elevation={3}>
        <h2 style={{ textDecoration: 'underline' , color: '#2a70ef'}}>Electricity Bill Input</h2>
        <Summery summery={summery} precision={context.settings.precision_calculate} />

        <div className={classes.fields}>
          <Button variant="outlined" className={enablesl ? classes.editbtnactive : classes.editbtnnormal}
            onClick={(event) => {
              if (enablesl) {
                setInputs(old => ({ ...old, sl: len + 1 }))
              } else {
                setTimeout(() => {
                  slRef.current.focus()
                  setInputs(resetInput)
                }, 100)
              }
              setEnableSl(!enablesl)

            }}
          >{enablesl ? "Cancle" : "Edit"}</Button>
          <TextField
            label="SL"
            id="sl"
            type="number"
            variant="outlined"
            style={{ width: '10rem' }}
            inputRef={slRef}
            inputProps={{ min: 0 }}
            disabled={!enablesl}
            value={inputs.sl}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                if (inputs.sl) {
                  meterRef.current.focus()
                }
              }
            }}
            onChange={event => {
              const target = event.target;
              setInputs(old => ({ ...old, sl: target ? target.value : '' }))
              if (enablesl && target.value !== '') {
                window.db.get(`Select * from tmp WHERE id like ?`, [parseInt(target.value)], (err, row) => {
                  if (err) {
                    NotificationManager.error('Failed!', 'Failed to retrive Table Data')
                    throw err;
                  }
                  if (row) {
                    setInputs(old => ({ ...old, meter: row.meter_no, bill: row.amount, vat: row.vat, rev: row.rev }))

                  }
                })
              }
            }}
            onWheel={event => {
              const target = event.target;
              setInputs(old => ({ ...old, sl: target ? target.value : '' }))

            }}
            onFocus={() => {
              document.body.style.overflow = "hidden"
            }}
            onBlur={() => {
              document.body.style.overflow = "scroll"
            }}
          />
          <TextField
            label={`Meter No(${context.settings.meter_no_length} digit)`}
            id="meter"
            type="number"
            variant="outlined"
            inputRef={meterRef}
            autoFocus
            value={inputs.meter}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                if (inputs.meter && ((inputs.meter).toString().length === parseFloat(context.settings.meter_no_length))) {
                  billRef.current.focus()
                }
              }
            }}
            onFocus={() => {
              document.body.style.overflow = "hidden"
            }}
            onBlur={() => {
              document.body.style.overflow = "scroll"
            }}
            onWheel={event => {
              const target = event.target
              setInputs(old => ({ ...old, meter: target ? target.value : '' }))
              // event.preventDefault()
            }}
            error={inputs.meter ? ((inputs.meter).toString().length !== parseInt(context.settings.meter_no_length)) : false}
            onChange={event => {
              const target = event.target
              if (parseFloat(target.value.length) > parseFloat(context.settings.meter_no_length)) {
                NotificationManager.error(`Maximum Allowed Meter Length is ${context.settings.meter_no_length}`, "Sorry", 1000)
              } else {
                setInputs(old => ({ ...old, meter: target ? target.value : '' }))

              }
              if (enablesl && target.value !== '') {
                window.db.get(`Select * from tmp WHERE meter_no like ?`, [parseInt(target.value)], (err, row) => {
                  if (err) {
                    NotificationManager.error('Failed!', 'Failed to retrive Table Data')
                    throw err;
                  }
                  // NotificationManager.info('Query Successful')
                  if (row) {
                    setInputs(old => ({ ...old, sl: row.id, bill: row.amount, vat: row.vat, rev: row.rev }))
                  }

                })
              }
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Bill Amount"
            id="bill_amount"
            type="number"
            variant="outlined"
            inputRef={billRef}
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">Tk.</InputAdornment>,
              endAdornment: < InputAdornment position="start" > /-</InputAdornment >
            }}
            value={inputs.bill}
            onChange={event => {
              const val = event.target.value;
              if (!val) {
                setInputs(old => ({ ...old, bill: '', vat: '', rev: '' }))
                return;
              } else {

                setInputs(old => ({
                  ...old,
                  bill: val,
                  vat: pushed ? '0' : `${calculatevat(parseFloat(val), parseFloat(context.settings.vat_percent), parseFloat(context.settings.meter_charge), parseFloat(context.settings.precision_calculate))}`,
                  rev: `${calculaterev(parseFloat(val), parseFloat(context.settings.revenue_threshold), parseFloat(context.settings.revenue_amount), parseFloat(context.settings.precision_calculate))}`
                }))
              }

            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (inputs.bill && pushed) {
                  setTimeout(() => {
                    vatRef.current.select()
                  }, 100)
                } else if (inputs.bill && !pushed) {
                  if (inputs.sl !== '' && inputs.meter !== '' && inputs.bill !== '' && inputs.vat !== '' && inputs.rev !== '') {
                    if (enablesl) {
                      window.db.run(`UPDATE tmp SET meter_no=?,amount=?,vamount=?,vat=?,rev=? WHERE id=?`, [inputs.meter, inputs.bill, inputs.bill - inputs.vat, inputs.vat, inputs.rev, inputs.sl], (err) => {
                        if (err) {
                          NotificationManager.error('Failed!', 'Failed to Insert Data')
                          throw err;
                        }
                        NotificationManager.success('Insert Successful')
                        if (tableEl.current) {
                          tableEl.current.onQueryChange();
                        }
                        setEnableSl(false);
                        meterRef.current.focus()
                      })
                    } else {
                      const updated = inputs.bill - inputs.vat;
                      console.log(inputs)
                      window.db.run(`INSERT INTO tmp(meter_no,amount,vamount,vat,rev) VALUES (?,?,?,?,?)`, [inputs.meter, inputs.bill, updated, inputs.vat, inputs.rev], (err) => {
                        if (err) {
                          console.log(err)
                          NotificationManager.error('Failed!', 'Failed to Insert Data')
                          throw err;
                        }
                        NotificationManager.success('Insert Successful')
                        if (tableEl.current) {
                          tableEl.current.onQueryChange();
                        }
                        setLen(len => len + 1)
                        setSummery(old => ({ amount: old.amount + parseFloat(inputs.bill), vamount: old.vamount + parseFloat(updated), vat: old.vat + parseFloat(inputs.vat), rev: old.rev + parseFloat(inputs.rev) }))
                        setInputs(old => ({
                          sl: old.sl + 1,
                          meter: '',
                          bill: '',
                          vat: '',
                          rev: ''
                        }))
                        meterRef.current.focus()
                      })
                    }
                  }
                }
              } else if (event.key === ' ') {
                if (pushRef) {
                  pushRef.current.animate()
                }
                setInputs(old => ({ ...old, vat: 0 }))
                setTimeout(() => {
                  vatRef.current.select()
                }, 100)
              }
            }}
            onFocus={() => {
              document.body.style.overflow = "hidden"
            }}
            onBlur={() => {
              document.body.style.overflow = "scroll"
            }}
          />


          <TextField
            label={`Vat (${context.settings.vat_percent}%)`}
            id="vat"
            type="number"
            variant="outlined"
            inputRef={vatRef}
            InputProps={{
              startAdornment: <InputAdornment position="start">Tk.</InputAdornment>,
              endAdornment: < InputAdornment position="start" > /-</InputAdornment >
            }}
            value={inputs.vat}
            onChange={event => {
              const target = event.target
              setInputs(old => ({ ...old, vat: target ? target.value : '' }))

            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (inputs.sl !== '' && inputs.meter !== '' && inputs.bill !== '' && inputs.vat !== '' && inputs.rev !== '') {
                  if (enablesl) {
                    window.db.run(`UPDATE tmp SET meter_no=?,amount=?,vamount=?,vat=?,rev=? WHERE id=?`, [inputs.meter, inputs.bill, inputs.bill - inputs.vat, inputs.vat, inputs.rev, inputs.sl], (err) => {
                      if (err) {
                        NotificationManager.error('Failed!', 'Failed to Insert Data')
                        throw err;
                      }
                      NotificationManager.success('Update Successful')
                      if (tableEl.current) {
                        tableEl.current.onQueryChange();
                      }
                      setEnableSl(false);
                      meterRef.current.focus()
                    })
                  } else {
                    const updated = inputs.bill - inputs.vat;
                    window.db.run(`INSERT INTO tmp(meter_no,amount,vamount,vat,rev) VALUES (?,?,?,?,?)`, [inputs.meter, inputs.bill, updated, inputs.vat, inputs.rev], (err) => {
                      if (err) {
                        NotificationManager.error('Failed!', 'Failed to Insert Data')
                        throw err;
                      }
                      NotificationManager.success('Insert Successful')
                      if (tableEl.current) {
                        tableEl.current.onQueryChange();
                      }
                      setLen(len => len + 1)
                      setSummery(old => ({ amount: old.amount + parseFloat(inputs.bill), vamount: old.vamount + parseFloat(updated), vat: old.vat + parseFloat(inputs.vat), rev: old.rev + parseFloat(inputs.rev) }))
                      setInputs(old => ({
                        sl: old.sl + 1,
                        meter: '',
                        bill: '',
                        vat: '',
                        rev: ''
                      }))
                      meterRef.current.focus()
                    })
                  }
                }
              } else if (event.key === ' ') {
                if (pushRef) {
                  pushRef.current.animate()
                }
                setInputs(old => ({ ...old, vat: 0 }))
                setTimeout(() => {
                  vatRef.current.select()
                }, 500)
              }
            }}
            onFocus={() => {
              document.body.style.overflow = "hidden"
            }}
            onBlur={() => {
              document.body.style.overflow = "scroll"
            }}
          />
          <TextField
            label="Revenue"
            id="vat"
            type="number"
            variant="outlined"
            style={{ width: '8rem' }}
            inputRef={revRef}
            disabled
            InputProps={{
              startAdornment: <InputAdornment position="start">Tk.</InputAdornment>,
              endAdornment: < InputAdornment position="start" > /-</InputAdornment >
            }}

            value={inputs.rev}
          />
          <PushButton
            ref={pushRef}
            onLongClick={() => {
              if (pushed) {
                meterRef.current.focus()
              } else {
                setInputs(old => ({ ...old, vat: 0 }))
                setTimeout(() => {
                  vatRef.current.select()
                }, 100)
              }

              setPushed(old => !old)


            }}
            singleClick={() => {
              if (pushed) {
                setPushed(false)
              } else {
                setInputs(old => ({ ...old, vat: 0 }))
                setTimeout(() => {
                  vatRef.current.select()
                }, 100)
              }

            }}
          />
        </div>
      </Paper>


      {<CustomTable tableRef={tableEl} len={len} onDelete={(oldData) => {
        setLen(len => len - 1);
        setInputs(old => ({ ...old, sl: old.sl - 1 }))
        setSummery(old => ({ amount: old.amount - oldData.amount, vamount: old.vamount - oldData.vamount, vat: old.vat - oldData.vat, rev: old.rev - oldData.rev }))
        setEnableSl(false)
      }}
        onUpdate={(oldData, newData) => {
          setSummery(old => ({ ...old, amount: old.amount - (newData.amount - oldData.amount) }))
        }} />}
    </div>
  )
}