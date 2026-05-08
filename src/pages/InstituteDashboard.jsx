import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const mockApplications = [
  { id: 'APP001', name: 'Rahul Sharma', scheme: 'Post Matric Scholarship', aadhar: 'XXXX-XXXX-1234', status: 'Pending' },
  { id: 'APP002', name: 'Priya Patel', scheme: 'Pragati Scholarship', aadhar: 'XXXX-XXXX-5678', status: 'Pending' },
  { id: 'APP003', name: 'Amit Kumar', scheme: 'NTSE', aadhar: 'XXXX-XXXX-9012', status: 'Pending' },
]

export default function InstituteDashboard() {
  const navigate = useNavigate()
  const [apps, setApps] = useState(mockApplications)
  const [selected, setSelected] = useState(null)
  const [bonafide, setBonafide] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleAction = (id, action) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: action === 'verify' ? 'Forwarded to State' : 'Rejected' } : a))
    setSelected(null)
    alert(action === 'verify' ? 'Application forwarded to State Nodal Officer.' : 'Application rejected.')
  }

  const statusColor = s =>
    s === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
    s === 'Forwarded to State' ? 'bg-green-100 text-green-700' :
    'bg-red-100 text-red-700'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="institute" onLogout={() => navigate('/')} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden w-full mb-4 btn-secondary text-xs"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? 'Hide Institute Info ▲' : 'Show Institute Info ▼'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className={`lg:col-span-1 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="card border-l-4 border-primary">
              <div className="mb-4">
                <p className="font-bold text-sm text-primary">Government Polytechnic</p>
                <p className="text-xs text-gray-500">Institute Code: INST001</p>
              </div>
              <nav className="space-y-1">
                {['View Student Applications', 'Institute Profile', 'Logout'].map(item => (
                  <button key={item} onClick={() => item === 'Logout' && navigate('/')}
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
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="section-title mb-0">Student Applications</h2>
                <button className="btn-primary text-xs px-4 py-1 flex-shrink-0">Fetch Forms</button>
              </div>
              <div className="space-y-3">
                {apps.map(app => (
                  <div key={app.id}
                    className={`border rounded p-3 cursor-pointer transition-all ${selected?.id === app.id ? 'border-primary bg-green-50' : 'hover:border-primary'}`}
                    onClick={() => setSelected(app)}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{app.name}</p>
                        <p className="text-xs text-gray-500 truncate">{app.scheme}</p>
                        <p className="text-xs text-gray-400">Aadhar: {app.aadhar}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <button className="text-xs text-primary hover:underline mt-1">View Application</button>

                    {/* Mobile inline action panel */}
                    {selected?.id === app.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 lg:hidden space-y-2">
                        <div>
                          <label className="form-label">Attach Bonafide Certificate</label>
                          <label className="cursor-pointer block">
                            <input type="file" className="hidden" onChange={e => setBonafide(e.target.files[0])} />
                            <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                              {bonafide ? bonafide.name : 'Upload Certificate'}
                            </span>
                          </label>
                        </div>
                        {app.status === 'Pending' && (
                          <>
                            <button onClick={e => { e.stopPropagation(); handleAction(app.id, 'verify') }}
                              className="btn-primary w-full text-sm">Verify & Forward to State</button>
                            <button onClick={e => { e.stopPropagation(); handleAction(app.id, 'reject') }}
                              className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50 transition-colors">
                              Reject Application
                            </button>
                          </>
                        )}
                        {app.status !== 'Pending' && (
                          <p className={`text-xs text-center font-semibold ${app.status === 'Forwarded to State' ? 'text-green-600' : 'text-red-600'}`}>
                            {app.status}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop action panel */}
          <div className="lg:col-span-1 hidden lg:block">
            {selected ? (
              <div className="card border-t-4 border-secondary">
                <h3 className="font-bold text-sm text-primary mb-3">Student Application</h3>
                <p className="text-sm font-semibold">{selected.name}</p>
                <p className="text-xs text-gray-500 mb-1">{selected.scheme}</p>
                <p className="text-xs text-gray-400 mb-4">ID: {selected.id}</p>
                <div className="space-y-3">
                  <div>
                    <label className="form-label">Attach Bonafide Certificate</label>
                    <label className="cursor-pointer block">
                      <input type="file" className="hidden" onChange={e => setBonafide(e.target.files[0])} />
                      <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                        {bonafide ? bonafide.name : 'Upload Certificate'}
                      </span>
                    </label>
                  </div>
                  {selected.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(selected.id, 'verify')} className="btn-primary w-full text-sm">
                        Verify & Forward to State
                      </button>
                      <button onClick={() => handleAction(selected.id, 'reject')}
                        className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50 transition-colors">
                        Reject Application
                      </button>
                    </>
                  )}
                  {selected.status !== 'Pending' && (
                    <p className={`text-xs text-center font-semibold ${selected.status === 'Forwarded to State' ? 'text-green-600' : 'text-red-600'}`}>
                      {selected.status}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center text-gray-400 text-sm py-10">
                Select an application to review
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
