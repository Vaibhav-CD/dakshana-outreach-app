import React, { useState } from 'react'
import { FileText, Clock, AlertCircle, CheckCircle, Send, MessageSquare, Calendar } from 'lucide-react'

export default function InternView({ currentUser, allUsers, reports, onSubmitReport }) {
  const [tasks, setTasks] = useState('')
  const [hours, setHours] = useState('')
  const [challenges, setChallenges] = useState('')
  const [nextGoals, setNextGoals] = useState('')
  const [month, setMonth] = useState('October 2026')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Find intern's assigned Junior Secretary
  const assignedSec = allUsers.find(u => u.id === currentUser.assignedTo)

  // Intern's past reports
  const internReports = reports.filter(r => r.internId === currentUser.id)
  const hasSubmittedThisMonth = internReports.some(r => r.monthYear === month)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!tasks || !hours) return

    setIsSubmitting(true)
    const newReport = {
      id: `rep-${Date.now()}`,
      internId: currentUser.id,
      internName: currentUser.name,
      juniorSecId: currentUser.assignedTo || 'user-jsec-1',
      monthYear: month,
      tasksCompleted: tasks,
      hoursContributed: parseInt(hours, 10) || 0,
      challengesFaced: challenges,
      nextMonthGoals: nextGoals,
      status: 'submitted',
      reviewerFeedback: '',
      reviewedBy: null,
      updatedAt: new Date().toISOString().split('T')[0]
    }

    setTimeout(() => {
      onSubmitReport(newReport)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setTasks('')
      setHours('')
      setChallenges('')
      setNextGoals('')
      setTimeout(() => setSubmitSuccess(false), 4000)
    }, 400)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reviewed':
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved & Reviewed</span>
      case 'revision_requested':
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Revision Requested</span>
      default:
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Review</span>
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Intern Welcome Card */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Hello, {currentUser.name}!</h2>
            <p className="text-amber-100 text-sm mt-1">Intern Portal • {currentUser.department || 'NGO Operations'}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-xs">
            <span className="text-amber-200 block">Assigned Supervisor:</span>
            <span className="font-semibold text-white">{assignedSec ? assignedSec.name : 'Junior Secretary'}</span>
            <span className="text-xs text-amber-200 block">{assignedSec ? assignedSec.email : ''}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Submission Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Monthly Progress Submission
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Submit your monthly milestone summary to your Junior Secretary</p>
            </div>
            <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {month}
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
              Your monthly report has been submitted to your Junior Secretary for review!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tasks Completed & Major Contributions *
              </label>
              <textarea
                required
                rows={4}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Describe key activities, events organized, people impacted, or deliverables completed..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Hours Contributed This Month *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="300"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Reporting Cycle
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="October 2026">October 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Challenges Faced & Support Needed
              </label>
              <textarea
                rows={2}
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Any obstacles encountered (e.g. logistics, resources, attendance)..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Goals for Next Month
              </label>
              <textarea
                rows={2}
                value={nextGoals}
                onChange={(e) => setNextGoals(e.target.value)}
                placeholder="What do you plan to achieve in the upcoming cycle?..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Monthly Report'}
            </button>
          </form>
        </div>

        {/* Previous Reports & Feedback */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg flex items-center mb-1">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Your Submission History
            </h3>
            <p className="text-xs text-slate-500 mb-4">Past reports and supervisor evaluation</p>

            {internReports.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No reports submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {internReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{rep.monthYear}</span>
                        <span className="text-xs text-slate-500 block">{rep.hoursContributed} hours recorded</span>
                      </div>
                      {getStatusBadge(rep.status)}
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Work Accomplished:</strong>
                      {rep.tasksCompleted}
                    </p>

                    {rep.reviewerFeedback && (
                      <div className="text-xs bg-indigo-50/80 border border-indigo-100 p-3 rounded-lg text-indigo-900">
                        <div className="flex items-center space-x-1 font-semibold text-indigo-800 mb-1">
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          Feedback from {rep.reviewedBy || 'Junior Secretary'}:
                        </div>
                        {rep.reviewerFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
