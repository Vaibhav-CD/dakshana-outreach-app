import React from 'react'
import { Award, BarChart, FileCheck, Users, TrendingUp, Download, CheckCircle2, Clock, ClipboardList } from 'lucide-react'

export default function ManagementView({ allUsers, reports, sessions = [], assignedTasks = [] }) {
  const interns = allUsers.filter(u => u.role === 'intern')
  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const seniorSec = allUsers.find(u => u.role === 'senior_sec')

  const totalSessions = sessions.reduce((acc, curr) => acc + (curr.sessionsCount || 1), 0)
  const reviewedCount = reports.filter(r => r.status === 'reviewed').length

  // Directives assigned to Senior Sec by Management
  const managementDirectives = assignedTasks.filter(t => t.assignedToRole === 'senior_sec' || t.assignedToId === 'user-senior-sec')
  const completedDirectives = managementDirectives.filter(t => t.isCompleted).length

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Intern Name,Month,Status,Reviewer,Feedback"].join(",") + "\n"
      + reports.map(r => `"${r.internName}","${r.monthYear}","${r.status}","${r.reviewedBy || ''}","${(r.reviewerFeedback || '').replace(/"/g, '""')}"`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `NGO_Monthly_Report_Summary.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      
      {/* Management Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Board of Directors & Management Portal</span>
            </div>
            <h2 className="text-2xl font-bold">Executive Oversight Dashboard</h2>
            <p className="text-purple-200 text-sm mt-1">High-level institutional auditing and impact metrics</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs flex items-center shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Monthly Audit (.CSV)
          </button>
        </div>

        {/* Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/30">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-200 block">Total School Visits Logged</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalSessions} sessions</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-200 block">Intern Cohort Size</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{interns.length} members</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-200 block">Supervisory Staff</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">1 Senior + {juniorSecs.length} Juniors</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-200 block">Executive Directives</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{completedDirectives} / {managementDirectives.length} done</span>
          </div>
        </div>
      </div>

      {/* Leadership Chain of Command Display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
          Organizational Delegation Hierarchy
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="text-center w-full md:w-1/3 p-3 bg-white rounded-xl shadow-2xs border border-purple-100">
            <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Management Tier</span>
            <p className="font-extrabold text-slate-900 text-sm mt-1">Board / Director</p>
            <p className="text-slate-500">Full audit & governance</p>
          </div>

          <div className="text-slate-400 font-bold hidden md:block">→</div>

          <div className="text-center w-full md:w-1/3 p-3 bg-white rounded-xl shadow-2xs border border-indigo-100">
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Operational Tier</span>
            <p className="font-extrabold text-slate-900 text-sm mt-1">{seniorSec ? seniorSec.name : 'Senior Secretary'}</p>
            <p className="text-slate-500">Resource & team allocation</p>
          </div>

          <div className="text-slate-400 font-bold hidden md:block">→</div>

          <div className="text-center w-full md:w-1/3 p-3 bg-white rounded-xl shadow-2xs border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Field Supervision</span>
            <p className="font-extrabold text-slate-900 text-sm mt-1">3 Junior Secretaries</p>
            <p className="text-slate-500">Mentorship & direct report reviews</p>
          </div>
        </div>
      </div>

    </div>
  )
}
