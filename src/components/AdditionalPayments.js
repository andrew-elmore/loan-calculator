import React, { useReducer, useState } from 'react'
import {
    IconButton,
    TextField,
    Grid,
    Chip
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
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
            >
                <AddCircleIcon/>
            </IconButton>
            {Object.entries(payments).map(([type, value]) => {
                if (type === 'ONE_TIME'){
                    return( 
                        <Chip
                            label={value}
                            onDelete={handleDelete}
                        />
                    )
                } else {
                    return (
                        <Chip
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