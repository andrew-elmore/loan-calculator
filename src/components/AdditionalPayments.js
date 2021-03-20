import React from 'react'
import {
    IconButton,
    Chip
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const AdditionalPayments = (props) => {

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
                            key={`${type}-${value}`}
                            style={{margin: 1}}
                            label={value}
                            onDelete={handleDelete}
                            style={{ backgroundColor: 'rgb(94, 174, 156)', color: 'white' }}
                        />
                    )
                } else if (type ==='MONTHLY'){
                    return (
                        <Chip
                            key={`${type}-${value}`}
                            style={{ margin: 1 }}
                            color="secondary"
                            label={value}
                            variant="outlined"
                        />
                    )
                } else {
                    return (
                        <Chip
                            key={`${type}-${value}`}
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