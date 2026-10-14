import React, { useState } from 'react'
import {
  DollarSign,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Clock,
  Send,
  Check,
  CreditCard,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Download,
  ExternalLink,
  Edit3,
  Calendar,
  AlertCircle,
  X,
  ChevronRight,
  Lock
} from 'lucide-react'

export default function ReimbursementModule({
  currentUser,
  cycle,
  onToggleCycle,
  onUpdateCycleSettings,
  claims = [],
  onSubmitClaim,
  onUpdateClaimStatus,
  delegatedPowers = {}
}) {
  const userPowers = currentUser.role === 'junior_sec' ? (delegatedPowers[currentUser.id] || {}) : {}
  const isAuthority = currentUser.role === 'senior_sec' || currentUser.role === 'management' || Boolean(userPowers.canManageReimbursements)

  // Edit Announcement Modal state
  const [isEditingNotice, setIsEditingNotice] = useState(false)
  const [editFormUrl, setEditFormUrl] = useState(cycle?.formUrl || 'https://bit.ly/Reimbursement_OutreachInternship')
  const [editDeadline, setEditDeadline] = useState(cycle?.deadline || '5th August (Expenses up to 31st July)')
  const [editMonthYear, setEditMonthYear] = useState(cycle?.monthYear || 'July - August 2026')
  const [editMessageText, setEditMessageText] = useState(cycle?.messageText || '')

  // Optional internal claim logging
  const [showInternalForm, setShowInternalForm] = useState(false)
  const [claimAmount, setClaimAmount] = useState('3000')
  const [upiDetails, setUpiDetails] = useState('')
  const [purpose, setPurpose] = useState('Google Form submitted • Field visits & stipend')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalClaimed = claims.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const approvedTotal = claims.filter(c => c.status === 'approved' || c.status === 'paid').reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const paidTotal = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount || 0), 0)

  const internClaims = claims.filter(c => c.internId === currentUser.id)

  const baseUrl = import.meta.env.BASE_URL || '/'
  const excelUrl = `${baseUrl}Expense_Report_Template.xlsx`
  const pdfUrl = `${baseUrl}Cash_Voucher_Template.pdf`
  const formUrl = cycle?.formUrl || 'https://bit.ly/Reimbursement_OutreachInternship'

  const handleSaveNoticeSettings = (e) => {
    e.preventDefault()
    if (onUpdateCycleSettings) {
      onUpdateCycleSettings({
        formUrl: editFormUrl,
        deadline: editDeadline,
        monthYear: editMonthYear,
        messageText: editMessageText
      })
    }
    setIsEditingNotice(false)
  }

  const handleOpenEdit = () => {
    setEditFormUrl(cycle?.formUrl || 'https://bit.ly/Reimbursement_OutreachInternship')
    setEditDeadline(cycle?.deadline || '5th August (Expenses up to 31st July)')
    setEditMonthYear(cycle?.monthYear || 'July - August 2026')
    setEditMessageText(cycle?.messageText || '')
    setIsEditingNotice(true)
  }

  const handleSubmitClaim = (e) => {
    e.preventDefault()
    if (!claimAmount || !upiDetails) return

    setIsSubmitting(true)
    const newClaim = {
      id: `clm-${Date.now()}`,
      internId: currentUser.id,
      internName: currentUser.name,
      monthYear: cycle.monthYear,
      amount: parseFloat(claimAmount),
      upiOrBank: upiDetails,
      purpose: purpose,
      status: 'pending',
      approvedBy: null,
      paidAt: null
    }

    setTimeout(() => {
      if (onSubmitClaim) onSubmitClaim(newClaim)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 4000)
    }, 400)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Disbursed (Paid)</span>
      case 'approved':
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200"><Check className="w-3.5 h-3.5 mr-1 text-blue-600" /> Approved by Sec</span>
      default:
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Verification</span>
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Reimbursement Banner with Dakshana Brand Gradient */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-100 text-xs font-semibold mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Dakshana Outreach Internship Reimbursement Portal</span>
            </div>
            <h2 className="text-2xl font-bold">Scholar Expense Claim & Disbursement Window</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Active Cycle: <span className="font-semibold text-white">{cycle.monthYear}</span> • Deadline: <span className="font-semibold text-amber-200">{cycle.deadline}</span>
            </p>
          </div>

          {/* Authority Controls (Senior Sec, Management & Delegated Junior Sec) */}
          {isAuthority && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenEdit}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center shadow-xs transition-colors cursor-pointer"
                title="Edit Announcement Message, Form Link & Deadline"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
                Edit Notice & Links
              </button>

              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-200 block">Cycle Status</span>
                  <span className="font-bold text-xs">{cycle.isActive ? 'Window Open' : 'Closed'}</span>
                </div>
                <button
                  onClick={onToggleCycle}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${cycle.isActive ? 'text-emerald-300' : 'text-slate-300'}`}
                  title="Toggle reimbursement window open/closed"
                >
                  {cycle.isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delegated Authority Notice if user is a Junior Secretary */}
        {currentUser.role === 'junior_sec' && isAuthority && (
          <div className="mt-4 pt-3 border-t border-white/20 text-xs text-emerald-200 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-300" />
            <span>You have been granted <strong>Special Reimbursement Management Powers</strong> by the Senior Secretary.</span>
          </div>
        )}

        {/* Aggregate Financial Metrics for Leadership */}
        {isAuthority && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20 text-center sm:text-left">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Total Claims Received</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">₹{totalClaimed.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">{claims.length} intern claim entries</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Approved for Payout</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">₹{approvedTotal.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">Verified by Secretariat</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Successfully Disbursed</span>
              <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">₹{paidTotal.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">Transferred to scholars</span>
            </div>
          </div>
        )}
      </div>

      {/* STATE 1: Reimbursement Window CLOSED */}
      {!cycle.isActive && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 text-amber-700">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Reimbursement Window is Currently Closed</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            The reimbursement cycle is closed at this time. Once activated by the Senior Secretary or Secretariat leadership, the official submission Google Form and downloadable templates will become available here.
          </p>
          {isAuthority && (
            <div className="mt-5">
              <button
                onClick={onToggleCycle}
                className="px-4 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center"
              >
                <ToggleRight className="w-4 h-4 mr-1.5" />
                Activate Reimbursement Window for Interns
              </button>
            </div>
          )}
        </div>
      )}

      {/* STATE 2: Reimbursement Window ACTIVE (Display Official Announcement, Google Form link, and Downloadable Templates) */}
      {cycle.isActive && (
        <div className="space-y-6">
          
          {/* Official Announcement Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            
            {/* Header with edit button for leadership */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-purple-50/50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0A643B] text-white flex items-center justify-center shadow-2xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    📢 Official Reimbursement Notice & Instructions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cycle: {cycle.monthYear} • Submissions verified and processed monthly
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30">
                  <span className="w-2 h-2 rounded-full bg-[#0A643B] animate-ping mr-1.5"></span>
                  Window Active
                </span>
                {isAuthority && (
                  <button
                    onClick={handleOpenEdit}
                    className="p-1.5 text-slate-500 hover:text-[#0A643B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center text-xs font-semibold"
                    title="Edit announcement message"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Announcement Body Content */}
            <div className="p-6 space-y-6">
              
              {/* Salutation & Intro */}
              <div className="space-y-3 text-slate-800 leading-relaxed text-sm">
                <p className="font-extrabold text-base text-[#0A643B]">
                  📢 Dear Interns,
                </p>
                <p>
                  Thank you for your valuable contribution in visiting schools and conducting outreach sessions for the <strong>Dakshana Foundation</strong>. Your efforts are helping deserving students learn about the Dakshana Scholarship Program.
                </p>
                <p>
                  To claim your reimbursement, please fill out the <strong>Outreach Internship Reimbursement Form 2026–27</strong>.
                </p>
              </div>

              {/* Big Action Callout: Reimbursement Google Form */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0A643B]/10 via-[#0A643B]/5 to-[#7B2E68]/10 border-2 border-[#0A643B]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-[#0A643B] uppercase tracking-wider">
                    <span>🔗 Official Google Form</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    Outreach Internship Reimbursement Form 2026–27
                  </h4>
                  <p className="text-xs text-slate-600 font-mono break-all">
                    {formUrl}
                  </p>
                </div>

                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center whitespace-nowrap cursor-pointer flex-shrink-0"
                >
                  <span>Open Reimbursement Form</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* Mandatory Template Files Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center">
                    <Download className="w-4 h-4 mr-1.5 text-[#0A643B]" />
                    Mandatory Submission Templates (Download Before Filling Form)
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">2 Files Available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Template 1: Expense Report Excel */}
                  <div className="p-4 rounded-xl border border-slate-200 hover:border-[#0A643B] bg-slate-50/70 hover:bg-emerald-50/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0A643B] flex items-center justify-center flex-shrink-0 border border-emerald-200">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">Expense Report Sheet</h5>
                          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            Microsoft Excel (.xlsx) • Visit Ledger
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        Fill in all school visit dates, kilometers, transport mode, and expense details. Mark each item as <strong>Billed</strong>, <strong>Unbilled</strong>, or <strong>Cash Voucher</strong>, then upload to the form.
                      </p>
                    </div>

                    <a
                      href={excelUrl}
                      download="Expense_Report_Template.xlsx"
                      className="w-full py-2 px-3 rounded-lg bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Expense Report (.xlsx)
                    </a>
                  </div>

                  {/* Template 2: Cash Voucher PDF */}
                  <div className="p-4 rounded-xl border border-slate-200 hover:border-[#7B2E68] bg-slate-50/70 hover:bg-purple-50/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#F8EDF5] text-[#7B2E68] flex items-center justify-center flex-shrink-0 border border-[#7B2E68]/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">Cash Voucher Template</h5>
                          <span className="text-[11px] text-[#7B2E68] font-semibold bg-[#F8EDF5] px-2 py-0.5 rounded-md inline-block mt-0.5">
                            Official PDF Format • Max ₹250 / Voucher
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        Required for cash payments without digital bills. Print & sign or fill digitally, and merge into your single bills PDF. Max ₹250 per voucher (use multiple vouchers for larger amounts).
                      </p>
                    </div>

                    <a
                      href={pdfUrl}
                      download="Cash_Voucher_Template.pdf"
                      className="w-full py-2 px-3 rounded-lg bg-[#7B2E68] hover:bg-[#5F2150] text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Cash Voucher (PDF)
                    </a>
                  </div>

                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center text-slate-900">
                  <span className="text-base mr-2">📌</span>
                  Important Instructions
                </h4>

                <ol className="space-y-3 text-xs text-slate-700 leading-relaxed list-none">
                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">1</span>
                    <div>
                      Submit this form <strong>only once per month</strong>, after completing all your school visits for that month.
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">2</span>
                    <div>
                      Include all approved school visit expenses incurred during the month in a single submission.
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">3</span>
                    <div>
                      <strong>Download the Expense Report Excel sheet</strong>, fill in all visit and expense details accurately, and upload the completed Excel sheet in the form.
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">4</span>
                    <div className="w-full">
                      <span>In the Expense Report Excel sheet, select the correct Expense Type for each expense:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-bold text-[#0A643B] block">✓ Billed</span>
                          <span className="text-[11px] text-slate-600">Expenses for which you have an official bill or tax invoice.</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-bold text-blue-700 block">✓ Unbilled</span>
                          <span className="text-[11px] text-slate-600">Expenses paid through UPI or digital transfer where no bill is available.</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="font-bold text-[#7B2E68] block">✓ Cash Voucher</span>
                          <span className="text-[11px] text-slate-600">Expenses paid in cash where no bill or digital receipt is available.</span>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">5</span>
                    <div>
                      <strong>Combine all your bills into a single PDF</strong>, including travel bills (Bus / Train / Taxi / Auto) and completed Cash Voucher(s) if applicable.
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">6</span>
                    <div>
                      <span><strong>For Cash Voucher expenses:</strong></span>
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600 text-[11px]">
                        <li>Download the Cash Voucher PDF provided above.</li>
                        <li>Take a printout, fill it and either take a clear photo/scan or fill it digitally.</li>
                        <li>Include all completed Cash Vouchers in the same bills PDF.</li>
                        <li><strong>Each Cash Voucher can be claimed for a maximum of ₹250.</strong> If your cash expense exceeds ₹250, use multiple Cash Vouchers and include all of them in the bills PDF.</li>
                      </ul>
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#0A643B] text-white font-bold flex items-center justify-center text-[10px] mt-0.5">7</span>
                    <div>
                      Enter your <strong>Internship Batch (Batch 1 / Batch 2)</strong>, <strong>Panel Number</strong>, and <strong>bank account details</strong> carefully. Reimbursement will be processed based on the details provided in the form.
                    </div>
                  </li>
                </ol>
              </div>

              {/* Deadline & Support Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3 text-xs">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-sm">Submission Deadline</span>
                    <p className="mt-0.5">
                      Please submit on or before <strong>{cycle.deadline}</strong> so that submissions can be verified and reimbursements processed at the earliest.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0A643B] flex items-start space-x-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#0A643B] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block text-sm">Questions or Assistance?</span>
                    <p className="mt-0.5 text-slate-700">
                      If you face any issues while filling out the form, contact your assigned Junior Secretary or Senior Secretary.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs font-bold text-slate-700">
                  Thank you once again for your dedication and support! 🌟
                </p>
              </div>

            </div>

          </div>

          {/* Optional Intern Tracking / Submission Confirmation Drawer */}
          {currentUser.role === 'intern' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Intern Claim Tracking</h4>
                  <p className="text-xs text-slate-500">Record that you have completed your Google Form submission or track verification status</p>
                </div>
                <button
                  onClick={() => setShowInternalForm(!showInternalForm)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  {showInternalForm ? 'Hide Claim Logger' : '+ Log My Form Submission'}
                </button>
              </div>

              {showInternalForm && (
                <form onSubmit={handleSubmitClaim} className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs">
                  {submitSuccess && (
                    <div className="p-3 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] font-semibold flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Submission log recorded! Your Junior & Senior Secretary will cross-verify with the Google Form.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Total Claim Amount Claimed in Form (in ₹) *</label>
                      <input
                        required
                        type="number"
                        value={claimAmount}
                        onChange={(e) => setClaimAmount(e.target.value)}
                        className="w-full text-sm font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">UPI ID or Bank Account entered in Form *</label>
                      <input
                        required
                        type="text"
                        value={upiDetails}
                        onChange={(e) => setUpiDetails(e.target.value)}
                        placeholder="e.g. name@upi or Account + IFSC"
                        className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Remarks / School Visit Summary</label>
                    <textarea
                      rows={2}
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Google Form submitted for 8 school visits in cluster 1..."
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2 px-4 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors flex items-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {isSubmitting ? 'Logging Submission...' : 'Record Form Submission in Portal'}
                  </button>
                </form>
              )}

              {/* Past scholar records */}
              {internClaims.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-800 text-xs">Your Recorded Submissions</h5>
                  {internClaims.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">₹{c.amount.toLocaleString()}</span>
                        <span className="text-slate-500 ml-2">({c.monthYear})</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{c.purpose}</p>
                      </div>
                      <div>
                        {getStatusBadge(c.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Leadership Table (Senior Sec, Management & Delegated Junior Sec) */}
      {isAuthority && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-[#0A643B]" />
                Scholar Stipend & Expense Ledger ({claims.length} entries)
              </h3>
              <p className="text-xs text-slate-500">Cross-verification against Google Form submissions & disbursement pipeline</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Scholar</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Account / UPI</th>
                  <th className="pb-3 font-semibold">Purpose & Notes</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500">
                      No claims currently recorded for this cycle.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900">
                        {claim.internName}
                        <span className="block text-[11px] font-normal text-slate-500">{claim.monthYear}</span>
                      </td>
                      <td className="py-3.5 font-extrabold text-[#0A643B] text-sm">
                        ₹{claim.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-mono text-slate-700">
                        {claim.upiOrBank}
                      </td>
                      <td className="py-3.5 text-slate-600 max-w-xs truncate" title={claim.purpose}>
                        {claim.purpose}
                      </td>
                      <td className="py-3.5">
                        {getStatusBadge(claim.status)}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {claim.status === 'pending' && (
                          <button
                            onClick={() => onUpdateClaimStatus(claim.id, 'approved', currentUser.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0A643B] hover:bg-[#074D2D] text-white font-semibold cursor-pointer shadow-2xs"
                          >
                            Approve
                          </button>
                        )}
                        {claim.status === 'approved' && (
                          <button
                            onClick={() => onUpdateClaimStatus(claim.id, 'paid', currentUser.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#7B2E68] hover:bg-[#5F2150] text-white font-semibold cursor-pointer shadow-2xs"
                          >
                            Mark Paid (Disburse)
                          </button>
                        )}
                        {claim.status === 'paid' && (
                          <span className="text-[#0A643B] font-bold text-[11px]">Settled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leadership Modal: Edit Announcement, Form Link & Deadline */}
      {isEditingNotice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#0A643B]" />
                <h3 className="font-bold text-slate-900 text-lg">Edit Reimbursement Announcement & Settings</h3>
              </div>
              <button
                onClick={() => setIsEditingNotice(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNoticeSettings} className="my-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Active Cycle Month/Period</label>
                  <input
                    type="text"
                    value={editMonthYear}
                    onChange={(e) => setEditMonthYear(e.target.value)}
                    placeholder="e.g. July - August 2026"
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Deadline Notice</label>
                  <input
                    type="text"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    placeholder="e.g. 5th August (expenses up to 31st July)"
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Reimbursement Form URL *</label>
                <input
                  required
                  type="url"
                  value={editFormUrl}
                  onChange={(e) => setEditFormUrl(e.target.value)}
                  placeholder="https://bit.ly/Reimbursement_OutreachInternship"
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Message & Custom Guidelines</label>
                <textarea
                  rows={8}
                  value={editMessageText}
                  onChange={(e) => setEditMessageText(e.target.value)}
                  placeholder="Paste or update the full official message to interns here..."
                  className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden leading-relaxed"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  This announcement will be displayed to all scholars across Batch 1 & Batch 2 when the window is active.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingNotice(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold cursor-pointer shadow-xs"
                >
                  Save & Publish Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
