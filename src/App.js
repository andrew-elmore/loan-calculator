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


const reducer = (state, action) => {
  Object.freeze(state)
  let currentState = Object.assign({}, state)
  console.log(action)
  switch (action.type) {
    case 'CREATE_LOAN':
      console.log(action)
      currentState['data'] = action.payload.data
      currentState['durationType'] = action.payload.durationType
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
    subsequentPayments: []
  })

  const submitDataInput = (data, durationType) => {
    console.log(data)
    dispatch({ type: 'CREATE_LOAN', payload: { data, durationType } })
  }


  console.log(state)
  return (
    <div className="App">
      <DataInput
        submitDataInput={submitDataInput}
      />

    </div>
  );
} 

export default App;
