import React, { useState } from 'react'
import {
  Bug,
  MessageSquareHeart,
  Info,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Smartphone,
  Globe,
  Layers,
  Wrench,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export default function FeedbackModal({
  isOpen,
  onClose,
  currentUser,
  activeTab = 'dashboard',
  onSubmitFeedback,
  onNavigateToMaintenance
}) {
  const [activeType, setActiveType] = useState('bug') // 'bug' | 'suggestion' | 'about'
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Technical Glitch')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')
  const [stepsToReproduce, setStepsToReproduce] = useState('')
  const [screenshotNote, setScreenshotNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  if (!isOpen) return null

  // Auto-detect client environment for quick technical diagnosis
  const clientEnv = {
    platform: navigator?.userAgentData?.platform || navigator?.platform || 'Unknown OS',
    browser: navigator?.userAgent?.includes('Chrome')
      ? 'Chrome'
      : navigator?.userAgent?.includes('Firefox')
      ? 'Firefox'
      : navigator?.userAgent?.includes('Safari')
      ? 'Safari'
      : 'Web Browser',
    screen: `${window.innerWidth}x${window.innerHeight}px`,
    activePage: activeTab
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    const ticketId = `sug-${Date.now()}`
    const fullDescription = activeType === 'bug'
      ? `${description.trim()}${stepsToReproduce.trim() ? `\n\n[Steps to Reproduce]: ${stepsToReproduce.trim()}` : ''}${screenshotNote.trim() ? `\n[Notes / Screenshot]: ${screenshotNote.trim()}` : ''}\n\n[Client Environment]: ${clientEnv.browser} on ${clientEnv.platform} (${clientEnv.screen}) • Page: ${clientEnv.activePage}`
      : `${description.trim()}\n\n[Context]: Page: ${clientEnv.activePage} • Device: ${clientEnv.browser}`

    const newIssue = {
      id: ticketId,
      title: `${activeType === 'bug' ? '🐛 [BUG] ' : '💡 [SUGGESTION] '}${title.trim()}`,
      description: fullDescription,
      submittedBy: currentUser ? `${currentUser.name} (${currentUser.title || currentUser.role})` : 'Anonymous Scholar',
      submittedRole: currentUser?.role || 'intern',
      category: category,
      priority: priority,
      status: 'pending', // Senior Secretary will rectify this
      createdAt: new Date().toISOString().split('T')[0],
      rectifiedAt: null,
      rectifiedNote: null
    }

    setTimeout(() => {
      if (onSubmitFeedback) {
        onSubmitFeedback(newIssue)
      }
      setIsSubmitting(false)
      setSubmittedTicket(ticketId)
    }, 400)
  }

  const handleResetAndClose = () => {
    setTitle('')
    setDescription('')
    setStepsToReproduce('')
    setScreenshotNote('')
    setSubmittedTicket(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <Bug className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Feedback & Bug Reporting Desk
              </h3>
              <p className="text-xs text-emerald-100">
                Direct communication channel to Central Operations & Senior Secretary
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveType('bug')
              setCategory('Technical Glitch')
            }}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
              activeType === 'bug'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bug className="w-4 h-4 text-rose-600" />
            <span>Report a Bug / Glitch</span>
          </button>

          <button
            onClick={() => {
              setActiveType('suggestion')
              setCategory('Operations')
            }}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
              activeType === 'suggestion'
                ? 'border-[#0A643B] text-[#0A643B] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4 text-[#0A643B]" />
            <span>Suggest Improvement</span>
          </button>

          <button
            onClick={() => setActiveType('about')}
            className={`py-3 px-4 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              activeType === 'about'
                ? 'border-[#7B2E68] text-[#7B2E68] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-4 h-4 text-[#7B2E68]" />
            <span>About Portal</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Submission Success Screen */}
          {submittedTicket ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0A643B] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-lg">
                  Report Received Successfully!
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your report has been logged with ticket ID <strong className="text-slate-800">{submittedTicket}</strong> and routed to the <strong>Senior Secretary's Maintenance Desk</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-left space-y-1.5 max-w-md mx-auto">
                <div className="flex items-center space-x-1.5 font-bold text-[#0A643B]">
                  <Wrench className="w-4 h-4" />
                  <span>How Resolution Works:</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  The Senior Secretary handles system maintenance. As soon as the issue is verified and rectified in the codebase/portal, it will automatically move from pending to rectified status.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {currentUser?.role === 'senior_sec' && (
                  <button
                    onClick={() => {
                      handleResetAndClose()
                      if (onNavigateToMaintenance) onNavigateToMaintenance()
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7B2E68] hover:bg-[#602351] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Open My Maintenance Desk &rarr;
                  </button>
                )}
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Close Desk
                </button>
              </div>
            </div>
          ) : activeType === 'about' ? (
            /* About Panel Tab */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0A643B] text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-300">
                    Portal Version 2.4.0 (2026 Edition)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    Official
                  </span>
                </div>
                <h4 className="font-black text-base text-white">
                  Dakshana Outreach Internship Platform
                </h4>
                <p className="text-emerald-100 text-xs leading-relaxed">
                  "Honor. Knowledge. Service." — Built for coordinating grassroots rural school outreach across Batch 1 & Batch 2 scholars.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Leadership Hierarchy</span>
                  <p className="font-extrabold text-slate-800 text-xs mt-1">Management &rarr; Senior Sec &rarr; Junior Secs &rarr; Scholars</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">System Maintenance</span>
                  <p className="font-extrabold text-[#0A643B] text-xs mt-1">Senior Secretary Desk</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-slate-600">
                <h5 className="font-bold text-slate-900 text-xs flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-[#0A643B]" />
                  What to do if you encounter an issue?
                </h5>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 leading-relaxed">
                  <li>Use the <strong>"Report a Bug / Glitch"</strong> tab above to describe what went wrong.</li>
                  <li>Your browser, screen resolution, and current page are automatically captured to help the team troubleshoot immediately.</li>
                  <li>The Senior Secretary verifies and rectifies issues in real-time.</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveType('bug')}
                  className="px-4 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Report a Problem Now &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* Bug Report & Improvement Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Context Summary Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                <span>
                  Reporting as: <strong className="text-slate-900">{currentUser?.name || 'Logged User'}</strong> ({currentUser?.title || currentUser?.role || 'Intern'})
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                  Active Page: {activeTab}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {activeType === 'bug' ? 'Issue Summary / What went wrong? *' : 'Suggestion Title / Idea Summary *'}
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeType === 'bug' ? 'e.g. Circular popup getting cut off on mobile' : 'e.g. Add offline printable attendance sheet in Materials Hub'}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Technical Glitch">Technical Glitch / Bug</option>
                    <option value="UI & Mobile Display">UI & Mobile Layout Cutoff</option>
                    <option value="Materials Hub">Materials Hub & Downloads</option>
                    <option value="Reimbursements">Reimbursement Claim Window</option>
                    <option value="Field Reports & Visits">Field Reports & Visit Counts</option>
                    <option value="Queries Hub">Queries & Doubts Forum</option>
                    <option value="Operations">Operations & Team Allocation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Severity / Priority *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
                  >
                    <option value="medium">Medium — Normal inquiry / slight friction</option>
                    <option value="high">High — Impairs workflow</option>
                    <option value="urgent">Critical / Blocking — Cannot submit work</option>
                    <option value="low">Low — Minor visual suggestion</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {activeType === 'bug' ? 'Detailed Description of the Bug *' : 'Detailed Explanation of your Suggestion *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={activeType === 'bug' ? 'Explain what happened when you clicked or viewed this...' : 'Explain why this feature or change would help the outreach internship cohort...'}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden resize-none"
                />
              </div>

              {/* Optional Steps to reproduce (only for bug) */}
              {activeType === 'bug' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Steps to Reproduce (Optional)
                  </label>
                  <input
                    type="text"
                    value={stepsToReproduce}
                    onChange={(e) => setStepsToReproduce(e.target.value)}
                    placeholder="e.g. Go to Notices -> Click 2nd notice -> Popover closes unexpectedly"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>
              )}

              {/* Auto-detected Diagnostics Pill */}
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center">
                  <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Auto-Captured Diagnostics:
                </span>
                <span className="font-semibold text-slate-700 truncate max-w-[250px]">
                  {clientEnv.browser} • {clientEnv.platform} ({clientEnv.screen})
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-xs flex items-center cursor-pointer transition-all ${
                    activeType === 'bug'
                      ? 'bg-rose-700 hover:bg-rose-800'
                      : 'bg-[#0A643B] hover:bg-[#074D2D]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting ? 'Sending...' : activeType === 'bug' ? 'Submit Bug Report' : 'Send Suggestion'}
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0A643B]" />
          <span>Managed directly by the Senior Secretary for prompt rectification.</span>
        </div>

      </div>
    </div>
  )
}
