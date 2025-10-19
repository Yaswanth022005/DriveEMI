import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import EMIForm from '../components/EMIForm'
import EMIChart from '../components/EMIChart'
import AmortizationTable from '../components/AmortizationTable'

export default function Calculator() {
  const location = useLocation()
  const [result, setResult] = useState(null)
  // Get car price and name from navigation state (if present)
  const carPrice = location.state?.carPrice
  const carName = location.state?.carName

  return (
    <div className="card bg-base-100 shadow-xl p-8 my-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Car EMI Calculator</h2>
      {carName && (
        <div className="mb-4 text-lg text-blue-700 font-semibold">Selected Car: {carName} <span className="text-gray-600">(₹{carPrice?.toLocaleString()})</span></div>
      )}
      <EMIForm onResult={setResult} initialCarPrice={carPrice} />
      {result && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <div className="text-lg">EMI: <span className="font-bold text-blue-700">₹{result.emi}</span></div>
              <div className="text-lg">Total Payment: <span className="font-bold text-green-700">₹{result.totalPayment}</span></div>
              <div className="text-lg">Total Interest: <span className="font-bold text-yellow-600">₹{result.totalInterest}</span></div>
            </div>
            <EMIChart principal={result.principal} interest={result.totalInterest} />
          </div>
          {result.amortization && <AmortizationTable rows={result.amortization} />}
        </div>
      )}
    </div>
  )
}
