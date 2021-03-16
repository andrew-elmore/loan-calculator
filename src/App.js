import React, {useReducer, useState} from 'react'
import { 
  Button,
  FormControlLabel,
  Switch,
  TextField
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DataInput from './DataInput'
import PaymentSchedule from './PaymentSchedule'
import SubsequentPayment from './SubsequentPayment'

const reducer = (state, action) => {
  Object.freeze(state)
  let currentState = Object.assign({}, state)
  switch (action.type) {
    case 'CREATE_LOAN':
      currentState['inputData'] = action.payload.data
      currentState['durationType'] = action.payload.durationType
      return currentState
    case 'ADD_PAYMENT':
      const {paymentAction, paymentType} = action.payload
      if (paymentType === 'MONTHLY'){
        currentState.subsequentPayments[paymentType] = paymentAction['']
      } else {
        currentState.subsequentPayments[paymentType] = { ...currentState.subsequentPayments[paymentType], ...paymentAction}
      }
      return currentState
    case 'seeState':
      console.log(state)
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    inputData: {},
    durationType: '',
    subsequentPayments: {
      'ONE_TIME': {},
      'MONTHLY': {},
      'YEARLY': {}
    }
  })

  const submitDataInput = (data, durationType) => {
    dispatch({ type: 'CREATE_LOAN', payload: { data, durationType } })
  }
  
  const addPayment = (paymentType, paymentAction) => {
    dispatch({ type: 'ADD_PAYMENT', payload: { paymentType, paymentAction } })
  }

  


  return (
    <div className="App">
      <DataInput
        submitDataInput={submitDataInput}
      />
      <button onClick={() => {console.log(state)}}>STATE</button>
      <SubsequentPayment
        addPayment={addPayment}
      />
      <PaymentSchedule
        inputData={state.inputData}
        durationType={state.durationType}
        subsequentPayments={state.subsequentPayments}
      />

    </div>
  );
} 

export default App;
