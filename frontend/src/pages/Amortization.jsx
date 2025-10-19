import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function toCurrency(n){
  return '₹'+Number(n).toLocaleString()
}

function downloadCSV(rows, filename='amortization.csv'){
  if(!rows || rows.length===0) return
  const header = Object.keys(rows[0])
  const csv = [header.join(',')].concat(rows.map(r=>header.map(h=>`"${r[h]}"`).join(','))).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function Amortization(){
  const { state } = useLocation()
  const navigate = useNavigate()
  const rows = state?.amortization || []
  const meta = state?.meta || {}
  const [page, setPage] = useState(1)
  const perPage = 12

  const totalPages = Math.max(1, Math.ceil(rows.length / perPage))
  const pageRows = useMemo(()=> rows.slice((page-1)*perPage, page*perPage), [rows, page])

  if(!rows || rows.length===0) return (
    <div className="card bg-base-100 shadow p-6 my-4">
      <div className="text-lg font-semibold">No amortization data available.</div>
      <div className="mt-4">
        <button className="btn btn-primary" onClick={()=>navigate(-1)}>Go back</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Amortization Schedule</h1>
          {meta.carName && <div className="text-sm text-gray-600">{meta.carName} — {meta.tenureMonths} months</div>}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => downloadCSV(rows, `${meta.carName||'amortization'}.csv`)}>Export CSV</button>
          <button className="btn" onClick={()=>navigate(-1)}>Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Monthly EMI</div>
          <div className="text-xl font-bold">{toCurrency(meta.emi ?? (rows[0]?.emi || 0))}</div>
        </div>
        <div className="card bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Total Interest</div>
          <div className="text-xl font-bold">{toCurrency(meta.totalInterest ?? rows.reduce((s,r)=>s + Number(r.interest||0),0))}</div>
        </div>
        <div className="card bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Total Payment</div>
          <div className="text-xl font-bold">{toCurrency(meta.totalPayment ?? rows.reduce((s,r)=>s + Number(r.principalPaid||0) + Number(r.interest||0),0))}</div>
        </div>
      </div>

      <div className="card bg-white p-4 shadow">
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={rows.map(r=>({month: r.month, balance: Number(r.balance)}))}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(val)=>toCurrency(val)} />
              <Area type="monotone" dataKey="balance" stroke="#2563eb" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card bg-white p-4 shadow">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>Month</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r=> (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{toCurrency(r.principalPaid)}</td>
                <td>{toCurrency(r.interest)}</td>
                <td>{toCurrency(r.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
          <div className="flex gap-2">
            <button className="btn btn-sm" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
            <button className="btn btn-sm" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
