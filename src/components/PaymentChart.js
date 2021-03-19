import React from 'react'
import {Line} from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
        background: 'white',
        margin: '2%',
        padding: '3%',
        boxShadow: '1px 1px 5px grey',
        display: 'inline-block',
        width: '57%',
        height: 394,
        verticalAlign: 'top'

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

const PaymentChart = (props) => {
    const classes = useStyles();
    const schedule = props.schedule
    if (schedule.length < 1) {return null}

    let labels = []
    let mothlyPayment = []
    let interestPayment = []
    let principalPayment = []
    let remainingPrincipal = []
    let additionalPayments = []
    let totalInterest = 0
    let runningTotalInterest = []

    schedule.forEach((month) => {
        labels.push(month.numMonth + 1)
        mothlyPayment.push(Math.floor(month.mothlyPayment))
        interestPayment.push(Math.floor(month.interestPayment))
        principalPayment.push(Math.floor(month.principalPayment))
        remainingPrincipal.push(Math.floor(month.remainingPrincipal))
        additionalPayments.push(Math.floor(month.additionalPayments))
        totalInterest += month.interestPayment
        runningTotalInterest.push(Math.floor(totalInterest))
    })

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Total Interest',
                data: runningTotalInterest,
                fill: false,
                backgroundColor: '#e37263',
                borderColor: '#e37263',
            },
        ],
    }

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    }

    return (
        <div className={classes.root} style={{position: 'relative'}}>
            <Line data={data} options={options} />
        </div>
    )
}

export default PaymentChart