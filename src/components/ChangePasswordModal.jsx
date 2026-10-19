import React, { useState } from 'react'
import {
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'
import { verifyUserPassword } from '../utils/security'

export default function ChangePasswordModal({
  isOpen,
  onClose,
  currentUser,
  onUpdatePassword
}) {
  // Enforce strictly: ONLY logged in users can change password
  if (!isOpen || !currentUser) return null

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setIsSuccess(false)
    setIsSubmitting(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cur = currentPassword.trim()
    const next = newPassword.trim()
    const conf = confirmPassword.trim()

    if (!cur) {
      setError('Please enter your current password.')
      return
    }

    // Cryptographic verification against stored hash or secure default
    const isValid = await verifyUserPassword(cur, currentUser)
    if (!isValid) {
      setError('Current password does not match our records.')
      return
    }

    if (!next) {
      setError('Please provide a new password.')
      return
    }

    if (next.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (next === cur) {
      setError('New password must be different from your current password.')
      return
    }

    if (next !== conf) {
      setError('New password and confirmation do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      if (onUpdatePassword) {
        await onUpdatePassword(next)
      }
      setIsSubmitting(false)
      setIsSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 2200)
    } catch (err) {
      setIsSubmitting(false)
      setError(err?.message || 'Failed to update password. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] p-5 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Change Password
              </h3>
              <p className="text-emerald-100 text-[11px] font-medium">
                Authenticated session • Protect your Dakshana portal
              </p>
            </div>
          </div>

          {/* User Card Pill */}
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 flex items-center space-x-3 mt-3">
            <Avatar
              src={currentUser.photo}
              name={currentUser.name}
              role={currentUser.role}
              size="md"
              className="border border-white/40 shadow-xs flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="font-extrabold text-white text-xs truncate">
                  {currentUser.name}
                </span>
                {currentUser.role === 'intern' && currentUser.stream && (
                  <StreamBadge stream={currentUser.stream} size="xs" />
                )}
              </div>
              <span className="text-[11px] text-emerald-100 truncate block">
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#EBF7F0] text-[#0A643B] rounded-full flex items-center justify-center mx-auto border-2 border-[#0A643B]/20">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Password Updated!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your new security credential is saved and active for this device and cloud sessions.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Notice */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 pr-10 focus:ring-2 focus:ring-[#0A643B] focus:border-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 pr-10 focus:ring-2 focus:ring-[#0A643B] focus:border-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 pr-10 focus:ring-2 focus:ring-[#0A643B] focus:border-transparent focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Hint */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0A643B] flex-shrink-0 mt-0.5" />
                <span>
                  For safety, passwords are only changeable while actively authenticated into your account.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  )
}
