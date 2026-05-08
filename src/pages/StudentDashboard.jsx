import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const schemes = [
  { id: 'pms', name: 'Post Matric Scholarship (Merit-cum-Means)', eligibility: 'SC/ST/OBC/Minority | Min 60% in 10th & 12th | Income < ₹2.5L/yr', amount: '₹10,000 – ₹20,000 per year', deadline: '31 Dec 2024', description: 'Provides scholarship to students from backward categories for technical and undergraduate/postgraduate courses.' },
  { id: 'pragati', name: 'Pragati Scholarship for Girls', eligibility: 'Girl students | Family income < ₹8L/yr | AICTE approved institution', amount: 'Tuition Fee up to ₹30,000', deadline: '15 Jan 2025', description: 'Encourages girl students to pursue technical education by providing financial assistance.' },
  { id: 'ntse', name: 'NTSE – National Talent Search Examination', eligibility: 'Indian National | Min 60% in Class IX | Recognized school', amount: '₹1,250/month (Class XI-XII) | ₹2,000/month (UG/PG)', deadline: '30 Nov 2024', description: 'Merit-based scholarship for talented students identified through a two-stage selection process.' },
  { id: 'nms', name: 'National Merit Scholarship', eligibility: 'Merit based | Min 60% marks', amount: '₹6,000 per year', deadline: '31 Jan 2025', description: 'Awarded to meritorious students to encourage academic excellence.' },
  { id: 'css', name: 'Central Scholarship Scheme', eligibility: "Central Govt. employees' children", amount: 'Up to ₹15,000 per year', deadline: '28 Feb 2025', description: 'Scholarship for children of central government employees pursuing higher education.' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [status] = useState([
    { scheme: 'Post Matric Scholarship', status: 'Pending at Institute', date: '10 Nov 2024' }
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" onLogout={() => navigate('/')} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden w-full mb-4 btn-secondary text-xs"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? 'Hide Profile & Status ▲' : 'Show Profile & Status ▼'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar — hidden on mobile unless toggled */}
          <div className={`lg:col-span-1 flex flex-col gap-4 ${sidebarOpen ? 'block' : 'hidden'} lg:flex`}>
            <div className="card border-l-4 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">S</div>
                <div>
                  <p className="font-bold text-sm">Student Name</p>
                  <p className="text-xs text-gray-500">UID: NSP2024XXXXX</p>
                </div>
              </div>
              <nav className="space-y-1">
                {['My Profile', 'Check Status', 'Update Profile', 'Logout'].map(item => (
                  <button key={item} onClick={() => item === 'Logout' && navigate('/')}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors">
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            <div className="card">
              <h3 className="section-title">Application Status</h3>
              {status.map((s, i) => (
                <div key={i} className="text-xs border rounded p-2 bg-yellow-50">
                  <p className="font-semibold">{s.scheme}</p>
                  <p className="text-yellow-700">{s.status}</p>
                  <p className="text-gray-400">{s.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scheme list */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="section-title">Available Scholarship Schemes</h2>
              <div className="space-y-3">
                {schemes.map(s => (
                  <div key={s.id}
                    className={`border rounded p-3 cursor-pointer transition-all ${selected?.id === s.id ? 'border-primary bg-green-50' : 'hover:border-primary hover:bg-green-50'}`}
                    onClick={() => setSelected(s)}>
                    <p className="font-semibold text-sm text-primary">{s.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.eligibility}</p>
                    <div className="flex flex-wrap justify-between items-center mt-2 gap-1">
                      <span className="text-xs font-medium text-green-700">{s.amount}</span>
                      <span className="text-xs text-red-500">Deadline: {s.deadline}</span>
                    </div>
                    {/* Mobile inline apply button */}
                    {selected?.id === s.id && (
                      <button
                        className="btn-orange w-full mt-3 text-sm lg:hidden"
                        onClick={e => { e.stopPropagation(); navigate(`/dashboard/student/apply/${s.id}`) }}>
                        Apply Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — desktop only */}
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
                <p className="text-xs mt-1"><span className="font-semibold">Deadline:</span> {selected.deadline}</p>
                <button
                  className="btn-orange w-full mt-4 text-sm"
                  onClick={() => navigate(`/dashboard/student/apply/${selected.id}`)}>
                  Apply Now
                </button>
              </div>
            )}
          </div>

          {/* Guidelines on mobile (below scheme list) */}
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
