import React, { useState } from 'react'
import { Calendar, Clock, X, CheckCircle2, Sparkles, AlertCircle, Radio } from 'lucide-react'
import { calculateInternshipCountdown } from '../utils/dateUtils'

export default function SetEndDateModal({
  isOpen,
  onClose,
  currentEndDate,
  onSaveEndDate,
  canBroadcast = true
}) {
  const [selectedDate, setSelectedDate] = useState(currentEndDate || '2027-04-30')
  const [shouldBroadcast, setShouldBroadcast] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  // Live calculation based on currently selected date
  const liveCountdown = calculateInternshipCountdown(selectedDate)

  const presets = [
    { label: '31 Mar 2027', date: '2027-03-31', desc: 'Q1 Target' },
    { label: '30 Apr 2027', date: '2027-04-30', desc: 'Standard Academic End' },
    { label: '31 May 2027', date: '2027-05-31', desc: 'Summer Outreach' },
    { label: '30 Jun 2027', date: '2027-06-30', desc: 'Full Annual Cycle' }
  ]

  const handleSave = (e) => {
    e.preventDefault()
    if (!selectedDate) {
      setErrorMsg('Please choose a valid end date for the internship.')
      return
    }

    if (liveCountdown.isCompleted) {
      // If past date is selected, warn or confirm
      const confirmPast = window.confirm(
        'The selected date has already passed. The countdown panel will display "Internship Completed". Do you wish to proceed?'
      )
      if (!confirmPast) return
    }

    onSaveEndDate(selectedDate, shouldBroadcast)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Header with Dakshana theme gradient */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight">Configure Internship End Date</h3>
              <p className="text-xs text-emerald-100">Updates the countdown panel for all scholars & secretaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">

          {/* Date Picker Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target End Date of Internship:
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setErrorMsg('')
                }}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#0A643B] focus:ring-4 focus:ring-emerald-500/15 outline-hidden text-sm font-bold text-slate-800 bg-slate-50/50 transition-all cursor-pointer"
                required
              />
            </div>
            {errorMsg && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                {errorMsg}
              </p>
            )}
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Quick Presets</span>
              <span className="text-[10px] text-slate-400 font-normal">Click to apply</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => {
                const isSelected = selectedDate === preset.date
                return (
                  <button
                    key={preset.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(preset.date)
                      setErrorMsg('')
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0A643B] bg-[#EBF7F0] shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold ${isSelected ? 'text-[#0A643B]' : 'text-slate-800'}`}>
                        {preset.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0A643B]" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                      {preset.desc}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-purple-50 border border-emerald-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0A643B] flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> Live Panel Preview (What Everyone Sees)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                Target: {liveCountdown.endDateFormatted}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="text-xs font-medium text-slate-500 mb-0.5">Remaining Duration:</div>
              <div className="text-xl font-black text-[#0A643B] tracking-tight">
                {liveCountdown.formatted}
              </div>
              <div className="mt-1 flex items-center space-x-3 text-[11px] text-slate-600 font-semibold">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-[#7B2E68]" />
                  {liveCountdown.totalDays} total days left
                </span>
                <span>•</span>
                <span>Program Completion: {liveCountdown.progressPct}%</span>
              </div>
            </div>
          </div>

          {/* Broadcast Circular Checkbox */}
          {canBroadcast && (
            <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={shouldBroadcast}
                onChange={(e) => setShouldBroadcast(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#0A643B] rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block flex items-center">
                  <Radio className="w-3 h-3 mr-1 text-[#0A643B]" /> Broadcast timeline circular notice
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Automatically adds an official notice to the circulars board with an audio chime so all scholars see the updated deadline.
                </span>
              </div>
            </label>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Panel</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
