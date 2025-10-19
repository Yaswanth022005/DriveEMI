import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-yellow-50 rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4 drop-shadow-lg">
        DriveEMI
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl text-center">
        Calculate your car loan EMI instantly, visualize your payment breakdown,
        and track your history. Secure, fast, and beautiful.
      </p>
      <div className="flex gap-4">
        <Link to="/calculator" className="btn btn-primary">
          Calculator
        </Link>
        <Link to="/history" className="btn btn-secondary">
          History
        </Link>
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl text-blue-500 mb-2">💸</span>
          <h2 className="font-bold text-lg mb-1">Instant EMI Calculation</h2>
          <p className="text-gray-600 text-center">
            Get your monthly payment, total interest, and amortization schedule
            in seconds.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl text-yellow-500 mb-2">📊</span>
          <h2 className="font-bold text-lg mb-1">Visual Insights</h2>
          <p className="text-gray-600 text-center">
            Pie charts and tables make your loan breakdown easy to understand.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-3xl text-green-500 mb-2">🔒</span>
          <h2 className="font-bold text-lg mb-1">Secure History</h2>
          <p className="text-gray-600 text-center">
            Register to save and review your calculations anytime, securely.
          </p>
        </div>
      </div>
    </div>
  );
}
