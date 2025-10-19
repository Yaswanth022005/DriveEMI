import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

export default function NavBar() {
  const { token, setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  return (
    <nav className="navbar bg-base-100 shadow-md mb-2 rounded-xl">
      <div className="container mx-auto flex flex-row items-center justify-between px-2">
        <Link to="/" className="text-2xl font-bold text-blue-900">DriveEMI</Link>
        <div className="flex gap-2">
          <Link to="/calculator" className="btn btn-ghost">Calculator</Link>
          <Link to="/cars" className="btn btn-ghost">All Cars</Link>
          <Link to="/history" className="btn btn-ghost">History</Link>
          {!token ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <button className="btn btn-error btn-sm" onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}
