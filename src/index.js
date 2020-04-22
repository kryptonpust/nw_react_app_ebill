import React from 'react';
import ReactDOM from 'react-dom';
import './fonts/bookantiqua.ttf'
import './fonts/CalibriRegular.ttf'
import './fonts/arial.ttf'
import './fonts/Arial_Rounded_MT_Bold.ttf'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const sqlite3 = window.nw.require('sqlite3').verbose();
const fs = window.nw.require('fs')

if (!fs.existsSync('./backup')) {
    fs.mkdirSync('./backup')
}
if (!fs.existsSync('./settings.sqlite')) {

    window.sdb = new sqlite3.Database('./settings.sqlite', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the settings database.');
    });

    const values = [
        { name: 'title', val: 'Rajshahi Krishi Unnayan Bank' },
        { name: 'sub_title', val: 'Mollaparahat Branch' },
        { name: 'vat_percent', val: '5' },
        { name: 'meter_charge', val: '10' },
        { name: 'revenue_threshold', val: '400' },
        { name: 'revenue_amount', val: '10' },
        { name: 'meter_no_length', val: '4' },
        { name: 'precision_calculate', val: '2' },
        { name: 'date_format', val: 'd M y' },
        { name: 'bill_title', val: 'Daily Electricity Bill Register' },
        { name: 'bill_end_title', val: 'Following Amount is received by' },
        { name: 'user_name', val: 'Md. Mizanur Rahman' },
        { name: 'user_name_font', val: 'serif' },
        { name: 'user_name_size', val: '10px' },
        { name: 'user_designation', val: '(Officer)' },
        { name: 'user_address', val: 'RAKUB, Mollaparahat Branch, Rajshahi' },
        { name: 'ac_no', val: 'CD-47' },
        { name: 'vat_account', val: '41/10B' },
        { name: 'table_row_number', val: '3' },
        { name: 'paper_type', val: 'A4' },
        { name: 'table_per_page', val: '3' },
        { name: 'row_per_table', val: '40' },
        { name: 'font_size', val: '17' },
    ]
    window.sdb.serialize(() => {
        window.sdb
            .run(`CREATE TABLE settings(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        val TEXT DEFAULT NULL
      )`)
            .run(`INSERT INTO settings(name,val)
              VALUES `+ values.map((val) => (`('${val.name}','${val.val}')`)).join(','))
            .run(`INSERT INTO settings(name)
              VALUES ('date')`)
    });
} else {
    window.sdb = new sqlite3.Database('./settings.sqlite', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the settings database.');
    });;
}

ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
