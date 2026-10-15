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
  ToggleRight
} from 'lucide-react'

import PodiumSpotlight from './PodiumSpotlight'
import Avatar from './Avatar'

export default function SeniorSecView({
  allUsers,
  reports,
  sessions = [],
  onReassignIntern,
  onUpdateInternBatch,
  onAddIntern,
  onSelectIntern,
  delegatedPowers = {},
  onTogglePrivilege,
  onBulkPrivilege
}) {
  const [activeTab, setActiveTab] = useState('assignments') // 'assignments' | 'reports' | 'delegation'
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all') // 'all' | 'Batch 1' | 'Batch 2'
  const [showAddModal, setShowAddModal] = useState(false)
  const [newInternName, setNewInternName] = useState('')
  const [newInternEmail, setNewInternEmail] = useState('')
  const [newInternSec, setNewInternSec] = useState('user-jsec-1')
  const [newInternBatch, setNewInternBatch] = useState('Batch 1')
  const [newInternDept, setNewInternDept] = useState('Field Outreach')

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
      assignedTo: newInternSec,
      department: newInternDept,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      title: 'Outreach Scholar'
    })

    setNewInternName('')
    setNewInternEmail('')
    setShowAddModal(false)
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
            Junior Secretaries & Subordinate Wings
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
                        <p className="text-[11px] text-slate-500">{jsec.department}</p>
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
          <div className="flex space-x-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors ${activeTab === 'assignments' ? 'border-[#0A643B] text-[#0A643B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Batch & Wing Supervision Mapping ({filteredInterns.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors ${activeTab === 'reports' ? 'border-[#0A643B] text-[#0A643B]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              All Monthly Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('delegation')}
              className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center space-x-1.5 ${activeTab === 'delegation' ? 'border-[#7B2E68] text-[#7B2E68]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Special Privilege Delegation (Senior Sec Exclusive)</span>
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
                    <th className="pb-3 font-semibold">Outreach Track</th>
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
                        <td className="py-3.5 text-slate-600">{intern.department || 'General Outreach'}</td>
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
                      <span className="text-slate-500 ml-2">({rep.monthYear}) • {rep.hoursContributed} hrs clocked</span>
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
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {jsec.department}
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
                            onClick={() => onTogglePrivilege(jsec.id, priv.key)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isGranted
                                ? 'bg-emerald-50/50 border-[#0A643B]/40 shadow-xs ring-1 ring-[#0A643B]/20'
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
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                  {priv.desc}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-label={`Toggle ${priv.title}`}
                              className={`p-1 rounded-full transition-colors flex-shrink-0 ${
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

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Outreach Track</label>
                  <input
                    type="text"
                    value={newInternDept}
                    onChange={(e) => setNewInternDept(e.target.value)}
                    placeholder="e.g. Foundational Numeracy"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
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
