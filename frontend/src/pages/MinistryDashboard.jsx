import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  getMinistryStats, getMinistryStudentApps, reviewMinistryStudentApp,
  getMinistryInstituteApps, reviewMinistryInstituteApp, getMinistrySchemes, toggleScheme
} from '../api/ministry'
import { useAuth } from '../context/AuthContext'

const StudentBadge = ({ s }) => {
  const c = s === 'state_forwarded' ? 'bg-yellow-100 text-yellow-700' : s === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  const labels = { state_forwarded: 'Pending', granted: 'Granted', ministry_rejected: 'Rejected' }
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{labels[s] || s}</span>
}
const InstBadge = ({ s }) => {
  const c = s === 'approved_by_state' ? 'bg-yellow-100 text-yellow-700' : s === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  const labels = { approved_by_state: 'Pending', approved: 'Approved', rejected: 'Rejected' }
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{labels[s] || s}</span>
}

export default function MinistryDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('students')
  const [stats, setStats] = useState(null)
  const [studentApps, setStudentApps] = useState([])
  const [instApps, setInstApps] = useState([])
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getMinistryStats(),
      getMinistryStudentApps(),
      getMinistryInstituteApps(),
      getMinistrySchemes(),
    ])
      .then(([s, apps, insts, sc]) => {
        setStats(s.data)
        setStudentApps(apps.data)
        setInstApps(insts.data)
        setSchemes(sc.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStudentAction = async (id, action) => {
    try {
      await reviewMinistryStudentApp(id, action)
      setStudentApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'grant' ? 'granted' : 'ministry_rejected' }
        : a
      ))
      alert(action === 'grant' ? "Scholarship granted!" : 'Application rejected.')
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    }
  }

  const handleInstAction = async (id, action) => {
    try {
      const { data } = await reviewMinistryInstituteApp(id, action)
      setInstApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' }
        : a
      ))
      if (action === 'approve') {
        alert(
          `✅ Institute Approved!\n\n` +
          `Institute: ${data.instituteName}\n` +
          `Login UID (Institute Code): ${data.loginId}\n` +
          `Password: (the password set during registration)\n\n` +
          `The institute can now log in using their Institute Code as the UID.`
        )
      } else {
        alert('Registration rejected.')
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    }
  }

  const handleToggleScheme = async (schemeId) => {
    try {
      const { data } = await toggleScheme(schemeId)
      setSchemes(prev => prev.map(s => s.schemeId === schemeId ? { ...s, isActive: data.isActive } : s))
    } catch (err) {
      alert('Failed to toggle scheme.')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const statCards = stats ? [
    { label: 'Total Applications', value: stats.totalApplications?.toLocaleString(), color: 'bg-blue-50 border-blue-300 text-blue-700' },
    { label: 'Scholarships Granted', value: stats.scholarshipsGranted?.toLocaleString(), color: 'bg-green-50 border-green-300 text-green-700' },
    { label: 'Pending Review', value: stats.pendingReview?.toLocaleString(), color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
    { label: 'Institutes Registered', value: stats.institutesRegistered?.toLocaleString(), color: 'bg-purple-50 border-purple-300 text-purple-700' },
  ] : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="ministry" onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">

        <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-primary text-lg">Ministry Dashboard</h1>
            <p className="text-xs text-gray-500">{user?.name}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-xs w-full sm:w-auto">Logout</button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map(s => (
              <div key={s.label} className={`border rounded-lg p-3 sm:p-4 text-center ${s.color}`}>
                <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
                <p className="text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { key: 'students', label: 'Student Applications' },
              { key: 'institutes', label: 'Institute Registrations' },
              { key: 'schemes', label: 'Manage Schemes' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {loading && <p className="text-xs text-gray-400">Loading...</p>}

          {!loading && tab === 'students' && (
            <div>
              <h2 className="section-title mb-3">Student Applications (Approved by State)</h2>
              {studentApps.length === 0 ? <p className="text-xs text-gray-400">No applications pending.</p> : (
                <>
                  <div className="sm:hidden space-y-3">
                    {studentApps.map(app => (
                      <div key={app._id} className="border rounded p-3 bg-white">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div>
                            <p className="font-semibold text-sm">{app.student?.name}</p>
                            <p className="text-xs text-gray-500">{app.scheme?.name}</p>
                            <p className="text-xs font-semibold text-green-700 mt-0.5">{app.scheme?.amount}</p>
                          </div>
                          <StudentBadge s={app.status} />
                        </div>
                        {app.status === 'state_forwarded' && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleStudentAction(app._id, 'grant')}
                              className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded">Grant</button>
                            <button onClick={() => handleStudentAction(app._id, 'reject')}
                              className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary text-white text-xs">
                          {['App ID', 'Student Name', 'Scheme', 'State', 'Amount', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-3 py-2 text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {studentApps.map((app, i) => (
                          <tr key={app._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-3 py-2 text-xs">{app.applicationId}</td>
                            <td className="px-3 py-2 text-xs font-medium">{app.student?.name}</td>
                            <td className="px-3 py-2 text-xs">{app.scheme?.name}</td>
                            <td className="px-3 py-2 text-xs">{app.student?.state}</td>
                            <td className="px-3 py-2 text-xs font-semibold text-green-700">{app.scheme?.amount}</td>
                            <td className="px-3 py-2"><StudentBadge s={app.status} /></td>
                            <td className="px-3 py-2">
                              {app.status === 'state_forwarded' && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleStudentAction(app._id, 'grant')}
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Grant</button>
                                  <button onClick={() => handleStudentAction(app._id, 'reject')}
                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && tab === 'institutes' && (
            <div>
              <h2 className="section-title mb-3">Institute Registration Applications</h2>
              {instApps.length === 0 ? <p className="text-xs text-gray-400">No institute registrations pending.</p> : (
                <>
                  <div className="sm:hidden space-y-3">
                    {instApps.map(app => (
                      <div key={app._id} className="border rounded p-3 bg-white">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div>
                            <p className="font-semibold text-sm">{app.name}</p>
                            <p className="text-xs text-primary font-mono font-semibold">Code: {app.code}</p>
                            <p className="text-xs text-gray-500">{app.state} · {app.type}</p>
                          </div>
                          <InstBadge s={app.status} />
                        </div>
                        {app.status === 'approved_by_state' && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleInstAction(app._id, 'approve')}
                              className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded">Approve</button>
                            <button onClick={() => handleInstAction(app._id, 'reject')}
                              className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary text-white text-xs">
                          {['Institute Name', 'Code (Login UID)', 'State', 'Type', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-3 py-2 text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {instApps.map((app, i) => (
                          <tr key={app._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                            <td className="px-3 py-2 text-xs font-mono font-semibold text-primary">{app.code}</td>
                            <td className="px-3 py-2 text-xs">{app.state}</td>
                            <td className="px-3 py-2 text-xs">{app.type}</td>
                            <td className="px-3 py-2"><InstBadge s={app.status} /></td>
                            <td className="px-3 py-2">
                              {app.status === 'approved_by_state' && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleInstAction(app._id, 'approve')}
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Approve</button>
                                  <button onClick={() => handleInstAction(app._id, 'reject')}
                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && tab === 'schemes' && (
            <div>
              <h2 className="section-title">Scholarship Schemes Management</h2>
              <div className="space-y-3">
                {schemes.map(s => (
                  <div key={s._id} className="flex items-center justify-between border rounded p-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.applicantsCount?.toLocaleString()} applicants</p>
                    </div>
                    <button
                      onClick={() => handleToggleScheme(s.schemeId)}
                      className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 transition-colors ${s.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
