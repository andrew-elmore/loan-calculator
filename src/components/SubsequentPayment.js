import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField,
    Grid,
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
        background: 'red'
    },
});

const SubsequentPayment = (props) => {
    const classes = useStyles();
    const [paymentType, setPaymentType] = useState(props.paymentType || 'ONE_TIME')
    const [paymentDetails, setPaymentDetails] = useState({
        month: props.paymentMonth || 0,
        amount: 0
    })

    
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
            <div>
                <Typography>Add A Payment in {0}</Typography>
                <TextField
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
            </div>
        )
    }

    const yearlyDisplay = () => {
        return (
            <div>
                <Typography>Add A Payment Every Year in a Month</Typography>
                <TextField
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
        <div>
            <div>
                <Typography>Monthly: 
                    {monthly ? <Chip label={`${monthly}`} onDelete={() => {handleDelete('MONTHLY')}} />: null}
                </Typography>
            </div>
            <div>
                <Typography>Annual: {Object.entries(annual).map(([month, value]) => {
                    return(
                        <Chip
                            label={`${value} Every ${month}`}
                            onDelete={() => {handleDelete('YEARLY',month)}}
                        />
                    )
                })}</Typography>
            </div>

            <Button
                onClick={() => { props.togglePaymentOpen() }}
            >
            Add Payments
            </Button>
            <Dialog
                open={props.paymentOpen}
                disableBackdropClick
            >
                <DialogContent>
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
                        onClick={() => {
                            resetState()
                            props.togglePaymentOpen()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
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