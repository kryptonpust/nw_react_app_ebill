import 'react-notifications/lib/notifications.css';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Link, MemoryRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import RootContext from './context/RootContext';
import DetailsView, { Field } from './DetailView';

import logo from './images/logo.svg';
import windmill from './images/windmill.gif';

import CloseDay from './pages/closeDay';
import Greetings from './pages/greetings';
import FreshDay from './pages/home/FreshDay';
import View from './pages/records';
import Settings from './Settings';
import { FormatDate } from './utils';
import DayOpen from './pages/dayopen';
const sqlite3 = window.nw.require('sqlite3').verbose();

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
      fontFamily: 'BookAntiqua'
    },
    sub_title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      fontFamily: 'CalibriRegular'

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
      color: 'red',
      borderRadius: '5px',
      background: 'linear-gradient(-45deg, #FFA63D, #338AFF, #3CF0C5)',
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
      {<Button to="/settings" component={Link} variant="contained" color="primary">Settings</Button>}
      {context.settings.date && <Button to="/view" component={Link} variant="contained" color="primary">View</Button>}
      <Button to="/records" component={Link} variant="contained" color="primary">Records</Button>
      {context.settings.date && <Button to="/close" component={Link} variant="contained" className={classes.closebtn}>DAY CLOSE</Button>}
    </div>


  )
}






function App() {
  const [reload, setReload] = useState(null);
  const [dbloaded,setDbloaded]=useState(false);
  const [settings, setSettings] = useState({});

  const reloadSettings = () => {
    setReload(true);
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
      window.sdb.all(`SELECT * FROM settings`, (err, row) => {
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
  }, [reload])

  useEffect(() => {
    setDbloaded(false);
    const filename = Buffer.from(settings.date ? settings.date : '').toString('base64');
    console.log(settings.date)
    if (filename) {
      console.log(filename)
      window.db = new sqlite3.Database(window.path+`/backup/${filename}.sqlite`, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the backup database.');
        // window.db.all(`SELECT * FROM tmp`, (err, row) => {
        //   if (err) {
        //     // throw err;
        //     NotificationManager.error('Failed!', 'Failed to retrive Table Data')
        //   }
        //  console.log(row);
         
          window.db.run(`CREATE TABLE if not exists "tmp" (
            "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
            "meter_no"	TEXT NOT NULL,
            "amount"	REAL NOT NULL,
            "vamount"	REAL NOT NULL,
            "vat"	REAL NOT NULL,
            "rev"	REAL NOT NULL,
            "date" date DEFAULT CURRENT_DATE
          )`,(err)=>{
            if(err){
              NotificationManager.error("Table creation failed","Fatal")
              console.log(err)
              throw err;
            }
            setDbloaded(true)
          })
         
        })
        // if (context.reloadSettings) {
        //     context.reloadSettings()
        // }else{
        //     throw Error('Unable to Reload Settings')
        // }
      // });
    }
  }, [settings.date])

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
          value={{ settings: settings, reload: reload, reloadSettings: reloadSettings, updateSetting: updateSetting }}
        >
          <div className={classes.root}>
            <div className={classes.fixed}>
              <Header />
              <Menu />

            </div>
            <div className={classes.decoration}>
              <img src={windmill} alt="Logo" style={{
                position: 'fixed',
                bottom: 0,
                zIndex: -100,
              }} />
              <img src={windmill} alt="Logo" style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                zIndex: -100,
              }} />
            </div>
            <div className={classes.content}>
              {/* <div className={classes.cover}> */}
              {/* <img src={logo} alt="Logo" className={classes.cover} /> */}


              {/* // </div> */}

              <Route path="/home">
                {!settings.date && <DayOpen />}
                {settings.date && dbloaded && <FreshDay />}
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


