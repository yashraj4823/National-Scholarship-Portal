import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getInstituteApplications, instituteAction } from '../api/applications'
import { useAuth } from '../context/AuthContext'

export default function InstituteDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [apps, setApps] = useState([])
  const [selected, setSelected] = useState(null)
  const [bonafide, setBonafide] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getInstituteApplications()
      .then(({ data }) => setApps(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async (id, action) => {
    setActionLoading(true)
    try {
      await instituteAction(id, action, '', bonafide)
      setApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'verify' ? 'institute_verified' : 'institute_rejected' }
        : a
      ))
      setSelected(null)
      setBonafide(null)
      alert(action === 'verify' ? 'Application forwarded to State Nodal Officer.' : 'Application rejected.')
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    } finally {
      setActionLoading(false)
    }
  }

  const statusColor = s =>
    s === 'pending' ? 'bg-yellow-100 text-yellow-700' :
    s === 'institute_verified' ? 'bg-green-100 text-green-700' :
    'bg-red-100 text-red-700'

  const statusLabel = s =>
    s === 'pending' ? 'Pending' :
    s === 'institute_verified' ? 'Forwarded to State' :
    'Rejected'

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="institute" onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <button className="lg:hidden w-full mb-4 btn-secondary text-xs" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? 'Hide Institute Info ▲' : 'Show Institute Info ▼'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="card border-l-4 border-primary">
              <div className="mb-4">
                <p className="font-bold text-sm text-primary">{user?.name || 'Institute'}</p>
                <p className="text-xs text-gray-500">Code: {user?.code || '—'}</p>
              </div>
              <nav className="space-y-1">
                {['View Student Applications', 'Logout'].map(item => (
                  <button key={item} onClick={() => item === 'Logout' && handleLogout()}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors">
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Application list */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="section-title mb-4">Student Applications</h2>
              {loading ? (
                <p className="text-xs text-gray-400">Loading applications...</p>
              ) : apps.length === 0 ? (
                <p className="text-xs text-gray-400">No applications found.</p>
              ) : (
                <div className="space-y-3">
                  {apps.map(app => (
                    <div key={app._id}
                      className={`border rounded p-3 cursor-pointer transition-all ${selected?._id === app._id ? 'border-primary bg-green-50' : 'hover:border-primary'}`}
                      onClick={() => setSelected(app)}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{app.student?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{app.scheme?.name}</p>
                          <p className="text-xs text-gray-400">UID: {app.student?.uid}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusColor(app.status)}`}>
                          {statusLabel(app.status)}
                        </span>
                      </div>

                      {/* Mobile inline action */}
                      {selected?._id === app._id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 lg:hidden space-y-2">
                          <label className="cursor-pointer block">
                            <input type="file" className="hidden" onChange={e => setBonafide(e.target.files[0])} />
                            <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                              {bonafide ? bonafide.name : 'Upload Bonafide Certificate'}
                            </span>
                          </label>
                          {app.status === 'pending' && (
                            <>
                              <button disabled={actionLoading} onClick={e => { e.stopPropagation(); handleAction(app._id, 'verify') }}
                                className="btn-primary w-full text-sm">
                                {actionLoading ? 'Processing...' : 'Verify & Forward to State'}
                              </button>
                              <button disabled={actionLoading} onClick={e => { e.stopPropagation(); handleAction(app._id, 'reject') }}
                                className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50">
                                Reject Application
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop action panel */}
          <div className="lg:col-span-1 hidden lg:block">
            {selected ? (
              <div className="card border-t-4 border-secondary">
                <h3 className="font-bold text-sm text-primary mb-3">Student Application</h3>
                <p className="text-sm font-semibold">{selected.student?.name}</p>
                <p className="text-xs text-gray-500 mb-1">{selected.scheme?.name}</p>
                <p className="text-xs text-gray-400 mb-4">ID: {selected.applicationId}</p>
                <div className="space-y-3">
                  <label className="cursor-pointer block">
                    <input type="file" className="hidden" onChange={e => setBonafide(e.target.files[0])} />
                    <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                      {bonafide ? bonafide.name : 'Upload Bonafide Certificate'}
                    </span>
                  </label>
                  {selected.status === 'pending' && (
                    <>
                      <button disabled={actionLoading} onClick={() => handleAction(selected._id, 'verify')} className="btn-primary w-full text-sm">
                        {actionLoading ? 'Processing...' : 'Verify & Forward to State'}
                      </button>
                      <button disabled={actionLoading} onClick={() => handleAction(selected._id, 'reject')}
                        className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50">
                        Reject Application
                      </button>
                    </>
                  )}
                  {selected.status !== 'pending' && (
                    <p className={`text-xs text-center font-semibold ${selected.status === 'institute_verified' ? 'text-green-600' : 'text-red-600'}`}>
                      {statusLabel(selected.status)}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center text-gray-400 text-sm py-10">Select an application to review</div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
