import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ userType, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

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

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-green-800 px-4 pb-4 flex flex-col gap-3 text-sm font-medium">
          <Link to="/" className="hover:text-green-200 transition-colors pt-3" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/#about" className="hover:text-green-200 transition-colors" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/#contact" className="hover:text-green-200 transition-colors" onClick={() => setMenuOpen(false)}>Contact Us</Link>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200 transition-colors" onClick={() => setMenuOpen(false)}>New Registration</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white text-primary px-3 py-1 rounded text-xs font-bold hover:bg-green-100 transition-colors w-fit">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
