import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
// ...existing code...
import { AuthContext } from '../App'

export default function History(){
  const { token } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(null)

  useEffect(()=>{
    if(!token) return
    setLoading(true)
    setError(null)
    axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>{
        // API may return array (legacy) or { items, page, total }
        if (Array.isArray(r.data)) {
          setItems(r.data)
          setTotal(r.data.length)
        } else if (r.data && Array.isArray(r.data.items)) {
          setItems(r.data.items)
          setTotal(r.data.total ?? r.data.items.length)
        } else {
          // unexpected shape
          setItems([])
          setTotal(0)
        }
      })
      .catch(e=>{ console.error(e); setError('Failed to load history') })
      .finally(()=>setLoading(false))
  }, [token])

  if(!token) return (
    <div className="card bg-base-100 shadow p-6 my-4">
      <div className="text-lg font-semibold mb-2">Please login to view your history.</div>
    </div>
  )

  return (
    <div className="card bg-base-100 shadow p-6 my-4">
      <div className="text-2xl font-bold mb-2">Saved Calculations</div>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          {total !== null && <div className="text-sm text-gray-600 mb-2">Total: {total}</div>}
          <ul className="divide-y divide-gray-200">
            {items.map(it=> (
              <li key={it._id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">EMI ₹{it.emi} — {it.tenureMonths} months</div>
                  <div className="text-xs text-gray-500">Total interest: ₹{it.totalInterest} | Car: ₹{it.carPrice}</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => {
                  // navigate to the amortization page with full schedule
                  window.history.pushState({}, '', '/amortization')
                  // use location state via dispatch event to trigger navigate in app (simple approach)
                  const evt = new CustomEvent('showAmortization', { detail: { amortization: it.amortization, meta: it } })
                  window.dispatchEvent(evt)
                }}>View Amortization</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
