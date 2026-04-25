import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import StudentRegister from './pages/StudentRegister'
import StudentDashboard from './pages/StudentDashboard'
import ScholarshipForm from './pages/ScholarshipForm'
import InstituteRegister from './pages/InstituteRegister'
import InstituteDashboard from './pages/InstituteDashboard'
import StateDashboard from './pages/StateDashboard'
import MinistryDashboard from './pages/MinistryDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/institute" element={<InstituteRegister />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/student/apply/:schemeId" element={<ScholarshipForm />} />
        <Route path="/dashboard/institute" element={<InstituteDashboard />} />
        <Route path="/dashboard/state" element={<StateDashboard />} />
        <Route path="/dashboard/ministry" element={<MinistryDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
