import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getSchemes } from '../api/schemes'
import { getMyApplications } from '../api/applications'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [schemes, setSchemes] = useState([])
  const [selected, setSelected] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [myApps, setMyApps] = useState([])
  const [loadingSchemes, setLoadingSchemes] = useState(true)
  const appsRef = useRef(null)

  useEffect(() => {
    getSchemes()
      .then(({ data }) => setSchemes(data))
      .catch(() => {})
      .finally(() => setLoadingSchemes(false))

    getMyApplications()
      .then(({ data }) => setMyApps(data))
      .catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const statusLabel = (s) => {
    const map = {
      pending: 'Pending at Institute',
      institute_verified: 'Forwarded to State',
      institute_rejected: 'Rejected by Institute',
      state_forwarded: 'Forwarded to Ministry',
      state_rejected: 'Rejected by State',
      granted: 'Scholarship Granted',
      ministry_rejected: 'Rejected by Ministry',
    }
    return map[s] || s
  }

  const statusColor = (s) => {
    if (s === 'granted') return 'text-green-700'
    if (s.includes('rejected')) return 'text-red-600'
    return 'text-yellow-700'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <button className="lg:hidden w-full mb-4 btn-secondary text-xs" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? 'Hide Profile & Status ▲' : 'Show Profile & Status ▼'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className={`lg:col-span-1 flex flex-col gap-4 ${sidebarOpen ? 'block' : 'hidden'} lg:flex`}>
            <div className="card border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="font-bold text-sm">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-500">UID: {user?.uid || '—'}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {['My Profile', 'Check Status', 'Logout'].map(item => (
                  <button key={item}
                    onClick={() => {
                      if (item === 'Logout') return handleLogout()
                      if (item === 'My Profile') return navigate('/dashboard/student/profile')
                      if (item === 'Check Status') {
                        if (appsRef.current) {
                          appsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        } else {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        return
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors">
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="card">
              <h3 className="section-title">Application Status</h3>
              {myApps.length === 0 ? (
                <p className="text-xs text-gray-400">No applications yet</p>
              ) : (
                myApps.map((a) => (
                  <div key={a._id} className="text-xs border rounded p-2 bg-yellow-50 mb-2">
                    <p className="font-semibold">{a.scheme?.name}</p>
                    <p className={statusColor(a.status)}>{statusLabel(a.status)}</p>
                    <p className="text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Scheme list */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="section-title">Available Scholarship Schemes</h2>
              {loadingSchemes ? (
                <p className="text-xs text-gray-400">Loading schemes...</p>
              ) : (
                <div className="space-y-3">
                  {schemes.map(s => (
                    <div key={s._id}
                      className={`border rounded p-3 cursor-pointer transition-all ${selected?._id === s._id ? 'border-primary bg-green-50' : 'hover:border-primary hover:bg-green-50'}`}
                      onClick={() => setSelected(s)}>
                      <p className="font-semibold text-sm text-primary">{s.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.eligibility}</p>
                      <div className="flex flex-wrap justify-between items-center mt-2 gap-1">
                        <span className="text-xs font-medium text-green-700">{s.amount}</span>
                        <span className="text-xs text-red-500">
                          Deadline: {new Date(s.deadline).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      {selected?._id === s._id && (
                        <button className="btn-orange w-full mt-3 text-sm lg:hidden"
                          onClick={e => { e.stopPropagation(); navigate(`/dashboard/student/apply/${s.schemeId}`) }}>
                          Apply Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
            <div className="card">
              <h3 className="section-title">Guidelines</h3>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Apply only for schemes you are eligible for</li>
                <li>Keep all documents ready before applying</li>
                <li>Aadhar must be linked to bank account</li>
                <li>Only one application per scheme allowed</li>
                <li>False information leads to disqualification</li>
              </ul>
            </div>
            {selected && (
              <div className="card border-t-4 border-secondary">
                <h3 className="font-bold text-sm text-primary mb-2">{selected.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{selected.description}</p>
                <p className="text-xs"><span className="font-semibold">Amount:</span> {selected.amount}</p>
                <p className="text-xs mt-1"><span className="font-semibold">Deadline:</span> {new Date(selected.deadline).toLocaleDateString('en-IN')}</p>
                <button className="btn-orange w-full mt-4 text-sm"
                  onClick={() => navigate(`/dashboard/student/apply/${selected.schemeId}`)}>
                  Apply Now
                </button>
              </div>
            )}
          </div>

          {/* Guidelines on mobile */}
          <div className="lg:hidden col-span-1">
            <div className="card">
              <h3 className="section-title">Guidelines</h3>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Apply only for schemes you are eligible for</li>
                <li>Keep all documents ready before applying</li>
                <li>Aadhar must be linked to bank account</li>
                <li>Only one application per scheme allowed</li>
                <li>False information leads to disqualification</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
