import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ userType, onLogout }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const pathname = location.pathname

  const onStudentProfilePage = pathname === '/dashboard/student/profile'
  const onInstituteProfilePage = pathname === '/dashboard/institute/profile'

  const handleLogout = () => {
    if (onLogout) onLogout()
    else logout()
    navigate('/')
  }

  const shouldLogoutOnNav = user?.role === 'student' || user?.role === 'institute'

  const handleNavTo = (path) => {
    if (shouldLogoutOnNav) {
      if (onLogout) onLogout()
      else logout()
      navigate(path)
    } else {
      navigate(path)
    }
  }

  const isStudent = userType === 'student' || user?.role === 'student' || user?.type === 'student' || user?.userType === 'student'
  const isInstitute = userType === 'institute' || user?.role === 'institute' || user?.type === 'institute' || user?.userType === 'institute'

  return (
    <nav className="bg-primary/90 text-white shadow-[0_25px_50px_rgba(26,107,60,0.22)] border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <button type="button" onClick={() => handleNavTo('/')} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <svg viewBox="0 0 64 64" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="#ffffff" />
              <rect width="64" height="18" fill="#FF9933" />
              <rect y="18" width="64" height="28" fill="#ffffff" />
              <rect y="46" width="64" height="18" fill="#138808" />
              <circle cx="32" cy="32" r="8" fill="#102A43" />
              <circle cx="32" cy="32" r="5" fill="#ffffff" />
              <circle cx="32" cy="32" r="2" fill="#102A43" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">National Scholarship Portal</div>
            <div className="text-xs text-green-200">Government of India</div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <button onClick={() => { if (shouldLogoutOnNav) { handleLogout() } else navigate('/') }} className="hover:text-green-200 transition-colors">Home</button>
          {onStudentProfilePage && (
            <button onClick={() => navigate('/dashboard/student')} className="hover:text-green-200 transition-colors">Student Dashboard</button>
          )}
          {onInstituteProfilePage && (
            <button onClick={() => navigate('/dashboard/institute')} className="hover:text-green-200 transition-colors">Institute Dashboard</button>
          )}
          <button onClick={() => handleNavTo('/#about')} className="hover:text-green-200 transition-colors">About Us</button>
          <button onClick={() => handleNavTo('/#contact')} className="hover:text-green-200 transition-colors">Contact Us</button>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200 transition-colors">New Registration</Link>
          )}
          {isStudent && (
            <Link to="/dashboard/student/profile" className="hover:text-green-200 transition-colors">Profile</Link>
          )}
          {isInstitute && (
            <Link to="/dashboard/institute/profile" className="hover:text-green-200 transition-colors">Profile</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white/95 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition">
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
          <button className="pt-3 hover:text-green-200 text-left" onClick={() => { setOpen(false); if (shouldLogoutOnNav) { handleLogout() } else navigate('/') }}>Home</button>
          {onStudentProfilePage && (
            <button className="hover:text-green-200 text-left" onClick={() => { setOpen(false); navigate('/dashboard/student') }}>Student Dashboard</button>
          )}
          {onInstituteProfilePage && (
            <button className="hover:text-green-200 text-left" onClick={() => { setOpen(false); navigate('/dashboard/institute') }}>Institute Dashboard</button>
          )}
          <button className="hover:text-green-200 text-left" onClick={() => { setOpen(false); handleNavTo('/#about') }}>About Us</button>
          <button className="hover:text-green-200 text-left" onClick={() => { setOpen(false); handleNavTo('/#contact') }}>Contact Us</button>
          {!userType && (
            <Link to="/register/student" className="hover:text-green-200" onClick={() => setOpen(false)}>New Registration</Link>
          )}
          {isStudent && (
            <Link to="/dashboard/student/profile" className="hover:text-green-200" onClick={() => setOpen(false)}>Profile</Link>
          )}
          {isInstitute && (
            <Link to="/dashboard/institute/profile" className="hover:text-green-200" onClick={() => setOpen(false)}>Profile</Link>
          )}
          {userType && (
            <button onClick={handleLogout} className="bg-white/95 text-primary px-4 py-2 rounded-full text-xs font-bold w-fit hover:bg-white transition">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
