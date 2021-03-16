import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField,
    Grid,
    Dialog,
    Typography,
    DialogContent
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const SubsequentPayment = (props) => {
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [paymentType, setPaymentType] = useState('ONE_TIME')
    const [paymentDetails, setPaymentDetails] = useState({})

    const resetState = () => {
        setPaymentOpen(false)
        setPaymentType('ONE_TIME')
    }

    const handleSubmit = () => {
        const {month, amount} = paymentDetails

        props.addPayment(paymentType, {[month]: amount })
        resetState()
    }
    const oneTimeDisplay = () => {
        return (
            <div>
                <Typography>Add A Payment in {0}</Typography>
               <TextField
                    label={`Payment Amount`}
                    value={paymentDetails.amount}
                    onChange={(e) => {
                        setPaymentDetails({...paymentDetails, ['amount']: e.currentTarget.value, ['month']: 0})
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
                    label={`Payment Amount`}
                    value={paymentDetails.amount}
                    onChange={(e) => {
                        setPaymentDetails({ ...paymentDetails, ['amount']: e.currentTarget.value })
                    }}
                />
                <TextField
                    label={`Payment Month`}
                    value={paymentDetails.month}
                    onChange={(e) => {
                        setPaymentDetails({ ...paymentDetails, ['month']: e.currentTarget.value })
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
    return (
        <div>
            <Button
                onClick={() => { setPaymentOpen(!paymentOpen) }}
            >
                +
            </Button>
            <Dialog
                open={paymentOpen}
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
                            setPaymentOpen(!paymentOpen)
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