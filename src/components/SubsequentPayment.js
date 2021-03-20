import React, { useState } from 'react'
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    heading: {
        // textAlign: 'center',
        color: '#4a4a4a',
        fontFamily: 'sofia-pro',
        fontWeight: '600',
        fontStyle: 'normal',
        marginTop: 5,
        fontSize: '20px',
    },
});

const SubsequentPayment = (props) => {
    const classes = useStyles();

    const monthsToIdx = {}
    const idxToMonths = {}
    let i = 0
    while (i < props.inputData.termMonths) {
        let month = (props.inputData.startDate.getMonth() + i + 1) % 12 + 1
        let year = Math.floor((i + 1) / 12) + props.inputData.startDate.getFullYear()
        monthsToIdx[`${month}/${year}`] = i
        idxToMonths[i] = `${month}/${year}`
        i++
    }

    const [paymentType, setPaymentType] = useState(props.paymentType || 'ONE_TIME')
    const [paymentDetails, setPaymentDetails] = useState({
        month: props.paymentMonth || '',
        amount: ''
    })

    const idxToMonth = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec', }

    if (!props.inputData.loanAmount) { return null }
    
    const resetState = () => {
        props.togglePaymentOpen()
        setPaymentType('ONE_TIME')
        setPaymentDetails({
            month: props.paymentMonth || '',
            amount: ''
        })
    }

    const handleSubmit = () => {
        const {month, amount} = paymentDetails

        props.addPayment(paymentType, {[month]: amount })
        resetState()
    }


    
    const handleDelete = (type, month) => {                
        props.deleteSubesquentPayment(type, month)
    }

    const oneTimeDisplay = () => {
        return (
            <div >
                <Typography>Add A Payment in a Month</Typography>
                <FormControl className={classes.inputs}>
                    <InputLabel id="simple-select-label">Month</InputLabel>
                    <Select
                        id="simple-select"
                        value={paymentDetails.month}
                        onChange={(e) => {
                            setPaymentDetails({ ['month']: e.target.value})

                        }}
                    >
                        {Object.entries(monthsToIdx).map(([date, idx]) => {
                            return <MenuItem key={`${idx}`} value={idx}>{date}</MenuItem>
                        })}
                    </Select>
                </FormControl>
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
                <FormControl className={classes.inputs}>
                    <InputLabel id="simple-select-label">Month</InputLabel>
                    <Select
                        id="simple-select"
                        value={paymentDetails.month}
                        onChange={(e) => {
                            setPaymentDetails({ ['month']: e.target.value })

                        }}
                    >
                        <MenuItem value={1}>Jan</MenuItem>
                        <MenuItem value={2}>Feb</MenuItem>
                        <MenuItem value={3}>Mar</MenuItem>
                        <MenuItem value={4}>Apr</MenuItem>
                        <MenuItem value={5}>May</MenuItem>
                        <MenuItem value={6}>Jun</MenuItem>
                        <MenuItem value={7}>Jul</MenuItem>
                        <MenuItem value={8}>Aug</MenuItem>
                        <MenuItem value={9}>Sep</MenuItem>
                        <MenuItem value={10}>Oct</MenuItem>
                        <MenuItem value={11}>Nov</MenuItem>
                        <MenuItem value={12}>Dec</MenuItem>
                    </Select>
                </FormControl>
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
            return oneTimeDisplay(monthsToIdx, idxToMonths)
        } else if (paymentType === 'MONTHLY') {
            return monthlyDisplay()
        } else {
            return yearlyDisplay(monthsToIdx, idxToMonths)
        }
    }

    let monthly = ''
    if ( props.currentSubsequentPayments['MONTHLY'] > 0 ){
        monthly = props.currentSubsequentPayments['MONTHLY']

    }
    const annual = props.currentSubsequentPayments['YEARLY']
    return (
        <div className={classes.root}>
            <div className={classes.paymentDisplay}>
                <Typography className={classes.paymentDisplayTitle}>Monthly </Typography>
                <div className={classes.chipsContainer}>
                    {monthly ? <Chip color="secondary" label={`${monthly}`} onDelete={() => { handleDelete('MONTHLY') }} /> : ''}
                </div>
            </div>
            <div className={classes.paymentDisplay}>
                <Typography className={classes.paymentDisplayTitle}>Annual: </Typography>
                <div className={classes.chipsContainer}>
                    {Object.entries(annual).map(([month, value]) => {
                        return (
                            <Chip
                                key={`${month}`}
                                color="primary"
                                label={`${value} Every ${idxToMonth[month]}`}
                                onDelete={() => { handleDelete('YEARLY', month) }}
                            />
                        )
                    })}
                </div>
            </div>
            <Typography className={classes.heading}>Want to pay off your loan faster? Click below to add an additional One Time, Monthly, or Annual payment! </Typography>

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