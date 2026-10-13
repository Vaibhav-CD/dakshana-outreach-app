import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, Calendar, Award, Filter, Sparkles } from 'lucide-react'

export default function VisualDataBoard({ sessions, allUsers }) {
  const [selectedWing, setSelectedWing] = useState('all')

  const filteredSessions = selectedWing === 'all'
    ? sessions
    : sessions.filter(s => s.wing.includes(selectedWing))

  // Statistical calculations
  const totalSessions = filteredSessions.reduce((acc, curr) => acc + curr.sessionsCount, 0)
  const totalStudentsReached = filteredSessions.reduce((acc, curr) => acc + curr.studentsReached, 0)
  const averageSessions = filteredSessions.length > 0 ? (totalSessions / filteredSessions.length).toFixed(1) : 0
  const maxSessionCount = Math.max(...sessions.map(s => s.sessionsCount), 20)

  // Top Scholar
  const topScholar = [...sessions].sort((a, b) => b.sessionsCount - a.sessionsCount)[0]

  return (
    <div className="space-y-6">
      
      {/* Board Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Leadership Visual Analytics</span>
            </div>
            <h2 className="text-2xl font-bold">Field Sessions & Scholar Impact Board</h2>
            <p className="text-indigo-200 text-sm mt-1">
              Live graphical telemetry of grassroots sessions conducted by our scholars.
            </p>
          </div>

          {/* Wing Filter */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-200" />
            <span className="text-indigo-200">Wing Filter:</span>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="text-slate-900">All Wings (Whole Cohort)</option>
              <option value="Wing 1" className="text-slate-900">Wing 1 (Priya Sharma)</option>
              <option value="Wing 2" className="text-slate-900">Wing 2 (Rohan Verma)</option>
              <option value="Wing 3" className="text-slate-900">Wing 3 (Sneha Kulkarni)</option>
            </select>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/30">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Total Sessions Delivered</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalSessions} sessions</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Students / Beneficiaries</span>
            <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">{totalStudentsReached} taught</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Avg. Sessions / Scholar</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{averageSessions}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-200 block">Top Contributing Scholar</span>
            <span className="text-sm font-bold text-amber-300 mt-2 block truncate">
              ★ {topScholar ? topScholar.internName : 'N/A'} ({topScholar ? topScholar.sessionsCount : 0})
            </span>
          </div>
        </div>
      </div>

      {/* Main Graphical Visual Chart: Sessions per Scholar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Comparative Sessions Conducted by Scholars
            </h3>
            <p className="text-xs text-slate-500">Relative session volume and beneficiary footprint per individual scholar</p>
          </div>
        </div>

        {/* CSS / SVG Responsive Bar Chart */}
        <div className="space-y-5">
          {filteredSessions.map((item, index) => {
            const percentage = Math.round((item.sessionsCount / maxSessionCount) * 100)

            return (
              <div key={item.internId} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.internName}</span>
                    <span className="text-[11px] text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">{item.wing}</span>
                    <span className="text-[11px] text-indigo-600 font-medium italic">({item.topic})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-indigo-700 text-sm">{item.sessionsCount} sessions</span>
                    <span className="text-slate-400 text-[11px] ml-2">({item.studentsReached} students reached)</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200 flex">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    {percentage}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Breakdown by Wing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['Wing 1', 'Wing 2', 'Wing 3'].map((wingName, idx) => {
          const wingData = sessions.filter(s => s.wing.includes(wingName))
          const wingSessions = wingData.reduce((acc, c) => acc + c.sessionsCount, 0)
          const wingStudents = wingData.reduce((acc, c) => acc + c.studentsReached, 0)

          return (
            <div key={wingName} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Sub-Supervision Wing 0{idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-2">{wingName} Performance</h4>
                <p className="text-xs text-slate-500 mt-1">Supervised by Junior Secretary</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="font-extrabold text-slate-900 text-base block">{wingSessions}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Sessions</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="font-extrabold text-emerald-600 text-base block">{wingStudents}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Scholars Reached</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
