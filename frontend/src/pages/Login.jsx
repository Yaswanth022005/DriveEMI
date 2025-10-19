import React, { useState, useContext } from 'react'
import axios from 'axios'
import { TextField, Button, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/login', { email, password })
      const token = res.data.token
      localStorage.setItem('token', token)
      setToken(token)
      navigate('/')
    }catch(err){
      console.error(err)
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={submit}>
        <TextField label="Email" fullWidth value={email} onChange={e=>setEmail(e.target.value)} sx={{ my:1 }} />
        <TextField label="Password" type="password" fullWidth value={password} onChange={e=>setPassword(e.target.value)} sx={{ my:1 }} />
        <Button type="submit" variant="contained">Login</Button>
      </form>
    </Paper>
  )
}
