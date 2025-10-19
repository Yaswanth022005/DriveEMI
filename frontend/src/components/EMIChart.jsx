import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563eb', '#fbbf24', '#10b981', '#ef4444', '#6366f1', '#f472b6']

export default function EMIChart({ principal, interest }) {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: interest }
  ]

  return (
    <div className="w-full h-60 bg-white rounded-xl shadow p-4 flex items-center justify-center">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
