import {
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    FormControlLabel,
    Paper,
    Radio,
    Switch,
    TextField,
    Select,
    MenuItem,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useContext, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';

import RootContext from './context/RootContext';


const Field = (props) => {
    const [data, setData] = useState('');
    useEffect(() => {
        function init() {
            if (props.data.val) {
                setData(props.data.val);
            }
        }
        init()
    }, [props.data.val]);
    const classes = makeStyles(theme => ({
        field: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        edit: {
            flex: 1
        }
    }))();
    return (
        <div className={classes.field}>
            <TextField className={classes.edit} value={data} label={props.data.title ? props.data.title : props.data.name.replace(/_/g, ' ').toUpperCase()}
                InputLabelProps={{ shrink: true, style: { color: 'red' } }}
                onChange={event => {
                    setData(event.target.value);
                }}

            />
            {props.fontdata && <Select
                value={props.fontdata.val ? props.fontdata.val : 'serif'}
            >
                <MenuItem value={'serif'}>Serif</MenuItem>
            </Select>}

            {props.sizedata && <Select
                value={props.sizedata.val ? props.sizedata.val : 10}
            >
                <MenuItem value={10}>10px</MenuItem>
            </Select>}
            {props.data.val && props.data.val !== data && <Button variant="contained" color="secondary"
                onClick={() => {
                    if (props.data.name) {
                        window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [data, props.data.name], (err) => {
                            if (err) {
                                NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                throw err;
                            }
                            NotificationManager.success('Update Successful')
                            if (props.update) {
                                props.update(props.data.name, data);
                            }
                        })
                    }
                }}
            >Save</Button>}
        </div>
    )
}
const RadioField = (props) => {
    const [data, setData] = useState('');
    useEffect(() => {
        function init() {
            if (props.data.val) {
                setData(props.data.val);
            }
        }
        init()
    }, [props.data.val]);
    const classes = makeStyles(theme => ({
        field: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            border: '1px solid red',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        radios:
        {
            display: 'flex',
            // flexWrap: 'wrap',
            // justifyContent: 'center',
            maxWidth: '50vh',
            overflowX: 'auto'

        },
        header: {
            minWidth: '15vw',
            fontWeight: 'bold'
        }
    }))();

    return (
        <div className={classes.field}>
            <div className={classes.header}>
                {props.data.name && props.data.name.replace(/_/g, ' ').toUpperCase()}:
            </div>
            <div className={classes.radios}>
                {props.options && props.options.map((val, idx) => {
                    return (
                        <FormControlLabel
                            checked={data === val}
                            onChange={event => {
                                setData(event.target.value)
                            }}
                            value={val}
                            key={idx}
                            control={<Radio color="primary" />}
                            label={val}
                            labelPlacement="top"
                        />
                    )
                })}
            </div>

            {props.data.val && props.data.val !== data && <Button variant="contained" color="secondary"
                onClick={() => {
                    if (props.data.name) {
                        window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [data, props.data.name], (err) => {
                            if (err) {
                                NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                throw err;
                            }
                            NotificationManager.success('Update Successful')
                            if (props.onChange) {
                                props.onChange(props.data.name, data);
                            }
                        })
                    }
                }}
            >Save</Button>}
        </div>
    )
}


const SwitchField = (props) => {
    const [data, setData] = useState('');
    useEffect(() => {
        function init() {
            if (props.data.val) {
                setData(props.data.val);
            }
        }
        init()
    }, [props.data.val]);
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            border: '1px solid red',
            '& > *': {
                margin: theme.spacing(2),
            },
        },
        field: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
            // backgroundColor:'red',
            // '& > *': {
            //     margin: theme.spacing(1),
            // },
        },
        header: {
            minWidth: '15vw',
            fontWeight: 'bold'
        },
    }))();

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                {props.data.name && props.data.name.replace(/_/g, ' ').toUpperCase()}:
            </div>
            <div className={classes.field}>
                {props.options && props.options.map((val, idx) => {
                    return (
                        <FormControlLabel
                            checked={data === val}
                            onChange={event => {
                                setData(event.target.value)
                            }}
                            value={val}
                            key={idx}
                            control={<Switch color="primary" />}
                            label={val}
                            labelPlacement="start"
                        />
                    )
                })}
                {props.data.val && props.data.val !== data && <Button variant="contained" color="secondary"
                    onClick={() => {
                        if (props.data.name) {
                            window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [data, props.data.name], (err) => {
                                if (err) {
                                    NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                    throw err;
                                }
                                NotificationManager.success('Update Successful')
                                if (props.onChange) {
                                    props.onChange(props.data.name, data);
                                }
                            })
                        }
                    }}
                >Save</Button>}
            </div>
        </div>
    )
}

function FieldRevenue(props) {

    const [data1, setData1] = useState('')
    const [data2, setData2] = useState('')

    useEffect(() => {
        if (props.data1.val) {
            setData1(props.data1.val)
        }
    }, [props.data1.val])
    useEffect(() => {
        if (props.data2.val) {
            setData2(props.data2.val)
        }
    }, [props.data2.val])
    const classes = makeStyles(theme => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            margin: '10px',
            padding: '10px',
            border: '1px solid red'
        },
        content: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            " & > *": {
                margin: '5px'
            }
        },
        fixedwidth: {
            width: '5rem',
        }
    }))()
    return (<div className={classes.root}>
        <p style={{ color: 'red' }}>Revenue</p>
        <div className={classes.content}>
            <h4>Bill Amount ></h4>
            <TextField className={classes.fixedwidth} variant="outlined" type="number" label="value" value={data1}
                onChange={event => {
                    setData1(event.target.value)
                }}
            ></TextField>
            =
            <TextField className={classes.fixedwidth} variant="outlined" type="number" label="amount" value={data2}
                onChange={event => {
                    setData2(event.target.value)
                }}
            ></TextField>

            {((props.data1.val && props.data1.val !== data1) || (props.data2.val && props.data2.val !== data2)) && <Button variant="contained" color="secondary"
                onClick={() => {
                    if (props.data1.name && props.data2.name) {
                        window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [data1, props.data1.name], (err) => {
                            if (err) {
                                NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                throw err;
                            }
                            if (props.onChange) {
                                props.onChange(props.data1.name, data1, false);
                            }


                            window.sdb.run(`UPDATE settings SET val=? WHERE name=?`, [data2, props.data2.name], (err) => {
                                if (err) {
                                    NotificationManager.error('Failed!', 'Failed to UPDATE Data')
                                    throw err;
                                }
                                NotificationManager.success('Update Successful')
                                if (props.onChange) {
                                    props.onChange(props.data2.name, data2);
                                }
                            })
                        })
                    }
                }}
            >Save</Button>}
        </div>
    </div>)
}

export default function SimpleTabs() {
    const [value, setValue] = React.useState(0);


    const classes = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            "& > *": {
                margin: '20px',
                flexGrow: 1
            }
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 'bolder',
            color: '#119a11'
        },
        excontent: {
            display: 'flex', justifyContent: 'center', flexDirection: 'column', flexWrap: 'wrap'
        }
    }))();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const context = useContext(RootContext)
    return (
        <div className={classes.root}>
            <Paper>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="General" {...a11yProps(0)} />
                        <Tab label="View" {...a11yProps(1)} />
                        <Tab label="Branding" {...a11yProps(2)} />
                        <Tab label="Printing Settings" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>


                    <Field data={{ name: 'ac_no', val: context.settings['ac_no'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'vat_account', val: context.settings['vat_account'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Advanced Settings</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelSummary classes={{
                            content: classes.excontent
                        }}>
                            <Field data={{ name: 'vat_percent', val: context.settings['vat_percent'] }} update={(key, val) => {
                                context.updateSetting(key, val);
                            }} />
                            <Field data={{ name: 'meter_charge', val: context.settings['meter_charge'] }} update={(key, val) => {
                                context.updateSetting(key, val);
                            }} />
                            <FieldRevenue
                                data1={{ name: 'revenue_threshold', val: context.settings['revenue_threshold'] }}
                                data2={{ name: 'revenue_amount', val: context.settings['revenue_amount'] }}
                                onChange={(key, val, update = true) => {
                                    context.updateSetting(key, val, update);
                                }} />
                        </ExpansionPanelSummary>
                    </ExpansionPanel>
                </TabPanel>
                <TabPanel value={value} index={1}>

                    <RadioField data={{ name: 'meter_no_length', val: context.settings['meter_no_length'] }} options={['2', '4', '6', '8']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <RadioField data={{ name: 'precision_calculate', val: context.settings['precision_calculate'] }} options={['0', '2', '3']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <SwitchField data={{ name: 'date_format', val: context.settings['date_format'] }} options={['d/m/y', 'd-m-y', 'd M y', 'd/M/y']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'table_row_number', val: context.settings['table_row_number'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Field data={{ name: 'title', title: 'Institute/Organization Name', val: context.settings['title'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'sub_title', title: 'Branch Name', val: context.settings['sub_title'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    {/* <Field data={{ name: 'bill_title', val: context.settings['bill_title'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} /> */}
                    <Field data={{ name: 'bill_end_title', title: 'Top Sheet Description', val: context.settings['bill_end_title'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'user_name', title: 'Responsible Name', val: context.settings['user_name'] }}
                    // fontdata={{ name: 'user_name_font', val: context.settings['user_name_font'] }} 
                    // sizedata ={{ name: 'user_name_size', val: context.settings['user_name_size']}}
                    update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'user_designation', title: 'Designation', val: context.settings['user_designation'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <Field data={{ name: 'user_address', title: 'Full Address', val: context.settings['user_address'] }} update={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                </TabPanel>
                <TabPanel value={value} index={3}>

                    <RadioField data={{ name: 'paper_type', val: context.settings['paper_type'] }} options={['A4', 'Legal']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    <RadioField data={{ name: 'table_per_page', val: context.settings['table_per_page'] }} options={['1', '2', '3', '4']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                    {context.settings['paper_type'] === 'A4' && <RadioField data={{ name: 'row_per_table', val: context.settings['row_per_table'] }} options={['40', '45', '50', '55']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />}
                    {context.settings['paper_type'] === 'Legal' && <RadioField data={{ name: 'row_per_table', val: context.settings['row_per_table'] }} options={['40', '45', '50', '55', '60', '65']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />}
                    <RadioField data={{ name: 'font_size', val: context.settings['font_size'] }} options={['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']} onChange={(key, val) => {
                        context.updateSetting(key, val);
                    }} />
                </TabPanel>
            </Paper>
            {/* <Paper>
                
            </Paper> */}
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}