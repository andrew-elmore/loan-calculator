import React, { useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import DataInput from './components/DataInput'
import PaymentSchedule from './components/PaymentSchedule'
import SubsequentPayment from './components/SubsequentPayment'

const reducer = (state, action) => {
    Object.freeze(state)
    let currentState = Object.assign({}, state)
    switch (action.type) {
        case 'CREATE_LOAN':
            currentState['inputData'] = action.payload.data
            currentState['durationType'] = action.payload.durationType
            return currentState
        case 'ADD_PAYMENT':
            const { paymentAction, paymentType } = action.payload
            if (paymentType === 'MONTHLY') {
                currentState.subsequentPayments[paymentType] = paymentAction['']
            } else {
                currentState.subsequentPayments[paymentType] = { ...currentState.subsequentPayments[paymentType], ...paymentAction }
            }
            return currentState
        case 'REMOVE_ONE_TIME_PAYMENT':
            console.log("REMOVE_ONE_TIME_PAYMENT", action.payload)
            delete currentState.subsequentPayments['ONE_TIME'][action.payload]
            return currentState
        case 'REMOVE_MONTHLY_PAYMENT':
            console.log("REMOVE_MONTHLY_PAYMENT")
            currentState.subsequentPayments['MONTHLY'] = 0
            return currentState
        case 'REMOVE_YEARLY_PAYMENT':
            console.log("REMOVE_YEARLY_PAYMENT", action.payload)
            delete currentState.subsequentPayments['YEARLY'][action.payload]
            return currentState
        case 'seeState':
            console.log(state)
        default:
            return state
    }
}


const useStyles = makeStyles({
    root: {
        background: '#eef7ef',
        height: '100%'
    },
});

function DebtCalculator() {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, {
        inputData: {},
        durationType: '',
        subsequentPayments: {
            'ONE_TIME': {},
            'MONTHLY': 0,
            'YEARLY': {}
        },
        errors: {
            dataInput: {
                loanAmount: false,
                termYears: false,
                termMonths: false,
                interestRate: false
            }
        }
    })
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [paymentMonth, setPaymentMonth] = useState(undefined)
    const [paymentType, setPaymentType] = useState(undefined)

    const submitDataInput = (data, durationType) => {
        dispatch({ type: 'CREATE_LOAN', payload: { data, durationType } })
    }

    const addPayment = (paymentType, paymentAction) => {
        dispatch({ type: 'ADD_PAYMENT', payload: { paymentType, paymentAction } })
    }

    const togglePaymentOpen = () => {
        if (paymentOpen) {
            setPaymentMonth(undefined)
            setPaymentType(undefined)
        }
        setPaymentOpen(!paymentOpen)
    }

    const deleteSubesquentPayment = (type, month) => {
        if (type === 'ONE_TIME') {
            dispatch({ type: 'REMOVE_ONE_TIME_PAYMENT', payload: month })
        } else if (type === 'MONTHLY') {
            dispatch({ type: 'REMOVE_MONTHLY_PAYMENT', payload: 0 })
        } else {
            dispatch({ type: 'REMOVE_YEARLY_PAYMENT', payload: month })
        }
    }







    const openPaymentToMonth = (paymentMonth) => {
        setPaymentMonth(paymentMonth)
        setPaymentType('ONE_TIME')
        setPaymentOpen(true)
    }


    return (
        <div className={classes.root}>
            {/* <button onClick={() => {console.log(state)}}>state</button> */}
            <DataInput
                submitDataInput={submitDataInput}
            />
            <SubsequentPayment
                inputData={state.inputData}
                addPayment={addPayment}
                currentSubsequentPayments={state.subsequentPayments}
                paymentOpen={paymentOpen}
                togglePaymentOpen={togglePaymentOpen}
                paymentMonth={paymentMonth}
                deleteSubesquentPayment={deleteSubesquentPayment}
            />
            <PaymentSchedule
                inputData={state.inputData}
                durationType={state.durationType}
                subsequentPayments={state.subsequentPayments}
                openPaymentToMonth={openPaymentToMonth}
                deleteSubesquentPayment={deleteSubesquentPayment}
            />

        </div>
    );
}

export default DebtCalculator;
