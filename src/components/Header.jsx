import React from 'react'
import { Menu, LogOut, LogIn, Bell, CheckCircle2, Camera } from 'lucide-react'
import logoImg from '../assets/logo.png'
import Avatar from './Avatar'

export default function Header({
  currentUser,
  activeTab,
  onOpenAuth,
  onSignOut,
  onToggleMobileSidebar,
  unreadBroadcastsCount = 0,
  onOpenPhotoModal
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'management':
        return { label: 'Trustee / Management', bg: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30' }
      case 'senior_sec':
        return { label: 'Senior Secretary', bg: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30' }
      case 'junior_sec':
        return { label: 'Junior Secretary', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
      case 'intern':
        return { label: 'Outreach Scholar', bg: 'bg-amber-50 text-amber-900 border-amber-200' }
      default:
        return { label: role, bg: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const badge = getRoleBadge(currentUser?.role)

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return 'Outreach Dashboard'
      case 'notices':
        return 'Notices & Circulars'
      case 'posts':
        return 'Community Posts & Activity Feed'
      case 'resources':
        return 'Materials Hub'
      case 'reimbursements':
        return 'Expense Claims & Reimbursements'
      case 'team':
        return 'Our Leadership Team'
      default:
        return 'Dashboard'
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Left: Mobile Hamburger & Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile logo only */}
            <div className="lg:hidden flex items-center space-x-2">
              <img src={logoImg} className="w-8 h-8 rounded-full border border-[#0A643B]/30" alt="Logo" />
              <span className="font-extrabold text-[#0A643B] text-sm">Dakshana</span>
            </div>

            {/* Desktop page breadcrumb */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  {getPageTitle(activeTab)}
                </h1>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#0A643B] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full" title="Connected to Cloud Database">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A643B] mr-1.5 animate-pulse"></span>
                  Cloud Synced
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Dakshana Outreach Internship Program 2026–27
              </p>
            </div>
          </div>

          {/* Right: User Profile & Quick Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {currentUser && (
              <>
                {/* User Pill Button (Click avatar to change photo, click text to switch profile) */}
                <div className="flex items-center space-x-1.5 p-1 sm:p-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div
                    onClick={onOpenPhotoModal}
                    className="relative group cursor-pointer"
                    title="Change profile picture or use default icon"
                  >
                    <Avatar
                      src={currentUser.photo}
                      name={currentUser.name}
                      role={currentUser.role}
                      size="sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0A643B] text-white rounded-full flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                      <Camera className="w-2 h-2" />
                    </div>
                  </div>

                  <button
                    onClick={onOpenAuth}
                    className="text-left hidden sm:block pr-1 hover:opacity-80 transition-opacity cursor-pointer"
                    title="Switch profile or role"
                  >
                    <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                    <span className={`text-[10px] font-bold ${currentUser.role === 'senior_sec' ? 'text-[#0A643B]' : 'text-slate-500'}`}>
                      {badge.label}
                    </span>
                  </button>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={onSignOut}
                  className="px-3 py-1.5 sm:py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}

            {!currentUser && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  )
}
