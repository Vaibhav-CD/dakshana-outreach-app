import React, { useState, useEffect } from 'react'
import {
  ExternalLink,
  Sparkles,
  FileText,
  Briefcase,
  Check,
  Copy,
  BookOpen,
  Plus,
  Trash2,
  X,
  Link as LinkIcon
} from 'lucide-react'

const DEFAULT_OFFICIAL_RESOURCES = [
  {
    id: 'session-form',
    title: 'Dakshana outreach session form',
    badge: 'Mandatory Form',
    badgeColor: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30',
    iconBg: 'bg-emerald-100 text-[#0A643B] border-emerald-200',
    buttonBg: 'bg-[#0A643B] hover:bg-[#074D2D] text-white',
    cardBorder: 'hover:border-[#0A643B]',
    url: 'https://tinyurl.com/Outreach-session-form',
    description: 'Fill out this official session form to record each school visit, student attendance count, class topics covered, and field outreach activities.',
    usageNote: 'Must be filled after every completed school outreach session.',
    isOfficial: true
  },
  {
    id: 'intern-toolkit',
    title: 'Dakshana intern toolkit',
    badge: 'Official Toolkit 2026–27',
    badgeColor: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30',
    iconBg: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30',
    buttonBg: 'bg-[#7B2E68] hover:bg-[#5F2150] text-white',
    cardBorder: 'hover:border-[#7B2E68]',
    url: 'https://tinyurl.com/interntoolkit26-27',
    description: 'Comprehensive 2026–27 outreach teaching resources, presentation decks, curriculum modules, guidelines, and scholar handbook.',
    usageNote: 'Reference before and during school visits for approved materials.',
    isOfficial: true
  }
]

export default function ResourceHub({ currentUser }) {
  const [copiedLink, setCopiedLink] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Resource list persisted in localStorage
  const [resourceList, setResourceList] = useState(() => {
    const saved = localStorage.getItem('dakshana_resources')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return DEFAULT_OFFICIAL_RESOURCES
  })

  // Form state for adding an extra resource
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newBadge, setNewBadge] = useState('Outreach Resource')
  const [newDescription, setNewDescription] = useState('')
  const [newNote, setNewNote] = useState('')

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedLink(id)
    setTimeout(() => setCopiedLink(null), 2500)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newUrl.trim()) return

    const newRes = {
      id: `res-extra-${Date.now()}`,
      title: newTitle.trim(),
      badge: newBadge.trim() || 'Extra Resource',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-50 text-[#0A643B] border-emerald-200',
      buttonBg: 'bg-[#0A643B] hover:bg-[#074D2D] text-white',
      cardBorder: 'hover:border-[#0A643B]',
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      description: newDescription.trim() || 'Outreach internship reference link.',
      usageNote: newNote.trim() || 'Added for outreach fieldwork.',
      isOfficial: false,
      addedAt: new Date().toLocaleDateString()
    }

    const updated = [...resourceList, newRes]
    setResourceList(updated)
    localStorage.setItem('dakshana_resources', JSON.stringify(updated))

    // Reset & close
    setNewTitle('')
    setNewUrl('')
    setNewBadge('Outreach Resource')
    setNewDescription('')
    setNewNote('')
    setShowAddModal(false)
  }

  const handleDeleteResource = (id) => {
    const updated = resourceList.filter(r => r.id !== id)
    setResourceList(updated)
    localStorage.setItem('dakshana_resources', JSON.stringify(updated))
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Materials Hub Header with Mobile-First Action Button */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#0A643B] flex items-center justify-center font-bold flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dakshana Materials Hub</h2>
            <p className="text-slate-500 text-xs">
              Official outreach resources, session logging forms, and intern toolkits for 2026–27.
            </p>
          </div>
        </div>

        {/* Option for updating / adding extra resources on mobile & desktop */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Extra Resource Link</span>
        </button>
      </div>

      {/* Add Resource Modal (Mobile Optimized) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-[#0A643B]" />
                <h3 className="font-extrabold text-slate-900 text-base">Add New Resource Link</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. School Headmaster Permission Letter Format"
                  className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource URL (Link) *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://..."
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="e.g. Template, Guidelines"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usage Note</label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Carry hardcopy to visits"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain how scholars should use this material..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resourceList.map((item) => {
          const isCopied = copiedLink === item.id

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all ${item.cardBorder} hover:shadow-md relative`}
            >
              <div>
                {/* Header with Icon, Badge, and Delete for Extra Resources */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                    {item.id === 'session-form' ? (
                      <FileText className="w-6 h-6" />
                    ) : item.id === 'intern-toolkit' ? (
                      <Briefcase className="w-6 h-6" />
                    ) : (
                      <LinkIcon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {item.badge}
                    </span>
                    {!item.isOfficial && (
                      <button
                        onClick={() => handleDeleteResource(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove custom resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* URL Pill */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-700 truncate mr-2 select-all">
                    {item.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer flex items-center text-[11px] font-medium flex-shrink-0"
                    title="Copy URL to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
                        <span className="text-[#0A643B] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Usage Note */}
                <div className="text-[11px] text-slate-500 italic mb-6">
                  📌 {item.usageNote}
                </div>
              </div>

              {/* Direct Open Button */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center transition-all shadow-xs hover:shadow-md cursor-pointer ${item.buttonBg}`}
              >
                <span>Open {item.title}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )
        })}
      </div>

      {/* Helpful Instructions Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-purple-50/50 rounded-2xl p-5 border border-[#0A643B]/20 text-xs text-slate-700">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-[#0A643B] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-slate-900 block text-sm">
              Quick Reference for Outreach Interns & Supervisors
            </span>
            <p>
              • <strong>Session Form:</strong> Every outreach scholar must submit the form after conducting each workshop to record attendance and school feedback.
            </p>
            <p>
              • <strong>Intern Toolkit:</strong> Contains all official slides, handouts, and foundational numeracy & science materials for your visits.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
