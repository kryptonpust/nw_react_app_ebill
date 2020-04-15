import { TextField } from '@material-ui/core';
import LoopIcon from '@material-ui/icons/Loop';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { Fragment, useContext } from 'react';
import { NotificationManager } from 'react-notifications';

import RootContext from '../../context/RootContext';
import { calculaterev, calculatevat } from '../../utils';
import { tableIcons } from './TableIcons';

export default function CustomTable(props) {

    const context = useContext(RootContext)
    const [len, setLen] = React.useState(0);
    React.useEffect(() => {
        setLen(props.len ? parseFloat(props.len) : 0)
        if (props.tableRef) {
            props.tableRef.current.onQueryChange();
        }
    }, [props.len, props.tableRef])
    const [isLoading, setIsLoading] = React.useState(false)
    return (<MaterialTable
        icons={tableIcons}
        tableRef={props.tableRef}
        components={{
            Toolbar: props => (
                <div style={{ backgroundColor: '#e8eaf5', textAlign: 'center' }}>
                    <MTableToolbar {...props} style={{ backgroundColor: '#e8eaf5', textAlign: 'center' }} />
                </div>
            ),
        }}
        columns={[
            { title: "SL", field: "id", type: "numeric", filterPlaceholder: "Search(sl)", defaultSort: "desc", editable: 'never' },
            { title: "Meter NO", field: "meter_no", type: "numeric", filterPlaceholder: "Search(meter no)" },
            {
                title: "Bill Amount", field: "amount", type: "numeric", filtering: false,
                // currencySetting:{ currencyCode: '', minimumFractionDigits: 4, maximumFractionDigits: 5},
                render: rowData => <Fragment>{rowData.amount.toFixed(parseFloat(context.settings.precision_calculate))}</Fragment>,
                editComponent: props => {
                    return <TextField
                        type="number"
                        value={props.value}
                        inputProps={{
                            style: { fontSize: 15 }
                        }}
                        onChange={e => {
                            let temp = props.rowData
                            temp.amount = e.target.value
                            temp.vat = calculatevat(parseFloat(temp.amount), parseFloat(context.settings.vat_percent), parseFloat(context.settings.meter_charge), parseFloat(context.settings.precision_calculate))
                            temp.rev = calculaterev(parseFloat(temp.amount), parseFloat(context.settings.revenue_threshold), parseFloat(context.settings.revenue_amount), parseFloat(context.settings.precision_calculate))
                            props.onRowDataChange(temp);
                        }}
                    />
                }

            },
            {
                title: "Vat",
                field: "vat",
                type: "numeric",
                filtering: false,
                // render: rowData => <Fragment>{rowData.vat.toFixed(precision)}</Fragment>,

            },
            {
                title: "Revenue",
                field: "rev",
                type: "numeric",
                filtering: false,
                // render: rowData => <Fragment>{rowData.rev.toFixed(precision)}</Fragment>
            }
        ]}
        data={query =>
            new Promise((resolve, reject) => {
                let sql = 'SELECT * FROM tmp';
                if (len && (Math.ceil(len / parseFloat(query.pageSize)) - 1) < query.page) {
                    query.page -= 1;
                }
                // if (query.search !== "") {
                //   sql = sql + ` meter_no LIKE '%${query.search}%'`
                // }
                context.updateSetting('table_row_number', query.pageSize, false);
                if (query.filters.length !== 0) {
                    sql = sql + ' WHERE'
                    const filters = query.filters.map((val, idx) => {
                        return `${idx !== 0 ? ' AND' : ''} ${val.column.field} like '%${val.value}%'`
                    })
                    sql = sql + filters.toString();
                }
                if (query.orderBy) {
                    sql = sql + ` ORDER BY ${query.orderBy.field} ${query.orderDirection}`
                }
                window.db.all(sql + ` LIMIT ? OFFSET ?`, [query.pageSize, query.page * query.pageSize], (err, row) => {
                    if (err) {
                        NotificationManager.error('Failed!', 'Failed to retrive Table Data')
                        throw err;
                    }
                    resolve({
                        data: row,
                        page: query.page,
                        totalCount: len
                    });
                })
            })
        }
        title="Search &amp; Edit"
        options={{
            actionsColumnIndex: -1,
            filtering: true,
            search: false,
            pageSize: parseInt(context.settings.table_row_number ? context.settings.table_row_number : 1),
            pageSizeOptions: [1, 2, 3, 5, 10, 20, 50],
            headerStyle: { color: 'red', fontWeight: 'bold', fontSize: '1.2rem' },
        }}
        isLoading={isLoading}
        actions={[
            {
                icon: () => <LoopIcon style={{ color: 'green', fontSize: 40 }} />,
                tooltip: 'Fix Index',
                isFreeAction: true,
                onClick: (event) => {
                    window.db.serialize(() => {
                        setIsLoading(true)
                        window.db.run(`CREATE TABLE "test" (
                        "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                        "meter_no"	INTEGER NOT NULL,
                        "amount"	REAL NOT NULL,
                        "vamount"	REAL NOT NULL,
                        "vat"	REAL NOT NULL,
                        "rev"	REAL NOT NULL,
                        "date" date DEFAULT CURRENT_DATE
                      )`)
                            .run(`INSERT INTO test(meter_no,amount,vamount,vat,rev) SELECT meter_no,amount,vamount,vat,rev FROM tmp;`)
                            .run(`DROP TABLE tmp;`)
                            .run(`CREATE TABLE "tmp" (
                                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                                "meter_no"	INTEGER NOT NULL,
                                "amount"	REAL NOT NULL,
                                "vamount"	REAL NOT NULL,
                                "vat"	REAL NOT NULL,
                                "rev"	REAL NOT NULL,
                                "date" date DEFAULT CURRENT_DATE
                              )`)
                            .run(`INSERT INTO tmp(meter_no,amount,vamount,vat,rev) SELECT meter_no,amount,vamount,vat,rev FROM test;`)
                            .run(`DROP TABLE test;`, (event, row) => {
                                setIsLoading(false)
                                props.tableRef.current.onQueryChange()
                            })
                    });
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 2000)
                    //   props.tableRef.current.props.isLoading=true
                }
            }
        ]}

        editable={{
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    window.db.run(`UPDATE tmp SET meter_no=?,amount=?,vat=?,rev=? WHERE id=?`, [newData.meter_no, newData.amount, newData.vat, newData.rev, newData.id], (err) => {
                        if (err) {
                            NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                            throw err;
                        }
                        NotificationManager.success('Update Successful')
                        // let state = data;
                        // const index = state.indexOf(oldData);
                        // state[index] = newData;
                        // // db.close();
                        resolve()
                    })
                }),
            onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    window.db.run(`DELETE FROM tmp WHERE id=?`, [oldData.id], (err) => {
                        if (err) {
                            NotificationManager.error('Failed!', 'Failed to DELETE data')
                            throw err;
                        }
                        setLen(old => (old - 1))
                        NotificationManager.success('Delete Successful')
                        // let state = data;
                        // const index = state.indexOf(oldData);
                        // state.splice(index, 1);
                        if (props.onChange) {
                            props.onChange(oldData)
                        }
                        setTimeout(() => {
                            resolve()

                        }, 500)
                    })
                }),
        }}


        localization={{ 
            body: 
            { 
                editRow: 
                { 
                    deleteText: 'Do you want to delete this row?' 
                } 
            } 
        }}
    />)
}