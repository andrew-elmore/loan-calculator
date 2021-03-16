import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';



const reducer = (state, action) => {
    Object.freeze(state)
    let currentState = Object.assign({}, state)
    let newValue
    switch (action.type) {
        case 'loanAmount':
            currentState[action.type] = action.payload
            return currentState
        case 'interestRate':
            currentState[action.type] = action.payload
            return currentState
        case 'termYears':
            currentState['termYears'] = newValue
            currentState['termMonths'] = newValue * 12
            return currentState
        case 'termMonths':
            currentState['termYears'] = Math.floor(newValue / 12)
            currentState['termMonths'] = newValue
            return currentState
        case 'seeState':
            console.log(state)
        default:
            return state
    }
}

function DataInput(props) {
    const [state, dispatch] = useReducer(reducer, {
        loanAmount: 5000,
        termYears: null,
        termMonths: 60,
        interestRate: 4.5
    })
    const [duration, setDuration] = useState('Months')


    let loanTerm
    if (duration === 'Months') {
        loanTerm = state.termMonths
    } else {
        loanTerm = state.termYears
    }

    return (
        <div>

            <TextField
                id="standard-basic"
                label="Loan Amount"
                value={state.loanAmount}
                onChange={(e) => { dispatch({ type: 'loanAmount', payload: e.currentTarget.value }) }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
            />

            <br />

            <TextField
                id="standard-basic"
                label="Interest Rate"
                value={state.interestRate}
                onChange={(e) => { dispatch({ type: 'interestRate', payload: e.currentTarget.value }) }}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                }}
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
                id="standard-basic"
                label={`Loan term in ${duration}`}
                value={loanTerm}
                onChange={(e) => { dispatch({ type: `term${duration}`, payload: e.currentTarget.value }) }}
            />

            <br />

            <Button
                onClick={() => { 
                    let data = {
                        loanAmount: parseInt(state.loanAmount),
                        termYears: parseFloat(state.termYears),
                        termMonths: parseInt(state.termMonths),
                        interestRate: parseInt(state.interestRate),
                    }

                    props.submitDataInput(data, duration) 
                }}
            >
                Submit
            </Button>
        </div>
    );
}

export default DataInput;
