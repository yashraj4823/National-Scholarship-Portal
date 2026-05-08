import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const mockStudentApps = [
  { id: 'APP001', name: 'Rahul Sharma', scheme: 'Post Matric Scholarship', state: 'Maharashtra', amount: '₹15,000', status: 'Pending' },
  { id: 'APP002', name: 'Priya Patel', scheme: 'Pragati Scholarship', state: 'Maharashtra', amount: '₹30,000', status: 'Pending' },
  { id: 'APP003', name: 'Sunita Devi', scheme: 'NTSE', state: 'Delhi', amount: '₹24,000/yr', status: 'Granted' },
]
const mockInstituteApps = [
  { id: 'INST002', name: 'New Engineering College', state: 'Maharashtra', type: 'Engineering', status: 'Pending' },
  { id: 'INST003', name: 'City Medical College', state: 'Delhi', type: 'Medical', status: 'Approved' },
]
const stats = [
  { label: 'Total Applications', value: '1,24,532', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { label: 'Scholarships Granted', value: '98,210', color: 'bg-green-50 border-green-300 text-green-700' },
  { label: 'Pending Review', value: '18,450', color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  { label: 'Institutes Registered', value: '4,320', color: 'bg-purple-50 border-purple-300 text-purple-700' },
]

const StudentBadge = ({ s }) => {
  const c = s === 'Pending' ? 'bg-yellow-100 text-yellow-700' : s === 'Granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{s}</span>
}
const InstBadge = ({ s }) => {
  const c = s === 'Pending' ? 'bg-yellow-100 text-yellow-700' : s === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  return <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${c}`}>{s}</span>
}

export default function MinistryDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('students')
  const [studentApps, setStudentApps] = useState(mockStudentApps)
  const [instApps, setInstApps] = useState(mockInstituteApps)

  const handleStudentAction = (id, action) => {
    setStudentApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'grant' ? 'Granted' : 'Rejected' } : a))
    alert(action === 'grant' ? "Scholarship granted! Amount will be transferred to student's bank account." : 'Application rejected.')
  }
  const handleInstAction = (id, action) => {
    setInstApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'Approved' : 'Rejected' } : a))
    alert(action === 'approve' ? 'Institute registration approved! Login credentials activated.' : 'Registration rejected.')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="ministry" onLogout={() => navigate('/')} />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">

        {/* Header */}
        <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-primary text-lg">Ministry Dashboard</h1>
            <p className="text-xs text-gray-500">Ministry of Education – National Scholarship Portal Admin</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary text-xs w-full sm:w-auto">Logout</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`border rounded-lg p-3 sm:p-4 text-center ${s.color}`}>
              <p className="text-xl sm:text-2xl font-bold">{s.value}</p>
              <p className="text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div className="card">
          {/* Tabs — scrollable on small screens */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { key: 'students', label: 'Student Applications' },
              { key: 'institutes', label: 'Institute Registrations' },
              { key: 'schemes', label: 'Manage Schemes' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'students' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="section-title mb-0">Student Applications (Approved by State)</h2>
                <button className="btn-primary text-xs px-4 py-1 w-full sm:w-auto">Fetch Forms</button>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {studentApps.map(app => (
                  <div key={app.id} className="border rounded p-3 bg-white">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <p className="font-semibold text-sm">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.scheme}</p>
                        <p className="text-xs text-gray-400">{app.state} · {app.id}</p>
                        <p className="text-xs font-semibold text-green-700 mt-0.5">{app.amount}</p>
                      </div>
                      <StudentBadge s={app.status} />
                    </div>
                    {app.status === 'Pending' && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleStudentAction(app.id, 'grant')}
                          className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Grant</button>
                        <button onClick={() => handleStudentAction(app.id, 'reject')}
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
                      {['App ID','Student Name','Scheme','State','Amount','Status','Actions'].map(h => (
                        <th key={h} className="px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentApps.map((app, i) => (
                      <tr key={app.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.id}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                        <td className="px-3 py-2 text-xs">{app.scheme}</td>
                        <td className="px-3 py-2 text-xs">{app.state}</td>
                        <td className="px-3 py-2 text-xs font-semibold text-green-700">{app.amount}</td>
                        <td className="px-3 py-2"><StudentBadge s={app.status} /></td>
                        <td className="px-3 py-2">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStudentAction(app.id, 'grant')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Grant</button>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h2 className="section-title mb-0">Institute Registration Applications</h2>
                <button className="btn-primary text-xs px-4 py-1 w-full sm:w-auto">Fetch Forms</button>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {instApps.map(app => (
                  <div key={app.id} className="border rounded p-3 bg-white">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <p className="font-semibold text-sm">{app.name}</p>
                        <p className="text-xs text-gray-500">{app.state} · {app.type}</p>
                        <p className="text-xs text-gray-400">ID: {app.id}</p>
                      </div>
                      <InstBadge s={app.status} />
                    </div>
                    {app.status === 'Pending' && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleInstAction(app.id, 'approve')}
                          className="flex-1 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700">Approve</button>
                        <button onClick={() => handleInstAction(app.id, 'reject')}
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
                      {['Inst. ID','Institute Name','State','Type','Status','Actions'].map(h => (
                        <th key={h} className="px-3 py-2 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {instApps.map((app, i) => (
                      <tr key={app.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{app.id}</td>
                        <td className="px-3 py-2 text-xs font-medium">{app.name}</td>
                        <td className="px-3 py-2 text-xs">{app.state}</td>
                        <td className="px-3 py-2 text-xs">{app.type}</td>
                        <td className="px-3 py-2"><InstBadge s={app.status} /></td>
                        <td className="px-3 py-2">
                          {app.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleInstAction(app.id, 'approve')}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Approve</button>
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

          {tab === 'schemes' && (
            <div>
              <h2 className="section-title">Scholarship Schemes Management</h2>
              <div className="space-y-3">
                {[
                  { name: 'Post Matric Scholarship (Merit-cum-Means)', active: true, applicants: 45230 },
                  { name: 'Pragati Scholarship for Girls', active: true, applicants: 23100 },
                  { name: 'NTSE – National Talent Search', active: true, applicants: 18750 },
                  { name: 'National Merit Scholarship', active: false, applicants: 12400 },
                  { name: 'Central Scholarship Scheme', active: true, applicants: 25052 },
                ].map(s => (
                  <div key={s.name} className="flex items-center justify-between border rounded p-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.applicants.toLocaleString()} applicants</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
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
