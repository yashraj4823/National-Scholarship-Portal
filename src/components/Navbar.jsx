import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ userType, onLogout }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate('/')
  }

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-xs">GOI</span>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">National Scholarship Portal</div>
            <div className="text-xs text-green-200">Government of India</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link to="/" className="hover:text-green-200 transition-colors">Home</Link>
          <Link to="/#about" className="hover:text-green-200 transition-colors">About Us</Link>
          <Link to="/#contact" className="hover:text-green-200 transition-colors">Contact Us</Link>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200 transition-colors">New Registration</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white text-primary px-3 py-1 rounded text-xs font-bold hover:bg-green-100 transition-colors">
              Logout
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-1.5"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-green-800 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link to="/" className="pt-3 hover:text-green-200" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/#about" className="hover:text-green-200" onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/#contact" className="hover:text-green-200" onClick={() => setOpen(false)}>Contact Us</Link>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200" onClick={() => setOpen(false)}>New Registration</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white text-primary px-3 py-1.5 rounded text-xs font-bold w-fit hover:bg-green-100 transition-colors">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
