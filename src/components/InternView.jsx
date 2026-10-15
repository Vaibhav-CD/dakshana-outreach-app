import React, { useState } from 'react'
import { FileText, Clock, AlertCircle, CheckCircle, Send, MessageSquare, Calendar } from 'lucide-react'
import PodiumSpotlight from './PodiumSpotlight'
import Avatar from './Avatar'

export default function InternView({
  currentUser,
  allUsers,
  reports,
  sessions = [],
  onSubmitReport,
  onSelectIntern
}) {
  const [tasks, setTasks] = useState('')
  const [hours, setHours] = useState('')
  const [challenges, setChallenges] = useState('')
  const [nextGoals, setNextGoals] = useState('')
  const [month, setMonth] = useState('October 2026')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const assignedSec = allUsers.find(u => u.id === currentUser.assignedTo)
  const internReports = reports.filter(r => r.internId === currentUser.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!tasks || !hours) return

    setIsSubmitting(true)
    const newReport = {
      id: `rep-${Date.now()}`,
      internId: currentUser.id,
      internName: currentUser.name,
      batch: currentUser.batch || 'Batch 1',
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
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved & Reviewed</span>
      case 'revision_requested':
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Revision Requested</span>
      default:
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Review</span>
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Scholar Welcome Card - Only what is required */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Avatar
              src={currentUser.photo}
              name={currentUser.name}
              role={currentUser.role}
              size="xl"
              className="border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Dakshana Scholar
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${currentUser.batch === 'Batch 2' ? 'bg-[#7B2E68] text-white border border-white/30' : 'bg-emerald-200 text-[#074D2D]'}`}>
                  {currentUser.batch || 'Batch 1'}
                </span>
              </div>
              <h2 className="text-2xl font-bold mt-1">{currentUser.name}</h2>
              <p className="text-emerald-100 text-xs">{currentUser.department || 'Grassroots Outreach'}</p>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20 text-xs">
            <span className="text-emerald-200 block">Assigned Wing Supervisor:</span>
            <span className="font-bold text-white text-sm">{assignedSec ? assignedSec.name : 'Junior Secretary'}</span>
            <span className="text-[11px] text-emerald-100 block">{assignedSec ? assignedSec.email : ''}</span>
          </div>
        </div>
      </div>

      {/* Cohort Excellence Podium - Motivation for Interns */}
      <PodiumSpotlight
        allUsers={allUsers}
        sessions={sessions}
        onSelectIntern={onSelectIntern}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Submission Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#0A643B]" />
                Monthly Scholar Progress Submission
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Submit your field teaching and student outreach milestones</p>
            </div>
            <div className="flex items-center text-xs font-semibold text-[#0A643B] bg-[#EBF7F0] px-3 py-1 rounded-lg border border-[#0A643B]/20">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {month}
            </div>
          </div>

          {submitSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-[#0A643B] flex-shrink-0" />
              Your monthly report has been submitted to your Junior Secretary for review!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Sessions & Tasks Completed *
              </label>
              <textarea
                required
                rows={4}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Detail the sessions conducted, topics covered (math/science/etc.), number of students, and materials distributed..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-[#0A643B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Field Hours Contributed *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="300"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#0A643B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Reporting Cycle
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A643B]"
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
                placeholder="Logistics, learning kits, transportation, attendance hurdles..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-[#0A643B]"
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
                placeholder="Key milestones you aim to achieve next cycle..."
                className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-[#0A643B]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Transmitting Report...' : 'Submit Monthly Report to Wing Lead'}
            </button>
          </form>
        </div>

        {/* Previous Reports & Feedback */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg flex items-center mb-1">
              <Clock className="w-5 h-5 mr-2 text-[#0A643B]" />
              Submission History
            </h3>
            <p className="text-xs text-slate-500 mb-4">Past evaluations from your Junior Secretary</p>

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
                      <strong className="text-slate-900 block mb-1">Field Sessions:</strong>
                      {rep.tasksCompleted}
                    </p>

                    {rep.reviewerFeedback && (
                      <div className="text-xs bg-[#EBF7F0] border border-[#0A643B]/20 p-3 rounded-lg text-[#074D2D]">
                        <div className="flex items-center space-x-1 font-semibold text-[#0A643B] mb-1">
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
