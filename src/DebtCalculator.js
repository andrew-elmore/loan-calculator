import React, { useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import DataInput from './components/DataInput'
import PaymentSchedule from './components/PaymentSchedule'
import SubsequentPayment from './components/SubsequentPayment'
import PaymentChart from './components/PaymentChart'

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
            delete currentState.subsequentPayments['ONE_TIME'][action.payload]
            return currentState
        case 'REMOVE_MONTHLY_PAYMENT':
            currentState.subsequentPayments['MONTHLY'] = 0
            return currentState
        case 'REMOVE_YEARLY_PAYMENT':
            delete currentState.subsequentPayments['YEARLY'][action.payload]
            return currentState
        default:
            return state
    }
}

const generateSchedule = (inputData, subsequentPayments) => {
    let originalPrincipal = inputData.loanAmount
    let principal = originalPrincipal
    let rate = inputData.interestRate / 100
    let numMonths = inputData.termMonths
    let monthlyRate = rate / 12
    let months = []
    

    let i = 0
    while (i < numMonths || Math.floor(principal) > 0) {
        let mothlyPayment = (originalPrincipal * monthlyRate * ((1 + monthlyRate) ** numMonths)) / (((1 + monthlyRate) ** numMonths) - 1)
        let additionalPayments = parseFloat(subsequentPayments['MONTHLY'])
        let aditionalPaymentsComponents = {}
        if (parseFloat(subsequentPayments['MONTHLY']) > 0) {
            aditionalPaymentsComponents = { ['MONTHLY']: parseFloat(subsequentPayments['MONTHLY']) }
        }
        if (subsequentPayments['ONE_TIME'][i]) {
            additionalPayments += parseFloat(subsequentPayments['ONE_TIME'][i])
            aditionalPaymentsComponents['ONE_TIME'] = parseFloat(subsequentPayments['ONE_TIME'][i])
        }

        if (subsequentPayments['YEARLY'][(i % 12)]) {
            additionalPayments += parseFloat(subsequentPayments['YEARLY'][(i % 12)])
            aditionalPaymentsComponents['YEARLY'] = parseFloat(subsequentPayments['YEARLY'][i % 12])
        }

        mothlyPayment += additionalPayments

        mothlyPayment = Math.min(principal * (1 + monthlyRate), mothlyPayment)

        let interestPayment = (principal * monthlyRate)
        let principalPayment = (mothlyPayment - interestPayment)
        let remainingPrincipal = (principal - principalPayment)
        principal = remainingPrincipal

        let currentDate = new Date(inputData.startDate)
        
        currentDate.setMonth((inputData.startDate.getMonth() + (i+ 1))%12)
        currentDate.setFullYear(inputData.startDate.getFullYear() + Math.floor((inputData.startDate.getMonth() + i+1)/ 12))
        months.push({ currentDate, numMonth: i, mothlyPayment, interestPayment, principalPayment, remainingPrincipal, additionalPayments, aditionalPaymentsComponents })
        i++
    }
    return months
}



const useStyles = makeStyles({
    root: {
        background: '#eef7ef',
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



    const submitDataInput = (data, durationType) => {
        dispatch({ type: 'CREATE_LOAN', payload: { data, durationType } })
    }

    const addPayment = (paymentType, paymentAction) => {
        dispatch({ type: 'ADD_PAYMENT', payload: { paymentType, paymentAction } })
    }

    const togglePaymentOpen = () => {
        if (paymentOpen) {
            setPaymentMonth(undefined)
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

    const schedule = generateSchedule(state.inputData, state.subsequentPayments)
    
    






    const openPaymentToMonth = (paymentMonth) => {
        setPaymentMonth(paymentMonth)
        setPaymentOpen(true)
    }

    


    return (
        <div className={classes.root}>
            <DataInput
                submitDataInput={submitDataInput}
            />
            <PaymentChart
                schedule={schedule}
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
                schedule={schedule}
            />

        </div>
    );
}

export default DebtCalculator;
