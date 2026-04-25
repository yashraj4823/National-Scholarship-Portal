import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const mockStudentApps = [
  { id: 'APP001', name: 'Rahul Sharma', scheme: 'Post Matric Scholarship', institute: 'Govt. Polytechnic Mumbai', status: 'Pending' },
  { id: 'APP002', name: 'Priya Patel', scheme: 'Pragati Scholarship', institute: 'VJTI Mumbai', status: 'Pending' },
]

const mockInstituteApps = [
  { id: 'INST002', name: 'New Engineering College', district: 'Pune', type: 'Engineering', status: 'Pending' },
]

export default function StateDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('students')
  const [studentApps, setStudentApps] = useState(mockStudentApps)
  const [instApps, setInstApps] = useState(mockInstituteApps)

  const handleStudentAction = (id, action) => {
    setStudentApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'forward' ? 'Forwarded to Ministry' : 'Rejected' } : a))
    alert(action === 'forward' ? 'Application forwarded to Ministry.' : 'Application rejected.')
  }

  const handleInstAction = (id, action) => {
    setInstApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'forward' ? 'Forwarded to Ministry' : 'Rejected' } : a))
    alert(action === 'forward' ? 'Institute registration forwarded to Ministry.' : 'Registration rejected.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="state" onLogout={() => navigate('/')} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold text-primary text-lg">State Nodal Officer Dashboard</h1>
              <p className="text-xs text-gray-500">Maharashtra State</p>
            </div>
            <button onClick={() => navigate('/')} className="btn-secondary text-xs">Logout</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setTab('students')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === 'students' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              Student Applications
            </button>
            <button onClick={() => setTab('institutes')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tab === 'institutes' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              Institute Registrations
            </button>
          </div>

          {tab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="section-title mb-0">Student Applications (Forwarded by Institutes)</h2>
                <button className="btn-primary text-xs px-4 py-1">Fetch Forms</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white text-xs">
                      <th className="px-3 py-2 text-left">App ID</th>
                      <th className="px-3 py-2 text-left">Student Name</th>
                      <th className="px-3 py-2 text-left">Scheme</th>
                      <th className="px-3 py-2 text-left">Institute</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentApps.map((app, i) => (
                      <tr key={app.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.id}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                        <td className="px-3 py-2 text-xs">{app.scheme}</td>
                        <td className="px-3 py-2 text-xs">{app.institute}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'Forwarded to Ministry' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>{app.status}</span>
                        </td>
                        <td className="px-3 py-2">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStudentAction(app.id, 'forward')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                              <button onClick={() => handleStudentAction(app.id, 'reject')}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'institutes' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="section-title mb-0">Institute Registration Applications</h2>
                <button className="btn-primary text-xs px-4 py-1">Fetch Forms</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white text-xs">
                      <th className="px-3 py-2 text-left">Inst. ID</th>
                      <th className="px-3 py-2 text-left">Institute Name</th>
                      <th className="px-3 py-2 text-left">District</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instApps.map((app, i) => (
                      <tr key={app.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.id}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                        <td className="px-3 py-2 text-xs">{app.district}</td>
                        <td className="px-3 py-2 text-xs">{app.type}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'Forwarded to Ministry' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>{app.status}</span>
                        </td>
                        <td className="px-3 py-2">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleInstAction(app.id, 'forward')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Forward</button>
                              <button onClick={() => handleInstAction(app.id, 'reject')}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
