import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';



const reducer = (state, action) => {
    Object.freeze(state)
    let currentState = Object.assign({}, state)
    let newValue
    switch (action.type) {
        case 'loanAmount':
            if (action.payload === '') {
                currentState[action.type] = null
                return currentState
            }

            currentState[action.type] = action.payload
            return currentState

        case 'interestRate':
            if (action.payload === '') {
                currentState[action.type] = null
                return currentState
            }

            currentState[action.type] = action.payload
            return currentState

        case 'termYears':
            if (action.payload === ''){
                currentState['termYears'] = null
                currentState['termMonths'] = null
                return currentState
            }
            newValue = parseFloat(action.payload)
            currentState['termYears'] = newValue.toString()
            currentState['termMonths'] = ((newValue) * 12).toString()
            return currentState

        case 'termMonths':
            if (action.payload === '') {
                currentState['termYears'] = null
                currentState['termMonths'] = null
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
            console.log(state)
        default:
            return state
    }
}

const useStyles = makeStyles({
    root: {
        background: 'red'
    },
});

function DataInput(props) {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, {
        loanAmount: null,
        termYears: null,
        termMonths: null,
        interestRate: null,
        errors: {
            loanAmount: false,
            termYears: false,
            termMonths: false,
            interestRate: false
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
        <div>

            <TextField
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

            <ToggleButtonGroup size="small" value={duration} exclusive onChange={(e) => {
                setDuration(e.currentTarget.value)
            }}>
                <ToggleButton value="Months">Months</ToggleButton>
                <ToggleButton value="Years">Years</ToggleButton>
            </ToggleButtonGroup>

            <br />

            <TextField
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

            <Button
                onClick={() => { 
                    handleSubmit()
                }}
            >
                Submit
            </Button>
        </div>
    );
}

export default DataInput;
