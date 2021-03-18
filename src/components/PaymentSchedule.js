import React, { useReducer, useState } from 'react'
import {
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AdditionalPayments from './AdditionalPayments'


const useStyles = makeStyles({
    root: {
        background: 'white',
        margin: '2%',
        marginTop: '0',
        padding: '3%',
        boxShadow: '1px 1px 5px grey',
        alignItems: 'center',
        display: 'block',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        background: 'grey',
        color: 'white',
        padding: 20,
        marginBottom: 10
    }
});

const PaymentSchedule = (props) => {
    const classes = useStyles();

    const [inputData, setInputData] = useState(props.inputData)
    const [subsequentPayments, setSubsequentPayments] = useState(props.subsequentPayments)


    if (props.inputData !== inputData){
        setInputData(props.inputData)
    }


    if (props.subsequentPayments !== subsequentPayments){
        setSubsequentPayments(props.subsequentPayments)
    }

    if (!props.inputData.loanAmount) { return null }


    
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
        if (parseFloat(subsequentPayments['MONTHLY']) > 0){
            aditionalPaymentsComponents = { ['MONTHLY']: parseFloat(subsequentPayments['MONTHLY'])}
        }
        if (subsequentPayments['ONE_TIME'][i]){
            additionalPayments += parseFloat(subsequentPayments['ONE_TIME'][i])
            aditionalPaymentsComponents['ONE_TIME'] = parseFloat(subsequentPayments['ONE_TIME'][i])
        }
        
        if (subsequentPayments['YEARLY'][(i % 12)]){
            additionalPayments += parseFloat(subsequentPayments['YEARLY'][(i % 12)])
            aditionalPaymentsComponents['YEARLY'] = parseFloat(subsequentPayments['YEARLY'][i%12])
        }
        
        mothlyPayment += additionalPayments
        
        mothlyPayment = Math.min(principal * (1 + monthlyRate), mothlyPayment)

        let interestPayment = (principal * monthlyRate) 
        let principalPayment = (mothlyPayment - interestPayment)
        let remainingPrincipal = (principal - principalPayment)
        principal = remainingPrincipal
        months.push({ numMonth: i, mothlyPayment, interestPayment, principalPayment, remainingPrincipal, additionalPayments, aditionalPaymentsComponents})
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




    
    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid className={classes.header} container item xs={12} spacing={1}>
                    <Grid container item xs={2} spacing={1}>
                        Month
                    </Grid>
                    <Grid container item xs={2} spacing={1}>
                        Monthly Payment
                    </Grid>
                    <Grid container item xs={2} spacing={1}>
                        Principal Payment
                    </Grid>
                    <Grid container item xs={2} spacing={1}>
                        Interest Payment
                    </Grid>
                    <Grid container item xs={2} spacing={1}>
                        Remaining Principal
                    </Grid>
                    <Grid container item xs={2} spacing={1}>
                        Additional Payments
                    </Grid>
                </Grid>
                {months.map((month) => {
                    const { numMonth, mothlyPayment, interestPayment, principalPayment, remainingPrincipal } = month
                    const backgroundColor = numMonth % 2 ? 'white' : '#e3f1ff'
                    return (
                        <Grid style={{backgroundColor, height: 50}} container item xs={12} spacing={1}>
                            <Grid style={{ marginTop: 5}} container item xs={2} spacing={1}>
                                {numMonth}
                            </Grid>
                            <Grid style={{ marginTop: 5 }} container item xs={2} spacing={1}>
                                {makeDollarAmount(mothlyPayment)}
                            </Grid>
                            <Grid style={{ marginTop: 5 }} container item xs={2} spacing={1}>
                                {makeDollarAmount(principalPayment)}
                            </Grid>
                            <Grid style={{ marginTop: 5 }} container item xs={2} spacing={1}>
                                {makeDollarAmount(interestPayment)}
                            </Grid>
                            <Grid style={{ marginTop: 5 }} container item xs={2} spacing={1}>
                                {makeDollarAmount(remainingPrincipal)}
                            </Grid>
                            <Grid container item xs={2} spacing={1}>
                                <AdditionalPayments
                                    month={month}
                                    openPaymentToMonth={props.openPaymentToMonth}
                                    deleteSubesquentPayment={props.deleteSubesquentPayment}
                                />
                            </Grid>
                        </Grid>
                    )
                })}


            </Grid>
        </div>
    )
}

export default PaymentSchedule