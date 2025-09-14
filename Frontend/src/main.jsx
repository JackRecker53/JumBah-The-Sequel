import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { HeroUIProvider } from '@heroui/react'
import sabahTheme from './components/MUIcomponents/theme/sabahTheme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ThemeProvider theme={sabahTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
