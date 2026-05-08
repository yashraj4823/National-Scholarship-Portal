import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const states = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Uttar Pradesh','Gujarat','Rajasthan']
const districts = ['Mumbai','Pune','Nashik','Nagpur','Aurangabad','Thane','Solapur']
const years = Array.from({length:30}, (_,i) => 2024 - i)

export default function InstituteRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category:'', name:'', state:'', district:'', code:'', dise:'', location:'Rural',
    type:'', uniState:'', uniName:'', admissionYear:'', password:'', confirmPassword:'',
    estCert: null, affCert: null,
    addr1:'', addr2:'', city:'', addrState:'', addrDistrict:'', pincode:'',
    principal:'', mobile:'', telephone:'', agree: false
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.agree) return alert('Please accept the declaration')
    if (form.password !== form.confirmPassword) return alert('Passwords do not match')
    alert('Institute registration request submitted! It will be reviewed by the State Nodal Officer.')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-6 uppercase tracking-wide">
            Institute Registration Request Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* BASIC DETAILS */}
            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Institute Category *</label>
                  <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">-- Select --</option>
                    <option>Government</option>
                    <option>Government Aided</option>
                    <option>Private Unaided</option>
                    <option>Autonomous</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Institute Name *</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.state} onChange={e => set('state', e.target.value)} required>
                    <option value="">-- Select State --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className="form-select" value={form.district} onChange={e => set('district', e.target.value)} required>
                    <option value="">-- Select District --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Institute Code *</label>
                  <input className="form-input" value={form.code} onChange={e => set('code', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">DISE Code *</label>
                  <input className="form-input" value={form.dise} onChange={e => set('dise', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Location *</label>
                  <div className="flex gap-6 mt-2">
                    {['Rural','Urban'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="location" value={l} checked={form.location === l} onChange={() => set('location', l)} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label">Institute Type *</label>
                  <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)} required>
                    <option value="">-- Select --</option>
                    <option>Engineering</option>
                    <option>Medical</option>
                    <option>Arts & Science</option>
                    <option>Polytechnic</option>
                    <option>Management</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Affiliated University State *</label>
                  <select className="form-select" value={form.uniState} onChange={e => set('uniState', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Affiliated University / Board Name *</label>
                  <input className="form-input" value={form.uniName} onChange={e => set('uniName', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Year Admission Started *</label>
                  <select className="form-select" value={form.admissionYear} onChange={e => set('admissionYear', e.target.value)} required>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Set Password *</label>
                  <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Confirm Password *</label>
                  <input type="password" className="form-input" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
              </div>
            </section>

            {/* PROOF OF EXISTENCE */}
            <section>
              <h2 className="section-title">Proof of Existence of Institute</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 border rounded p-3">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">Institute Establishment / Registration Certificate *</span>
                  <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
                    <input type="file" className="hidden" onChange={e => set('estCert', e.target.files[0])} />
                    <span className="border border-gray-400 text-xs px-4 py-1.5 rounded hover:bg-gray-100 block text-center">
                      {form.estCert ? form.estCert.name : 'Upload'}
                    </span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 border rounded p-3">
                  <span className="text-xs text-gray-600 uppercase tracking-wide">University / Board Affiliation Certificate *</span>
                  <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
                    <input type="file" className="hidden" onChange={e => set('affCert', e.target.files[0])} />
                    <span className="border border-gray-400 text-xs px-4 py-1.5 rounded hover:bg-gray-100 block text-center">
                      {form.affCert ? form.affCert.name : 'Upload'}
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <h2 className="section-title">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Line 1 *</label><input className="form-input" value={form.addr1} onChange={e => set('addr1', e.target.value)} required /></div>
                <div><label className="form-label">Line 2</label><input className="form-input" value={form.addr2} onChange={e => set('addr2', e.target.value)} /></div>
                <div><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} required /></div>
                <div>
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.addrState} onChange={e => set('addrState', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className="form-select" value={form.addrDistrict} onChange={e => set('addrDistrict', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="form-label">Pincode *</label><input className="form-input" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value)} required /></div>
              </div>
            </section>

            {/* CONTACT DETAILS */}
            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Principal Name *</label><input className="form-input" value={form.principal} onChange={e => set('principal', e.target.value)} required /></div>
                <div><label className="form-label">Mobile Number *</label><input className="form-input" maxLength={10} value={form.mobile} onChange={e => set('mobile', e.target.value)} required /></div>
                <div><label className="form-label">Telephone</label><input className="form-input" value={form.telephone} onChange={e => set('telephone', e.target.value)} /></div>
              </div>
            </section>

            {/* DECLARATION */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => set('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details and documents submitted by us are valid and true. If found guilty of submitting invalid documents, we may be held responsible for that act by us.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" className="btn-primary w-full sm:w-auto px-10">Submit</button>
              <button type="reset" className="btn-secondary w-full sm:w-auto px-10">Reset</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
