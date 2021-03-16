import React, { useReducer, useState } from 'react'
import {
    Button,
    TextField,
    Grid
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const PaymentSchedule = (props) => {

    const [inputData, setInputData] = useState(props.inputData)
    const [subsequentPayments, setSubsequentPayments] = useState(props.subsequentPayments)


    if (props.inputData !== inputData){
        console.log('tripped inputData')
        setInputData(props.inputData)
    }

    console.log('props.subsequentPayments', props.subsequentPayments)
    console.log('subsequentPayments', subsequentPayments)
    console.log('props.subsequentPayments !== subsequentPayments', props.subsequentPayments !== subsequentPayments)

    if (props.subsequentPayments !== subsequentPayments){
        console.log('tripped subsequentPayments')
        setSubsequentPayments(props.subsequentPayments)
    }

    
    let originalPrincipal = inputData.loanAmount
    let principal = originalPrincipal
    let rate = inputData.interestRate / 100
    let months = inputData.termMonths
    let monthlyRate = rate / 12
    let years = []
    
    let i = 0 
    while (i < months) {
        let mothlyPayment = (originalPrincipal * monthlyRate * ((1 + monthlyRate) ** months)) / (((1 + monthlyRate) ** months) - 1)
        if (subsequentPayments['ONE_TIME'][i.toString()]){
            console.log('subPayments', subsequentPayments['ONE_TIME'][i.toString()])
            mothlyPayment += parseFloat(subsequentPayments['ONE_TIME'][i.toString()])
        }
        let interestPayment = (principal * monthlyRate) 
        let principalPayment = (mothlyPayment - interestPayment)
        let remainingPrincipal = (principal - principalPayment)
        principal = remainingPrincipal
        years.push({ month: i, mothlyPayment, interestPayment, principalPayment, remainingPrincipal})
        i ++
    }

    const makeDollarAmount = (num) => {
        let roundedNum =Math.round(num * 100)
        let cents = roundedNum % 100
        let dollars = Math.floor(roundedNum / 100)
        let centStr
        if (cents < 10){
            centStr = '0' + cents.toString()
        } else {
            centStr = cents.toString()
        }

        
        let dollarStr = ''
        while (dollars > 1000){
            let section = Math.floor(dollars % 1000)
            dollars = Math.floor(dollars/1000)
            if (section > 100){
                dollarStr += ',' + section.toString()
            } else if (section > 10){
                dollarStr += ',0' + section.toString()
            } else if (section > 1) {
                dollarStr += ',00' + section.toString()
            } else {
                dollarStr += ',000' 
            }
        }
        dollarStr = dollars.toString() + dollarStr

        return ('$ ' + dollarStr + '.' + centStr )


    }


    if (!props.inputData) { return null }


    
    return (
        <div>
            <button
                onClick={() => { console.log(subsequentPayments)}}
            >state</button>
            <Grid container spacing={1}>
                {years.map((year) => {
                    const { month, mothlyPayment, interestPayment, principalPayment, remainingPrincipal } = year
                    return (
                        <Grid container item xs={12} spacing={1}>
                            <Grid container item xs={2} spacing={1}>
                                {month}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>
                                {makeDollarAmount(mothlyPayment)}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>
                                {makeDollarAmount(principalPayment)}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>
                                {makeDollarAmount(interestPayment)}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>
                                {makeDollarAmount(remainingPrincipal)}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>

                            </Grid>
                        </Grid>
                    )
                })}


            </Grid>
        </div>
    )
}

export default PaymentSchedule