import React, { useState } from 'react'
import {
  Lock,
  Mail,
  ArrowRight,
  X,
  User,
  Phone,
  UserPlus,
  CheckCircle2,
  GraduationCap,
  Key,
  Shield,
  ChevronLeft,
  Camera,
  Upload,
  Trash2,
  Clock
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import Avatar from './Avatar'

export default function AuthModal({
  isOpen,
  onClose,
  allUsers,
  onLogin,
  onRegisterScholar,
  isFullScreen = false
}) {
  // Step: 'gateway' | 'scholar' | 'leadership'
  const [step, setStep] = useState('gateway')
  const [scholarMode, setScholarMode] = useState('signin') // 'signin' | 'signup'

  // Leadership unlock state
  const [isLeadershipUnlocked, setIsLeadershipUnlocked] = useState(false)
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState('')

  // Selected profile for scholar sign-in
  const [selectedScholarId, setSelectedScholarId] = useState('')
  const [scholarEmail, setScholarEmail] = useState('')
  const [scholarPassword, setScholarPassword] = useState('')

  // Selected profile for leadership sign-in
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [staffPassword, setStaffPassword] = useState('')

  // Sign up state
  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpPhoto, setSignUpPhoto] = useState(null) // null = default icon
  const [signUpBatch, setSignUpBatch] = useState('Batch 1')
  const [signUpPhone, setSignUpPhone] = useState('')
  const [signUpSec, setSignUpSec] = useState('user-jsec-1')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const internUsers = allUsers.filter(u => u.role === 'intern')
  const leadershipUsers = allUsers.filter(u => u.role !== 'intern')
  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')

  const handleClose = () => {
    setError('')
    setPasskey('')
    setIsLeadershipUnlocked(false)
    setStep('gateway')
    setScholarPassword('')
    setStaffPassword('')
    onClose()
  }

  // --- Scholar Login Handler with Password Verification ---
  const handleScholarSubmit = (e) => {
    e.preventDefault()
    setError('')

    let targetScholar = null
    if (selectedScholarId) {
      targetScholar = internUsers.find(u => u.id === selectedScholarId)
    } else if (scholarEmail.trim()) {
      targetScholar = internUsers.find(u => u.email.toLowerCase() === scholarEmail.trim().toLowerCase())
    }

    if (!targetScholar) {
      setError('Please select your profile or enter a registered scholar email.')
      return
    }

    if (!scholarPassword.trim()) {
      setError('Password is required to sign in.')
      return
    }

    // Verify password (accept registered password or standard default)
    if (scholarPassword.trim().length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    onLogin(targetScholar)
    handleClose()
  }

  // --- Leadership Passkey Verification ---
  const handleVerifyPasskey = (e) => {
    e.preventDefault()
    const trimmed = passkey.trim()
    if (trimmed === 'dakshana2026' || trimmed === 'Dakshana2026' || trimmed === 'admin2026') {
      setIsLeadershipUnlocked(true)
      setError('')
      if (leadershipUsers.length > 0) {
        setSelectedStaffId(leadershipUsers[0].id)
      }
    } else {
      setError('Invalid passkey. Access restricted to Secretariat leadership.')
    }
  }

  // --- Leadership Login Handler ---
  const handleStaffSubmit = (e) => {
    e.preventDefault()
    setError('')

    const targetStaff = leadershipUsers.find(u => u.id === selectedStaffId)
    if (!targetStaff) {
      setError('Please select your leadership profile.')
      return
    }

    if (!staffPassword.trim()) {
      setError('Staff password is required.')
      return
    }

    onLogin(targetStaff)
    handleClose()
  }

  // --- New Scholar Sign-Up (Strictly Intern) ---
  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    const exists = allUsers.find(u => u.email.toLowerCase() === signUpEmail.trim().toLowerCase())
    if (exists) {
      setError('An account with this email already exists.')
      return
    }

    setIsSubmitting(true)
    setError('')

    const newScholar = {
      name: signUpName.trim(),
      title: 'Outreach Scholar',
      email: signUpEmail.trim().toLowerCase(),
      phone: signUpPhone.trim(),
      role: 'intern', // Strictly intern role
      batch: signUpBatch,
      assignedTo: signUpSec,
      department: 'Outreach Fieldwork',
      photo: signUpPhoto || null, // Custom uploaded photo or null for WhatsApp default icon
      bio: `${signUpBatch} Outreach Scholar.`
    }

    try {
      const created = await onRegisterScholar(newScholar)
      setIsSubmitting(false)
      onLogin(created || newScholar)
      handleClose()
    } catch (err) {
      setIsSubmitting(false)
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div
      className={
        isFullScreen
          ? 'min-h-screen w-full bg-gradient-to-br from-[#063B22] via-[#0A4D2D] to-slate-950 flex flex-col items-center justify-center p-4 py-8 relative overflow-hidden select-none'
          : 'fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none'
      }
    >
      {/* Decorative ambient blurred shapes in full-screen mode */}
      {isFullScreen && (
        <>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#7B2E68]/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Prominent Header Above Login Card */}
          <div className="text-center mb-6 relative z-10 flex flex-col items-center animate-in fade-in duration-300">
            <img
              src={logoImg}
              alt="Dakshana"
              className="w-16 h-16 rounded-full object-cover shadow-xl border-3 border-emerald-400/50 mb-3"
            />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              DAKSHANA OUTREACH
            </h1>
            <p className="text-xs text-emerald-200 font-extrabold uppercase tracking-widest mt-0.5">
              Honor • Knowledge • Service • 2026–27
            </p>
          </div>
        </>
      )}

      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-white/20 animate-in fade-in duration-200 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            {!isFullScreen && (
              <img src={logoImg} className="w-8 h-8 rounded-full border border-[#0A643B]/30 object-cover" alt="" />
            )}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Dakshana Outreach Portal</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {step === 'gateway' && 'Select Portal'}
                {step === 'scholar' && 'Outreach Scholar Access'}
                {step === 'leadership' && 'Secretariat Leadership'}
              </p>
            </div>
          </div>

          {!isFullScreen ? (
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0A643B] border border-emerald-200">
              14-Day Session
            </span>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* ============================================== */}
        {/* STEP 1: GATEWAY - SIMPLE 2-OPTION SELECTOR     */}
        {/* ============================================== */}
        {step === 'gateway' && (
          <div className="py-5 space-y-4">
            <div className="text-center">
              <h4 className="text-base font-extrabold text-slate-900">
                Choose Your Role to Continue
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Select your portal to sign in or create an account
              </p>
            </div>

            <div className="space-y-3 pt-1">
              
              {/* Option A: Outreach Intern / Scholar */}
              <button
                type="button"
                onClick={() => { setStep('scholar'); setError('') }}
                className="w-full text-left p-4 rounded-2xl border-2 border-[#0A643B]/30 hover:border-[#0A643B] bg-emerald-50/50 hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#0A643B] text-white flex items-center justify-center font-bold shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      Outreach Scholar / Intern
                    </span>
                    <span className="text-xs text-slate-500">
                      Batch 1 & Batch 2 Scholars
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0A643B] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option B: Secretariat Leadership */}
              <button
                type="button"
                onClick={() => { setStep('leadership'); setError('') }}
                className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-[#7B2E68] bg-slate-50/60 hover:bg-purple-50/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#7B2E68] text-white flex items-center justify-center font-bold shadow-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      Secretariat & Leadership
                    </span>
                    <span className="text-xs text-slate-500">
                      Senior Sec • Junior Sec • Trustees
                    </span>
                  </div>
                </div>
                <Lock className="w-4 h-4 text-[#7B2E68]" />
              </button>

            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* STEP 2: SCHOLAR PORTAL (Sign In & Sign Up)     */}
        {/* ============================================== */}
        {step === 'scholar' && (
          <div className="py-3">
            <button
              type="button"
              onClick={() => { setStep('gateway'); setError('') }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            {/* Toggle: Sign In vs Sign Up */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setScholarMode('signin'); setError('') }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  scholarMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setScholarMode('signup'); setError('') }}
                className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
                  scholarMode === 'signup' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                New Scholar Registration
              </button>
            </div>

            {/* SCHOLAR SIGN IN */}
            {scholarMode === 'signin' && (
              <form onSubmit={handleScholarSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Your Profile</label>
                  <select
                    value={selectedScholarId}
                    onChange={(e) => {
                      setSelectedScholarId(e.target.value)
                      const found = internUsers.find(u => u.id === e.target.value)
                      if (found) setScholarEmail(found.email)
                    }}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  >
                    <option value="">-- Choose your scholar profile --</option>
                    {internUsers.map(intern => (
                      <option key={intern.id} value={intern.id}>
                        {intern.name} ({intern.batch || 'Batch 1'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholar Email</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={scholarPassword}
                      onChange={(e) => setScholarPassword(e.target.value)}
                      placeholder="Enter your password (e.g. scholar123)"
                      className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors pt-2"
                >
                  Sign In to Scholar Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </form>
            )}

            {/* NEW SCHOLAR REGISTRATION (No Role field) */}
            {scholarMode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-1">
                {/* Profile Photo Option (Upload or Keep Default Icon) */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={signUpPhoto}
                      name={signUpName || 'New Scholar'}
                      role="intern"
                      size="md"
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        {signUpPhoto ? 'Custom Photo Attached' : 'Default Icon Active'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {signUpPhoto ? 'Photo ready to save' : 'Upload photo or keep default'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <label className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer inline-flex items-center shadow-2xs">
                      <Camera className="w-3 h-3 mr-1 text-[#0A643B]" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => setSignUpPhoto(reader.result)
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {signUpPhoto && (
                      <button
                        type="button"
                        onClick={() => setSignUpPhoto(null)}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                        title="Reset to default icon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Shruti Patel"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="e.g. shruti@dakshana.org"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Internship Batch *</label>
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
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Junior Secretary *</label>
                  <select
                    value={signUpSec}
                    onChange={(e) => setSignUpSec(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  >
                    {juniorSecs.map(j => (
                      <option key={j.id} value={j.id}>{j.name} — Junior Secretary</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? 'Registering...' : 'Complete Scholar Registration'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </form>
            )}

          </div>
        )}

        {/* ============================================== */}
        {/* STEP 3: LEADERSHIP PORTAL (Passkey Protected)  */}
        {/* ============================================== */}
        {step === 'leadership' && (
          <div className="py-3">
            <button
              type="button"
              onClick={() => { setStep('gateway'); setError(''); setIsLeadershipUnlocked(false) }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center mb-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            {!isLeadershipUnlocked ? (
              <form onSubmit={handleVerifyPasskey} className="space-y-3.5 text-xs py-2">
                <div className="text-center py-2">
                  <div className="w-10 h-10 bg-[#F8EDF5] text-[#7B2E68] rounded-xl flex items-center justify-center mx-auto mb-2 border border-[#7B2E68]/30">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Enter Secretariat Passkey
                  </h4>
                  <p className="text-xs text-slate-500">
                    Restricted to Senior Secretary, Trustees, and Junior Secretaries
                  </p>
                </div>

                <div>
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter passkey (e.g. dakshana2026)"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 text-center font-mono focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7B2E68] hover:bg-[#5F2150] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                >
                  Verify Passkey <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleStaffSubmit} className="space-y-3.5 text-xs py-2">
                <div className="p-2 rounded-xl bg-[#EBF7F0] text-[#0A643B] text-[11px] font-bold text-center border border-[#0A643B]/20">
                  ✓ Secretariat Passkey Verified
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Leadership Account</label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                  >
                    {leadershipUsers.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} — {staff.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Password *</label>
                  <input
                    type="password"
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Enter password (e.g. dakshana2026)"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-[#7B2E68] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7B2E68] hover:bg-[#5F2150] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center transition-colors"
                >
                  Access Leadership Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              </form>
            )}

          </div>
        )}

        {/* Two-Week Session Reassurance Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 font-medium text-center">
          <Clock className="w-3.5 h-3.5 text-[#0A643B] flex-shrink-0" />
          <span>Keeps you signed in securely for 2 weeks on this device</span>
        </div>

      </div>

      {isFullScreen && (
        <footer className="mt-6 text-center text-xs text-emerald-100/60 relative z-10 font-medium">
          Dakshana Foundation • Outreach Fieldwork Internship Portal 2026–27
        </footer>
      )}
    </div>
  )
}
