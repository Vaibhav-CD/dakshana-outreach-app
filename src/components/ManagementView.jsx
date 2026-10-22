import React, { useState } from 'react'
import { Award, TrendingUp, Download, LayoutDashboard, FileSpreadsheet, Calendar } from 'lucide-react'
import ProgressIntelligenceHub from './ProgressIntelligenceHub'

export default function ManagementView({ allUsers, reports, sessions = [], assignedTasks = [], currentUser, countdown, onOpenSetEndDateModal }) {
  const [activeSubTab, setActiveSubTab] = useState('intelligence') // 'intelligence' | 'governance'
  const interns = allUsers.filter(u => u.role === 'intern')
  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const seniorSec = allUsers.find(u => u.role === 'senior_sec')

  const totalSessions = sessions.reduce((acc, curr) => acc + (curr.sessionsCount || 1), 0)
  const managementDirectives = assignedTasks.filter(t => t.assignedToRole === 'senior_sec' || t.assignedToId === 'user-senior-sec')
  const completedDirectives = managementDirectives.filter(t => t.isCompleted).length

  return (
    <div className="space-y-6">
      
      {/* Management Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-[#7B2E68] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Board of Directors & Trustee Oversight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Executive Oversight Dashboard</h2>
            <p className="text-purple-200 text-xs sm:text-sm mt-1">High-level institutional auditing, monthly progress intelligence, and Excel data extraction</p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenSetEndDateModal && (
              <button
                onClick={onOpenSetEndDateModal}
                className="px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center shadow-xs transition-all cursor-pointer"
                title="Configure the official end date of the internship"
              >
                <Calendar className="w-4 h-4 mr-1.5 text-purple-200" />
                <span>Configure End Date</span>
              </button>
            )}
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('intelligence')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeSubTab === 'intelligence' ? 'bg-white text-purple-950 shadow-md font-black' : 'text-purple-100 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-[#7B2E68]" />
                <span>Progress Intelligence & Excel</span>
              </button>
              <button
                onClick={() => setActiveSubTab('governance')}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeSubTab === 'governance' ? 'bg-white text-purple-950 shadow-md font-black' : 'text-purple-100 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Governance Hierarchy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/30">
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-xs text-purple-200 block font-bold">School Sessions Logged</span>
            <span className="text-2xl font-black text-white mt-1 block">{totalSessions} sessions</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-xs text-purple-200 block font-bold">Outreach Scholars</span>
            <span className="text-2xl font-black text-white mt-1 block">{interns.length} members</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-xs text-purple-200 block font-bold">Secretariat Supervision</span>
            <span className="text-2xl font-black text-white mt-1 block">1 Senior + {juniorSecs.length} Juniors</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10">
            <span className="text-xs text-purple-200 block font-bold">Executive Directives</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{completedDirectives} / {managementDirectives.length} done</span>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: PROGRESS INTELLIGENCE HUB & EXCEL EXPORT */}
      {activeSubTab === 'intelligence' && (
        <ProgressIntelligenceHub
          reports={reports}
          allUsers={allUsers}
          currentUser={currentUser}
        />
      )}

      {/* SUB-TAB 2: GOVERNANCE & DELEGATION HIERARCHY */}
      {activeSubTab === 'governance' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
            Organizational Delegation Hierarchy & Institutional Audit
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="text-center w-full md:w-1/3 p-4 bg-white rounded-2xl shadow-2xs border border-purple-100">
              <span className="text-[10px] uppercase font-black text-purple-600 tracking-wider">Management Tier</span>
              <p className="font-black text-slate-900 text-sm mt-1">Board of Trustees & Directors</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Statutory governance, budget sanctioning, and progress auditing</p>
            </div>

            <div className="text-slate-400 font-bold hidden md:block">→</div>

            <div className="text-center w-full md:w-1/3 p-4 bg-white rounded-2xl shadow-2xs border border-indigo-100">
              <span className="text-[10px] uppercase font-black text-indigo-600 tracking-wider">Operational Tier</span>
              <p className="font-black text-slate-900 text-sm mt-1">{seniorSec ? seniorSec.name : 'Senior Secretary'}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Central coordination, batch allocations, circulars, and finance approvals</p>
            </div>

            <div className="text-slate-400 font-bold hidden md:block">→</div>

            <div className="text-center w-full md:w-1/3 p-4 bg-white rounded-2xl shadow-2xs border border-emerald-100">
              <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider">Field Supervision Tier</span>
              <p className="font-black text-slate-900 text-sm mt-1">3 Junior Secretaries</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Fieldwork mentoring, cluster visits, and monthly report evaluation</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
