import React, { useState } from 'react'
import {
  Users,
  ShieldAlert,
  UserPlus,
  Filter,
  ShieldCheck,
  Key,
  Check,
  CreditCard,
  Radio,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Phone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  Plus,
  CheckSquare,
  Square,
  CheckCheck,
  FileText,
  Send,
  X,
  Archive,
  ClipboardList
} from 'lucide-react'

import PodiumSpotlight from './PodiumSpotlight'
import Avatar from './Avatar'
import { formatDateWithRelative } from '../utils/dateUtils'

export default function SeniorSecView({
  currentUser,
  allUsers,
  reports,
  sessions = [],
  onReassignIntern,
  onUpdateInternBatch,
  onUpdateInternStream,
  onUpdateInternTargetVisits,
  onAddIntern,
  onSelectIntern,
  delegatedPowers = {},
  onTogglePrivilege,
  onBulkPrivilege,
  assignedTasks = [],
  onToggleTaskDone,
  onAssignTask,
  suggestions = [],
  onRectifySuggestion,
  onAddSuggestion
}) {
  const [activeTab, setActiveTab] = useState('assignments') // 'assignments' | 'directives' | 'reports' | 'maintenance' | 'delegation'
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all') // 'all' | 'Batch 1' | 'Batch 2'
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInternName, setNewInternName] = useState('')
  const [newInternEmail, setNewInternEmail] = useState('')
  const [newInternSec, setNewInternSec] = useState('user-jsec-1')
  const [newInternBatch, setNewInternBatch] = useState('Batch 1')
  const [newInternStream, setNewInternStream] = useState('JEE')
  const [newInternTargetVisits, setNewInternTargetVisits] = useState('15')
  const [newInternDept, setNewInternDept] = useState('Field Outreach')

  // Directives & Assigned Tasks states
  const [directivesViewScope, setDirectivesViewScope] = useState('my_tasks') // 'my_tasks' | 'junior_sec_tasks'
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskJsecId, setNewTaskJsecId] = useState('user-jsec-1')
  const [newTaskPriority, setNewTaskPriority] = useState('high')

  // Improvement & Maintenance Tracker states (Senior Secretary Exclusive)
  const [maintenanceTab, setMaintenanceTab] = useState('pending') // 'pending' | 'rectified'
  const [maintenanceCategoryFilter, setMaintenanceCategoryFilter] = useState('all')
  const [rectifyingIssue, setRectifyingIssue] = useState(null)
  const [rectificationNote, setRectificationNote] = useState('')
  const [showNewSuggestionModal, setShowNewSuggestionModal] = useState(false)
  const [newSugTitle, setNewSugTitle] = useState('')
  const [newSugDesc, setNewSugDesc] = useState('')
  const [newSugCategory, setNewSugCategory] = useState('Materials Hub')
  const [newSugPriority, setNewSugPriority] = useState('medium')
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null)
  const [privilegeToast, setPrivilegeToast] = useState(null)

  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const interns = allUsers.filter(u => u.role === 'intern')

  // Filtered interns by batch
  const filteredInterns = selectedBatchFilter === 'all'
    ? interns
    : interns.filter(i => i.batch === selectedBatchFilter)

  // Metrics
  const totalInterns = interns.length
  const batch1Count = interns.filter(i => i.batch === 'Batch 1').length
  const batch2Count = interns.filter(i => i.batch === 'Batch 2').length
  const totalReports = reports.length
  const reviewedReports = reports.filter(r => r.status === 'reviewed').length
  const complianceRate = totalInterns > 0 ? Math.round((totalReports / totalInterns) * 100) : 0

  const handleAddInternSubmit = (e) => {
    e.preventDefault()
    if (!newInternName || !newInternEmail) return

    onAddIntern({
      id: `user-intern-${Date.now()}`,
      name: newInternName,
      email: newInternEmail,
      role: 'intern',
      batch: newInternBatch,
      stream: newInternStream,
      assignedTo: newInternSec,
      targetVisits: parseInt(newInternTargetVisits, 10) || 15,
      department: 'Outreach Fieldwork',
      photo: null,
      title: 'Outreach Scholar',
      bio: `${newInternBatch} Outreach Scholar (${newInternStream} Stream).`
    })

    setNewInternName('')
    setNewInternEmail('')
    setNewInternStream('JEE')
    setNewInternTargetVisits('15')
    setShowAddModal(false)
  }

  // Directives metrics & filtering
  const seniorSecDirectives = assignedTasks.filter(t => t.assignedToId === 'user-senior-sec' || t.assignedToRole === 'senior_sec')
  const pendingSeniorSecDirectives = seniorSecDirectives.filter(t => !t.isCompleted).length
  const completedSeniorSecDirectives = seniorSecDirectives.filter(t => t.isCompleted).length

  const juniorSecDirectives = assignedTasks.filter(t => t.assignedToRole === 'junior_sec')
  const pendingJuniorSecDirectives = juniorSecDirectives.filter(t => !t.isCompleted).length

  // Maintenance & Suggestions metrics & filtering
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
  const rectifiedSuggestions = suggestions.filter(s => s.status === 'rectified')
  const activeSuggestionsList = maintenanceTab === 'pending' ? pendingSuggestions : rectifiedSuggestions
  const filteredSuggestions = activeSuggestionsList.filter(s => {
    if (maintenanceCategoryFilter === 'all') return true
    return s.category === maintenanceCategoryFilter
  })

  const handleAssignDirectiveSubmit = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const targetJsec = juniorSecs.find(j => j.id === newTaskJsecId) || juniorSecs[0]
    const newTask = {
      id: `task-jsec-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Directive assigned for immediate execution.',
      assignedToId: targetJsec ? targetJsec.id : 'user-jsec-1',
      assignedToName: targetJsec ? targetJsec.name : 'Junior Secretary',
      assignedToRole: 'junior_sec',
      assignedBy: currentUser?.name ? `${currentUser.name} (Senior Secretary)` : 'Senior Secretary',
      priority: newTaskPriority,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString().split('T')[0]
    }

    if (onAssignTask) onAssignTask(newTask)
    setNewTaskTitle('')
    setNewTaskDesc('')
    setShowAssignTaskModal(false)
    setActionSuccessNotice(`Directive assigned successfully to ${targetJsec ? targetJsec.name : 'Junior Secretary'}.`)
    setTimeout(() => setActionSuccessNotice(null), 4000)
  }

  const handleConfirmRectification = (e) => {
    e.preventDefault()
    if (!rectifyingIssue) return

    if (onRectifySuggestion) {
      onRectifySuggestion(rectifyingIssue.id, rectificationNote.trim() || 'Issue rectified and updated in system.')
    }
    setActionSuccessNotice(`Issue "${rectifyingIssue.title}" has been rectified and moved to archive!`)
    setRectifyingIssue(null)
    setRectificationNote('')
    setTimeout(() => setActionSuccessNotice(null), 4000)
  }

  const handleCreateSuggestionSubmit = (e) => {
    e.preventDefault()
    if (!newSugTitle.trim()) return

    const newSug = {
      id: `sug-${Date.now()}`,
      title: newSugTitle.trim(),
      description: newSugDesc.trim(),
      submittedBy: currentUser?.name ? `${currentUser.name} (Senior Secretary)` : 'Senior Secretary',
      submittedRole: 'senior_sec',
      category: newSugCategory,
      status: 'pending',
      priority: newSugPriority,
      createdAt: new Date().toISOString().split('T')[0],
      rectifiedAt: null,
      rectifiedNote: null
    }

    if (onAddSuggestion) onAddSuggestion(newSug)
    setNewSugTitle('')
    setNewSugDesc('')
    setShowNewSuggestionModal(false)
    setActionSuccessNotice('Maintenance issue logged successfully in pending queue.')
    setTimeout(() => setActionSuccessNotice(null), 4000)
  }

  const privilegeDefinitions = [
    {
      key: 'canManageReimbursements',
      title: 'Reimbursement Window & Payout Authority',
      desc: 'Can open/close reimbursement cycles, edit announcement message & Google Form link, and approve claims.',
      icon: CreditCard,
      color: 'text-[#0A643B] bg-emerald-50 border-emerald-200'
    },
    {
      key: 'canReassignBatches',
      title: 'Batch Allocation & Scholar Transfer',
      desc: 'Can reallocate scholars between Batch 1 and Batch 2, transfer scholars across wings, and onboard new scholars.',
      icon: Users,
      color: 'text-[#7B2E68] bg-purple-50 border-purple-200'
    },
    {
      key: 'canBroadcast',
      title: 'Cohort-Wide Notice & Circular Dispatch',
      desc: 'Can publish official broadcast notices directly to Batch 1, Batch 2, or all interns across the organization.',
      icon: Radio,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      key: 'canViewAllReports',
      title: 'Multi-Wing Scholar Evaluation',
      desc: 'Can view and evaluate monthly reports across all wings (not restricted solely to their assigned wing).',
      icon: Layers,
      color: 'text-amber-800 bg-amber-50 border-amber-200'
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* Senior Secretary Header Banner with Highest Operational Authority */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Highest Operational Command Authority</span>
            </div>
            <h2 className="text-2xl font-bold">Senior Secretary Central Command</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Complete oversight over Batch 1 ({batch1Count}) & Batch 2 ({batch2Count}), wing supervision, privilege delegation, and disbursements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('delegation')}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center shadow-xs transition-all cursor-pointer"
            >
              <Key className="w-4 h-4 mr-1.5 text-amber-300" />
              Delegate Powers
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#0A643B] hover:bg-emerald-50 font-bold text-xs flex items-center shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-2 text-[#0A643B]" />
              Onboard New Scholar
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Total Cohort Scholars</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalInterns}</span>
            <span className="text-[11px] text-emerald-200">{batch1Count} in Batch 1 • {batch2Count} in Batch 2</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Supervisory Staff</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">3 Junior Secs</span>
            <span className="text-[11px] text-emerald-200">Wing 1, Wing 2, Wing 3</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Monthly Reports Evaluated</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{reviewedReports} / {totalReports}</span>
            <span className="text-[11px] text-emerald-200">Cleared for payout</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Reporting Compliance</span>
            <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">{complianceRate}%</span>
            <span className="text-[11px] text-emerald-200">Across both batches</span>
          </div>
        </div>
      </div>

      {/* Junior Secretaries Cards */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center">
            <Users className="w-4 h-4 mr-2 text-[#0A643B]" />
            Junior Secretaries
          </h3>
          <button
            onClick={() => setActiveTab('delegation')}
            className="text-xs font-bold text-[#0A643B] hover:underline flex items-center cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 mr-1" />
            Manage Special Delegated Powers →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {juniorSecs.map((jsec) => {
            const secInterns = interns.filter(i => i.assignedTo === jsec.id)
            const secReports = reports.filter(r => r.juniorSecId === jsec.id)
            const secPending = secReports.filter(r => r.status === 'submitted').length
            const b1 = secInterns.filter(i => i.batch === 'Batch 1').length
            const b2 = secInterns.filter(i => i.batch === 'Batch 2').length

            const powers = delegatedPowers[jsec.id] || {}
            const activePowerCount = Object.values(powers).filter(Boolean).length

            return (
              <div key={jsec.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0A643B]/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={jsec.photo}
                        name={jsec.name}
                        role={jsec.role}
                        size="md"
                        className="border border-[#0A643B]/20"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{jsec.name}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 inline-block mt-0.5">
                          Junior Secretary
                        </span>
                        {jsec.phone && (
                          <a href={`tel:${jsec.phone}`} className="text-[11px] text-slate-600 flex items-center mt-1 hover:text-[#0A643B] font-medium">
                            <Phone className="w-3 h-3 mr-1 text-[#0A643B]" />
                            <span>{jsec.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {activePowerCount > 0 ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200" title={`${activePowerCount} special powers delegated`}>
                        <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                        {activePowerCount} Delegated
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold">Standard Scope</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                    <div>
                      <span className="font-extrabold text-[#0A643B] block text-base">{secInterns.length}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Scholars ({b1} B1 / {b2} B2)</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-[#7B2E68] block text-base">{secPending}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Pending Review</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('delegation')}
                  className="w-full py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center"
                >
                  <Key className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  Configure Privileges
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Outreach Scholars Podium Spotlight */}
      <PodiumSpotlight
        allUsers={allUsers}
        sessions={sessions}
        onSelectIntern={onSelectIntern}
      />

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 bg-slate-50/50 px-6 pt-3 gap-2">
          <div className="flex space-x-6 text-xs font-bold overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${activeTab === 'assignments' ? 'border-[#0A643B] text-[#0A643B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Batch Supervision ({filteredInterns.length})
            </button>
            <button
              onClick={() => setActiveTab('directives')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center space-x-1.5 ${activeTab === 'directives' ? 'border-[#0A643B] text-[#0A643B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Directives & Tasks</span>
              {pendingSeniorSecDirectives > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                  {pendingSeniorSecDirectives} pending
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${activeTab === 'reports' ? 'border-[#0A643B] text-[#0A643B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Monthly Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center space-x-1.5 ${activeTab === 'maintenance' ? 'border-[#7B2E68] text-[#7B2E68]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Maintenance & Suggestions</span>
              {pendingSuggestions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                  {pendingSuggestions.length} pending
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('delegation')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap flex items-center space-x-1.5 ${activeTab === 'delegation' ? 'border-[#7B2E68] text-[#7B2E68]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Delegation Privileges</span>
            </button>
          </div>

          {/* Batch Selector Filter */}
          {activeTab === 'assignments' && (
            <div className="flex items-center space-x-1.5 pb-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-semibold">View Batch:</span>
              <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  onClick={() => setSelectedBatchFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${selectedBatchFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  All ({totalInterns})
                </button>
                <button
                  onClick={() => setSelectedBatchFilter('Batch 1')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${selectedBatchFilter === 'Batch 1' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-600'}`}
                >
                  Batch 1 ({batch1Count})
                </button>
                <button
                  onClick={() => setSelectedBatchFilter('Batch 2')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${selectedBatchFilter === 'Batch 2' ? 'bg-[#7B2E68] text-white shadow-2xs' : 'text-slate-600'}`}
                >
                  Batch 2 ({batch2Count})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab 1: Scholar Batch & Wing Allocation */}
        {activeTab === 'assignments' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Central Delegation Controls</h4>
                <p className="text-xs text-slate-500">As Senior Secretary, you have sole authority to assign scholars to Junior Secretaries and reallocate batches.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Scholar Name</th>
                    <th className="pb-3 font-semibold">Batch</th>
                    <th className="pb-3 font-semibold">Stream</th>
                    <th className="pb-3 font-semibold">Target Visits</th>
                    <th className="pb-3 font-semibold">Assigned Junior Secretary</th>
                    <th className="pb-3 font-semibold text-right">Senior Sec Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInterns.map((intern) => {
                    const assignedSec = juniorSecs.find(j => j.id === intern.assignedTo)
                    return (
                      <tr key={intern.id} className="hover:bg-slate-50/80 transition-colors">
                        <td
                          onClick={() => onSelectIntern && onSelectIntern(intern)}
                          className="py-3.5 font-bold text-slate-900 flex items-center space-x-2.5 cursor-pointer group"
                        >
                          <Avatar
                            src={intern.photo}
                            name={intern.name}
                            role={intern.role || 'intern'}
                            size="sm"
                            className="border border-slate-200 group-hover:border-[#0A643B] transition-colors"
                          />
                          <div>
                            <span className="group-hover:text-[#0A643B] transition-colors">{intern.name}</span>
                            <span className="block text-[11px] font-normal text-slate-500">{intern.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <select
                            aria-label={`Change batch for ${intern.name}`}
                            value={intern.batch || 'Batch 1'}
                            onChange={(e) => onUpdateInternBatch(intern.id, e.target.value)}
                            className={`text-xs font-extrabold rounded-lg px-2 py-1 border cursor-pointer ${
                              intern.batch === 'Batch 2' 
                                ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30' 
                                : 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30'
                            }`}
                          >
                            <option value="Batch 1">Batch 1</option>
                            <option value="Batch 2">Batch 2</option>
                          </select>
                        </td>
                        <td className="py-3.5">
                          <select
                            aria-label={`Change stream for ${intern.name}`}
                            value={intern.stream || 'JEE'}
                            onChange={(e) => onUpdateInternStream && onUpdateInternStream(intern.id, e.target.value)}
                            className={`text-xs font-black rounded-lg px-2.5 py-1 border cursor-pointer transition-colors ${
                              intern.stream === 'NEET' 
                                ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/40' 
                                : 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/40'
                            }`}
                          >
                            <option value="JEE">JEE</option>
                            <option value="NEET">NEET</option>
                          </select>
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center space-x-1.5">
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
                              className="w-14 text-xs font-bold text-center py-1 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                              title="Click to modify this scholar's visit target"
                            />
                            <span className="text-[11px] text-slate-400 font-medium">visits</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30">
                            {assignedSec ? assignedSec.name : 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <select
                            aria-label={`Reassign ${intern.name} to Junior Secretary`}
                            value={intern.assignedTo || ''}
                            onChange={(e) => onReassignIntern(intern.id, e.target.value)}
                            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
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

        {/* Tab: Assigned Directives & Tasks with "Done or Not" update tracking */}
        {activeTab === 'directives' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Directives & Task Tracking Center</h4>
                <p className="text-xs text-slate-500">Track executive mandates from Management and supervise task completion across Junior Secretaries.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDirectivesViewScope('my_tasks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${directivesViewScope === 'my_tasks' ? 'bg-[#0A643B] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  My Directives ({seniorSecDirectives.length})
                </button>
                <button
                  onClick={() => setDirectivesViewScope('junior_sec_tasks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${directivesViewScope === 'junior_sec_tasks' ? 'bg-[#0A643B] text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Junior Sec Tasks ({juniorSecDirectives.length})
                </button>
                <button
                  onClick={() => setShowAssignTaskModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#7B2E68] hover:bg-[#602351] text-white text-xs font-bold flex items-center shadow-xs cursor-pointer ml-2"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Assign Directive
                </button>
              </div>
            </div>

            {/* Scope 1: My Tasks (Assigned to Senior Secretary by Management) */}
            {directivesViewScope === 'my_tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Executive Directives from Management for Senior Secretary:
                    </span>
                    <span className="text-xs text-slate-500">
                      ({completedSeniorSecDirectives} of {seniorSecDirectives.length} completed)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {seniorSecDirectives.map((task) => (
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
                            <h5 className={`font-bold text-sm ${task.isCompleted ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                              {task.title}
                            </h5>
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
                                Pending Action
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-500">
                            <span>From: <strong className="text-slate-700">{task.assignedBy}</strong></span>
                            <span>Assigned: {formatDateWithRelative(task.createdAt)}</span>
                            {task.completedAt && (
                              <span className="text-emerald-700 font-semibold">Done: {formatDateWithRelative(task.completedAt)}</span>
                            )}
                          </div>
                        </div>

                        {/* Interactive "Done or Not" Toggle Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => onToggleTaskDone && onToggleTaskDone(task.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all cursor-pointer shadow-xs ${
                              task.isCompleted
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-slate-900 hover:bg-[#0A643B] text-white'
                            }`}
                            title="Click to toggle Done / Not Done status"
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
              </div>
            )}

            {/* Scope 2: Junior Sec Tasks */}
            {directivesViewScope === 'junior_sec_tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Work Delegated to Junior Secretaries ({juniorSecDirectives.length}):
                  </span>
                  <span className="text-xs text-slate-500">
                    {juniorSecDirectives.filter(t => t.isCompleted).length} of {juniorSecDirectives.length} completed
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {juniorSecDirectives.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all ${
                        task.isCompleted
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h5 className={`font-bold text-sm ${task.isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                              {task.title}
                            </h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#7B2E68] border border-purple-200">
                              Assigned to: {task.assignedToName || 'Junior Sec'}
                            </span>
                            {task.isCompleted ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Completed ✓
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-500">
                            <span>Assigned by: <strong className="text-slate-700">{task.assignedBy}</strong></span>
                            <span>Assigned: {formatDateWithRelative(task.createdAt)}</span>
                          </div>
                        </div>

                        {/* Senior Sec can also update completion */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => onToggleTaskDone && onToggleTaskDone(task.id)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                              task.isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {task.isCompleted ? 'Mark Incomplete' : 'Mark as Done ✓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                      <span className="ml-2 px-2 py-0.5 rounded-md font-bold text-[10px] bg-white border border-slate-200 text-slate-700">
                        {rep.batch || 'Batch 1'}
                      </span>
                      <span className="text-slate-500 ml-2">({rep.monthYear})</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                      rep.status === 'reviewed' 
                        ? 'bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30' 
                        : rep.status === 'revision_requested' 
                        ? 'bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.status === 'reviewed' ? 'Reviewed & Approved' : rep.status === 'revision_requested' ? 'Revision Needed' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                    {rep.tasksCompleted}
                  </p>
                  {rep.reviewerFeedback && (
                    <p className="text-[#0A643B] bg-[#EBF7F0] p-2.5 rounded-lg border border-[#0A643B]/20">
                      <strong>Feedback ({rep.reviewedBy}):</strong> {rep.reviewerFeedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: System Improvement & Maintenance Suggestions (Senior Secretary Exclusive) */}
        {activeTab === 'maintenance' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-[#0A643B] p-5 rounded-2xl text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold mb-2">
                    <Wrench className="w-3.5 h-3.5 text-amber-300" />
                    <span>Senior Secretary Maintenance Desk</span>
                  </div>
                  <h4 className="font-extrabold text-xl text-white">
                    Platform Improvement & Issue Rectification Hub
                  </h4>
                  <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
                    Exclusively managed by the Senior Secretary to maintain operational integrity. Review feedback and issues submitted by Scholars, Junior Secretaries, and Leadership. When you click <strong>Rectify Issue</strong>, it immediately leaves the pending queue and archives with your resolution note.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewSuggestionModal(true)}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-xs flex items-center shadow-xs cursor-pointer flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
                  Log Maintenance Issue
                </button>
              </div>

              {/* Sub-tabs: Pending vs Rectified Archive */}
              <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-white/20">
                <button
                  onClick={() => setMaintenanceTab('pending')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    maintenanceTab === 'pending'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Pending Issues ({pendingSuggestions.length})
                </button>
                <button
                  onClick={() => setMaintenanceTab('rectified')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center ${
                    maintenanceTab === 'rectified'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5 mr-1" />
                  Rectified Archive ({rectifiedSuggestions.length})
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 mr-1">Filter Category:</span>
              {['all', 'Materials Hub', 'Reimbursements', 'Curriculum', 'Operations', 'Technical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMaintenanceCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    maintenanceCategoryFilter === cat
                      ? 'bg-[#0A643B] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>

            {/* Suggestions List */}
            {filteredSuggestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <p className="font-bold text-sm text-slate-800">
                  {maintenanceTab === 'pending'
                    ? 'All Caught Up! No Pending Issues'
                    : 'No Rectified Issues In This Filter'}
                </p>
                <p className="text-slate-500 mt-1">
                  {maintenanceTab === 'pending'
                    ? 'All reported issues and improvement suggestions have been rectified.'
                    : 'Rectified issues will appear here with resolution notes once addressed.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      item.status === 'rectified'
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-white border-slate-200 shadow-xs hover:border-[#0A643B]/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {item.category}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.priority === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : item.priority === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.priority} Priority
                          </span>
                          <span className="text-xs text-slate-400">
                            • Submitted {formatDateWithRelative(item.createdAt)}
                          </span>
                        </div>

                        <h5 className="font-bold text-slate-900 text-base">
                          {item.title}
                        </h5>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {item.description}
                        </p>

                        <div className="flex items-center space-x-2 text-xs text-slate-500 pt-1">
                          <span>Reported by:</span>
                          <span className="font-bold text-slate-800">{item.submittedBy}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-50 text-[#7B2E68] font-bold">
                            {item.submittedRole === 'intern' ? 'Outreach Scholar' : item.submittedRole === 'junior_sec' ? 'Junior Secretary' : 'Leadership'}
                          </span>
                        </div>

                        {/* If Rectified: Show Resolution Details */}
                        {item.status === 'rectified' && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                            <div className="flex items-center justify-between font-bold text-emerald-900">
                              <span className="flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
                                Rectified by {item.rectifiedBy || 'Senior Secretary'}
                              </span>
                              <span className="text-[11px] text-emerald-700 font-semibold">
                                {formatDateWithRelative(item.rectifiedAt)}
                              </span>
                            </div>
                            <p className="text-emerald-800">
                              <strong>Resolution Action:</strong> {item.rectifiedNote || 'Rectified and verified in maintenance update.'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Button: Only visible if pending */}
                      {item.status === 'pending' && (
                        <div className="flex-shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => {
                              setRectifyingIssue(item)
                              setRectificationNote('')
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-xs transition-colors cursor-pointer"
                            title="Rectify this issue to remove it from pending list and archive"
                          >
                            <Wrench className="w-3.5 h-3.5 mr-1.5" />
                            Rectify Issue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Special Privilege Delegation (Senior Secretary to Junior Secretaries) */}
        {activeTab === 'delegation' && (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-purple-50 via-emerald-50 to-teal-50 p-5 rounded-2xl border border-purple-200/60">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#7B2E68] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Key className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Senior Secretary Privilege Delegation System
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    As Senior Secretary, you hold sole executive command. Here you can selectively delegate your administrative powers to specific Junior Secretaries. When a power is granted, that Junior Secretary immediately unlocks those capabilities in their session.
                  </p>
                </div>
              </div>
            </div>

            {/* List of Junior Secretaries with individual privilege switches */}
            <div className="space-y-6">
              {juniorSecs.map((jsec) => {
                const secPowers = delegatedPowers[jsec.id] || {}
                const activeCount = Object.values(secPowers).filter(Boolean).length
                const allActive = activeCount === privilegeDefinitions.length

                return (
                  <div key={jsec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                    
                    {/* Header for this Junior Secretary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={jsec.photo}
                          name={jsec.name}
                          role={jsec.role}
                          size="md"
                          className="border border-[#0A643B]/20"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-900 text-base">{jsec.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0A643B] border border-emerald-200">
                              Junior Secretary
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Currently assigned: {interns.filter(i => i.assignedTo === jsec.id).length} scholars
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          activeCount > 0
                            ? 'bg-amber-50 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {activeCount} of {privilegeDefinitions.length} Privileges Granted
                        </span>

                        <button
                          onClick={() => onBulkPrivilege(jsec.id, !allActive)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            allActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-[#0A643B] text-white hover:bg-[#074D2D]'
                          }`}
                        >
                          {allActive ? 'Revoke All' : 'Grant All Powers'}
                        </button>
                      </div>
                    </div>

                    {/* Privilege Switches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                      {privilegeDefinitions.map((priv) => {
                        const isGranted = Boolean(secPowers[priv.key])
                        const Icon = priv.icon

                        return (
                          <div
                            key={priv.key}
                            onClick={() => {
                              onTogglePrivilege(jsec.id, priv.key)
                              setPrivilegeToast({
                                message: `${isGranted ? 'Revoked' : 'Granted'} "${priv.title}" for ${jsec.name}`,
                                type: isGranted ? 'revoke' : 'grant'
                              })
                              setTimeout(() => setPrivilegeToast(null), 3500)
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isGranted
                                ? 'bg-emerald-50/70 border-[#0A643B] shadow-xs ring-1 ring-[#0A643B]/20'
                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isGranted ? 'bg-[#0A643B] text-white' : 'bg-slate-200 text-slate-500'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h5 className={`font-bold text-xs ${isGranted ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {priv.title}
                                  </h5>
                                  {isGranted ? (
                                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                                      <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-700" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-600">
                                      Standard
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                  {priv.desc}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onTogglePrivilege(jsec.id, priv.key)
                                setPrivilegeToast({
                                  message: `${isGranted ? 'Revoked' : 'Granted'} "${priv.title}" for ${jsec.name}`,
                                  type: isGranted ? 'revoke' : 'grant'
                                })
                                setTimeout(() => setPrivilegeToast(null), 3500)
                              }}
                              aria-label={`Toggle ${priv.title}`}
                              className={`p-1 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                                isGranted ? 'text-[#0A643B]' : 'text-slate-300'
                              }`}
                            >
                              {isGranted ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
                            </button>
                          </div>
                        )
                      })}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Privilege Feedback Toast */}
      {privilegeToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`p-4 rounded-xl shadow-xl flex items-center space-x-3 text-xs font-bold text-white border ${
            privilegeToast.type === 'grant' ? 'bg-[#0A643B] border-emerald-400' : 'bg-slate-900 border-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{privilegeToast.message}</span>
            <button onClick={() => setPrivilegeToast(null)} className="ml-2 hover:opacity-80 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Success Notice Toast */}
      {actionSuccessNotice && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 duration-200">
          <div className="bg-[#0A643B] text-white p-3.5 px-4 rounded-xl shadow-xl flex items-center space-x-2.5 text-xs font-bold border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{actionSuccessNotice}</span>
            <button onClick={() => setActionSuccessNotice(null)} className="ml-2 hover:opacity-80 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal 1: Assign Directive to Junior Secretary */}
      {showAssignTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-[#0A643B]" />
                Assign Directive to Junior Secretary
              </h3>
              <button onClick={() => setShowAssignTaskModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Direct an official operational assignment to a Junior Secretary. It will appear on their dashboard with Done or Not update buttons.
            </p>

            <form onSubmit={handleAssignDirectiveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Directive / Task Title *</label>
                <input
                  required
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Audit school attendance logs for Pune cluster schools"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Instructions *</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Specific requirements, deliverables, or guidance for the Junior Secretary..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign To *</label>
                  <select
                    value={newTaskJsecId}
                    onChange={(e) => setNewTaskJsecId(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    {juniorSecs.map(j => (
                      <option key={j.id} value={j.id}>{j.name} (Junior Sec)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="medium">Medium Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold shadow-xs cursor-pointer"
                >
                  Confirm & Assign Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Rectify Issue (Senior Secretary Exclusive) */}
      {rectifyingIssue && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-[#0A643B]" />
                Rectify & Resolve Issue
              </h3>
              <button onClick={() => setRectifyingIssue(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your resolution note. Once rectified, this issue will <strong>immediately leave the Pending Issues list</strong> and move to the Rectified Archive.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-xs space-y-1">
              <p className="font-bold text-slate-900">{rectifyingIssue.title}</p>
              <p className="text-slate-600">{rectifyingIssue.description}</p>
              <p className="text-slate-400 text-[11px] pt-1">
                Submitted by: <strong>{rectifyingIssue.submittedBy}</strong> • Category: {rectifyingIssue.category}
              </p>
            </div>

            <form onSubmit={handleConfirmRectification} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Rectification Action & Maintenance Note *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rectificationNote}
                  onChange={(e) => setRectificationNote(e.target.value)}
                  placeholder="e.g. Added offline PDF sheet to Materials Hub, updated cluster link, and verified mobile download."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden resize-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  This note will be recorded permanently in the Rectified Archive.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setRectifyingIssue(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold shadow-xs cursor-pointer flex items-center"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Mark Rectified & Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Log New Maintenance Issue (Senior Secretary Direct Note) */}
      {showNewSuggestionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-[#0A643B]" />
                Log Platform Maintenance Issue
              </h3>
              <button onClick={() => setShowNewSuggestionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Log an operational bottleneck, technical bug, or improvement suggestion in the pending maintenance tracker.
            </p>

            <form onSubmit={handleCreateSuggestionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue / Suggestion Title *</label>
                <input
                  required
                  type="text"
                  value={newSugTitle}
                  onChange={(e) => setNewSugTitle(e.target.value)}
                  placeholder="e.g. Update curriculum presentation slide numbers"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newSugCategory}
                    onChange={(e) => setNewSugCategory(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Materials Hub">Materials Hub</option>
                    <option value="Reimbursements">Reimbursements</option>
                    <option value="Curriculum">Curriculum</option>
                    <option value="Operations">Operations</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={newSugPriority}
                    onChange={(e) => setNewSugPriority(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Description & Context *</label>
                <textarea
                  required
                  rows={3}
                  value={newSugDesc}
                  onChange={(e) => setNewSugDesc(e.target.value)}
                  placeholder="Explain what needs to be improved or repaired..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewSuggestionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold shadow-xs cursor-pointer"
                >
                  Log In Pending Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboard Scholar Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Onboard New Scholar</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new scholar to the Outreach cohort and assign supervision wing.</p>

            <form onSubmit={handleAddInternSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={newInternName}
                  onChange={(e) => setNewInternName(e.target.value)}
                  placeholder="e.g. Diya Sen"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={newInternEmail}
                  onChange={(e) => setNewInternEmail(e.target.value)}
                  placeholder="e.g. diya.sen@dakshana.org"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cohort Batch *</label>
                  <select
                    value={newInternBatch}
                    onChange={(e) => setNewInternBatch(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Batch 1">Batch 1</option>
                    <option value="Batch 2">Batch 2</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholar Stream *</label>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setNewInternStream('JEE')}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border text-center ${
                        newInternStream === 'JEE'
                          ? 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B] ring-2 ring-[#0A643B]/20'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      JEE
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewInternStream('NEET')}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border text-center ${
                        newInternStream === 'NEET'
                          ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68] ring-2 ring-[#7B2E68]/20'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      NEET
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Under Junior Secretary *</label>
                <select
                  value={newInternSec}
                  onChange={(e) => setNewInternSec(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                >
                  {juniorSecs.map((j) => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Visits (School Outreach Sessions) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newInternTargetVisits}
                  onChange={(e) => setNewInternTargetVisits(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">Customized target visits milestone for this scholar</span>
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
                  className="px-4 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-semibold shadow-xs cursor-pointer"
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
