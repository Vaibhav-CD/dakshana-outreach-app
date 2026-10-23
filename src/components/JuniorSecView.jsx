import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  ChevronRight,
  Check,
  X,
  Shield,
  Sparkles,
  Key,
  Layers,
  CreditCard,
  Radio,
  Filter,
  ClipboardList,
  Square,
  CheckCheck,
  Wrench,
  MessageSquarePlus,
  Send,
  Plus,
  FileSpreadsheet
} from 'lucide-react'

import PodiumSpotlight from './PodiumSpotlight'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'
import ProgressIntelligenceHub from './ProgressIntelligenceHub'
import { formatDateWithRelative } from '../utils/dateUtils'

export default function JuniorSecView({
  currentUser,
  allUsers,
  reports,
  sessions = [],
  onUpdateReport,
  delegatedPowers = {},
  onReassignIntern,
  onUpdateInternBatch,
  onUpdateInternTargetVisits,
  onSelectIntern,
  assignedTasks = [],
  onToggleTaskDone,
  onAddSuggestion
}) {
  const [selectedReport, setSelectedReport] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [newStatus, setNewStatus] = useState('reviewed')
  const [reportScope, setReportScope] = useState('my_wing') // 'my_wing' | 'all_wings'
  const [reportViewMode, setReportViewMode] = useState('queue') // 'queue' | 'intelligence'

  // Suggestion modal state (submit to Senior Secretary)
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [sugTitle, setSugTitle] = useState('')
  const [sugDesc, setSugDesc] = useState('')
  const [sugCategory, setSugCategory] = useState('Operations')
  const [sugPriority, setSugPriority] = useState('medium')
  const [sugSuccessNotice, setSugSuccessNotice] = useState(null)

  const myPowers = delegatedPowers?.[currentUser.id] || {}
  const hasAnyPower = Object.values(myPowers).some(Boolean)

  // Directives assigned to this Junior Secretary
  const myDirectives = assignedTasks.filter(t => 
    t.assignedToId === currentUser.id || 
    (t.assignedToRole === 'junior_sec' && (!t.assignedToId || t.assignedToId === currentUser.id))
  )
  const pendingDirectivesCount = myDirectives.filter(t => !t.isCompleted).length

  const handleSubmitSuggestion = (e) => {
    e.preventDefault()
    if (!sugTitle.trim()) return

    const newSug = {
      id: `sug-${Date.now()}`,
      title: sugTitle.trim(),
      description: sugDesc.trim(),
      submittedBy: `${currentUser.name} (Junior Secretary)`,
      submittedRole: 'junior_sec',
      category: sugCategory,
      status: 'pending',
      priority: sugPriority,
      createdAt: new Date().toISOString().split('T')[0],
      rectifiedAt: null,
      rectifiedNote: null
    }

    if (onAddSuggestion) onAddSuggestion(newSug)
    setSugTitle('')
    setSugDesc('')
    setShowSuggestionModal(false)
    setSugSuccessNotice('Improvement suggestion submitted to Senior Secretary successfully.')
    setTimeout(() => setSugSuccessNotice(null), 4000)
  }

  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const allInterns = allUsers.filter(u => u.role === 'intern')

  // Wing interns
  const assignedInterns = allUsers.filter(u => u.role === 'intern' && u.assignedTo === currentUser.id)
  const assignedInternIds = assignedInterns.map(i => i.id)

  // Report scoping: if canViewAllReports is true, user can toggle between my_wing and all_wings
  const effectiveReports = (myPowers.canViewAllReports && reportScope === 'all_wings')
    ? reports
    : reports.filter(r => assignedInternIds.includes(r.internId) || r.juniorSecId === currentUser.id)

  const pendingReports = effectiveReports.filter(r => r.status === 'submitted')
  const completedReports = effectiveReports.filter(r => r.status === 'reviewed')

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
      <div className="bg-gradient-to-r from-[#074D2D] to-[#0A643B] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5 mr-1" />
              <span>Junior Secretary Supervision Portal</span>
              {hasAnyPower && (
                <span className="ml-2 inline-flex items-center text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-400 text-slate-900">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Elevated Powers Active
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold">Welcome, {currentUser.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">Junior Secretary • Outreach Operations</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex space-x-3 text-center">
              <div className="bg-white/15 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20">
                <span className="block text-xl font-bold">{assignedInterns.length}</span>
                <span className="text-xs text-emerald-100">Supervised Scholars</span>
              </div>
              <div className="bg-white/15 px-4 py-2 rounded-xl backdrop-blur-xs border border-white/20">
                <span className="block text-xl font-bold text-amber-200">{pendingReports.length}</span>
                <span className="text-xs text-emerald-100">Pending Review</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuggestionModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 text-xs font-bold transition-all shadow-xs flex items-center cursor-pointer whitespace-nowrap"
              title="Submit a maintenance or improvement suggestion to Senior Secretary"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
              Suggest Improvement
            </button>
          </div>
        </div>

        {/* Delegated Special Powers Banner */}
        {hasAnyPower && (
          <div className="mt-5 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-2 mb-2">
              <Key className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Senior Secretary Delegated Special Privileges:
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {myPowers.canManageReimbursements && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 text-white font-semibold">
                  <CreditCard className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
                  Reimbursement Window & Claims Authority
                </span>
              )}
              {myPowers.canReassignBatches && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 text-white font-semibold">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-purple-200" />
                  Batch Allocation & Scholar Transfer
                </span>
              )}
              {myPowers.canBroadcast && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 text-white font-semibold">
                  <Radio className="w-3.5 h-3.5 mr-1.5 text-blue-200" />
                  Cohort Circular Broadcast Dispatch
                </span>
              )}
              {myPowers.canViewAllReports && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/20 border border-white/30 text-white font-semibold">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-amber-200" />
                  Cross-Wing Report Evaluation
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Success Toast */}
      {sugSuccessNotice && (
        <div className="bg-[#0A643B] text-white p-3.5 px-4 rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-in slide-in-from-top-2 border border-emerald-400">
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-200" />
            {sugSuccessNotice}
          </span>
          <button onClick={() => setSugSuccessNotice(null)} className="hover:opacity-80 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Outreach Scholars Podium Spotlight */}
      <PodiumSpotlight
        allUsers={allUsers}
        sessions={sessions}
        onSelectIntern={onSelectIntern}
      />

      {/* Assigned Directives & Operational Tasks for this Junior Secretary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-[#0A643B]" />
              Assigned Directives & Tasks ({myDirectives.length})
            </h3>
            <p className="text-xs text-slate-500">
              Work assigned to you by Senior Secretary and Management. Use the toggle button to update completion status.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {pendingDirectivesCount > 0 ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {pendingDirectivesCount} Incomplete
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> All Tasks Done
              </span>
            )}
          </div>
        </div>

        {myDirectives.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No pending directives currently assigned to your wing.
          </div>
        ) : (
          <div className="space-y-3">
            {myDirectives.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  task.isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className={`font-bold text-sm ${task.isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        task.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.priority} Priority
                      </span>
                      {task.isCompleted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-500">
                      <span>Delegated by: <strong className="text-slate-700">{task.assignedBy}</strong></span>
                      <span>Assigned: {formatDateWithRelative(task.createdAt)}</span>
                      {task.completedAt && (
                        <span className="text-emerald-700 font-semibold">Done: {formatDateWithRelative(task.completedAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Interactive "Done or Not" Update Button for Junior Secretary */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => onToggleTaskDone && onToggleTaskDone(task.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all cursor-pointer shadow-xs ${
                        task.isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 hover:bg-[#0A643B] text-white'
                      }`}
                      title="Click to update task status"
                    >
                      {task.isCompleted ? (
                        <>
                          <CheckCheck className="w-4 h-4 mr-1.5" />
                          Completed ✓
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4 mr-1.5" />
                          Mark as Done
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Switcher: Review Queue vs Progress Intelligence & Excel Export */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto self-start border border-slate-200 text-xs font-bold">
        <button
          onClick={() => setReportViewMode('queue')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
            reportViewMode === 'queue' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#0A643B]" />
          <span>Evaluation Queue & Scholars ({pendingReports.length} pending)</span>
        </button>
        <button
          onClick={() => setReportViewMode('intelligence')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
            reportViewMode === 'intelligence' ? 'bg-[#0A643B] text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Progress Intelligence & Excel Export</span>
        </button>
      </div>

      {reportViewMode === 'intelligence' ? (
        <ProgressIntelligenceHub
          reports={myPowers.canViewAllReports && reportScope === 'all_wings' ? reports : filteredReportsList}
          allUsers={allUsers}
          currentUser={currentUser}
          onUpdateReport={onUpdateReport}
        />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Review Queue */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#0A643B]" />
                  Monthly Reports Requiring Review ({pendingReports.length})
                </h3>
                <p className="text-xs text-slate-500">
                  {myPowers.canViewAllReports && reportScope === 'all_wings'
                    ? 'Showing submissions across ALL cohort wings (delegated authority)'
                    : 'Showing submissions from your assigned wing scholars'}
                </p>
              </div>

              {/* Scope toggle for delegated Cross-Wing Evaluators */}
              {myPowers.canViewAllReports && (
                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setReportScope('my_wing')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      reportScope === 'my_wing' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    My Wing
                  </button>
                  <button
                    onClick={() => setReportScope('all_wings')}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      reportScope === 'all_wings' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    All Wings ({reports.length})
                  </button>
                </div>
              )}
            </div>

            {pendingReports.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-[#0A643B] mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800">All evaluations completed!</p>
                <p className="text-xs text-slate-500 mt-1">There are no pending submissions awaiting your review right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900">{rep.internName}</h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-md ${rep.batch === 'Batch 2' ? 'bg-[#F8EDF5] text-[#7B2E68]' : 'bg-[#EBF7F0] text-[#0A643B]'}`}>
                            {rep.batch || 'Batch 1'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">{rep.monthYear}</span>
                      </div>
                      <button
                        onClick={() => handleOpenReview(rep)}
                        className="px-3 py-1.5 rounded-lg bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-semibold flex items-center cursor-pointer shadow-xs"
                      >
                        Evaluate & Feedback <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
                    <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded-sm bg-white border border-slate-200 text-slate-600 font-semibold">{rep.batch || 'Batch 1'}</span>
                    <span className="text-slate-500 ml-2">({rep.monthYear})</span>
                    <p className="text-slate-600 mt-0.5 italic">"{rep.reviewerFeedback}"</p>
                  </div>
                  <button
                    onClick={() => handleOpenReview(rep)}
                    className="text-[#0A643B] hover:underline font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Supervised Scholars & Delegated Batch Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <Users className="w-4 h-4 mr-2 text-[#0A643B]" />
                Supervised Scholars ({assignedInterns.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {myPowers.canReassignBatches
                ? 'Elevated power active: You can reassign batches or transfer scholars'
                : 'Scholars assigned to your wing for field evaluation'}
            </p>

            <div className="space-y-3">
              {assignedInterns.map(intern => {
                const hasReport = effectiveReports.some(r => r.internId === intern.id)
                return (
                  <div key={intern.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => onSelectIntern && onSelectIntern(intern)}
                        className="flex items-center space-x-2.5 cursor-pointer group flex-1"
                        title="Click to view scholar visits, progress & graphs"
                      >
                        <Avatar
                          src={intern.photo}
                          name={intern.name}
                          role={intern.role || 'intern'}
                          size="sm"
                          className="group-hover:border-[#0A643B] transition-colors"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#0A643B] transition-colors">{intern.name}</p>
                            {intern.stream && <StreamBadge stream={intern.stream} size="xs" />}
                          </div>
                          <span className="text-[10px] text-slate-500">{intern.batch || 'Batch 1'} • Outreach Scholar</span>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${hasReport ? 'bg-[#EBF7F0] text-[#0A643B]' : 'bg-slate-200 text-slate-700'}`}>
                        {hasReport ? 'Active' : 'Awaiting'}
                      </span>
                    </div>

                    {/* Target Visits Goal Modifier */}
                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600 font-semibold">Target Visits:</span>
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          defaultValue={intern.targetVisits || 15}
                          key={`${intern.id}-${intern.targetVisits || 15}`}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10)
                            if (val && onUpdateInternTargetVisits) {
                              onUpdateInternTargetVisits(intern.id, val)
                            }
                          }}
                          className="w-12 text-xs font-bold text-center py-0.5 rounded border border-slate-300 bg-white focus:ring-1 focus:ring-[#0A643B] focus:outline-hidden"
                          title="Modify scholar's target visits"
                        />
                        <span className="text-[10px] text-slate-500">visits</span>
                      </div>
                    </div>

                    {/* If Junior Secretary has delegated batch power */}
                    {myPowers.canReassignBatches && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 text-xs">
                        <select
                          aria-label={`Change batch for ${intern.name}`}
                          value={intern.batch || 'Batch 1'}
                          onChange={(e) => onUpdateInternBatch && onUpdateInternBatch(intern.id, e.target.value)}
                          className="text-[11px] font-bold rounded-md px-1.5 py-0.5 border bg-white border-slate-300"
                        >
                          <option value="Batch 1">Batch 1</option>
                          <option value="Batch 2">Batch 2</option>
                        </select>

                        <select
                          aria-label={`Transfer ${intern.name}`}
                          value={intern.assignedTo || ''}
                          onChange={(e) => onReassignIntern && onReassignIntern(intern.id, e.target.value)}
                          className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 border bg-white border-slate-300 max-w-[130px] truncate"
                        >
                          {juniorSecs.map(j => (
                            <option key={j.id} value={j.id}>Transfer: {j.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Evaluate Scholar Report</h3>
                <p className="text-xs text-slate-500">{selectedReport.internName} ({selectedReport.batch}) • {selectedReport.monthYear}</p>
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
                <span className="font-bold text-slate-700 block mb-1">Grassroots Activities & Progress:</span>
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
                  <span className="font-bold text-slate-700 block mb-1">Goals for Upcoming Month:</span>
                  <p className="text-slate-800 leading-relaxed">{selectedReport.nextMonthGoals}</p>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Supervisor Feedback & Mentorship Remarks:
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide guidance, acknowledgment of good work, or points to correct..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Status Decision:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('reviewed')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center border cursor-pointer ${newStatus === 'reviewed' ? 'bg-[#0A643B] text-white border-[#0A643B]' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" /> Approve & Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('revision_requested')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center border cursor-pointer ${newStatus === 'revision_requested' ? 'bg-[#7B2E68] text-white border-[#7B2E68]' : 'bg-slate-50 text-slate-700 border-slate-300'}`}
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
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0A643B] hover:bg-[#074D2D] text-white shadow-xs cursor-pointer"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Improvement Suggestion to Senior Secretary Modal */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <MessageSquarePlus className="w-5 h-5 mr-2 text-[#0A643B]" />
                Submit Improvement Suggestion
              </h3>
              <button onClick={() => setShowSuggestionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Submit an operational suggestion or report a bug directly to the Senior Secretary. He handles all system maintenance and rectification.
            </p>

            <form onSubmit={handleSubmitSuggestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Brief Summary *</label>
                <input
                  required
                  type="text"
                  value={sugTitle}
                  onChange={(e) => setSugTitle(e.target.value)}
                  placeholder="e.g. Standardize attendance reporting format across clusters"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={sugCategory}
                    onChange={(e) => setSugCategory(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Materials Hub">Materials Hub</option>
                    <option value="Reimbursements">Reimbursements</option>
                    <option value="Curriculum">Curriculum</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={sugPriority}
                    onChange={(e) => setSugPriority(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={sugDesc}
                  onChange={(e) => setSugDesc(e.target.value)}
                  placeholder="Describe the issue, operational friction, or proposed improvement in detail..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSuggestionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold shadow-xs cursor-pointer flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Submit to Senior Secretary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
