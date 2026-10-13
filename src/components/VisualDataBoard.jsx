import React, { useState } from 'react'
import { BarChart3, TrendingUp, Filter } from 'lucide-react'

export default function VisualDataBoard({ sessions, allUsers }) {
  const [selectedWing, setSelectedWing] = useState('all')
  const [selectedBatch, setSelectedBatch] = useState('all')

  const filteredSessions = sessions.filter(s => {
    const matchesWing = selectedWing === 'all' || s.wing.includes(selectedWing)
    const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch
    return matchesWing && matchesBatch
  })

  const totalSessions = filteredSessions.reduce((acc, curr) => acc + curr.sessionsCount, 0)
  const totalStudentsReached = filteredSessions.reduce((acc, curr) => acc + curr.studentsReached, 0)
  const averageSessions = filteredSessions.length > 0 ? (totalSessions / filteredSessions.length).toFixed(1) : 0
  const maxSessionCount = Math.max(...sessions.map(s => s.sessionsCount), 20)

  const topScholar = [...filteredSessions].sort((a, b) => b.sessionsCount - a.sessionsCount)[0]

  return (
    <div className="space-y-6">
      
      {/* Board Header with Dakshana Gradient */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dakshana Outreach Telemetry</span>
            </div>
            <h2 className="text-2xl font-bold">Field Sessions & Scholar Impact Board</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Live graphical telemetry of grassroots sessions delivered by Batch 1 & Batch 2 scholars.
            </p>
          </div>

          {/* Dual Filters: Batch & Wing */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-200 font-bold">Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-white/20 text-white font-bold rounded-lg px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value="all" className="text-slate-900">All Batches</option>
                <option value="Batch 1" className="text-slate-900">Batch 1</option>
                <option value="Batch 2" className="text-slate-900">Batch 2</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 border-l border-white/20 pl-2">
              <span className="text-emerald-200 font-bold">Wing:</span>
              <select
                value={selectedWing}
                onChange={(e) => setSelectedWing(e.target.value)}
                className="bg-white/20 text-white font-bold rounded-lg px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value="all" className="text-slate-900">All Wings</option>
                <option value="Wing 1" className="text-slate-900">Wing 1 (Priya)</option>
                <option value="Wing 2" className="text-slate-900">Wing 2 (Rohan)</option>
                <option value="Wing 3" className="text-slate-900">Wing 3 (Sneha)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Total Sessions Delivered</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{totalSessions} sessions</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Students / Beneficiaries</span>
            <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">{totalStudentsReached} taught</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Avg. Sessions / Scholar</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{averageSessions}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-200 block">Top Contributing Scholar</span>
            <span className="text-sm font-bold text-amber-300 mt-2 block truncate">
              ★ {topScholar ? topScholar.internName : 'N/A'} ({topScholar ? topScholar.sessionsCount : 0} sessions)
            </span>
          </div>
        </div>
      </div>

      {/* Main Graphical Visual Chart: Sessions per Scholar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#0A643B]" />
              Comparative Sessions Conducted by Scholars
            </h3>
            <p className="text-xs text-slate-500">Relative session volume and student footprint per individual scholar</p>
          </div>
        </div>

        {/* Visual Bar Chart */}
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
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${item.batch === 'Batch 2' ? 'bg-[#F8EDF5] text-[#7B2E68]' : 'bg-[#EBF7F0] text-[#0A643B]'}`}>
                      {item.batch}
                    </span>
                    <span className="text-[11px] text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">{item.wing}</span>
                    <span className="text-[11px] text-[#0A643B] font-semibold italic">({item.topic})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#0A643B] text-sm">{item.sessionsCount} sessions</span>
                    <span className="text-slate-400 text-[11px] ml-2">({item.studentsReached} students taught)</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200 flex">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0A643B] via-[#11844E] to-[#7B2E68] transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white"
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
            <div key={wingName} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#0A643B]/40 transition-all">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30">
                  Sub-Supervision Wing 0{idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-2">{wingName} Performance</h4>
                <p className="text-xs text-slate-500 mt-1">Supervised by Junior Secretary</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="font-extrabold text-[#0A643B] text-base block">{wingSessions}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Sessions</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="font-extrabold text-[#7B2E68] text-base block">{wingStudents}</span>
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
