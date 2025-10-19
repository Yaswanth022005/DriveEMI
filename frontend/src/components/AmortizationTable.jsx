import React from 'react'

export default function AmortizationTable({ rows = [] }) {
  if (!rows || rows.length === 0) return null
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="table table-zebra w-full rounded-xl shadow">
        <thead>
          <tr>
            <th>Month</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 12).map(r => (
            <tr key={r.month}>
              <td>{r.month}</td>
              <td>{r.principalPaid}</td>
              <td>{r.interest}</td>
              <td>{r.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
