import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getInstituteProfile } from '../api/institutes'
import { useAuth } from '../context/AuthContext'

export default function InstituteProfile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    getInstituteProfile()
      .then(res => setProfile(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="institute" onLogout={() => { logout(); window.location.href = '/' }} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="card">
          <h2 className="section-title">Institute Profile</h2>

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
                <p className="text-sm font-semibold">Code</p>
                <p className="text-xs text-gray-700">{profile?.code || user?.code || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Category</p>
                <p className="text-xs text-gray-700">{profile?.category || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Type</p>
                <p className="text-xs text-gray-700">{profile?.type || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Contact (Principal)</p>
                <p className="text-xs text-gray-700">{profile?.contact?.principalName || '—'}</p>
                <p className="text-xs text-gray-700">Mobile: {profile?.contact?.mobile || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-xs text-gray-700">{profile?.address?.line1 || '—'}</p>
                <p className="text-xs text-gray-700">{profile?.address?.city}, {profile?.address?.state} - {profile?.address?.pincode}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">State</p>
                <p className="text-xs text-gray-700">{profile?.address?.state || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">University Name</p>
                <p className="text-xs text-gray-700">{profile?.uniName || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Establishment Year</p>
                <p className="text-xs text-gray-700">{profile?.admissionYear || '—'}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">NAAC Grade</p>
                <p className="text-xs text-gray-700">A++</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

