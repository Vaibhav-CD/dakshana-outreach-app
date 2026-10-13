import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Clock, Users, MessageSquare, ChevronRight, Check, X } from 'lucide-react'

export default function JuniorSecView({ currentUser, allUsers, reports, onUpdateReport }) {
  const [selectedReport, setSelectedReport] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [newStatus, setNewStatus] = useState('reviewed')

  // Filter only interns assigned to this Junior Secretary
  const assignedInterns = allUsers.filter(u => u.role === 'intern' && u.assignedTo === currentUser.id)
  const assignedInternIds = assignedInterns.map(i => i.id)

  // Reports only belonging to assigned interns
  const myReports = reports.filter(r => assignedInternIds.includes(r.internId) || r.juniorSecId === currentUser.id)
  const pendingReports = myReports.filter(r => r.status === 'submitted')
  const completedReports = myReports.filter(r => r.status === 'reviewed')

  const handleOpenReview = (report) => {
    setSelectedReport(report)
    setFeedbackText(report.reviewerFeedback || '')
    setNewStatus(report.status === 'submitted' ? 'reviewed' : report.status)
  }

  const handleSaveReview = () => {
    if (!selectedReport) return

    onUpdateReport(selectedReport.id, {
      status: newStatus,
      reviewerFeedback: feedbackText,
      reviewedBy: currentUser.name,
      reviewedAt: new Date().toISOString()
    })
    setSelectedReport(null)
  }

  return (
    <div className="space-y-6">
      
      {/* Junior Sec Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {currentUser.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">Junior Secretary Dashboard • {currentUser.department}</p>
          </div>
          <div className="flex space-x-3 text-center">
            <div className="bg-white/15 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20">
              <span className="block text-xl font-bold">{assignedInterns.length}</span>
              <span className="text-xs text-emerald-200">Assigned Interns</span>
            </div>
            <div className="bg-white/15 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20">
              <span className="block text-xl font-bold">{pendingReports.length}</span>
              <span className="text-xs text-emerald-200">Needs Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Review Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                Monthly Reports Requiring Review ({pendingReports.length})
              </h3>
              <span className="text-xs text-slate-500">Only showing your assigned interns</span>
            </div>

            {pendingReports.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">There are no pending submissions awaiting your review right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900">{rep.internName}</h4>
                        <span className="text-xs text-slate-500">{rep.monthYear} • {rep.hoursContributed} hrs contributed</span>
                      </div>
                      <button
                        onClick={() => handleOpenReview(rep)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center cursor-pointer shadow-xs"
                      >
                        Review & Feedback <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-700 line-clamp-2 bg-white/80 p-2.5 rounded-lg border border-amber-100">
                      {rep.tasksCompleted}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Reviewed Reports */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-3">Reviewed History ({completedReports.length})</h3>
            <div className="space-y-3">
              {completedReports.map(rep => (
                <div key={rep.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{rep.internName}</span>
                    <span className="text-slate-500 ml-2">({rep.monthYear})</span>
                    <p className="text-slate-600 mt-0.5 italic">"{rep.reviewerFeedback}"</p>
                  </div>
                  <button
                    onClick={() => handleOpenReview(rep)}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Interns List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center mb-1">
              <Users className="w-4 h-4 mr-2 text-emerald-600" />
              Your Assigned Interns ({assignedInterns.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">Assigned to you by Senior Secretary</p>

            <div className="space-y-3">
              {assignedInterns.map(intern => {
                const hasReport = myReports.some(r => r.internId === intern.id)
                return (
                  <div key={intern.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{intern.name}</p>
                      <p className="text-xs text-slate-500">{intern.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${hasReport ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                      {hasReport ? 'Active' : 'Awaiting Report'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Review Monthly Progress</h3>
                <p className="text-xs text-slate-500">{selectedReport.internName} • {selectedReport.monthYear}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">Tasks Completed ({selectedReport.hoursContributed} hrs):</span>
                <p className="text-slate-800 leading-relaxed">{selectedReport.tasksCompleted}</p>
              </div>

              {selectedReport.challengesFaced && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Challenges & Support Needed:</span>
                  <p className="text-slate-800 leading-relaxed">{selectedReport.challengesFaced}</p>
                </div>
              )}

              {selectedReport.nextMonthGoals && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Goals for Next Month:</span>
                  <p className="text-slate-800 leading-relaxed">{selectedReport.nextMonthGoals}</p>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Your Feedback / Actionable Remarks:
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide guidance, acknowledgment of good work, or points to correct..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Set Status Decision:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('reviewed')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center border cursor-pointer ${newStatus === 'reviewed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" /> Approve & Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('revision_requested')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center border cursor-pointer ${newStatus === 'revision_requested' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Request Revision
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
