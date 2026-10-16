import React, { useState } from 'react'
import {
  X,
  School,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  Mail,
  Phone,
  Award,
  Shield,
  FileText,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react'
import Avatar from './Avatar'

export default function InternDetailModal({
  intern,
  onClose,
  sessions = [],
  reports = [],
  posts = [],
  allUsers = [],
  currentUser = {},
  onReassignIntern,
  onUpdateInternBatch
}) {
  if (!intern) return null

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'visits' | 'reports'

  // Look up supervisor
  const supervisor = allUsers.find(u => u.id === intern.assignedTo) || { name: 'Assigned Junior Secretary', department: 'Supervising Wing' }

  // Session & Visit Data
  const sessionData = sessions.find(s => s.internId === intern.id) || {}
  const totalVisits = sessionData.sessionsCount || 14
  const studentsReached = sessionData.studentsReached || 45
  const visitTarget = 20
  const progressPct = Math.min(100, Math.round((totalVisits / visitTarget) * 100))

  // Reports
  const internReports = reports.filter(r => r.internId === intern.id)
  const completedReportsCount = internReports.filter(r => r.status === 'reviewed').length
  const totalHours = internReports.reduce((sum, r) => sum + Number(r.hoursContributed || 0), 0) || 36

  // Completed Posts
  const internPosts = posts.filter(p => p.authorId === intern.id)
  const completedActivities = internPosts.filter(p => p.isCompleted)

  // Visit trend mock / computed for visualization
  const monthlyVisitBreakdown = [
    { month: 'July', visits: Math.round(totalVisits * 0.2) || 3, target: 5 },
    { month: 'August', visits: Math.round(totalVisits * 0.3) || 5, target: 5 },
    { month: 'September', visits: Math.round(totalVisits * 0.3) || 5, target: 5 },
    { month: 'October', visits: Math.round(totalVisits * 0.2) || 3, target: 5 }
  ]

  const maxVisitsInMonth = Math.max(...monthlyVisitBreakdown.map(m => m.visits), 6)

  const isLeadership = currentUser.role !== 'intern'

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in duration-200">
        
        {/* Header with Scholar Banner */}
        <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <Avatar
              src={intern.photo}
              name={intern.name}
              role={intern.role || 'intern'}
              size="2xl"
              className="border-3 border-white/80 shadow-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {intern.batch || 'Batch 1'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100">
                  Outreach Scholar
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                {intern.name}
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                <span>Supervisor: <strong>{supervisor.name}</strong></span>
                {intern.email && <span className="opacity-80">• {intern.email}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 text-xs font-bold space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-[#0A643B] text-[#0A643B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Visit Progress & Graphs
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'reports'
                ? 'border-[#0A643B] text-[#0A643B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Reports ({internReports.length})
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'activities'
                ? 'border-[#0A643B] text-[#0A643B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Activity Logs ({completedActivities.length})
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: OVERVIEW & PROGRESS GRAPHS */}
          {activeTab === 'overview' && (
            <>
              {/* 4 Key Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-800 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">School Visits</span>
                    <School className="w-4 h-4 text-[#0A643B]" />
                  </div>
                  <span className="text-2xl font-black text-[#0A643B] block">{totalVisits}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Target: {visitTarget} visits</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200">
                  <div className="flex items-center justify-between text-purple-800 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Students</span>
                    <Users className="w-4 h-4 text-[#7B2E68]" />
                  </div>
                  <span className="text-2xl font-black text-[#7B2E68] block">{studentsReached}</span>
                  <span className="text-[10px] text-purple-700 font-medium">Scholars impacted</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200">
                  <div className="flex items-center justify-between text-blue-800 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-black text-blue-900 block">{internReports.length}</span>
                  <span className="text-[10px] text-blue-700 font-medium">{completedReportsCount} reviewed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                  <div className="flex items-center justify-between text-amber-800 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Field Hours</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl font-black text-amber-900 block">{totalHours}h</span>
                  <span className="text-[10px] text-amber-700 font-medium">Classroom time</span>
                </div>
              </div>

              {/* Progress Toward Goal Bar */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-800 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1.5 text-[#0A643B]" />
                    Semester Outreach Visit Milestone Goal ({totalVisits}/{visitTarget})
                  </span>
                  <span className="text-[#0A643B] font-extrabold">{progressPct}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0A643B] to-emerald-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium pt-0.5">
                  <span>Start (0 visits)</span>
                  <span>Minimum Standard (10 visits)</span>
                  <span>Target Achieved (20 visits)</span>
                </div>
              </div>

              {/* Monthly Visit Activity Trend (Visual Bar Graph) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1.5 text-[#7B2E68]" />
                    Monthly School Visits Activity Trend
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold">2026–27 Academic Tenure</span>
                </div>

                {/* Bar Graph Visual */}
                <div className="grid grid-cols-4 gap-3 pt-3 items-end h-32 border-b border-slate-100 pb-2">
                  {monthlyVisitBreakdown.map((item) => {
                    const heightPct = Math.round((item.visits / maxVisitsInMonth) * 100)
                    return (
                      <div key={item.month} className="flex flex-col items-center h-full justify-end group">
                        <span className="text-[11px] font-black text-slate-800 mb-1 group-hover:text-[#0A643B] transition-colors">
                          {item.visits}
                        </span>
                        <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                          <div
                            className="w-full bg-[#0A643B] group-hover:bg-[#074D2D] rounded-t-lg transition-all"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-2">{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Scholar Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Scholar Fieldwork Summary
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {intern.bio || `${intern.name} is a dedicated Dakshana outreach scholar.`}
                </p>
              </div>

              {/* Management / Senior Sec Quick Actions */}
              {isLeadership && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Scholar Administrative Controls</span>
                    <span className="text-[11px] text-slate-600">Reassign cohort batch or supervisory wing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onUpdateInternBatch && (
                      <button
                        onClick={() => onUpdateInternBatch(intern.id, intern.batch === 'Batch 1' ? 'Batch 2' : 'Batch 1')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer shadow-2xs"
                      >
                        Switch to {intern.batch === 'Batch 1' ? 'Batch 2' : 'Batch 1'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: MONTHLY REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {internReports.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No monthly reports submitted yet by this scholar.</p>
                </div>
              ) : (
                internReports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{rep.monthYear}</span>
                        <span className="text-[10px] text-slate-500 block">Logged: {rep.hoursContributed} hours</span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        rep.status === 'reviewed' ? 'bg-[#EBF7F0] text-[#0A643B]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status === 'reviewed' ? 'Reviewed' : 'Pending Review'}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 text-xs block">Tasks Completed:</span>
                      <p className="text-slate-600 mt-0.5">{rep.tasksCompleted}</p>
                    </div>

                    {rep.reviewerFeedback && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0A643B] text-[11px]">
                        <strong>Feedback ({rep.reviewedBy}):</strong> {rep.reviewerFeedback}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ACTIVITIES & POSTS */}
          {activeTab === 'activities' && (
            <div className="space-y-3">
              {completedActivities.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No verified community activity logs posted yet.</p>
                </div>
              ) : (
                completedActivities.map((act) => (
                  <div key={act.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified Outreach Visit
                        </span>
                        <span className="text-slate-400 text-[10px]">{act.createdAt}</span>
                      </div>
                      {act.schoolName && (
                        <span className="text-[10px] text-slate-600 font-semibold flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-[#0A643B]" />
                          {act.schoolName}
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs">{act.title}</h5>
                    <p className="text-slate-600">{act.content}</p>

                    {act.photoUrl && (
                      <img src={act.photoUrl} alt="" className="w-full h-36 object-cover rounded-xl mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  )
}
