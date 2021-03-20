import React, {useState} from 'react'
import { Line, Bar} from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles({
    root: {
        background: 'white',
        margin: '2%',
        padding: '3%',
        boxShadow: '1px 1px 5px grey',
        display: 'inline-block',
        width: '55%',
        height: 425,
        verticalAlign: 'top',
        paddingTop: 10
    },
    heading: {
        // textAlign: 'center',
        color: '#4a4a4a',
        fontFamily: 'sofia-pro',
        fontWeight: '600',
        fontStyle: 'normal',
        fontSize: '20px',
    },
    chart: {
    }
});

const PaymentChart = (props) => {
    const classes = useStyles();
    const schedule = props.schedule

    const [graph, setGraph] = useState('REMAINING_BALANCE')


    if (schedule.length < 1) {return null}

    let labels = []
    let mothlyPayment = []
    let interestPayment = []
    let principalPayment = []
    let remainingPrincipal = []
    let additionalPayments = []
    let totalInterest = 0
    let runningTotalInterest = []
    let oneTime = []
    let monthly = []
    let yearly = []
    let minimumMonthly = []

    console.log(schedule[0])
    schedule.forEach((month) => {

        labels.push(month.numMonth + 1)
        mothlyPayment.push(Math.floor(month.mothlyPayment))
        interestPayment.push(Math.floor(month.interestPayment))
        principalPayment.push(Math.floor(month.principalPayment))
        remainingPrincipal.push(Math.floor(month.remainingPrincipal))
        additionalPayments.push(Math.floor(month.additionalPayments))
        totalInterest += month.interestPayment
        runningTotalInterest.push(Math.floor(totalInterest))

        if (month.remainingPrincipal > 0) {
            const oneTimeInstance = parseInt(month.aditionalPaymentsComponents['ONE_TIME']) || 0
            const monthlyInstance = parseInt(month.aditionalPaymentsComponents['MONTHLY']) || 0
            const yearlyInstance = parseInt(month.aditionalPaymentsComponents['YEARLY']) || 0
            const minPayment = Math.floor(month.mothlyPayment - oneTimeInstance - monthlyInstance - yearlyInstance)
            oneTime.push(oneTimeInstance)
            monthly.push(monthlyInstance)
            yearly.push(yearlyInstance)
            minimumMonthly.push(Math.max(minPayment, 0))
        }
        
    })



    const totalInterestChart = () => {
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
    
        const options = {}

        return (<Line className={classes.chart} data={data} options={options} />)


    }

    const paymentScheduleChart = () => {
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Minimum Payment',
                    data: minimumMonthly,
                    backgroundColor: '#e0e0e0',
                },
                {
                    label: 'Additional One Time Payment',
                    data: oneTime,
                    backgroundColor: 'rgb(94, 174, 156)',
                },
                {
                    label: 'Aditional Monthly Payments',
                    data: monthly,
                    backgroundColor: '#536bed',
                },
                {
                    label: 'Additional Annual Payments',
                    data: yearly,
                    backgroundColor: '#e37263',
                },
            ]
        }
        const options = {
            scales: {
                yAxes: [ {stacked: true, ticks: {beginAtZero: true}}], 
                xAxes: [{ stacked: true }],
            },
        }


        return (<Bar data={data} options={options} />)

    }

    const remainingBalanceChart = () => {
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Remaining Principal',
                    data: remainingPrincipal,
                    fill: false,
                    backgroundColor: '#536bed',
                    borderColor: '#536bed',
                },
            ],
        }

        const options = {}

        return (<Line className={classes.chart} data={data} options={options} />)

    }


    const selectChart = () =>{
        if (graph === 'TOTAL_INTEREST'){
            return totalInterestChart()
        } else if (graph === 'REMAINING_BALANCE'){
            return remainingBalanceChart()
        }else {
            return paymentScheduleChart()
        }
    }




    return (
        <div className={classes.root} style={{position: 'relative'}}>
            <Typography className={classes.heading}>Select A Chart</Typography>

            <FormControl className={classes.inputs}>
                <Select
                    value={graph}
                    onChange={(e) => {setGraph(e.target.value)}}
                >
                    <MenuItem value={'REMAINING_BALANCE'}>Remaining Balance</MenuItem>
                    <MenuItem value={'PAYMENT_SCHEDULE'}>Payment Schedule</MenuItem>
                    <MenuItem value={'TOTAL_INTEREST'}>Total Interest Paid</MenuItem>

                </Select>
            </FormControl>

            {selectChart()}
            {/* {totalInterestChart()} */}
        </div>
    )
}

export default PaymentChart

//#536bed