export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-primary via-green-700 to-secondary text-white text-center py-6 mt-8 shadow-inner">
      <div className="absolute inset-x-0 top-0 h-16 bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <p className="text-xs font-semibold">© 2026 National Scholarship Portal | Government of India | Ministry of Education</p>
        <p className="text-[0.72rem] text-green-100 mt-2">For queries, contact: helpdesk@nsp.gov.in | Toll Free: 1800-101-3898</p>
      </div>
    </footer>
  )
}
