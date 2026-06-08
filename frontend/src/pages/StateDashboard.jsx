import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  getStateStudentApps, reviewStateStudentApp,
  getStateInstituteApps, reviewStateInstituteApp
} from '../api/state'
import { useAuth } from '../context/AuthContext'

const Badge = ({ status }) => {
  const c = status === 'institute_verified' || status === 'pending'
    ? 'bg-yellow-100 text-yellow-700'
    : status === 'state_forwarded' || status === 'approved_by_state'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700'
  const labels = {
    institute_verified: 'Pending',
    pending: 'Pending',
    state_forwarded: 'Forwarded to Ministry',
    approved_by_state: 'Forwarded to Ministry',
    state_rejected: 'Rejected',
    rejected: 'Rejected',
  }
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{labels[status] || status}</span>
}

export default function StateDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('students')
  const [studentApps, setStudentApps] = useState([])
  const [instApps, setInstApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudentApp, setSelectedStudentApp] = useState(null)
  const [selectedInstituteApp, setSelectedInstituteApp] = useState(null)

  useEffect(() => {
    Promise.all([getStateStudentApps(), getStateInstituteApps()])
      .then(([s, i]) => { setStudentApps(s.data); setInstApps(i.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStudentAction = async (id, action) => {
    try {
      await reviewStateStudentApp(id, action)
      setStudentApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'forward' ? 'state_forwarded' : 'state_rejected' }
        : a
      ))
      setSelectedStudentApp(null)
      alert(action === 'forward' ? 'Application forwarded to Ministry.' : 'Application rejected.')
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    }
  }

  const handleInstAction = async (id, action) => {
    try {
      await reviewStateInstituteApp(id, action)
      setInstApps(prev => prev.map(a => a._id === id
        ? { ...a, status: action === 'forward' ? 'approved_by_state' : 'rejected' }
        : a
      ))
      setSelectedInstituteApp(null)
      alert(action === 'forward' ? 'Institute forwarded to Ministry.' : 'Registration rejected.')
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="state" onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-bold text-primary text-lg">State Nodal Officer Dashboard</h1>
              <p className="text-xs text-gray-500">{user?.name}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary text-xs w-full sm:w-auto">Logout</button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {['students', 'institutes'].map(t => (
              <button key={t} onClick={() => { setTab(t); setSelectedStudentApp(null); setSelectedInstituteApp(null) }}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {t === 'students' ? 'Student Applications' : 'Institute Registrations'}
              </button>
            ))}
          </div>

          {loading && <p className="text-xs text-gray-400">Loading...</p>}

          {!loading && tab === 'students' && (
            <div>
              <h2 className="section-title mb-3">Student Applications (Forwarded by Institutes)</h2>
                {studentApps.length === 0 ? (
                  <p className="text-xs text-gray-400">No applications pending.</p>
                ) : (
                  <>
                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-3">
                      {studentApps.map(app => (
                        <div key={app._id} className={`border rounded p-3 bg-white cursor-pointer transition-all ${selectedStudentApp?._id === app._id ? 'border-primary bg-green-50' : 'hover:border-primary'}`}
                          onClick={() => setSelectedStudentApp(app)}>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div>
                              <p className="font-semibold text-sm">{app.student?.name}</p>
                              <p className="text-xs text-gray-500">{app.scheme?.name}</p>
                              <p className="text-xs text-gray-400">UID: {app.student?.uid}</p>
                            </div>
                            <Badge status={app.status} />
                          </div>
                          {selectedStudentApp?._id === app._id && app.status === 'institute_verified' && (
                            <div className="flex gap-2 mt-3 border-t pt-3">
                              <button onClick={(e) => { e.stopPropagation(); handleStudentAction(app._id, 'forward') }}
                                className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Forward</button>
                              <button onClick={(e) => { e.stopPropagation(); handleStudentAction(app._id, 'reject') }}
                                className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded hover:bg-red-600">Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-primary text-white text-xs">
                            {['App ID', 'Student Name', 'Scheme', 'State', 'Status', 'Actions'].map(h => (
                              <th key={h} className="px-3 py-2 text-left">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {studentApps.map((app, i) => (
                            <tr key={app._id} className={`cursor-pointer transition-all ${selectedStudentApp?._id === app._id ? 'border-l-4 border-primary bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                              onClick={() => setSelectedStudentApp(app)}>
                              <td className="px-3 py-2 text-xs">{app.applicationId}</td>
                              <td className="px-3 py-2 text-xs font-medium">{app.student?.name}</td>
                              <td className="px-3 py-2 text-xs">{app.scheme?.name}</td>
                              <td className="px-3 py-2 text-xs">{app.student?.state}</td>
                              <td className="px-3 py-2"><Badge status={app.status} /></td>
                              <td className="px-3 py-2">
                                {app.status === 'institute_verified' && (
                                  <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleStudentAction(app._id, 'forward') }}
                                      className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleStudentAction(app._id, 'reject') }}
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

          {/* Modal for Student Application Details */}
          {selectedStudentApp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-98 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
                  <h3 className="font-bold text-lg text-primary">Application Details</h3>
                  <button onClick={() => setSelectedStudentApp(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Name</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.student?.name || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Application ID</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.applicationId || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Scheme</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.scheme?.name || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Status</p>
                      <p className="text-sm"><Badge status={selectedStudentApp.status} /></p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Aadhar</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.aadhar || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Annual Income</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.annualIncome ? `₹${selectedStudentApp.annualIncome}` : '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Father Name</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.fatherName || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Mother Name</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.motherName || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Community</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.community || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Religion</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.religion || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Institute Name</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.instituteName || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Class</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.presentClass || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">10th Percentage</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.class10?.percentage ?? '—'}%</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">12th Percentage</p>
                      <p className="text-sm text-gray-800">{selectedStudentApp.class12?.percentage ?? '—'}%</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {selectedStudentApp.status === 'institute_verified' && (
                      <>
                        <button onClick={() => handleStudentAction(selectedStudentApp._id, 'forward')}
                          className="w-full text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium">
                          Forward to Ministry
                        </button>
                        <button onClick={() => handleStudentAction(selectedStudentApp._id, 'reject')}
                          className="w-full text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium">
                          Reject Application
                        </button>
                      </>
                    )}
                    {selectedStudentApp.status !== 'institute_verified' && (
                      <p className={`text-sm text-center font-semibold py-2 ${selectedStudentApp.status === 'state_forwarded' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStudentApp.status === 'state_forwarded' ? 'Forwarded to Ministry' : 'Rejected'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && tab === 'institutes' && (
            <div>
              <h2 className="section-title mb-3">Institute Registration Applications</h2>
              {instApps.length === 0 ? (
                <p className="text-xs text-gray-400">No institute registrations pending.</p>
              ) : (
                <>
                  <div className="sm:hidden space-y-3">
                    {instApps.map(app => (
                      <div key={app._id} className={`border rounded p-3 bg-white cursor-pointer transition-all ${selectedInstituteApp?._id === app._id ? 'border-primary bg-green-50' : 'hover:border-primary'}`}
                        onClick={() => setSelectedInstituteApp(app)}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <p className="font-semibold text-sm">{app.name}</p>
                            <p className="text-xs text-gray-500">{app.district} · {app.type}</p>
                          </div>
                          <Badge status={app.status} />
                        </div>
                        {selectedInstituteApp?._id === app._id && app.status === 'pending' && (
                          <div className="flex gap-2 mt-3 border-t pt-3">
                            <button onClick={(e) => { e.stopPropagation(); handleInstAction(app._id, 'forward') }}
                              className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Forward</button>
                            <button onClick={(e) => { e.stopPropagation(); handleInstAction(app._id, 'reject') }}
                              className="flex-1 text-xs bg-red-500 text-white py-1.5 rounded hover:bg-red-600">Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary text-white text-xs">
                          {['Institute Name', 'District', 'Type', 'State', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-3 py-2 text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {instApps.map((app, i) => (
                          <tr key={app._id} className={`cursor-pointer transition-all ${selectedInstituteApp?._id === app._id ? 'border-l-4 border-primary bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            onClick={() => setSelectedInstituteApp(app)}>
                            <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                            <td className="px-3 py-2 text-xs">{app.district}</td>
                            <td className="px-3 py-2 text-xs">{app.type}</td>
                            <td className="px-3 py-2 text-xs">{app.state}</td>
                            <td className="px-3 py-2"><Badge status={app.status} /></td>
                            <td className="px-3 py-2">
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); handleInstAction(app._id, 'forward') }}
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                                  <button onClick={(e) => { e.stopPropagation(); handleInstAction(app._id, 'reject') }}
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

          {/* Modal for Institute Application Details */}
          {selectedInstituteApp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-98 overflow-y-auto">
                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
                  <h3 className="font-bold text-lg text-primary">Institute Details</h3>
                  <button onClick={() => setSelectedInstituteApp(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Institute Name</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.name || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Institute Code</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.code || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">District</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.district || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">State</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.state || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Type</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.type || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Category</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.category || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Contact Person</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.contact.principalName || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Contact Email</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.email || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Contact Phone</p>
                      <p className="text-sm text-gray-800">{selectedInstituteApp.contact.mobile || '—'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-600 uppercase">Status</p>
                      <p className="text-sm"><Badge status={selectedInstituteApp.status} /></p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-xs text-gray-600 uppercase">Address</p>
                      <p className="text-sm text-gray-800">
                        {selectedInstituteApp.address 
                          ? `${selectedInstituteApp.address.line1}, ${selectedInstituteApp.address.line2}, ${selectedInstituteApp.address.city}, ${selectedInstituteApp.address.district}, ${selectedInstituteApp.address.state} - ${selectedInstituteApp.address.pincode}`
                          : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {selectedInstituteApp.status === 'pending' && (
                      <>
                        <button onClick={() => handleInstAction(selectedInstituteApp._id, 'forward')}
                          className="w-full text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium">
                          Forward to Ministry
                        </button>
                        <button onClick={() => handleInstAction(selectedInstituteApp._id, 'reject')}
                          className="w-full text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-medium">
                          Reject Registration
                        </button>
                      </>
                    )}
                    {selectedInstituteApp.status !== 'pending' && (
                      <p className={`text-sm text-center font-semibold py-2 ${selectedInstituteApp.status === 'approved_by_state' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedInstituteApp.status === 'approved_by_state' ? 'Forwarded to Ministry' : 'Rejected'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
