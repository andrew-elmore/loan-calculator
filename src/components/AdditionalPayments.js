import React, { useReducer, useState } from 'react'
import {
    IconButton,
    Chip
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        background: 'red'
    },
});


const AdditionalPayments = (props) => {
    const classes = useStyles();

    const payments = props.month.aditionalPaymentsComponents
    const handleDelete = () => {
        props.deleteSubesquentPayment('ONE_TIME', props.month.numMonth)
    }
    return (
        <div>
            <IconButton
                onClick={() => {
                    props.openPaymentToMonth(props.month.numMonth)
                }}
                size="small" 
                color={'secondary'}
            >
                <AddCircleIcon/>
            </IconButton>
            {Object.entries(payments).map(([type, value]) => {
                if (type === 'ONE_TIME'){
                    return( 
                        <Chip
                            style={{margin: 1}}
                            label={value}
                            onDelete={handleDelete}
                        />
                    )
                } else if (type ==='MONTHLY'){
                    return (
                        <Chip
                            style={{ margin: 1 }}
                            color="secondary"
                            label={value}
                            variant="outlined"
                        />
                    )
                } else {
                    return (
                        <Chip
                            style={{ margin: 1 }}
                            color="primary"
                            label={value}
                            variant="outlined"
                        />
                    )
                }
            })}
        </div>
    )
}

export default AdditionalPayments