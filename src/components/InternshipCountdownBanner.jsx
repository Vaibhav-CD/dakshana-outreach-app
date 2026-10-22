import React from 'react'
import { Calendar, Clock, Sparkles, ChevronRight, Edit3, ShieldCheck, Flag } from 'lucide-react'

export default function InternshipCountdownBanner({
  countdown,
  currentUser,
  onOpenSetEndDateModal,
  className = ''
}) {
  if (!countdown) return null

  // Check if current user can edit the end date (Senior Secretary, Management, or Junior Secretary)
  const canEdit = currentUser && (
    currentUser.role === 'senior_sec' ||
    currentUser.role === 'management' ||
    currentUser.role === 'junior_sec'
  )

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] text-white p-5 sm:p-6 shadow-lg border border-emerald-700/40 ${className}`}>
      
      {/* Decorative background blurs & patterns */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left: Main Countdown Headline */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <Sparkles className="w-3 h-3 mr-1 text-emerald-300" />
              Internship Timeline & Days Remaining
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7B2E68]/60 text-white border border-white/20">
              Dakshana Outreach 2026–27
            </span>
          </div>

          <div>
            <div className="text-emerald-100 text-xs font-semibold flex items-center space-x-1.5">
              <span>Time Remaining in Outreach Internship:</span>
            </div>
            {/* The primary formatted countdown */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mt-1 drop-shadow-xs">
              {countdown.formatted}
            </div>
          </div>

          {/* Key Metric Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="inline-flex items-center px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 font-bold text-white shadow-2xs">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
              <span>Target End Date: <strong className="text-emerald-100 underline decoration-emerald-300/40">{countdown.endDateFullFormatted}</strong></span>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 font-bold text-white shadow-2xs">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
              <span>{countdown.totalDays} Total Days Left</span>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 font-bold text-white shadow-2xs">
              <Flag className="w-3.5 h-3.5 mr-1.5 text-purple-200" />
              <span>{countdown.progressPct}% Program Completed</span>
            </div>
          </div>
        </div>

        {/* Right: Progress Meter & Configure Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/15">
          
          {/* Visual Progress Bar */}
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-emerald-100">
              <span>Cycle Progress</span>
              <span className="text-white font-extrabold">{countdown.progressPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-emerald-300 via-teal-200 to-white rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${Math.min(100, Math.max(5, countdown.progressPct))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-emerald-200/90 font-medium">
              <span>Induction (Jun '26)</span>
              <span>Graduation ({countdown.endDateFormatted})</span>
            </div>
          </div>

          {/* Action button: Set / Change End Date for leadership */}
          {canEdit ? (
            <button
              onClick={onOpenSetEndDateModal}
              className="w-full sm:w-auto mt-1 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-900 text-xs font-black shadow-md hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 group"
              title="Click to set or adjust the internship completion date"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0A643B] group-hover:rotate-12 transition-transform" />
              <span>Set End Date</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-emerald-200 font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Official Dakshana Outreach Timeline</span>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
