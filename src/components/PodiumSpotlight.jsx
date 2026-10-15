import React, { useState } from 'react'
import { Trophy, Award, Medal, Flame, Star, Sparkles, ChevronRight, School, Users } from 'lucide-react'

export default function PodiumSpotlight({ allUsers = [], sessions = [], onSelectIntern }) {
  const [activeTab, setActiveTab] = useState('overall') // 'overall' | 'batch1' | 'batch2'

  const internUsers = allUsers.filter(u => u.role === 'intern')

  // Calculate visits & students reached for each intern
  const internStats = internUsers.map(intern => {
    const sessionData = sessions.find(s => s.internId === intern.id) || {}
    const visits = sessionData.sessionsCount || 0
    const students = sessionData.studentsReached || 0
    return {
      ...intern,
      visitsCount: visits,
      studentsReached: students
    }
  }).sort((a, b) => b.visitsCount - a.visitsCount)

  const batch1Leaders = internStats.filter(i => i.batch === 'Batch 1')
  const batch2Leaders = internStats.filter(i => i.batch === 'Batch 2')

  const topBatch1 = batch1Leaders[0]
  const topBatch2 = batch2Leaders[0]

  const currentDisplayList = activeTab === 'batch1'
    ? batch1Leaders
    : activeTab === 'batch2'
    ? batch2Leaders
    : internStats

  const first = currentDisplayList[0]
  const second = currentDisplayList[1]
  const third = currentDisplayList[2]

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0A4D2D] to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-500/30 overflow-hidden relative">
      
      {/* Background ambient decorative shapes */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-1.5 border border-amber-400/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Outreach Excellence Podium</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
            Top Performing Outreach Scholars
            <Sparkles className="w-5 h-5 ml-2 text-amber-300 animate-pulse" />
          </h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Ranked by verified school visits completed across grassroots centers
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overall')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overall'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-white hover:text-amber-200'
            }`}
          >
            Cohort Podium
          </button>
          <button
            onClick={() => setActiveTab('batch1')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'batch1'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-white hover:text-amber-200'
            }`}
          >
            Batch 1
          </button>
          <button
            onClick={() => setActiveTab('batch2')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'batch2'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-white hover:text-amber-200'
            }`}
          >
            Batch 2
          </button>
        </div>
      </div>

      {/* Visual Podium (2nd | 1st | 3rd) */}
      <div className="pt-8 pb-4 max-w-2xl mx-auto relative z-10">
        <div className="flex items-end justify-center gap-3 sm:gap-6">
          
          {/* 2nd Place (Silver - Left) */}
          {second && (
            <div
              onClick={() => onSelectIntern && onSelectIntern(second)}
              className="flex-1 flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1"
            >
              <div className="relative mb-2">
                <img
                  src={second.photo}
                  alt={second.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-slate-300 shadow-lg group-hover:ring-4 group-hover:ring-slate-300/50 transition-all"
                />
                <div className="absolute -bottom-2.5 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                  2nd
                </div>
              </div>

              <div className="text-center mb-2 px-1">
                <span className="font-extrabold text-white text-xs sm:text-sm block truncate max-w-[110px] sm:max-w-[140px]">
                  {second.name}
                </span>
                <span className="text-[10px] text-emerald-200 font-semibold block">{second.batch}</span>
              </div>

              {/* Podium Column */}
              <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700/80 rounded-t-2xl p-3 pt-4 text-center border-t-2 border-slate-300 h-28 sm:h-32 flex flex-col justify-between shadow-inner">
                <div className="inline-flex items-center justify-center space-x-1 text-slate-200 text-xs font-bold">
                  <Medal className="w-4 h-4 text-slate-300" />
                  <span>Silver Star</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">{second.visitsCount}</span>
                  <span className="text-[10px] text-slate-300 block uppercase font-bold">School Visits</span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Gold - Center - Highest) */}
          {first && (
            <div
              onClick={() => onSelectIntern && onSelectIntern(first)}
              className="flex-1 flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1.5"
            >
              {/* Crown Icon */}
              <div className="text-amber-400 mb-1 animate-bounce">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="relative mb-2">
                <img
                  src={first.photo}
                  alt={first.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-amber-400 shadow-2xl group-hover:ring-4 group-hover:ring-amber-400/60 transition-all"
                />
                <div className="absolute -bottom-3 -right-2.5 w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg border-2 border-white">
                  1st
                </div>
              </div>

              <div className="text-center mb-2 px-1">
                <span className="font-black text-white text-sm sm:text-base block truncate max-w-[120px] sm:max-w-[160px]">
                  {first.name}
                </span>
                <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wide block">
                  🏆 Top Outreach Scholar • {first.batch}
                </span>
              </div>

              {/* Gold Podium Column */}
              <div className="w-full bg-gradient-to-t from-amber-700/80 via-amber-600/90 to-amber-500 rounded-t-2xl p-3 pt-5 text-center border-t-3 border-amber-300 h-36 sm:h-44 flex flex-col justify-between shadow-2xl">
                <div className="inline-flex items-center justify-center space-x-1 text-slate-950 text-xs font-black">
                  <Star className="w-4 h-4 fill-slate-950" />
                  <span>CHAMPION</span>
                </div>
                <div className="pb-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950">{first.visitsCount}</span>
                  <span className="text-[11px] text-slate-900 block uppercase font-extrabold tracking-wider">
                    School Visits
                  </span>
                  <span className="text-[10px] text-slate-900/80 font-bold block mt-0.5">
                    {first.studentsReached} Scholars Reached
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze - Right) */}
          {third && (
            <div
              onClick={() => onSelectIntern && onSelectIntern(third)}
              className="flex-1 flex flex-col items-center cursor-pointer group transition-transform hover:-translate-y-1"
            >
              <div className="relative mb-2">
                <img
                  src={third.photo}
                  alt={third.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-amber-700 shadow-lg group-hover:ring-4 group-hover:ring-amber-700/50 transition-all"
                />
                <div className="absolute -bottom-2.5 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md">
                  3rd
                </div>
              </div>

              <div className="text-center mb-2 px-1">
                <span className="font-extrabold text-white text-xs sm:text-sm block truncate max-w-[110px] sm:max-w-[140px]">
                  {third.name}
                </span>
                <span className="text-[10px] text-emerald-200 font-semibold block">{third.batch}</span>
              </div>

              {/* Podium Column */}
              <div className="w-full bg-gradient-to-t from-slate-900 to-amber-950/70 rounded-t-2xl p-3 pt-4 text-center border-t-2 border-amber-600 h-24 sm:h-28 flex flex-col justify-between shadow-inner">
                <div className="inline-flex items-center justify-center space-x-1 text-amber-200 text-xs font-bold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Bronze Star</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">{third.visitsCount}</span>
                  <span className="text-[10px] text-amber-200/80 block uppercase font-bold">School Visits</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Dual Batch Highlight Spotlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs relative z-10">
        
        {/* Batch 1 Spotlight */}
        {topBatch1 && (
          <div
            onClick={() => onSelectIntern && onSelectIntern(topBatch1)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-3">
              <img src={topBatch1.photo} className="w-10 h-10 rounded-xl object-cover border border-amber-300" alt="" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-amber-300 block">
                  🌟 Batch 1 Leader
                </span>
                <span className="font-bold text-white text-sm group-hover:text-amber-200">
                  {topBatch1.name}
                </span>
                <span className="text-[11px] text-emerald-200 block">
                  {topBatch1.visitsCount} school visits • {topBatch1.studentsReached} students
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* Batch 2 Spotlight */}
        {topBatch2 && (
          <div
            onClick={() => onSelectIntern && onSelectIntern(topBatch2)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-3">
              <img src={topBatch2.photo} className="w-10 h-10 rounded-xl object-cover border border-amber-300" alt="" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-amber-300 block">
                  🌟 Batch 2 Leader
                </span>
                <span className="font-bold text-white text-sm group-hover:text-amber-200">
                  {topBatch2.name}
                </span>
                <span className="text-[11px] text-emerald-200 block">
                  {topBatch2.visitsCount} school visits • {topBatch2.studentsReached} students
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

      </div>

    </div>
  )
}
