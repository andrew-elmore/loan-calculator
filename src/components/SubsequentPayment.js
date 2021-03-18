import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField,
    Dialog,
    Typography,
    DialogContent,
    Chip
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        background: 'white',
        margin: '2%',
        marginTop: '0',
        padding: '3%',
        boxShadow: '1px 1px 5px grey',
        alignItems: 'center',
        display: 'block',
        height: '100%'
    },
    button: {
        marginTop: 20,
        borderRadius: 20,
        boxShadow: '1px 1px 5px grey',
    },
    paymentDisplay: {
        margin: '0.5%',
        border: '1px solid grey',
        borderRadius: 20,
        width: '100%',
        display: 'inline-block',
    },
    paymentDisplayTitle: {
        background: 'grey',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        color: 'white',
        textAlign: 'center',
        padding: 5        
    },
    chipsContainer: {
        height: 30,
        padding: 7
    },
    dialog: {
        width: 400,
        height: 325,
        alignItems: 'center',
        display: 'inline-block',
    },
    inputs: {
        width: 400,
        marginTop: 20
    },
    button: {
        marginTop: 10,
        borderRadius: 20,
        boxShadow: '1px 1px 5px grey',
    },
});

const SubsequentPayment = (props) => {
    const classes = useStyles();
    const [paymentType, setPaymentType] = useState(props.paymentType || 'ONE_TIME')
    const [paymentDetails, setPaymentDetails] = useState({
        month: props.paymentMonth || 0,
        amount: 0
    })

    if (!props.inputData.loanAmount) { return null }

    
    if (paymentDetails.month !== props.paymentMonth && props.paymentMonth !== undefined){
        setPaymentDetails({...paymentDetails, ['month']: props.paymentMonth})
    }
    
    
    const resetState = () => {
        props.togglePaymentOpen()
        setPaymentType('ONE_TIME')
    }

    const handleSubmit = () => {
        console.log(paymentDetails)
        const {month, amount} = paymentDetails

        console.log(month)
        props.addPayment(paymentType, {[month]: amount })
        resetState()
    }


    
    const handleDelete = (type, month) => {                
        props.deleteSubesquentPayment(type, month)
    }

    const oneTimeDisplay = () => {
        return (
            <div >
                <Typography>Add A Payment in {0}</Typography>
                <TextField
                    className={classes.inputs}
                    label={`Payment Month`}
                    value={paymentDetails.month}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        console.log(e.currentTarget.value)
                        setPaymentDetails({ ['month']: e.currentTarget.value })
                    }}
                />
                <br/>
               <TextField
                    className={classes.inputs}
                    label={`Payment Amount`}
                    value={paymentDetails.amount}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        setPaymentDetails({...paymentDetails, ['amount']: e.currentTarget.value})
                    }}
                />
            </div>
        )
    }

    const monthlyDisplay = () => {
        return (
            <div>
                <Typography>Add A Payment For Every Month</Typography>
                <TextField
                    className={classes.inputs}
                    label={`Payment Amount`}
                    value={paymentDetails.amount}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        setPaymentDetails({...paymentDetails, ['amount']: e.currentTarget.value, ['month']: ''})
                    }}
                />
                <div style={{ height: 68 }}></div>
            </div>
        )
    }

    const yearlyDisplay = () => {
        return (
            <div>
                <Typography>Add A Payment Every Year in a Month</Typography>
                <TextField
                    className={classes.inputs}
                    label={`Payment Month`}
                    value={paymentDetails.month}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        setPaymentDetails({ ...paymentDetails, ['month']: e.currentTarget.value })
                    }}
                />
                <br />
                <TextField
                    className={classes.inputs}
                    label={`Payment Amount`}
                    value={paymentDetails.amount}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        setPaymentDetails({ ...paymentDetails, ['amount']: e.currentTarget.value })
                    }}
                />
            </div>
        )
    }




    const inputDisplay = () => {
        if (paymentType === 'ONE_TIME') {
            return oneTimeDisplay()
        } else if (paymentType === 'MONTHLY') {
            return monthlyDisplay()
        } else {
            return yearlyDisplay()
        }
    }

    let monthly = null
    if ( props.currentSubsequentPayments['MONTHLY'] > 0 ){
        monthly = props.currentSubsequentPayments['MONTHLY']

    }
    const annual = props.currentSubsequentPayments['YEARLY']
    return (
        <div className={classes.root}>
            <div className={classes.paymentDisplay}>
                <Typography className={classes.paymentDisplayTitle}>Monthly </Typography>
                <div className={classes.chipsContainer}>
                    {monthly ? <Chip color="secondary" label={`${monthly}`} onDelete={() => { handleDelete('MONTHLY') }} /> : null}
                </div>
            </div>
            <div className={classes.paymentDisplay}>
                <Typography className={classes.paymentDisplayTitle}>Annual: </Typography>
                <div className={classes.chipsContainer}>
                    {Object.entries(annual).map(([month, value]) => {
                        return (
                            <Chip
                                color="primary"
                                label={`${value} Every ${month}`}
                                onDelete={() => { handleDelete('YEARLY', month) }}
                            />
                        )
                    })}
                </div>
            </div>

            <Button
                variant="contained"
                onClick={() => { props.togglePaymentOpen() }}
                className={classes.button}
                color="secondary"
                fullWidth
            >
            Add Payments
            </Button>
            <Dialog
                open={props.paymentOpen}
                disableBackdropClick
                
            >
                <DialogContent className={classes.dialog}>
                    <ToggleButtonGroup size="small" value={paymentType} exclusive
                        onChange={(e) => {
                            setPaymentType(e.currentTarget.value)
                        }}
                    >
                        <ToggleButton value="ONE_TIME">One Time</ToggleButton>
                        <ToggleButton value="MONTHLY">Monthly</ToggleButton>
                        <ToggleButton value="YEARLY">Annual</ToggleButton>
                    </ToggleButtonGroup>
                    <br />
                    {inputDisplay()}
                    <br />
                    <Button
                        fullWidth
                        className={classes.button}
                        variant="outlined"
                        onClick={() => {
                            resetState()
                            props.togglePaymentOpen()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color='primary'
                        className={classes.button}
                        onClick={() => { handleSubmit() }}
                    >
                        Submit
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )

}

export default SubsequentPayment