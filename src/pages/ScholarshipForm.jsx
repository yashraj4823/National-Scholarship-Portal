import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const states = ['Maharashtra','Delhi','Karnataka','Tamil Nadu','Uttar Pradesh','Gujarat']
const districts = ['Mumbai','Pune','Nashik','Nagpur','Aurangabad','Thane']
const blocks = ['Block A','Block B','Block C','Block D']
const religions = ['Hindu','Muslim','Christian','Sikh','Buddhist','Jain','Other']
const schemes = ['Post Matric Scholarship','Pragati Scholarship','NTSE','National Merit Scholarship','Central Scholarship Scheme']

const FileUpload = ({ label }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
    <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
    <label className="cursor-pointer self-start sm:self-auto">
      <input type="file" className="hidden" />
      <span className="border border-gray-400 text-xs px-4 py-1 rounded hover:bg-gray-50 transition-colors block">Upload</span>
    </label>
  </div>
)

export default function ScholarshipForm() {
  const navigate = useNavigate()
  const { schemeId } = useParams()
  const [form, setForm] = useState({
    aadhar:'', religion:'', community:'', fatherName:'', motherName:'', annualIncome:'',
    instituteName:'', presentClass:'', classYear:'', modeOfStudy:'', classStartDate:'',
    universityBoard:'', prevClass:'', prevPassYear:'', prevClassPercent:'',
    roll10:'', board10:'', year10:'', percent10:'',
    roll12:'', board12:'', year12:'', percent12:'',
    admissionFee:'', tuitionFee:'', otherFee:'',
    isDisabled:'No', disabilityType:'', disabilityPercent:'', maritalStatus:'', parentsProfession:'',
    contactState:'', contactDistrict:'', contactBlock:'', houseNo:'', streetNo:'', pincode:'',
    scheme:'', agree: false
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.agree) return alert('Please accept the declaration')
    alert('Application submitted successfully! It will be forwarded to your institute for verification.')
    navigate('/dashboard/student')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" onLogout={() => navigate('/')} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-1 uppercase tracking-wide">
            Scholarship Application Form
          </h1>
          <p className="text-center text-xs text-gray-500 mb-6">National Scholarship Portal – Government of India</p>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* BASIC DETAILS */}
            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Aadhar Number *</label>
                  <input className="form-input" maxLength={12} value={form.aadhar} onChange={e => set('aadhar', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Religion *</label>
                  <select className="form-select" value={form.religion} onChange={e => set('religion', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {religions.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Community / Category *</label>
                  <input className="form-input" placeholder="SC / ST / OBC / General" value={form.community} onChange={e => set('community', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Father's Name *</label>
                  <input className="form-input" value={form.fatherName} onChange={e => set('fatherName', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Mother's Name *</label>
                  <input className="form-input" value={form.motherName} onChange={e => set('motherName', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Family Annual Income (₹) *</label>
                  <input type="number" className="form-input" value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} required />
                </div>
              </div>
            </section>

            {/* ACADEMIC DETAILS */}
            <section>
              <h2 className="section-title">Academic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Institute Name *</label>
                  <select className="form-select" value={form.instituteName} onChange={e => set('instituteName', e.target.value)} required>
                    <option value="">-- Select Institute --</option>
                    <option>Government Polytechnic Mumbai</option>
                    <option>VJTI Mumbai</option>
                    <option>College of Engineering Pune</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Present Class / Course *</label>
                  <input className="form-input" value={form.presentClass} onChange={e => set('presentClass', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Present Class / Course Year *</label>
                  <input className="form-input" placeholder="e.g. 2nd Year" value={form.classYear} onChange={e => set('classYear', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Mode of Study *</label>
                  <select className="form-select" value={form.modeOfStudy} onChange={e => set('modeOfStudy', e.target.value)} required>
                    <option value="">-- Select --</option>
                    <option>Regular</option>
                    <option>Distance</option>
                    <option>Part-Time</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Class Start Date *</label>
                  <input type="date" className="form-input" value={form.classStartDate} onChange={e => set('classStartDate', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">University / Board Name *</label>
                  <input className="form-input" value={form.universityBoard} onChange={e => set('universityBoard', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Previous Class / Course</label>
                  <input className="form-input" value={form.prevClass} onChange={e => set('prevClass', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Previous Passing Year</label>
                  <input className="form-input" maxLength={4} value={form.prevPassYear} onChange={e => set('prevPassYear', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Previous Class %</label>
                  <input type="number" className="form-input" max={100} value={form.prevClassPercent} onChange={e => set('prevClassPercent', e.target.value)} />
                </div>
              </div>
            </section>

            {/* 10TH CLASS */}
            <section>
              <h2 className="section-title">10th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Roll Number *</label><input className="form-input" value={form.roll10} onChange={e => set('roll10', e.target.value)} required /></div>
                <div><label className="form-label">Board Name *</label><input className="form-input" value={form.board10} onChange={e => set('board10', e.target.value)} required /></div>
                <div><label className="form-label">Passing Year *</label><input className="form-input" maxLength={4} value={form.year10} onChange={e => set('year10', e.target.value)} required /></div>
                <div><label className="form-label">% Obtained *</label><input type="number" className="form-input" max={100} value={form.percent10} onChange={e => set('percent10', e.target.value)} required /></div>
              </div>
            </section>

            {/* 12TH CLASS */}
            <section>
              <h2 className="section-title">12th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="form-label">Roll Number</label><input className="form-input" value={form.roll12} onChange={e => set('roll12', e.target.value)} /></div>
                <div><label className="form-label">Board Name</label><input className="form-input" value={form.board12} onChange={e => set('board12', e.target.value)} /></div>
                <div><label className="form-label">Passing Year</label><input className="form-input" maxLength={4} value={form.year12} onChange={e => set('year12', e.target.value)} /></div>
                <div><label className="form-label">% Obtained</label><input type="number" className="form-input" max={100} value={form.percent12} onChange={e => set('percent12', e.target.value)} /></div>
              </div>
            </section>

            {/* FEE DETAILS */}
            <section>
              <h2 className="section-title">Fee Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="form-label">Admission Fee (₹) *</label><input type="number" className="form-input" value={form.admissionFee} onChange={e => set('admissionFee', e.target.value)} required /></div>
                <div><label className="form-label">Tuition Fee (₹) *</label><input type="number" className="form-input" value={form.tuitionFee} onChange={e => set('tuitionFee', e.target.value)} required /></div>
                <div><label className="form-label">Other Fee (₹)</label><input type="number" className="form-input" value={form.otherFee} onChange={e => set('otherFee', e.target.value)} /></div>
              </div>
            </section>

            {/* OTHER PERSONAL DETAILS */}
            <section>
              <h2 className="section-title">Other Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Is Disabled?</label>
                  <select className="form-select" value={form.isDisabled} onChange={e => set('isDisabled', e.target.value)}>
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>
                {form.isDisabled === 'Yes' && <>
                  <div><label className="form-label">Type of Disability</label><input className="form-input" value={form.disabilityType} onChange={e => set('disabilityType', e.target.value)} /></div>
                  <div><label className="form-label">% of Disability</label><input type="number" className="form-input" max={100} value={form.disabilityPercent} onChange={e => set('disabilityPercent', e.target.value)} /></div>
                </>}
                <div>
                  <label className="form-label">Marital Status</label>
                  <select className="form-select" value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                    <option value="">-- Select --</option>
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
                <div><label className="form-label">Parents' Profession</label><input className="form-input" value={form.parentsProfession} onChange={e => set('parentsProfession', e.target.value)} /></div>
              </div>
            </section>

            {/* CONTACT DETAILS */}
            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">State *</label>
                  <select className="form-select" value={form.contactState} onChange={e => set('contactState', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className="form-select" value={form.contactDistrict} onChange={e => set('contactDistrict', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Block / Taluk</label>
                  <select className="form-select" value={form.contactBlock} onChange={e => set('contactBlock', e.target.value)}>
                    <option value="">-- Select --</option>
                    {blocks.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div><label className="form-label">House Number</label><input className="form-input" value={form.houseNo} onChange={e => set('houseNo', e.target.value)} /></div>
                <div><label className="form-label">Street Number</label><input className="form-input" value={form.streetNo} onChange={e => set('streetNo', e.target.value)} /></div>
                <div><label className="form-label">Pincode *</label><input className="form-input" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value)} required /></div>
              </div>
            </section>

            {/* SCHEME SELECTION */}
            <section>
              <h2 className="section-title">Scheme Selection</h2>
              <div>
                <label className="form-label">Choose Scheme Applying For *</label>
                <select className="form-select" value={form.scheme} onChange={e => set('scheme', e.target.value)} required>
                  <option value="">-- Select Scheme --</option>
                  {schemes.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </section>

            {/* DOCUMENT UPLOAD */}
            <section>
              <h2 className="section-title">Documents Upload Section</h2>
              <div className="bg-gray-50 border rounded p-4 space-y-1">
                {[
                  'Domicile Certificate',
                  'Student Photograph',
                  'Institute ID Card',
                  'Caste / Income Certificate',
                  'Previous Year Marksheet',
                  'Fee Receipt of Current Year',
                  'Bank Passbook (Front Page)',
                  'Aadhar Card',
                  '10th Class Marksheet',
                  '12th Class Marksheet',
                ].map(doc => <FileUpload key={doc} label={doc} />)}
              </div>
            </section>

            {/* DECLARATION */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0" checked={form.agree} onChange={e => set('agree', e.target.checked)} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details furnished by me are true to the best of my knowledge. If any mistakes are found then I may be disqualified for scholarship scheme announced by Government of India or my State Government.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button type="submit" className="btn-primary px-10 w-full sm:w-auto">Submit</button>
              <button type="button" className="btn-secondary px-10 w-full sm:w-auto" onClick={() => navigate('/dashboard/student')}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
