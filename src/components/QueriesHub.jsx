import React, { useState } from 'react'
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  Send,
  Sparkles,
  ShieldCheck,
  Filter,
  Check,
  ChevronDown,
  X,
  BookOpen
} from 'lucide-react'
import Avatar from './Avatar'

export default function QueriesHub({
  currentUser,
  queries = [],
  onAddQuery,
  onAddAnswer,
  onToggleResolve,
  onUpvoteQuery
}) {
  const [showComposer, setShowComposer] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'resolved' | 'open'
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [batchFilter, setBatchFilter] = useState('all')

  // Composer Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('School Permissions')

  // Answers State: active query being replied to & text
  const [expandedQueryId, setExpandedQueryId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const categories = [
    'School Permissions',
    'Expense & Reimbursements',
    'Classroom & Teaching Materials',
    'School Visits & Scheduling',
    'Attendance & Monthly Reports'
  ]

  const handleSubmitQuery = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const newQuery = {
      id: `query-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      batch: currentUser.batch || 'Batch 1',
      category: category,
      title: title.trim(),
      content: content.trim(),
      status: 'open',
      createdAt: 'Just now',
      upvotes: 1,
      answers: []
    }

    if (onAddQuery) {
      onAddQuery(newQuery)
    }

    // Reset
    setTitle('')
    setContent('')
    setCategory('School Permissions')
    setShowComposer(false)
  }

  const handlePostAnswer = (queryId) => {
    if (!replyText.trim()) return

    const isLeadership = currentUser.role === 'junior_sec' || currentUser.role === 'senior_sec' || currentUser.role === 'management'

    const newAns = {
      id: `ans-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: replyText.trim(),
      isOfficial: isLeadership,
      createdAt: 'Just now'
    }

    if (onAddAnswer) {
      onAddAnswer(queryId, newAns)
    }

    setReplyText('')
  }

  // Filter queries based on search, status, category, and batch
  const filteredQueries = queries.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.answers && q.answers.some(a => a.text.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesStatus =
      statusFilter === 'all' ? true : q.status === statusFilter

    const matchesCategory =
      categoryFilter === 'all' ? true : q.category === categoryFilter

    const matchesBatch =
      batchFilter === 'all' ? true : q.batch === batchFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesBatch
  })

  const isPrivileged = currentUser.role !== 'intern'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EBF7F0] text-[#0A643B] text-xs font-bold mb-1.5 border border-[#0A643B]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Outreach Doubt Resolution Hub</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Scholar Queries & Common Doubts
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Transparent forum for Batch 1 and Batch 2 scholars. Ask questions, view resolved doubts, and get verified guidance from Junior Secretaries.
          </p>
        </div>

        <button
          onClick={() => setShowComposer(!showComposer)}
          className="px-5 py-2.5 rounded-2xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {showComposer ? 'Close Form' : 'Ask a Question / Post Query'}
        </button>
      </div>

      {/* CREATE QUERY COMPOSER */}
      {showComposer && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#0A643B]/30 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
            <Avatar src={currentUser.photo} name={currentUser.name} role={currentUser.role} size="md" />
            <div>
              <span className="font-bold text-slate-900 text-sm block">{currentUser.name}</span>
              <span className="text-[11px] text-[#0A643B] font-semibold">
                {currentUser.role === 'intern' ? `Outreach Scholar • ${currentUser.batch || 'Batch 1'}` : currentUser.title}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitQuery} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Query Subject / Question Headline *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to get permission letter if Headmaster requests physical authorization?"
                className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category / Topic *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Explanation & Context *</label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your situation in detail so Junior Secretaries or fellow scholars can provide the best advice..."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center shadow-xs cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Query
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doubts by keyword (e.g. bills, headmaster, permission, cash voucher)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white shadow-2xs focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Status Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Queries ({queries.length})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'resolved' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Resolved ({queries.filter(q => q.status === 'resolved').length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'open' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Open ({queries.filter(q => q.status === 'open').length})
            </button>
          </div>

          {/* Batch Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-slate-200 p-1 rounded-2xl font-semibold">
            <span className="text-slate-400 text-[11px] px-2">Batch:</span>
            <button
              onClick={() => setBatchFilter('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] cursor-pointer ${batchFilter === 'all' ? 'bg-[#0A643B] text-white font-bold' : 'text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setBatchFilter('Batch 1')}
              className={`px-2.5 py-1 rounded-xl text-[11px] cursor-pointer ${batchFilter === 'Batch 1' ? 'bg-[#0A643B] text-white font-bold' : 'text-slate-600'}`}
            >
              Batch 1
            </button>
            <button
              onClick={() => setBatchFilter('Batch 2')}
              className={`px-2.5 py-1 rounded-xl text-[11px] cursor-pointer ${batchFilter === 'Batch 2' ? 'bg-[#7B2E68] text-white font-bold' : 'text-slate-600'}`}
            >
              Batch 2
            </button>
          </div>
        </div>
      </div>

      {/* QUERIES LIST */}
      <div className="space-y-4">
        {filteredQueries.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-bold text-sm">No matching doubts found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search terms or post your query above.</p>
          </div>
        ) : (
          filteredQueries.map((query) => {
            const isResolved = query.status === 'resolved'
            const isExpanded = expandedQueryId === query.id
            const canToggleStatus = isPrivileged || query.authorId === currentUser.id

            return (
              <div
                key={query.id}
                className={`bg-white rounded-3xl border transition-all shadow-xs hover:shadow-md p-5 sm:p-6 space-y-4 ${
                  isResolved ? 'border-emerald-200/90' : 'border-slate-200'
                }`}
              >
                {/* Header: Author & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={query.authorPhoto || null}
                      name={query.authorName}
                      role={query.authorRole}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {query.authorName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {query.batch}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">{query.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0A643B] border border-emerald-200">
                      {query.category}
                    </span>

                    {/* Status Pill */}
                    {isResolved ? (
                      <span className="inline-flex items-center text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Awaiting Guidance
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {query.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {query.content}
                  </p>
                </div>

                {/* Footer Controls: Upvote, Answers Count, and Mark as Resolved */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={() => onUpvoteQuery && onUpvoteQuery(query.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span>{query.upvotes || 0} Helpful</span>
                    </button>

                    {/* Answers Button */}
                    <button
                      type="button"
                      onClick={() => setExpandedQueryId(isExpanded ? null : query.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#0A643B] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{(query.answers || []).length} Solutions & Answers</span>
                    </button>
                  </div>

                  {/* Mark as Resolved Toggle (Leadership or Author) */}
                  {canToggleStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleResolve && onToggleResolve(query.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center space-x-1.5 ${
                        isResolved
                          ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          : 'bg-[#0A643B] text-white border-[#0A643B] hover:bg-[#074D2D] shadow-2xs'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isResolved ? 'Reopen Doubt' : 'Mark as Resolved ✓'}</span>
                    </button>
                  )}
                </div>

                {/* EXPANDED ANSWERS & GUIDANCE THREAD */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 p-4 rounded-2xl animate-in fade-in duration-150">
                    <span className="font-bold text-slate-700 text-xs block">
                      Clarifications & Guidance:
                    </span>

                    {/* Answers List */}
                    <div className="space-y-2.5">
                      {(!query.answers || query.answers.length === 0) ? (
                        <p className="text-[11px] text-slate-400 italic">
                          No replies posted yet. If you know the procedure or have solved this, leave an answer below!
                        </p>
                      ) : (
                        query.answers.map(ans => (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                              ans.isOfficial
                                ? 'bg-[#EBF7F0]/60 border-[#0A643B]/30'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-extrabold text-slate-900">
                                  {ans.authorName}
                                </span>
                                {ans.isOfficial && (
                                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#0A643B] text-white">
                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                    Secretariat Guidance
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{ans.createdAt}</span>
                            </div>

                            <p className="text-slate-700 leading-relaxed">
                              {ans.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Post an Answer Form */}
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Provide guidance or a solution to this doubt..."
                        className="flex-1 text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handlePostAnswer(query.id)
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handlePostAnswer(query.id)}
                        className="px-4 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center cursor-pointer transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        <span>Post Solution</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
