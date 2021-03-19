import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';




const reducer = (state, action) => {
    Object.freeze(state)
    let currentState = Object.assign({}, state)
    let newValue
    switch (action.type) {
        case 'loanAmount':
            if (action.payload === '') {
                currentState[action.type] = ''
                return currentState
            }

            currentState[action.type] = action.payload
            return currentState
        case 'date':
            if (action.payload === '') {
                currentState[action.type] = ''
                return currentState
            }
            currentState[action.type] = action.payload
            return currentState

        case 'interestRate':
            if (action.payload === '') {
                currentState[action.type] = ''
                return currentState
            }

            currentState[action.type] = action.payload
            return currentState

        case 'termYears':
            if (action.payload === ''){
                currentState['termYears'] = ''
                currentState['termMonths'] = ''
                return currentState
            }
            newValue = parseFloat(action.payload)
            currentState['termYears'] = newValue.toString()
            currentState['termMonths'] = ((newValue) * 12).toString()
            return currentState

        case 'termMonths':
            if (action.payload === '') {
                currentState['termYears'] = ''
                currentState['termMonths'] = ''
                return currentState
            }
            newValue = parseFloat(action.payload)
            currentState['termYears'] = Math.floor((newValue) / 12).toString()
            currentState['termMonths'] = newValue.toString()
            return currentState

        case 'ERRORS':
            currentState['errors'] = action.payload
            return currentState
        case 'seeState':
        default:
            return state
    }
}

const useStyles = makeStyles({
    root: {
        background: 'white',
        margin: '2%',
        padding: '3%',
        boxShadow: '1px 1px 5px grey',
        alignItems: 'center',
        display: 'inline-block',
    },
    inputs: {
        width: 300,
        marginTop: 20
    },
    button: {
        marginTop: 20,
        borderRadius: 20,
        boxShadow: '1px 1px 5px grey',
    },
    switch: {
        background: '#e37263',
    }
});

function DataInput(props) {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, {
        loanAmount: '',
        termYears: '',
        termMonths: '',
        interestRate: '',
        date: new Date(Date.now()),
        errors: {
            loanAmount: false,
            termYears: false,
            termMonths: false,
            interestRate: false,
            date: false
        }
    })
    const [duration, setDuration] = useState('Months')

    let loanTerm
    if (duration === 'Months') {
        loanTerm = state.termMonths
    } else {
        loanTerm = state.termYears
    }

    const handleSubmit = () => {
        let data = {
            loanAmount: parseFloat(state.loanAmount),
            termYears: parseFloat(state.termYears),
            termMonths: parseFloat(state.termMonths),
            interestRate: parseFloat(state.interestRate),
            startDate: state.date
        }

        let allValidated = true
        let currentErrors = state.errors
        Object.entries(data).forEach(([key, value]) => {
            if (isNaN(value)){
                allValidated = false
                currentErrors[key]= true
            } else {
                currentErrors[key] = false
            }
        })

        dispatch({ type: 'ERRORS', payload: currentErrors})
 
        if (allValidated){
            props.submitDataInput(data, duration) 
        }




    }

    return (
        <div className={classes.root}>
            <div>
                <Typography>Enter Your Loan Information</Typography>
                <TextField
                    className={classes.inputs}
                    label="Loan Amount"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    value={state.loanAmount}
                    onChange={(e) => { dispatch({ type: 'loanAmount', payload: e.currentTarget.value }) }}
                    error={state.errors.loanAmount}
                    helperText={state.errors.loanAmount?"Please Enter A Number":false}
                />

                <br />

                <TextField
                    className={classes.inputs}
                    label="Interest Rate"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                    }}
                    value={state.interestRate}
                    onChange={(e) => { dispatch({ type: 'interestRate', payload: e.currentTarget.value }) }}
                    error={state.errors.interestRate}
                    helperText={state.errors.interestRate ? "Please Enter A Number" : false}
                />

                <br />




                <TextField
                    className={classes.inputs}
                    label={`Loan term in ${duration}`}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={loanTerm}
                    onChange={(e) => { dispatch({ type: `term${duration}`, payload: e.currentTarget.value }) }}
                    error={state.errors[`term${duration}`]}
                    helperText={state.errors[`term${duration}`] ? "Please Enter A Number" : false}
                />
                <br />
                <ToggleButtonGroup  size="small" value={duration} exclusive onChange={(e) => {
                    setDuration(e.currentTarget.value)
                }}>
                    <ToggleButton value="Months">Months</ToggleButton>
                    <ToggleButton value="Years">Years</ToggleButton>
                </ToggleButtonGroup>

                <br />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Starting Date of Loan"
                        value={state.date}
                        onChange={(date) => { dispatch({ type: 'date', payload: date}) }}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br />

                <Button
                    variant="contained"
                    className={classes.button}
                    color="primary"
                    fullWidth
                    onClick={() => { 
                        handleSubmit()
                    }}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}



export default DataInput;
