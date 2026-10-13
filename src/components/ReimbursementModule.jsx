import React, { useState } from 'react'
import { DollarSign, ToggleLeft, ToggleRight, CheckCircle2, Clock, Send, Check, CreditCard, ShieldCheck } from 'lucide-react'

export default function ReimbursementModule({ currentUser, cycle, onToggleCycle, claims, onSubmitClaim, onUpdateClaimStatus }) {
  const isAuthority = currentUser.role === 'senior_sec' || currentUser.role === 'management'
  
  const [claimAmount, setClaimAmount] = useState('3000')
  const [upiDetails, setUpiDetails] = useState('')
  const [purpose, setPurpose] = useState('Monthly scholar stipend + local commute')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalClaimed = claims.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const approvedTotal = claims.filter(c => c.status === 'approved' || c.status === 'paid').reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const paidTotal = claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + Number(c.amount || 0), 0)

  const internClaims = claims.filter(c => c.internId === currentUser.id)

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
      onSubmitClaim(newClaim)
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
        return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30"><Clock className="w-3.5 h-3.5 mr-1" /> Pending Approval</span>
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
              <span>Dakshana Scholar Stipends & Field Reimbursements</span>
            </div>
            <h2 className="text-2xl font-bold">Disbursement & Expense Portal</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Cycle: {cycle.monthYear} • Base Stipend Standard: ₹{cycle.stipendStandard.toLocaleString()}
            </p>
          </div>

          {/* Authority Toggle Switch (Senior Sec & Management only) */}
          {isAuthority && (
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center space-x-3">
              <div>
                <span className="text-[11px] uppercase font-bold text-emerald-200 block">Cycle Window</span>
                <span className="font-bold text-xs">{cycle.isActive ? 'Active (Open for claims)' : 'Closed / Paused'}</span>
              </div>
              <button
                onClick={onToggleCycle}
                className={`p-1 rounded-full transition-colors cursor-pointer ${cycle.isActive ? 'text-emerald-300' : 'text-slate-300'}`}
                title="Toggle reimbursement window open/closed"
              >
                {cycle.isActive ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
              </button>
            </div>
          )}
        </div>

        {/* Aggregate Financial Metrics for Leadership */}
        {isAuthority && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20 text-center sm:text-left">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Total Claims Received</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">₹{totalClaimed.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">{claims.length} scholar claims</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Approved for Payout</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">₹{approvedTotal.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">Cleared by Senior Secretary</span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10">
              <span className="text-xs text-emerald-200 block">Successfully Disbursed</span>
              <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">₹{paidTotal.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-200">Direct UPI / Bank credited</span>
            </div>
          </div>
        )}
      </div>

      {/* Intern Perspective: Submit Claim or View Status */}
      {currentUser.role === 'intern' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center">
              <DollarSign className="w-5 h-5 mr-1.5 text-[#0A643B]" />
              Claim Monthly Reimbursement ({cycle.monthYear})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your payout account details and breakdown of expenses or stipend.
            </p>

            {!cycle.isActive ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center">
                <span>The reimbursement window for this month has not been activated yet by the Senior Secretary. Please check back soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] font-semibold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Reimbursement claim submitted to Senior Secretary for review!
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Claim Amount (in ₹) *</label>
                  <input
                    required
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full text-sm font-semibold rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Standard monthly base is ₹{cycle.stipendStandard}.</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">UPI ID or Bank Account Details *</label>
                  <input
                    required
                    type="text"
                    value={upiDetails}
                    onChange={(e) => setUpiDetails(e.target.value)}
                    placeholder="e.g. name@okhdfcbank or Account + IFSC"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expense Breakdown / Notes *</label>
                  <textarea
                    rows={3}
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Stipend claim + details of any bus tickets, printing, or classroom supplies..."
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting ? 'Transmitting Claim...' : 'Submit Claim to Senior Secretary'}
                </button>
              </form>
            )}
          </div>

          {/* Intern Past Claims */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Your Payout History</h3>
            <p className="text-xs text-slate-500 mb-4">Past monthly claims and settlement confirmations</p>

            <div className="space-y-3">
              {internClaims.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No claims submitted for this period yet.
                </div>
              ) : (
                internClaims.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">₹{c.amount.toLocaleString()}</span>
                        <span className="text-slate-500 ml-2">({c.monthYear})</span>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>
                    <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">{c.purpose}</p>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                      <span>Payout Target: <strong>{c.upiOrBank}</strong></span>
                      {c.approvedBy && <span className="text-[#0A643B] font-semibold">Approved by {c.approvedBy}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leadership Table (Senior Sec & Management) */}
      {isAuthority && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-[#0A643B]" />
                Scholar Stipend & Expense Ledger ({claims.length})
              </h3>
              <p className="text-xs text-slate-500">Authorized approval and disbursement pipeline</p>
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
                {claims.map((claim) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
