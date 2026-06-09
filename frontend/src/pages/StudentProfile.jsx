import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getStudentProfile } from '../api/students'
import { useAuth } from '../context/AuthContext'

export default function StudentProfile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getStudentProfile()
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" onLogout={() => { logout(); window.location.href = '/' }} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="page-hero text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">Profile Overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your NSP Account</h1>
          <p className="mt-3 text-sm text-slate-600">Review your personal details and bank information securely.</p>
        </div>
        <div className="card">
          <h2 className="section-title">My Profile</h2>

          {loading ? (
            <p className="text-xs text-gray-500">Loading profile...</p>
          ) : error ? (
            <div className="text-xs text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">Name</p>
                <p className="text-xs text-gray-700">{profile?.name || user?.name || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">UID</p>
                <p className="text-xs text-gray-700">{profile?.uid || user?.uid || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-xs text-gray-700">{profile?.email || user?.email || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Mobile</p>
                <p className="text-xs text-gray-700">{profile?.mobile || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Date of Birth</p>
                <p className="text-xs text-gray-700">{profile?.dob ? new Date(profile.dob).toLocaleDateString() : '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Gender</p>
                <p className="text-xs text-gray-700">{profile?.gender || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Aadhar</p>
                <p className="text-xs text-gray-700">{profile?.aadhar || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">State / District</p>
                <p className="text-xs text-gray-700">{profile?.state || '—'} / {profile?.district || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Institute Code</p>
                <p className="text-xs text-gray-700">{profile?.instituteCode || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Bank</p>
                <p className="text-xs text-gray-700">{profile?.bankName || '—'}</p>
                <p className="text-xs text-gray-700">Account: {profile?.bankAccount || '—'}</p>
                <p className="text-xs text-gray-700">IFSC: {profile?.bankIfsc || '—'}</p>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
