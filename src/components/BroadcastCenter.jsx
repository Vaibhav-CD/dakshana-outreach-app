import React, { useState } from 'react'
import { Megaphone, Send, CheckCircle2, Bell, Radio } from 'lucide-react'

export default function BroadcastCenter({ currentUser, broadcasts, onSendBroadcast, delegatedPowers = {} }) {
  // Senior Secretary, Management & Delegated Junior Secretaries have broadcast dispatching powers
  const userPowers = currentUser.role === 'junior_sec' ? (delegatedPowers[currentUser.id] || {}) : {}
  const isAuthority = currentUser.role === 'senior_sec' || currentUser.role === 'management' || Boolean(userPowers.canBroadcast)
  
  const [targetAudience, setTargetAudience] = useState('batch_1')
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  // Smart audience visibility based on user role and batch
  const visibleBroadcasts = broadcasts.filter(b => {
    // Senior Secretary and Management see all broadcasts
    if (currentUser.role === 'senior_sec' || currentUser.role === 'management') return true
    
    // Broadcast to entire organization
    if (b.audience === 'all') return true

    // Junior Secretaries see notices meant for them or all scholars
    if (currentUser.role === 'junior_sec') {
      return b.audience === 'junior_secs' || b.audience === 'all_interns' || b.audience === 'batch_1' || b.audience === 'batch_2'
    }

    // Interns / Scholars: strictly filtered by their batch!
    if (currentUser.role === 'intern') {
      if (b.audience === 'all_interns') return true
      if (currentUser.batch === 'Batch 1' && b.audience === 'batch_1') return true
      if (currentUser.batch === 'Batch 2' && b.audience === 'batch_2') return true
      return false
    }

    return false
  })

  const handleSend = (e) => {
    e.preventDefault()
    if (!broadcastTitle || !broadcastMessage) return

    setIsSending(true)
    const newBroadcast = {
      id: `bc-${Date.now()}`,
      sender: currentUser.name,
      title: broadcastTitle,
      message: broadcastMessage,
      audience: targetAudience,
      date: 'Just now',
      isNew: true
    }

    setTimeout(() => {
      onSendBroadcast(newBroadcast)
      setIsSending(false)
      setSendSuccess(true)
      setBroadcastTitle('')
      setBroadcastMessage('')
      setTimeout(() => setSendSuccess(false), 4000)
    }, 400)
  }

  const getAudienceBadge = (aud) => {
    switch (aud) {
      case 'batch_1':
        return { label: 'Batch 1 Scholars Only', bg: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30' }
      case 'batch_2':
        return { label: 'Batch 2 Scholars Only', bg: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30' }
      case 'all_interns':
        return { label: 'Both Batches (All Scholars)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
      case 'junior_secs':
        return { label: 'All 3 Junior Secretaries', bg: 'bg-amber-50 text-amber-900 border-amber-200' }
      case 'management':
        return { label: 'Board / Trustees', bg: 'bg-purple-50 text-purple-900 border-purple-200' }
      default:
        return { label: 'Entire Dakshana Cohort', bg: 'bg-slate-100 text-slate-800 border-slate-200' }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Radio className="w-6 h-6 mr-2 text-[#0A643B] animate-pulse" />
            Dakshana Notification & Circular Center
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Targeted announcements system. Transmit circulars batch-wise (Batch 1 or Batch 2), to Junior Secretaries, or to the entire cohort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sender Composer (Highest Power: Senior Secretary & Management) */}
        {isAuthority && (
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-[#0A643B]" />
              <h3 className="font-bold text-slate-900 text-base">Dispatch Targeted Circular</h3>
            </div>

            {sendSuccess && (
              <div className="p-3 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-xs font-semibold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Notification broadcast successfully transmitted to target audience!
              </div>
            )}

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Target Audience (Batch / Staff) *</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                >
                  <optgroup label="Scholar Batches">
                    <option value="batch_1">Batch 1 Scholars Only</option>
                    <option value="batch_2">Batch 2 Scholars Only</option>
                    <option value="all_interns">Both Batches (All Outreach Scholars)</option>
                  </optgroup>
                  <optgroup label="Secretariat & Staff">
                    <option value="junior_secs">All 3 Junior Secretaries (Secretariat Direct)</option>
                    <option value="all">Entire Dakshana Cohort (Scholars + Staff)</option>
                    <option value="management">Board / Trustees</option>
                  </optgroup>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {targetAudience === 'batch_1' && '🎯 Delivered strictly to scholars enrolled in Batch 1.'}
                  {targetAudience === 'batch_2' && '🎯 Delivered strictly to scholars enrolled in Batch 2.'}
                  {targetAudience === 'all_interns' && '🎯 Delivered to all scholars across both Batch 1 and Batch 2.'}
                  {targetAudience === 'junior_secs' && '⚡ Secretariat notice: strictly delivered to the 3 Junior Secretaries.'}
                  {targetAudience === 'all' && '⚡ Delivered to everyone in the portal.'}
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject / Headline *</label>
                <input
                  required
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Batch 1: Final Project Submission Guidelines"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Message *</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Write instructions, deadlines, or meeting agenda..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                {isSending ? 'Transmitting...' : 'Send Targeted Circular'}
              </button>
            </form>
          </div>
        )}

        {/* Notices Feed */}
        <div className={isAuthority ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#0A643B]" />
              Official Notices & Memos ({visibleBroadcasts.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentUser.role === 'intern' 
                ? `Showing circulars for ${currentUser.batch} and cohort-wide announcements`
                : 'Circulars and instructions relevant to your supervisory level'}
            </p>

            <div className="space-y-3">
              {visibleBroadcasts.map((b) => {
                const badge = getAudienceBadge(b.audience)

                return (
                  <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          Target: {badge.label}
                        </span>
                        {b.isNew && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7B2E68] text-white animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{b.date} • by {b.sender}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {b.message}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
