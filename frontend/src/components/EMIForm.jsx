import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Snackbar, Alert } from '@mui/material'
import { AuthContext } from '../App'

export default function EMIForm({ onResult, initialCarPrice }) {
  const [carPrice, setCarPrice] = useState(initialCarPrice ?? 30000)
  const [downPayment, setDownPayment] = useState(0)
  const [annualRate, setAnnualRate] = useState(7.5)
  const [tenure, setTenure] = useState(60)
  const [loading, setLoading] = useState(false)
  const [save, setSave] = useState(false)
  const { token } = useContext(AuthContext)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // basic validation
      if (Number(carPrice) <= 0) throw new Error('Car price must be > 0')
      if (Number(tenure) <= 0) throw new Error('Tenure must be > 0')
      const headers = {}
      if (token) headers.Authorization = `Bearer ${token}`
      const res = await axios.post('/api/calculate', {
        carPrice: Number(carPrice),
        downPayment: Number(downPayment),
        annualRate: Number(annualRate),
        tenureMonths: Number(tenure),
        save: save
      }, { headers })
      onResult({ ...res.data, amortization: res.data.amortization })
      setSnackbar({ open: true, message: save ? 'Calculated and saved' : 'Calculated', severity: 'success' })
    } catch (err) {
      console.error(err)
      setSnackbar({ open: true, message: err.response?.data?.error || err.message || 'Error calculating EMI', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Car Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
          <input type="number" value={carPrice} onChange={e => setCarPrice(e.target.value)} className="input input-bordered w-full pl-8" min={0} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Down Payment</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
          <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} className="input input-bordered w-full pl-8" min={0} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Annual Interest Rate (%)</label>
        <input type="number" value={annualRate} onChange={e => setAnnualRate(e.target.value)} className="input input-bordered w-full" min={0} step={0.01} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tenure (months)</label>
        <input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="input input-bordered w-full" min={1} required />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)} className="checkbox" id="saveHistory" />
        <label htmlFor="saveHistory" className="text-sm">Save to history</label>
      </div>
      <div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>Calculate</button>
      </div>
    </form>

    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={()=>setSnackbar(s => ({...s, open:false}))}>
      <Alert onClose={()=>setSnackbar(s => ({...s, open:false}))} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  )
}
