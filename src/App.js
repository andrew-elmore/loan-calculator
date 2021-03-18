import React, {useReducer, useState} from 'react'
import DebtCalculator from './DebtCalculator'
import { MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import { red, blue, deepOrange, indigo} from '@material-ui/core/colors'


function App() {
  
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#e37263',
        main: '#e37263',
        dark: 'dd5340'
      },
      secondary: {
        light: '#e37263',
        main: '#536bed',
        dark: 'dd5340'
      },
      // secondary: indigo '#536bed'
    }
  })

  return (
    <MuiThemeProvider theme={theme}>
      <DebtCalculator/>
    </MuiThemeProvider>
  );
} 

export default App;
