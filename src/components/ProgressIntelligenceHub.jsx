import React, { useState, useMemo } from 'react'
import {
  Download,
  Filter,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  Users,
  Search,
  Copy,
  Check,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowUpDown,
  BookOpen,
  Award,
  UserCheck
} from 'lucide-react'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'

/**
 * ProgressIntelligenceHub
 * 
 * Comprehensive Executive Progress Intelligence, AI Report Synthesis,
 * Multi-dimensional Filtering (Month, Batch, JEE/NEET Stream, Junior Secretary),
 * and 1-Click Excel (.CSV) Data Extraction.
 */
export default function ProgressIntelligenceHub({
  reports = [],
  allUsers = [],
  currentUser,
  onUpdateReport = null
}) {
  // --- Filter States ---
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedBatch, setSelectedBatch] = useState('all')
  const [selectedStream, setSelectedStream] = useState('all') // 'all' | 'JEE' | 'NEET'
  const [selectedJuniorSec, setSelectedJuniorSec] = useState('all') // 'all' | juniorSecId
  const [selectedStatus, setSelectedStatus] = useState('all') // 'all' | 'reviewed' | 'submitted' | 'revision_requested'
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'

  // --- AI Synthesis State ---
  const [aiTone, setAiTone] = useState('executive') // 'executive' | 'milestones' | 'challenges'
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [expandedReportId, setExpandedReportId] = useState(null)
  const [polishedReportIds, setPolishedReportIds] = useState({}) // { reportId: boolean }

  // Map users for fast lookup of stream, email, supervisor
  const usersMap = useMemo(() => {
    const map = {}
    allUsers.forEach(u => {
      map[u.id] = u
      if (u.name) map[u.name.toLowerCase()] = u
    })
    return map
  }, [allUsers])

  // Extract all distinct months available in reports
  const availableMonths = useMemo(() => {
    const months = new Set()
    reports.forEach(r => {
      if (r.monthYear) months.add(r.monthYear)
    })
    // Ensure standard months exist if empty
    if (months.size === 0) {
      months.add('October 2026')
      months.add('September 2026')
    }
    return Array.from(months)
  }, [reports])

  // Extract all Junior Secretaries for supervisor filtering
  const juniorSecretaries = useMemo(() => {
    const list = allUsers.filter(u => u.role === 'junior_sec')
    if (list.length > 0) return list
    return [
      { id: 'user-jsec-1', name: 'Priya Sharma', department: 'Wing 1 (Foundational Numeracy)' },
      { id: 'user-jsec-2', name: 'Rohan Verma', department: 'Wing 2 (Robotics & Literacy)' },
      { id: 'user-jsec-3', name: 'Sneha Kulkarni', department: 'Wing 3 (Media & Cluster Outreach)' }
    ]
  }, [allUsers])

  // Enriched reports with stream, email, and supervisor info
  const enrichedReports = useMemo(() => {
    return reports.map(r => {
      const user = usersMap[r.internId] || usersMap[(r.internName || '').toLowerCase()] || {}
      const supervisor = usersMap[r.juniorSecId] || usersMap[user.assignedTo] || {}
      const jsecId = r.juniorSecId || user.assignedTo || supervisor.id || ''
      const supervisorName = supervisor.name || r.reviewedBy || 'Junior Secretary'
      return {
        ...r,
        stream: user.stream || 'JEE',
        email: user.email || `${(r.internName || 'scholar').toLowerCase().replace(/\s+/g, '.')}@dakshana.org`,
        batch: r.batch || user.batch || 'Batch 1',
        juniorSecId: jsecId,
        supervisorName: supervisorName,
        hoursContributed: Number(r.hoursContributed) || 0
      }
    })
  }, [reports, usersMap])

  // Apply Multi-Dimensional Filters
  const filteredReports = useMemo(() => {
    return enrichedReports.filter(r => {
      // Month Filter
      if (selectedMonth !== 'all' && r.monthYear !== selectedMonth) return false
      // Batch Filter
      if (selectedBatch !== 'all' && r.batch !== selectedBatch) return false
      // Stream Filter (JEE / NEET)
      if (selectedStream !== 'all' && String(r.stream).toUpperCase() !== selectedStream.toUpperCase()) return false
      // Junior Secretary Filter
      if (selectedJuniorSec !== 'all') {
        const matchId = r.juniorSecId === selectedJuniorSec
        const matchName = (r.supervisorName || '').toLowerCase().includes(selectedJuniorSec.toLowerCase())
        if (!matchId && !matchName) return false
      }
      // Status Filter
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = (r.internName || '').toLowerCase().includes(q)
        const matchTasks = (r.tasksCompleted || '').toLowerCase().includes(q)
        const matchChallenges = (r.challengesFaced || '').toLowerCase().includes(q)
        const matchSupervisor = (r.supervisorName || '').toLowerCase().includes(q)
        if (!matchName && !matchTasks && !matchChallenges && !matchSupervisor) return false
      }
      return true
    })
  }, [enrichedReports, selectedMonth, selectedBatch, selectedStream, selectedJuniorSec, selectedStatus, searchQuery])

  // Aggregate Key Performance Metrics
  const metrics = useMemo(() => {
    const totalReports = filteredReports.length
    const totalHours = filteredReports.reduce((acc, curr) => acc + curr.hoursContributed, 0)
    const avgHours = totalReports > 0 ? (totalHours / totalReports).toFixed(1) : 0
    const reviewedCount = filteredReports.filter(r => r.status === 'reviewed').length
    const reviewRate = totalReports > 0 ? Math.round((reviewedCount / totalReports) * 100) : 0

    // Stream distribution
    const jeeReports = filteredReports.filter(r => r.stream === 'JEE')
    const neetReports = filteredReports.filter(r => r.stream === 'NEET')
    const jeeHours = jeeReports.reduce((acc, curr) => acc + curr.hoursContributed, 0)
    const neetHours = neetReports.reduce((acc, curr) => acc + curr.hoursContributed, 0)

    return {
      totalReports,
      totalHours,
      avgHours,
      reviewedCount,
      reviewRate,
      jeeCount: jeeReports.length,
      neetCount: neetReports.length,
      jeeHours,
      neetHours
    }
  }, [filteredReports])

  // AI-Driven Executive Synthesis Generator (Dynamic to active filters)
  const executiveSynthesis = useMemo(() => {
    if (filteredReports.length === 0) {
      return {
        headline: 'No reports match current filter criteria.',
        narrative: 'Adjust your month, batch, or stream filters above to display cohort progress and AI synthesis.',
        achievements: [],
        challenges: [],
        recommendation: 'Expand filter parameters to view outreach data.'
      }
    }

    const activeJsec = juniorSecretaries.find(j => j.id === selectedJuniorSec)
    const cohortLabel = [
      selectedMonth !== 'all' ? selectedMonth : 'All Recorded Cycles',
      selectedBatch !== 'all' ? selectedBatch : 'Combined Batches (1 & 2)',
      selectedStream !== 'all' ? `${selectedStream} Stream` : 'Both JEE & NEET Streams',
      selectedJuniorSec !== 'all' ? (activeJsec ? `${activeJsec.name}'s Wing` : 'Specific Wing') : 'All Junior Secretaries'
    ].join(' • ')

    // Extract achievements
    const achievements = filteredReports
      .map(r => r.tasksCompleted)
      .filter(Boolean)
      .slice(0, 4)

    // Extract challenges
    const challenges = filteredReports
      .map(r => r.challengesFaced)
      .filter(Boolean)
      .slice(0, 3)

    // Synthesize Executive Narrative
    const narrative = `Across ${cohortLabel}, ${metrics.totalReports} outreach scholar(s) logged a cumulative ${metrics.totalHours} hours of fieldwork (averaging ${metrics.avgHours} hours/scholar). With an official review completion rate of ${metrics.reviewRate}%, scholars successfully delivered STEM workshops across assigned schools, sustaining strong classroom engagement and student mentorship.`

    return {
      cohortLabel,
      headline: `${cohortLabel} — Strategic Fieldwork Review`,
      narrative,
      achievements: achievements.length > 0 ? achievements : ['Conducted foundational student sessions in rural partner schools.'],
      challenges: challenges.length > 0 ? challenges : ['Weather-related attendance fluctuations and school examination timetables.'],
      recommendation: metrics.reviewRate < 100
        ? `Expedite review for ${metrics.totalReports - metrics.reviewedCount} pending monthly report(s) before closing financial stipend approvals.`
        : 'All submitted reports in this view have been formally reviewed and verified.'
    }
  }, [filteredReports, selectedMonth, selectedBatch, selectedStream, selectedJuniorSec, juniorSecretaries, metrics])

  // Copy Executive Summary to Clipboard
  const handleCopySummary = () => {
    const textToCopy = `DAKSHANA OUTREACH INTERNSHIP — EXECUTIVE PROGRESS SUMMARY
${executiveSynthesis.headline}
--------------------------------------------------
Cohort Overview:
${executiveSynthesis.narrative}

Key Accomplishments:
${executiveSynthesis.achievements.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Field Bottlenecks & Challenges:
${executiveSynthesis.challenges.map((c, i) => `• ${c}`).join('\n')}

Administrative Recommendation:
${executiveSynthesis.recommendation}

Generated via Dakshana Progress Intelligence Hub.`

    navigator.clipboard.writeText(textToCopy)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2500)
  }

  // --- 1-Click Excel (.CSV) Export with UTF-8 BOM ---
  const handleExportExcel = () => {
    if (filteredReports.length === 0) {
      alert('No reports available under current filter to export.')
      return
    }

    const headers = [
      'Scholar Name',
      'Scholar Email',
      'Internship Batch',
      'Stream (JEE/NEET)',
      'Assigned Junior Secretary',
      'Reporting Cycle (Month/Year)',
      'Hours Contributed',
      'Tasks Completed & Activities',
      'Key Challenges Faced',
      'Next Month Goals',
      'Review Status',
      'Reviewed By',
      'Reviewer Feedback',
      'Last Updated'
    ]

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""'
      const sanitized = String(str).replace(/"/g, '""').replace(/[\r\n]+/g, ' ')
      return `"${sanitized}"`
    }

    const rows = filteredReports.map(r => [
      escapeCsv(r.internName),
      escapeCsv(r.email),
      escapeCsv(r.batch),
      escapeCsv(r.stream),
      escapeCsv(r.supervisorName),
      escapeCsv(r.monthYear),
      r.hoursContributed,
      escapeCsv(r.tasksCompleted),
      escapeCsv(r.challengesFaced || 'None reported'),
      escapeCsv(r.nextMonthGoals || 'Continuous outreach'),
      escapeCsv(r.status === 'reviewed' ? 'Reviewed & Approved' : r.status === 'revision_requested' ? 'Revision Needed' : 'Pending Review'),
      escapeCsv(r.reviewedBy || 'Pending'),
      escapeCsv(r.reviewerFeedback || 'No feedback yet'),
      escapeCsv(r.updatedAt || '2026-10-15')
    ])

    // Prepend UTF-8 BOM (\uFEFF) so Excel properly recognizes Unicode
    const csvString = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    const sanitizeFilenamePart = (s) => s.replace(/[^a-zA-Z0-9]/g, '_')
    const activeJsecName = juniorSecretaries.find(j => j.id === selectedJuniorSec)?.name || selectedJuniorSec
    const filename = `Dakshana_Progress_Report_${sanitizeFilenamePart(selectedMonth)}_${sanitizeFilenamePart(selectedBatch)}_${sanitizeFilenamePart(selectedStream)}_${sanitizeFilenamePart(activeJsecName)}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Toggle Simulated AI Polish for individual report
  const togglePolishReport = (reportId) => {
    setPolishedReportIds(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }))
  }

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & EXPORT ACTION                                   */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-emerald-100 text-xs font-bold mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Progress Intelligence & Report Synthesizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Outreach Progress Analytics
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl font-medium leading-relaxed">
              Synthesize monthly outreach achievements, inspect stream-specific milestones (JEE & NEET), and extract filtered progress reports into structured Excel spreadsheets.
            </p>
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-[#074D2D] font-extrabold text-xs sm:text-sm flex items-center shadow-lg hover:shadow-xl transition-all cursor-pointer flex-shrink-0 group"
            title="Download filtered reports as Microsoft Excel compatible CSV file"
          >
            <Download className="w-4 h-4 mr-2 text-[#0A643B] group-hover:-translate-y-0.5 transition-transform" />
            <span>Export to Excel ({filteredReports.length})</span>
          </button>
        </div>

        {/* Live KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/20">
          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
            <span className="text-[11px] text-emerald-100 font-bold block uppercase tracking-wider">Filtered Scholars</span>
            <span className="text-2xl font-black text-white mt-0.5 block">{metrics.totalReports}</span>
            <span className="text-[10px] text-emerald-200">Across active criteria</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
            <span className="text-[11px] text-emerald-100 font-bold block uppercase tracking-wider">Fieldwork Hours</span>
            <span className="text-2xl font-black text-white mt-0.5 block">{metrics.totalHours} hrs</span>
            <span className="text-[10px] text-emerald-200">Avg {metrics.avgHours} hrs/scholar</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
            <span className="text-[11px] text-emerald-100 font-bold block uppercase tracking-wider">Stream Balance</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-[#0A643B]/60 border border-emerald-300/40">
                JEE: {metrics.jeeCount}
              </span>
              <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-[#7B2E68]/60 border border-purple-300/40">
                NEET: {metrics.neetCount}
              </span>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3 border border-white/20">
            <span className="text-[11px] text-emerald-100 font-bold block uppercase tracking-wider">Review Sign-Off</span>
            <span className="text-2xl font-black text-amber-300 mt-0.5 block">{metrics.reviewRate}%</span>
            <span className="text-[10px] text-emerald-200">{metrics.reviewedCount} of {metrics.totalReports} verified</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MULTI-DIMENSIONAL FILTER CONTROLS BAR                       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-sm">
            <Filter className="w-4 h-4 text-[#0A643B]" />
            <span>Multi-Dimensional Filters:</span>
          </div>

          {/* View Mode Toggle: Grid vs Dense Table */}
          <div className="flex items-center space-x-2 self-start lg:self-auto">
            <span className="text-xs text-slate-400 font-bold mr-1">Display:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>

        </div>

        {/* Filter Dropdowns Grid (5 Multi-Dimensional Filters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          
          {/* A. Month Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
              <span>Reporting Month</span>
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            >
              <option value="all">All Available Cycles</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* B. Batch Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
              <span>Internship Batch</span>
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            >
              <option value="all">All Batches (1 & 2)</option>
              <option value="Batch 1">Batch 1</option>
              <option value="Batch 2">Batch 2</option>
            </select>
          </div>

          {/* C. Stream Filter (JEE / NEET) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-[#7B2E68]" />
              <span>Scholar Stream</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedStream('all')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold cursor-pointer transition-colors text-center ${
                  selectedStream === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedStream('JEE')}
                className={`py-1.5 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-colors text-center ${
                  selectedStream === 'JEE' ? 'bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                JEE
              </button>
              <button
                type="button"
                onClick={() => setSelectedStream('NEET')}
                className={`py-1.5 px-2 rounded-lg text-xs font-extrabold cursor-pointer transition-colors text-center ${
                  selectedStream === 'NEET' ? 'bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                NEET
              </button>
            </div>
          </div>

          {/* D. Junior Secretary Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
              <span>Junior Secretary</span>
            </label>
            <select
              value={selectedJuniorSec}
              onChange={(e) => setSelectedJuniorSec(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            >
              <option value="all">All Junior Secretaries</option>
              {juniorSecretaries.map(jsec => (
                <option key={jsec.id} value={jsec.id}>
                  {jsec.name}
                </option>
              ))}
            </select>
          </div>

          {/* E. Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
              <span>Review Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="reviewed">Reviewed & Approved</option>
              <option value="submitted">Pending Review</option>
              <option value="revision_requested">Revision Requested</option>
            </select>
          </div>

        </div>

        {/* Search Bar + Reset */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scholar, supervisor, school or keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            />
          </div>

          {(selectedMonth !== 'all' || selectedBatch !== 'all' || selectedStream !== 'all' || selectedJuniorSec !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMonth('all')
                setSelectedBatch('all')
                setSelectedStream('all')
                setSelectedJuniorSec('all')
                setSelectedStatus('all')
                setSearchQuery('')
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer transition-colors self-end sm:self-auto"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. AI EXECUTIVE SYNTHESIS PANEL ("UNDERSTANDING PURPOSE")       */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A4D2D] rounded-3xl p-6 text-white shadow-lg space-y-4 border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-700/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">
                Executive Synthesis & Cohort Intelligence
              </h3>
              <p className="text-[11px] text-slate-300">
                Automated synthesis across active filters for Board Meetings and Leadership Circulars
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer border border-white/20"
            title="Copy formatted summary to clipboard"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Narrative Box */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            {executiveSynthesis.headline}
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed">
            {executiveSynthesis.narrative}
          </p>
        </div>

        {/* Two-Column Breakdown: Accomplishments vs Bottlenecks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          {/* Key Accomplishments */}
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <span className="font-extrabold text-emerald-300 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
              Cohort Accomplishments
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {executiveSynthesis.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Field Bottlenecks & Challenges */}
          <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30 space-y-2">
            <span className="font-extrabold text-rose-300 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
              Fieldwork Bottlenecks Identified
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              {executiveSynthesis.challenges.map((chl, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{chl}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Administrative Action Footer */}
        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="italic">
            💡 {executiveSynthesis.recommendation}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Synced with Supabase Cloud
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FILTERED REPORTS DISPLAY (CARDS OR TABLE VIEW)               */}
      {/* ============================================================== */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">No Matching Progress Reports</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No scholars or progress reports match the selected filters ({selectedMonth}, {selectedBatch}, {selectedStream}, {selectedJuniorSec !== 'all' ? (juniorSecretaries.find(j => j.id === selectedJuniorSec)?.name || 'Specific Junior Secretary') : 'All Supervisors'}). Try broadening your filter selection.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW (Interactive Scholar Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const isPolished = Boolean(polishedReportIds[report.id])
            const isExpanded = expandedReportId === report.id

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-[#0A643B]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                {/* Scholar Header */}
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={report.photo}
                        name={report.internName}
                        role="intern"
                        size="md"
                        className="flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h4 className="font-extrabold text-slate-900 text-sm">
                            {report.internName}
                          </h4>
                          <StreamBadge stream={report.stream} size="xs" />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {report.batch} • {report.monthYear}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex-shrink-0 ${
                        report.status === 'reviewed'
                          ? 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30'
                          : report.status === 'revision_requested'
                          ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {report.status === 'reviewed'
                        ? '✓ Reviewed & Approved'
                        : report.status === 'revision_requested'
                        ? '⚠️ Revision Needed'
                        : '⏳ Pending Review'}
                    </span>
                  </div>

                  {/* Fieldwork Metrics Pill */}
                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[11px] flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#0A643B]" />
                      <span>{report.hoursContributed} hrs contributed</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Supervisor: <span className="text-slate-700 font-semibold">{report.supervisorName}</span>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500">
                      <span>Tasks Executed</span>
                      <button
                        onClick={() => togglePolishReport(report.id)}
                        className="text-[#0A643B] hover:text-[#074D2D] font-bold flex items-center space-x-0.5 cursor-pointer"
                        title="Toggle AI polished professional phrasing"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{isPolished ? 'Show Original' : '✨ AI Polish'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {isPolished
                        ? `[Executive Phrasing]: Successfully orchestrated ${report.tasksCompleted.toLowerCase()} Ensuring strong classroom pedagogical continuity under Dakshana guidelines.`
                        : report.tasksCompleted}
                    </p>
                  </div>

                  {/* Challenges & Next Month Goals (Expandable) */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100 text-xs animate-in fade-in duration-150">
                      {report.challengesFaced && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700">Challenges Faced:</span>
                          <p className="text-[11px] mt-0.5">{report.challengesFaced}</p>
                        </div>
                      )}
                      {report.nextMonthGoals && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-[#0A643B]">Next Month Goals:</span>
                          <p className="text-[11px] mt-0.5">{report.nextMonthGoals}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Pill if available */}
                  {report.reviewerFeedback && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/20 text-[11px] text-[#0A643B] font-medium">
                      <strong>Reviewed by {report.reviewedBy}:</strong> {report.reviewerFeedback}
                    </div>
                  )}
                </div>

                {/* Card Toggle Button */}
                <button
                  onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                  className="w-full mt-2 py-1.5 text-center text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>{isExpanded ? 'Hide Details' : 'View Challenges & Goals'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            )
          })}
        </div>

      ) : (

        /* DENSE TABLE VIEW (Auditing & Spreadsheet Style) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Scholar</th>
                  <th className="py-3 px-3">Batch & Stream</th>
                  <th className="py-3 px-3">Month</th>
                  <th className="py-3 px-3">Hours</th>
                  <th className="py-3 px-4">Tasks Executed</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Avatar src={report.photo} name={report.internName} role="intern" size="sm" />
                        <div>
                          <span className="font-extrabold text-slate-900 block">{report.internName}</span>
                          <span className="text-[10px] text-slate-400">{report.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {report.batch}
                        </span>
                        <StreamBadge stream={report.stream} size="xs" />
                      </div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-600">
                      {report.monthYear}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap font-extrabold text-[#0A643B]">
                      {report.hoursContributed} hrs
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate" title={report.tasksCompleted}>
                      {report.tasksCompleted}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          report.status === 'reviewed'
                            ? 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30'
                            : report.status === 'revision_requested'
                            ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {report.status === 'reviewed' ? 'Approved' : report.status === 'revision_requested' ? 'Revision' : 'Pending'}
                      </span>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                      {report.supervisorName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  )
}
