import React, { useContext, useEffect } from "react";
import RootContext from "../../context/RootContext";
import { makeStyles, Paper } from "@material-ui/core";


export default function Summery(props) {

    const context = useContext(RootContext);
    const classes = makeStyles(theme => ({
        root: {
            // padding: '1rem',
            alignSelf: 'flex-start',
            marginLeft: '2rem',
        },
        header: {
            background: "linear-gradient(90deg,#614385,#516395)",
            textAlign: "center",
            minHeight: "1rem",
            fontSize: "20px",
            padding: "10px",
            fontWeight: "bold",
            color: 'white',
        },
        table: {
            // border: '1px solid red',
            borderCollapse: 'collapse',
            padding: '10px',
            "& > tbody >tr >td":
            {
                // border: '1px solid',
                padding: '10px',
                textAlign: 'center',
            }
        }
    }))();
    useEffect(() => {
        if (props.summery.amount && props.summery.vat) {
            context.updateSetting('gtotal', props.summery.amount, false)
        }
    }, [context, props.summery.amount, props.summery.vat])
    return (<Paper className={classes.root} elevation={3}>
        {/* <div className={classes.header}>Summery</div> */}
        <table className={classes.table}>
            <tbody>
                {/* <tr>
                    <td style={{
                        background: 'linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)',
                        color: 'white'
                    }}>Bill Amount ({context.settings.ac_no})</td>
                    <td>{props.summery.vamount ? props.summery.vamount : '0'}</td>
                    <td rowSpan="2">Revenue</td>
                </tr>
                <tr>
                    <td style={{
                        background: 'linear-gradient(90deg, rgba(252,70,107,1) 0%, rgba(63,94,251,1) 100%)',
                        color: 'white'
                    }}>Vat ({context.settings.vat_account})</td>
                    <td>{props.summery.vat ? props.summery.vat : '0'}</td>
                </tr> */}
                <tr>
                    <td style={{fontWeight: 'bold'}}>Grand Total:</td>
                    <td style={{color: 'rgb(255,0,0)'}}>TK.{(props.summery.amount) ? parseFloat(props.summery.amount).toFixed(props.precision ? parseFloat(props.precision) : 0) : '0'} /-</td>
                    {/* <td>{props.summery.rev ? props.summery.rev : '0'}</td> */}
                </tr>
            </tbody>
        </table>
    </Paper>)
}
