import React, { useState } from 'react'
import { FolderLock, BookOpen, ExternalLink, Plus, Lock, Globe, FileText, CheckCircle2 } from 'lucide-react'

export default function ResourceHub({ currentUser, resources, onAddResource }) {
  const isStaff = currentUser.role !== 'intern'
  const [activeSpace, setActiveSpace] = useState(isStaff ? 'staff' : 'interns')
  const [showAddModal, setShowAddModal] = useState(false)

  // New resource form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Study Materials')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [targetSpace, setTargetSpace] = useState(isStaff ? 'staff' : 'interns')

  const filteredResources = resources.filter(r => r.targetSpace === activeSpace)

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!title || !url) return

    onAddResource({
      id: `res-${Date.now()}`,
      title,
      category,
      url,
      description,
      targetSpace,
      addedBy: currentUser.name
    })

    setTitle('')
    setUrl('')
    setDescription('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Resource Hub Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Resource & Materials Hub</h2>
          <p className="text-slate-500 text-xs mt-1">
            Centralized document drives, SOPs, study curriculum, and reporting templates.
          </p>
        </div>

        {/* Add Material Button (Senior Sec, Junior Sec, Management only) */}
        {isStaff && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Resource Link
          </button>
        )}
      </div>

      {/* Dual Space Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        {/* Space 1: Staff Only */}
        {isStaff && (
          <button
            onClick={() => setActiveSpace('staff')}
            className={`pb-3 px-2 font-bold text-xs flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
              activeSpace === 'staff'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>Staff & Leadership Vault (Confidential)</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px]">
              {resources.filter(r => r.targetSpace === 'staff').length}
            </span>
          </button>
        )}

        {/* Space 2: Interns & Scholars Space */}
        <button
          onClick={() => setActiveSpace('interns')}
          className={`pb-3 px-2 font-bold text-xs flex items-center space-x-2 border-b-2 transition-colors cursor-pointer ${
            activeSpace === 'interns'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Interns & Scholars Material Space</span>
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
            {resources.filter(r => r.targetSpace === 'interns').length}
          </span>
        </button>
      </div>

      {/* Space Notice */}
      {activeSpace === 'staff' ? (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span><strong>Leadership Vault:</strong> Strictly visible only to Management, Senior Secretary, and Junior Secretaries. Contains SOPs, confidential spreadsheets, and audit forms.</span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span><strong>Scholars Space:</strong> Curated curriculum drives, worksheets, lesson plans, and monthly reporting templates accessible by all interns.</span>
          </div>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  res.targetSpace === 'staff' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {res.category}
                </span>
                <span className="text-[11px] text-slate-400">Added by {res.addedBy}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mb-2">{res.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
              >
                Open Resource <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Resource */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-1">Add Resource Link</h3>
            <p className="text-xs text-slate-500 mb-4">Add a Google Drive, document, or portal link to the repository.</p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. October Teaching Syllabus"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Space *</label>
                <select
                  value={targetSpace}
                  onChange={(e) => setTargetSpace(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="interns">Interns & Scholars Space (Public to Cohort)</option>
                  <option value="staff">Staff & Leadership Vault (Confidential)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Tag</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Curriculum, Guidelines, Finance"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL (Drive / Doc link) *</label>
                <input
                  required
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief note about what this document covers..."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
