import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ userType, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onLogout) onLogout()
    navigate('/')
  }

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Emblem placeholder */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-xs">GOI</span>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">National Scholarship Portal</div>
            <div className="text-xs text-green-200">Government of India</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
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
      </div>
    </nav>
  )
}
