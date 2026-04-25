import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ uid: '', password: '', type: 'student' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.uid || !form.password) return alert('Please fill all fields')
    const routes = { student: '/dashboard/student', institute: '/dashboard/institute', state: '/dashboard/state', ministry: '/dashboard/ministry' }
    navigate(routes[form.type])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="card w-full max-w-md border-t-4 border-primary">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">NSP</span>
            </div>
            <div>
              <h1 className="font-bold text-primary">National Scholarship Portal</h1>
              <p className="text-xs text-gray-500">Government of India</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Login As</label>
              <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="student">Student</option>
                <option value="institute">Institute / State / Ministry</option>
                <option value="state">State Nodal Officer</option>
                <option value="ministry">Ministry</option>
              </select>
            </div>
            <div>
              <label className="form-label">UID / Username</label>
              <input className="form-input" placeholder="Enter UID or Username" value={form.uid} onChange={e => setForm({...form, uid: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Enter Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <a href="#" className="text-primary hover:underline">Forgot Password?</a>
            </div>
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
