import React, { useState } from 'react'
import { Shield, Lock, Mail, ArrowRight, X, User, Phone, BookOpen, UserPlus, CheckCircle2 } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function AuthModal({ isOpen, onClose, allUsers, onLogin, onRegisterScholar }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  
  // Sign In state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Sign Up state (New Entry)
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

  const handleCustomLogin = (e) => {
    e.preventDefault()
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (foundUser) {
      onLogin(foundUser)
      onClose()
    } else {
      setError('No profile found with this email. Try choosing one of the demo roles or click "Sign Up" below!')
    }
  }

  const handleCustomSignUp = async (e) => {
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

    const newScholar = {
      name: signUpName.trim(),
      title: 'Outreach Scholar',
      email: signUpEmail.trim().toLowerCase(),
      phone: signUpPhone.trim(),
      role: 'intern',
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
        onClose()
      }, 500)
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Registration error: ' + (err.message || 'Please check connection and try again.'))
      setIsSubmitting(false)
    }
  }

  const handleQuickLogin = (user) => {
    onLogin(user)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <img src={logoImg} className="w-8 h-8 rounded-full border border-[#0A643B]/30 object-cover" alt="" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dakshana Outreach Portal</h3>
              <p className="text-[11px] text-slate-500">
                {mode === 'signin' ? 'Authorized Portal Sign-In' : 'New Scholar Entry Registration'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex bg-slate-100 p-1 rounded-xl my-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError('') }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
              mode === 'signup' ? 'bg-[#0A643B] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up (New Entry)
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {signUpSuccess && (
          <div className="my-3 p-2.5 rounded-lg bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-xs font-semibold flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Scholar account created! Logging into your dashboard...
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'signin' && (
          <>
            <form onSubmit={handleCustomLogin} className="space-y-3 my-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. senior.sec@dakshana.org"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center"
              >
                Sign In with Credentials <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </form>

            {/* Quick Role Shortcuts */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Or instant switch demo profile:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickLogin(allUsers[0])}
                  className="p-2 rounded-xl border border-[#0A643B]/30 bg-[#EBF7F0] hover:bg-[#D5EFE0] text-[#0A643B] font-bold text-left cursor-pointer flex items-center space-x-2"
                >
                  <img src={allUsers[0].photo} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="truncate">Senior Sec (You)</span>
                </button>
                <button
                  onClick={() => handleQuickLogin(allUsers[1])}
                  className="p-2 rounded-xl border border-[#7B2E68]/30 bg-[#F8EDF5] hover:bg-[#F0DCEB] text-[#7B2E68] font-bold text-left cursor-pointer flex items-center space-x-2"
                >
                  <img src={allUsers[1].photo} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="truncate">Management</span>
                </button>
                <button
                  onClick={() => handleQuickLogin(allUsers[2])}
                  className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-left cursor-pointer flex items-center space-x-2"
                >
                  <img src={allUsers[2].photo} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="truncate">Junior Sec 1</span>
                </button>
                <button
                  onClick={() => handleQuickLogin(allUsers[5])}
                  className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-left cursor-pointer flex items-center space-x-2"
                >
                  <img src={allUsers[5].photo} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="truncate">Scholar (Aarav)</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* MODE 2: SIGN UP / NEW SCHOLAR REGISTRATION */}
        {mode === 'signup' && (
          <form onSubmit={handleCustomSignUp} className="space-y-3 my-2 text-xs max-h-[420px] overflow-y-auto pr-1">
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
              <label className="block font-bold text-slate-700 mb-1">Supervising Wing *</label>
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
              {isSubmitting ? 'Saving to Supabase Cloud...' : 'Register & Enter Portal'} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
