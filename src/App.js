import 'react-calendar/dist/Calendar.css';
import 'react-notifications/lib/notifications.css';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Link, MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import RootContext from './context/RootContext';
import DetailsView, { Field } from './DetailView';
import logo from './images/logo.svg';
import mountain from './images/mountain.png';
import stars from './images/stars.png';
import tree from './images/tree.png';
import CloseDay from './pages/closeDay';
import Greetings from './pages/greetings';
import FreshDay from './pages/home/FreshDay';
import View from './pages/records';
import Settings from './Settings';
import { FormatDate } from './utils';

// import styles from './App.module.css';



// const dbStore = window.require('./Db')

// const db = dbStore.connect();
// window.db = db;

function Header() {

  const classes = makeStyles(theme => ({
    root: {
      display: 'flex',
      // flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // minWidth: '90vw',
      backgroundColor: 'white',
      minHeight: '10vh',
      "& >img":
      {
        height: '90px',
        margin: '5px',
      }
    },
    contents: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // minWidth: '90vw',
      minHeight: '10vh',
    },
    date: {
      position: 'absolute',
      right: 0,
    },
    title:
    {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    sub_title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    }
  }))();

  const context = useContext(RootContext)
  return (
    <div className={classes.root}>
      <img src={logo} alt="Logo" />
      <div className={classes.contents}>
        <div className={classes.title}>{context.settings.title}</div>
        <div className={classes.sub_title}>{context.settings.sub_title}</div>
      </div>
      <div className={classes.date}>
        {context.settings.date && <Field title={"Date"} value={FormatDate(context.settings.date, context.settings.date_format)} />}
      </div>

    </div>
  )
}


function Menu() {

  const classes = makeStyles(theme => ({
    menus: {
      display: 'flex',
      backgroundImage: 'linear-gradient(90deg, rgb(230, 80, 80), rgb(235, 74, 208))',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: '5vh',
      " & > *": {
        margin: '5px',
      },
    },
    closebtn: {
      border: '2px solid black',
      fontWeight: 'bold',
      // color: 'greenyellow',

      textAlign: 'center',
      color: 'rgba(255,255,255,0.9)',
      borderRadius: '5px',
      background: 'linear-gradient(-45deg, #FFA63D, #FF3D77, #338AFF, #3CF0C5)',
      backgroundSize: '600%',
      animation: `$anime 16s linear infinite`,
    },
    "@keyframes anime": {
      "0%": {
        backgroundPosition: "0% 50%",
      },
      "50%": {
        backgroundPosition: "100% 50%",

      },
      "100%": {
        backgroundPosition: "0% 50%",

      },
    }



  }))();
  const context = useContext(RootContext);
  return (

    <div className={classes.menus}>
      <Button to="/home" component={Link} variant="contained" color="primary">Home</Button>
      {/* {!context.status && <Link to="/settings">Settings</Link>} */}
      <Button to="/settings" component={Link} variant="contained" color="primary">Settings</Button>
      {context.settings.date && <Button to="/view" component={Link} variant="contained" color="primary">View</Button>}
      <Button to="/records" component={Link} variant="contained" color="primary">Records</Button>
      {context.settings.date && <Button to="/close" component={Link} variant="contained" className={classes.closebtn}>Close Day</Button>}
    </div>


  )
}



function Base() {
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
  const context = useContext(RootContext)
  return (
    <div className={classes.root}>
      <Calendar
        value={date} />
      <Button variant="outlined" color="secondary"
        onClick={() => {
          const val = date.toLocaleDateString();
          window.db.run(`UPDATE settings SET val=? WHERE name=?`, [val, 'date'], (err) => {
            if (err) {
              NotificationManager.error('Failed!', 'Failed to UPDATE Data')
              throw err;
            }
            NotificationManager.success('Update Successful')
            if (context.settings) {
              context.updateSetting('date', val)
            }
          })
        }}
      >Open A new Day</Button>
    </div>
  )
}



function App() {
  const [status, setStatus] = useState(false);
  const [settings, setSettings] = useState({});

  const openday = () => {
    setStatus(true);
  }
  const closeday = () => {
    setStatus(false)
  }

  const updateSetting = (key, val, update = true) => {
    settings[key] = val;
    if (update) {
      setSettings({ ...settings })
    } else {
      setSettings(settings)
    }
  }

  useEffect(() => {
    function getdata() {
      window.db.all(`SELECT * FROM settings`, (err, row) => {
        if (err) {
          // throw err;
          NotificationManager.error('Failed!', 'Failed to retrive Settings Data')
        }
        let result = {};
        row.map((val) => {
          result[val.name] = val.val;
          return 0;
        })
        setSettings(result)
      })
    }
    getdata()
  }, [])

  const classes = makeStyles(theme => ({
    root: {
      display: 'flex',
      minHeight: '90vh',
      flexDirection: 'column',
      touchAction: 'none',
    },
    cover:
    {
      position: 'fixed',
      // backgroundImage: `url(${logo})`,
      // backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      width: '45vw',
      zIndex: -100,
      left: '50%',
      marginLeft: '-22.5vw',
      filter: 'drop-shadow(2px 4px 6px black)'
    },
    fixed:
    {
      position: 'sticky',
      top: 0,
      height: '10rem',
      width: '100%',
      // background: 'white',
      zIndex: 50,
      "@media print":
      {
        display: 'none',
      }
    },
    content:
    {
      // marginTop: '5rem',
      "@media print":
      {
        margin: 0,
      },
    },
    decoration:
    {
      position: 'absolute',
      "@media print": {
        display: 'none',
      }
    }
  }))()
  console.log(settings)
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {/* {!status && <Base />}
              {status && <FreshDay />} */}
          <Greetings />
        </Route>
        <RootContext.Provider
          value={{ settings: settings, status: status, openday: openday, closeday: closeday, updateSetting: updateSetting }}
        >
          <div className={classes.root}>
            <div className={classes.fixed}>
              <Header />
              <Menu />

            </div>
            <div className={classes.decoration}>
            <img src={mountain} alt="Logo" style={{
              position: 'fixed',
              height: '100px',
              width: '100px',
              bottom: 0,
              zIndex: -100,
            }} />
            <img src={tree} alt="Logo" style={{
              position: 'fixed',
              height: '100px',
              width: '140px',
              left: 86,
              bottom: 0,
              zIndex: -100,
              "@media print": {
                display: 'none',
              }
            }} />
            <img src={tree} alt="Logo" style={{
              position: 'fixed',
              height: '100px',
              width: '140px',
              left: 200,
              bottom: 0,
              zIndex: -100
            }} />
            <img src={tree} alt="Logo" style={{
              position: 'fixed',
              height: '100px',
              width: '140px',
              bottom: 0,
              right: 0,
              zIndex: -100
            }} />
            <img src={tree} alt="Logo" style={{
              position: 'fixed',
              height: '100px',
              width: '140px',
              bottom: 0,
              right: 120,
              zIndex: -100
            }} />
            <img src={stars} alt="Logo" style={{
              position: 'fixed',
              height: '500px',
              bottom: 30,
              left: 10,
              zIndex: -100
            }} />
            </div>
            <div className={classes.content}>
              {/* <div className={classes.cover}> */}
              {/* <img src={logo} alt="Logo" className={classes.cover} /> */}


              {/* // </div> */}

              <Route path="/home">
                {!settings.date && <Base />}
                {settings.date && <FreshDay />}
              </Route>
              {!settings.date && <Redirect to="/home" />}
              <Route path="/records">
                <View />
              </Route>
              <Route path="/view">
                <DetailsView />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>

              <Route path="/close">
                <CloseDay />
              </Route>
            </div>
            <NotificationContainer />
          </div>
        </RootContext.Provider>

      </Switch>
    </Router>
  );
}



export default App;


