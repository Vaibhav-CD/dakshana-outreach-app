import React, { useState } from 'react'
import { Shield, Lock, Mail, ArrowRight, X } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function AuthModal({ isOpen, onClose, allUsers, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCustomLogin = (e) => {
    e.preventDefault()
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    if (foundUser) {
      onLogin(foundUser)
      onClose()
    } else {
      setError('No profile found with this email. Try choosing one of the demo roles below!')
    }
  }

  const handleQuickLogin = (user) => {
    onLogin(user)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <img src={logoImg} className="w-8 h-8 rounded-full border border-[#0A643B]/30 object-cover" alt="" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Dakshana Portal Sign-In</h3>
              <p className="text-[11px] text-slate-500">Role-Based Access Control</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Credentials Form */}
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Or instant switch role:</p>
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

      </div>
    </div>
  )
}
