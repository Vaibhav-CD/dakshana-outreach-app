import React, { useState } from 'react'
import { Users, UserCheck, ShieldAlert, BarChart3, ArrowRightLeft, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function SeniorSecView({ allUsers, reports, onReassignIntern, onAddIntern }) {
  const [activeTab, setActiveTab] = useState('assignments') // 'assignments' | 'reports' | 'junior_secs'
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInternName, setNewInternName] = useState('')
  const [newInternEmail, setNewInternEmail] = useState('')
  const [newInternSec, setNewInternSec] = useState('user-jsec-1')
  const [newInternDept, setNewInternDept] = useState('Field Operations')

  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const interns = allUsers.filter(u => u.role === 'intern')

  // Metrics
  const totalInterns = interns.length
  const totalReports = reports.length
  const reviewedReports = reports.filter(r => r.status === 'reviewed').length
  const pendingReports = reports.filter(r => r.status === 'submitted').length
  const complianceRate = totalInterns > 0 ? Math.round((totalReports / totalInterns) * 100) : 0

  const handleAddInternSubmit = (e) => {
    e.preventDefault()
    if (!newInternName || !newInternEmail) return

    onAddIntern({
      id: `user-intern-${Date.now()}`,
      name: newInternName,
      email: newInternEmail,
      role: 'intern',
      assignedTo: newInternSec,
      department: newInternDept
    })

    setNewInternName('')
    setNewInternEmail('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Senior Secretary Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Central Coordination Authority</span>
            </div>
            <h2 className="text-2xl font-bold">Senior Secretary Control Center</h2>
            <p className="text-indigo-200 text-sm mt-1">
              Overseeing 3 Junior Secretaries and intern coordination.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Onboard New Intern
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/30">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Total Interns Active</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalInterns}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Junior Secretaries</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{juniorSecs.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Reports Reviewed</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{reviewedReports} / {totalReports}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Cycle Submission Rate</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{complianceRate}%</span>
          </div>
        </div>
      </div>

      {/* Junior Secretaries Cards */}
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center">
          <Users className="w-4 h-4 mr-2 text-indigo-600" />
          Junior Secretaries & Workload Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {juniorSecs.map((jsec) => {
            const secInterns = interns.filter(i => i.assignedTo === jsec.id)
            const secReports = reports.filter(r => r.juniorSecId === jsec.id)
            const secPending = secReports.filter(r => r.status === 'submitted').length

            return (
              <div key={jsec.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {jsec.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{jsec.name}</h4>
                    <p className="text-[11px] text-slate-500">{jsec.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-extrabold text-slate-800 block text-base">{secInterns.length}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Interns</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-600 block text-base">{secPending}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pending</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-3 space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Intern Assignment & Hierarchy ({interns.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            All Monthly Reports ({reports.length})
          </button>
        </div>

        {/* Tab 1: Intern Assignments & Power Delegation */}
        {activeTab === 'assignments' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Direct Supervision Mapping</h4>
                <p className="text-xs text-slate-500">As Senior Secretary, you control which Junior Secretary oversees which intern.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Intern Name</th>
                    <th className="pb-3 font-semibold">Department</th>
                    <th className="pb-3 font-semibold">Assigned Junior Secretary</th>
                    <th className="pb-3 font-semibold text-right">Reassign Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interns.map((intern) => {
                    const assignedSec = juniorSecs.find(j => j.id === intern.assignedTo)
                    return (
                      <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-slate-900">
                          {intern.name}
                          <span className="block text-[11px] font-normal text-slate-500">{intern.email}</span>
                        </td>
                        <td className="py-3.5 text-slate-600">{intern.department || 'General'}</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {assignedSec ? assignedSec.name : 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <select
                            aria-label={`Reassign ${intern.name} to Junior Secretary`}
                            value={intern.assignedTo || ''}
                            onChange={(e) => onReassignIntern(intern.id, e.target.value)}
                            className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                          >
                            {juniorSecs.map(j => (
                              <option key={j.id} value={j.id}>
                                Transfer to {j.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: All Reports across organization */}
        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{rep.internName}</span>
                      <span className="text-slate-500 ml-2">({rep.monthYear}) • {rep.hoursContributed} hrs</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${rep.status === 'reviewed' ? 'bg-emerald-100 text-emerald-800' : rep.status === 'revision_requested' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {rep.status === 'reviewed' ? 'Reviewed' : rep.status === 'revision_requested' ? 'Revision Needed' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                    {rep.tasksCompleted}
                  </p>
                  {rep.reviewerFeedback && (
                    <p className="text-indigo-800 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                      <strong>Feedback ({rep.reviewedBy}):</strong> {rep.reviewerFeedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Onboard New Intern */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Onboard New Intern</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new intern and assign them under one of your Junior Secretaries.</p>

            <form onSubmit={handleAddInternSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={newInternName}
                  onChange={(e) => setNewInternName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={newInternEmail}
                  onChange={(e) => setNewInternEmail(e.target.value)}
                  placeholder="e.g. rahul@inspire-ngo.org"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department / Track</label>
                <input
                  type="text"
                  value={newInternDept}
                  onChange={(e) => setNewInternDept(e.target.value)}
                  placeholder="e.g. Community Outreach"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Under Junior Secretary *</label>
                <select
                  value={newInternSec}
                  onChange={(e) => setNewInternSec(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  {juniorSecs.map((j) => (
                    <option key={j.id} value={j.id}>{j.name} ({j.department})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Confirm & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
