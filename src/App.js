import React, {useReducer} from 'react'
import { Button } from '@material-ui/core';


function App() {
   const [state, dispatch] = useReducer(reducer, initialState, init)
  return (
    <div className="App">
      <Button>Test</Button>
    </div>
  );
}

export default App;
