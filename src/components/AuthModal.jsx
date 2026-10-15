import React, { useState } from 'react'
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  X,
  User,
  Phone,
  BookOpen,
  UserPlus,
  CheckCircle2,
  GraduationCap,
  Key,
  AlertTriangle,
  ChevronLeft,
  ShieldCheck,
  Building
} from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function AuthModal({ isOpen, onClose, allUsers, onLogin, onRegisterScholar }) {
  // Navigation step: 'gateway' | 'scholar' | 'leadership'
  const [step, setStep] = useState('gateway')
  
  // Scholar mode: 'signin' | 'signup'
  const [scholarMode, setScholarMode] = useState('signin')

  // Leadership unlock state
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [passkeyError, setPasskeyError] = useState('')

  // Common errors
  const [error, setError] = useState('')

  // Scholar Sign In state
  const [scholarEmail, setScholarEmail] = useState('')
  const [scholarPassword, setScholarPassword] = useState('')

  // Leadership Sign In state
  const [staffEmail, setStaffEmail] = useState('')
  const [staffPassword, setStaffPassword] = useState('')

  // Sign Up state (Strictly Outreach Scholar)
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpBatch, setSignUpBatch] = useState('Batch 1')
  const [signUpTrack, setSignUpTrack] = useState('Foundational Numeracy')
  const [signUpPhone, setSignUpPhone] = useState('')
  const [signUpSec, setSignUpSec] = useState('user-jsec-1')
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')
  const internUsers = allUsers.filter(u => u.role === 'intern')
  const leadershipUsers = allUsers.filter(u => u.role !== 'intern')

  const handleResetAndClose = () => {
    setError('')
    setPasskeyError('')
    setPasskey('')
    setIsUnlocked(false)
    setStep('gateway')
    onClose()
  }

  // --- Gateway Selection Handlers ---
  const handleSelectScholarPortal = () => {
    setError('')
    setStep('scholar')
    setScholarMode('signin')
  }

  const handleSelectLeadershipPortal = () => {
    setError('')
    setPasskeyError('')
    setStep('leadership')
  }

  // --- Leadership Passkey Verification ---
  const handleVerifyPasskey = (e) => {
    e.preventDefault()
    const trimmed = passkey.trim()
    if (trimmed === 'dakshana2026' || trimmed === 'Dakshana2026' || trimmed === 'admin2026') {
      setIsUnlocked(true)
      setPasskeyError('')
    } else {
      setPasskeyError('Invalid passkey. Access is strictly restricted to authorized Dakshana secretariat staff.')
    }
  }

  // --- Scholar Login Handler ---
  const handleScholarLogin = (e) => {
    e.preventDefault()
    const foundUser = internUsers.find(u => u.email.toLowerCase() === scholarEmail.trim().toLowerCase())
    if (foundUser) {
      onLogin(foundUser)
      handleResetAndClose()
    } else {
      setError('No scholar account found with this email. Please check your email or click "Register New Scholar".')
    }
  }

  // --- Leadership Login Handler ---
  const handleStaffLogin = (e) => {
    e.preventDefault()
    const foundUser = leadershipUsers.find(u => u.email.toLowerCase() === staffEmail.trim().toLowerCase())
    if (foundUser) {
      onLogin(foundUser)
      handleResetAndClose()
    } else {
      setError('Staff profile not found with this email. Select an authorized profile below.')
    }
  }

  // --- Quick Login Handler ---
  const handleQuickLogin = (user) => {
    onLogin(user)
    handleResetAndClose()
  }

  // --- New Scholar Sign-Up (Strictly Intern) ---
  const handleScholarSignUp = async (e) => {
    e.preventDefault()
    if (!signUpName || !signUpEmail) return

    // Check if email already exists
    const existing = allUsers.find(u => u.email.toLowerCase() === signUpEmail.trim().toLowerCase())
    if (existing) {
      setError('An account with this email already exists! Please sign in.')
      return
    }

    setIsSubmitting(true)
    setError('')

    // Strictly Outreach Scholar (intern role) - no leadership creation possible
    const newScholar = {
      name: signUpName.trim(),
      title: 'Outreach Scholar',
      email: signUpEmail.trim().toLowerCase(),
      phone: signUpPhone.trim(),
      role: 'intern', // Strict: always intern
      batch: signUpBatch,
      assignedTo: signUpSec,
      department: signUpTrack,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: `${signUpBatch} Scholar • Focus on ${signUpTrack}.`
    }

    try {
      const createdScholar = await onRegisterScholar(newScholar)
      const userToLogin = createdScholar || newScholar
      setSignUpSuccess(true)
      setTimeout(() => {
        onLogin(userToLogin)
        setSignUpSuccess(false)
        setIsSubmitting(false)
        handleResetAndClose()
      }, 500)
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Registration error: ' + (err.message || 'Please check connection and try again.'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <img src={logoImg} className="w-8 h-8 rounded-full border border-[#0A643B]/30 object-cover" alt="" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dakshana Outreach Portal</h3>
              <p className="text-[11px] text-slate-500">
                {step === 'gateway' && 'Select Your Access Portal'}
                {step === 'scholar' && (scholarMode === 'signin' ? 'Scholar Portal Sign-In' : 'New Scholar Registration')}
                {step === 'leadership' && (!isUnlocked ? 'Secretariat Access Verification' : 'Leadership & Command Center')}
              </p>
            </div>
          </div>
          <button onClick={handleResetAndClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* SCREEN 1: GATEWAY (Are you an intern or leadership?)     */}
        {/* ======================================================== */}
        {step === 'gateway' && (
          <div className="py-4 space-y-4">
            <div className="text-center py-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A643B] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#0A643B]/20">
                Welcome to Dakshana
              </span>
              <h4 className="text-lg font-extrabold text-slate-900 mt-2">
                Are you an Outreach Intern or Secretariat Staff?
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Please select your entry portal below to continue to your dashboard.
              </p>
            </div>

            <div className="space-y-3">
              
              {/* Option 1: Outreach Scholar Portal */}
              <button
                type="button"
                onClick={handleSelectScholarPortal}
                className="w-full text-left p-4 rounded-2xl border-2 border-[#0A643B]/30 hover:border-[#0A643B] bg-gradient-to-r from-emerald-50/70 to-teal-50/50 hover:bg-emerald-50 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#0A643B] text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        I am an Outreach Intern / Scholar
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0A643B] text-white">
                        Batch 1 & 2
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Access monthly session logs, view school outreach reports, download templates, and submit expense reimbursement forms.
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#0A643B] flex items-center">
                      <span>Enter Scholar Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 2: Secretariat & Leadership Staff */}
              <button
                type="button"
                onClick={handleSelectLeadershipPortal}
                className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-[#7B2E68] bg-slate-50/60 hover:bg-purple-50/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#7B2E68] text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">
                        Secretariat & Leadership Staff
                      </span>
                      <span className="text-[10px] font-bold text-[#7B2E68] bg-[#F8EDF5] border border-[#7B2E68]/30 px-2 py-0.5 rounded-full flex items-center">
                        <Lock className="w-3 h-3 mr-1" /> Protected
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Reserved for Senior Secretary, Junior Secretaries, and Trustees. Passkey required to access supervisory controls.
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#7B2E68] flex items-center">
                      <span>Enter Leadership Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>

            </div>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              Dakshana Outreach Internship Program • Protected Multi-Role Gateway
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: SCHOLAR PORTAL (Sign In & Registration)        */}
        {/* ======================================================== */}
        {step === 'scholar' && (
          <div className="py-2">
            
            {/* Back button */}
            <button
              type="button"
              onClick={() => { setStep('gateway'); setError('') }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Portal Selection
            </button>

            {/* Tab Toggle: Scholar Sign In vs New Scholar Registration */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setScholarMode('signin'); setError('') }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  scholarMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Scholar Sign In
              </button>
              <button
                type="button"
                onClick={() => { setScholarMode('signup'); setError('') }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  scholarMode === 'signup' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register New Scholar
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {signUpSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-xs font-semibold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Scholar account registered! Entering dashboard...
              </div>
            )}

            {/* Scholar Mode: SIGN IN */}
            {scholarMode === 'signin' && (
              <div>
                <form onSubmit={handleScholarLogin} className="space-y-3 mb-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Scholar Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={scholarEmail}
                        onChange={(e) => setScholarEmail(e.target.value)}
                        placeholder="e.g. aarav.scholar@dakshana.org"
                        className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={scholarPassword}
                        onChange={(e) => setScholarPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                  >
                    Enter Scholar Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </form>

                {/* Quick Scholar Profile Selector (ONLY Interns, NO Leadership!) */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or select an Outreach Scholar profile:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs max-h-40 overflow-y-auto pr-1">
                    {internUsers.map(scholar => (
                      <button
                        key={scholar.id}
                        type="button"
                        onClick={() => handleQuickLogin(scholar)}
                        className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-left cursor-pointer flex items-center space-x-2 transition-colors"
                      >
                        <img src={scholar.photo} className="w-6 h-6 rounded-full object-cover flex-shrink-0" alt="" />
                        <div className="truncate">
                          <span className="block truncate font-bold text-[11px]">{scholar.name}</span>
                          <span className="block text-[9px] text-amber-700 font-normal">{scholar.batch || 'Batch 1'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scholar Mode: SIGN UP (Strictly Outreach Scholar, NO Role Selector) */}
            {scholarMode === 'signup' && (
              <form onSubmit={handleScholarSignUp} className="space-y-3 my-1 text-xs max-h-[380px] overflow-y-auto pr-1">
                
                {/* Safety Notice */}
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0A643B] text-[11px] flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Scholar Registration:</strong> You are registering as an Outreach Scholar. Supervisory and secretariat accounts are provisioned separately by administration.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholar Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Shruti Patel"
                      className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. shruti@dakshana.org"
                      className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assign Batch *</label>
                    <select
                      value={signUpBatch}
                      onChange={(e) => setSignUpBatch(e.target.value)}
                      className="w-full text-xs font-bold rounded-xl border border-slate-300 p-2.5 bg-white text-[#0A643B] focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    >
                      <option value="Batch 1">Batch 1</option>
                      <option value="Batch 2">Batch 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full text-xs rounded-xl border border-slate-300 pl-8 pr-2 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outreach Track / Field</label>
                  <input
                    type="text"
                    value={signUpTrack}
                    onChange={(e) => setSignUpTrack(e.target.value)}
                    placeholder="e.g. Foundational Numeracy, Science, Health"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Supervising Wing Lead *</label>
                  <select
                    value={signUpSec}
                    onChange={(e) => setSignUpSec(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  >
                    {juniorSecs.map((j) => (
                      <option key={j.id} value={j.id}>{j.name} ({j.department})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center mt-2 transition-all ${
                    isSubmitting ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-[#0A643B] hover:bg-[#074D2D] text-white cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'Registering Scholar in Cloud...' : 'Register as Outreach Scholar'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </form>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: LEADERSHIP PORTAL (Passkey Protected)          */}
        {/* ======================================================== */}
        {step === 'leadership' && (
          <div className="py-2">
            
            {/* Back button */}
            <button
              type="button"
              onClick={() => { setStep('gateway'); setError(''); setPasskeyError('') }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Portal Selection
            </button>

            {/* GATED PASSKEY SCREEN (If not unlocked) */}
            {!isUnlocked && (
              <div className="py-2 space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#F8EDF5] text-[#7B2E68] rounded-2xl flex items-center justify-center mx-auto mb-2 border border-[#7B2E68]/20">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Administrative Passkey Required
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Leadership, Senior Secretary, and Junior Secretary profiles are restricted to authorized personnel. Please enter your secretariat passkey.
                  </p>
                </div>

                {passkeyError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{passkeyError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyPasskey} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Administrative Passkey</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={passkey}
                        onChange={(e) => setPasskey(e.target.value)}
                        placeholder="Enter authorized passkey..."
                        className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Secretariat authorization passkey: <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">dakshana2026</code>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#7B2E68] hover:bg-[#5F2150] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                  >
                    Unlock Leadership Profiles <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </form>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  🔒 <strong>Strict Protection:</strong> Public users and interns cannot create or claim leadership accounts. Only designated coordinators holding authorized credentials may enter.
                </div>
              </div>
            )}

            {/* UNLOCKED LEADERSHIP PROFILES (After entering passkey) */}
            {isUnlocked && (
              <div className="space-y-4">
                
                <div className="p-2.5 rounded-xl bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-xs font-semibold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Secretariat Passkey Verified. Authorized Leadership Active.
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {error}
                  </div>
                )}

                {/* Quick Switch Authorized Profiles */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Authorized Leadership Role:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {leadershipUsers.map(staff => {
                      const isSenior = staff.role === 'senior_sec'
                      const isMgmt = staff.role === 'management'
                      return (
                        <button
                          key={staff.id}
                          type="button"
                          onClick={() => handleQuickLogin(staff)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center space-x-2 transition-all hover:shadow-xs ${
                            isSenior
                              ? 'border-[#0A643B]/40 bg-[#EBF7F0] text-[#0A643B] font-bold'
                              : isMgmt
                              ? 'border-[#7B2E68]/40 bg-[#F8EDF5] text-[#7B2E68] font-bold'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold'
                          }`}
                        >
                          <img src={staff.photo} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                          <div className="truncate">
                            <span className="block truncate font-bold text-xs">{staff.name}</span>
                            <span className="block text-[10px] opacity-80">{staff.title}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Email Sign In for Staff */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Or Sign In with Staff Email:
                  </p>
                  <form onSubmit={handleStaffLogin} className="space-y-2.5 text-xs">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        placeholder="e.g. senior.sec@dakshana.org"
                        className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#7B2E68] hover:bg-[#5F2150] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                    >
                      Sign In as Staff <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </form>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
                  🛡️ <strong>Safety Guarantee:</strong> All junior secretary and leadership accounts are provisioned via administrative channels. No public self-service registration is allowed for staff tiers.
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
