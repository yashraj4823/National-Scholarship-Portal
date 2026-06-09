import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getInstituteApplications, instituteAction } from "../api/applications";
import { useAuth } from "../context/AuthContext";

export default function InstituteDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [bonafide, setBonafide] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getInstituteApplications()
      .then(({ data }) => setApps(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await instituteAction(id, action, "", bonafide);
      setApps((prev) =>
        prev.map((a) =>
          a._id === id
            ? {
                ...a,
                status:
                  action === "verify"
                    ? "institute_verified"
                    : "institute_rejected",
              }
            : a,
        ),
      );
      setSelected(null);
      setBonafide(null);
      alert(
        action === "verify"
          ? "Application forwarded to State Nodal Officer."
          : "Application rejected.",
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const statusColor = (s) =>
    s === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "institute_verified"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";

  const statusLabel = (s) =>
    s === "pending"
      ? "Pending"
      : s === "institute_verified"
        ? "Forwarded to State"
        : "Rejected";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="institute" onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="page-hero flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">Institute Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Hello, {user?.name?.split(' ')[0] || 'Institute'}</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">Review scholarship applications and move eligible student requests forward quickly.</p>
          </div>
          <button className="btn-primary w-full sm:w-auto text-sm" onClick={() => navigate('/dashboard/institute/profile')}>View Profile</button>
        </div>
        <button
          className="lg:hidden w-full mb-4 btn-secondary text-xs"
          onClick={() => setSidebarOpen((o) => !o)}
        >
          {sidebarOpen ? "Hide Institute Info ▲" : "Show Institute Info ▼"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 ${sidebarOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="card border-l-4 border-primary">
              <div className="mb-4">
                <p className="font-bold text-sm text-primary">
                  {user?.name || "Institute"}
                </p>
                <p className="text-xs text-gray-500">
                  Code: {user?.code || "—"}
                </p>
              </div>
              <nav className="space-y-1">
                {["My Profile", "View Student Applications", "Logout"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        if (item === "Logout") return handleLogout();
                        if (item === "My Profile")
                          return navigate("/dashboard/institute/profile");
                        // View Student Applications -- do nothing (current)
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded hover:bg-green-50 hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  ),
                )}
              </nav>
            </div>
          </div>

          {/* Application list */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="section-title mb-4">Student Applications</h2>
              {loading ? (
                <p className="text-xs text-gray-400">Loading applications...</p>
              ) : apps.length === 0 ? (
                <p className="text-xs text-gray-400">No applications found.</p>
              ) : (
                <div className="space-y-3">
                  {apps.map((app) => (
                    <div
                      key={app._id}
                      className={`border rounded p-3 cursor-pointer transition-all ${selected?._id === app._id ? "border-primary bg-green-50" : "hover:border-primary"}`}
                      onClick={() => setSelected(app)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {app.student?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {app.scheme?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            UID: {app.student?.uid}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusColor(app.status)}`}
                        >
                          {statusLabel(app.status)}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile action modal */}
          {selected && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
                  <h3 className="font-bold text-lg text-primary">Application Details</h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div>
                    <p className="font-semibold">Name</p>
                    <p className="text-xs text-gray-700">{selected.student?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Application ID</p>
                    <p className="text-xs text-gray-700">{selected.applicationId || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Scheme</p>
                    <p className="text-xs text-gray-700">{selected.scheme?.name || "—"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Aadhar</p>
                      <p className="text-xs text-gray-700">{selected.aadhar || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Annual Income</p>
                      <p className="text-xs text-gray-700">{selected.annualIncome ? `₹${selected.annualIncome}` : "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Father</p>
                      <p className="text-xs text-gray-700">{selected.fatherName || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Mother</p>
                      <p className="text-xs text-gray-700">{selected.motherName || "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Community</p>
                      <p className="text-xs text-gray-700">{selected.community || "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Religion</p>
                      <p className="text-xs text-gray-700">{selected.religion || "—"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Institute</p>
                    <p className="text-xs text-gray-700">{selected.instituteName || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Course</p>
                    <p className="text-xs text-gray-700">{selected.presentClass || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Contact (Address)</p>
                    <p className="text-xs text-gray-700">
                      {selected.contact?.houseNo || ""} {selected.contact?.streetNo || ""}, {selected.contact?.district || ""}, {selected.contact?.state || ""} - {selected.contact?.pincode || ""}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Previous Education</p>
                    <p className="text-xs text-gray-700">
                      10th: {selected.class10?.board || "—"} ({selected.class10?.percentage ?? "—"}%) | 12th: {selected.class12?.board || "—"} ({selected.class12?.percentage ?? "—"}%)
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Disability</p>
                    <p className="text-xs text-gray-700">
                      {selected.isDisabled
                        ? `${selected.disabilityType || ""} ${selected.disabilityPercent ? `(${selected.disabilityPercent}%)` : ""}`
                        : "No"}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setBonafide(e.target.files[0])}
                      />
                      <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                        {bonafide ? bonafide.name : "Upload Bonafide Certificate"}
                      </span>
                    </label>
                    {selected.status === "pending" && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selected._id, "verify")}
                          className="btn-primary w-full text-sm"
                        >
                          {actionLoading ? "Processing..." : "Verify & Forward to State"}
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selected._id, "reject")}
                          className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50"
                        >
                          Reject Application
                        </button>
                      </>
                    )}
                    {selected.status !== "pending" && (
                      <p className={`text-xs text-center font-semibold ${selected.status === "institute_verified" ? "text-green-600" : "text-red-600"}`}>
                        {statusLabel(selected.status)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop action panel */}
          <div className="lg:col-span-1 hidden lg:block">
            {selected ? (
              <div className="card border-t-4 border-secondary">
                <h3 className="font-bold text-sm text-primary mb-3">
                  Student Application
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Name</p>
                    <p className="text-xs text-gray-700">
                      {selected.student?.name || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Application ID</p>
                    <p className="text-xs text-gray-700">
                      {selected.applicationId}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Scheme</p>
                    <p className="text-xs text-gray-700">
                      {selected.scheme?.name || "—"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Aadhar</p>
                      <p className="text-xs text-gray-700">
                        {selected.aadhar || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Annual Income</p>
                      <p className="text-xs text-gray-700">
                        {selected.annualIncome
                          ? `₹${selected.annualIncome}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Father</p>
                      <p className="text-xs text-gray-700">
                        {selected.fatherName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Mother</p>
                      <p className="text-xs text-gray-700">
                        {selected.motherName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Community</p>
                      <p className="text-xs text-gray-700">
                        {selected.community || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Religion</p>
                      <p className="text-xs text-gray-700">
                        {selected.religion || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Institute</p>
                      <p className="text-xs text-gray-700">
                        {selected.instituteName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Course</p>
                      <p className="text-xs text-gray-700">
                        {selected.presentClass || "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold">Contact (Address)</p>
                    <p className="text-xs text-gray-700">
                      {selected.contact?.houseNo || ""}{" "}
                      {selected.contact?.streetNo || ""},{" "}
                      {selected.contact?.district || ""},{" "}
                      {selected.contact?.state || ""} -{" "}
                      {selected.contact?.pincode || ""}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Previous Education</p>
                    <p className="text-xs text-gray-700">
                      10th: {selected.class10?.board || "—"} (
                      {selected.class10?.percentage ?? "—"}%) | 12th:{" "}
                      {selected.class12?.board || "—"} (
                      {selected.class12?.percentage ?? "—"}%)
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Disability</p>
                    <p className="text-xs text-gray-700">
                      {selected.isDisabled
                        ? `${selected.disabilityType || ""} ${selected.disabilityPercent ? `(${selected.disabilityPercent}%)` : ""}`
                        : "No"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setBonafide(e.target.files[0])}
                      />
                      <span className="border border-gray-400 text-xs px-4 py-2 rounded hover:bg-gray-50 block text-center">
                        {bonafide
                          ? bonafide.name
                          : "Upload Bonafide Certificate"}
                      </span>
                    </label>
                    {selected.status === "pending" && (
                      <>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selected._id, "verify")}
                          className="btn-primary w-full text-sm"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Verify & Forward to State"}
                        </button>
                        <button
                          disabled={actionLoading}
                          onClick={() => handleAction(selected._id, "reject")}
                          className="w-full border border-red-400 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50"
                        >
                          Reject Application
                        </button>
                      </>
                    )}
                    {selected.status !== "pending" && (
                      <p
                        className={`text-xs text-center font-semibold ${selected.status === "institute_verified" ? "text-green-600" : "text-red-600"}`}
                      >
                        {statusLabel(selected.status)}
                      </p>
                    )}
                  </div>
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
  );
}
