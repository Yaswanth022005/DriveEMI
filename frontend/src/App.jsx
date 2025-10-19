import React, { useState, createContext } from 'react'
import { Container, Box, Typography, Paper } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import NavBar from './components/NavBar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EMIForm from './components/EMIForm'
import EMIChart from './components/EMIChart'
import AmortizationTable from './components/AmortizationTable'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Cars from './pages/Cars'
import Amortization from './pages/Amortization'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function EventBridge(){
  const navigate = useNavigate()
  useEffect(()=>{
    function onShow(e){
      const { amortization, meta } = e.detail || {}
      navigate('/amortization', { state: { amortization, meta } })
    }
    window.addEventListener('showAmortization', onShow)
    return () => window.removeEventListener('showAmortization', onShow)
  }, [navigate])
  return null
}

export const AuthContext = createContext({ token: null, setToken: () => {} })

// Home page is now a separate file with Tailwind/DaisyUI styling

export default function App() {
  const tokenState = useState(localStorage.getItem('token'))
  const [token, setToken] = tokenState

  const theme = createTheme({
    palette: {
      primary: { main: '#1E3A8A' },
      secondary: { main: '#FBBF24' },
      background: { default: '#F9FAFB' }
    }
  })

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <NavBar />
          <EventBridge />
          <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/amortization" element={<Amortization />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

// NavBar handles logout UI and navigation now
