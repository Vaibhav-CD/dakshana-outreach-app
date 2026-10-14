import React from 'react'
import { Layers, BarChart3, CreditCard, FolderLock, Users, Radio, LogIn, Bell } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  unreadBroadcastsCount
}) {
  const isAboveInterns = currentUser.role !== 'intern'

  const getRoleBadge = (role) => {
    switch (role) {
      case 'management':
        return { label: 'Trustees / Management', bg: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30' }
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

  const badge = getRoleBadge(currentUser.role)

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: Layers },
    ...(isAboveInterns ? [{ id: 'visual_stats', label: 'Visual Stats Board', icon: BarChart3 }] : []),
    { id: 'reimbursements', label: 'Reimbursements', icon: CreditCard },
    { id: 'resources', label: 'Materials Hub', icon: FolderLock },
    { id: 'team', label: 'Our Team', icon: Users },
    { id: 'broadcasts', label: 'Notices', icon: Radio, count: unreadBroadcastsCount }
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Dakshana Official Logo & Branding */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img
              src={logoImg}
              alt="Dakshana Outreach Internship Logo"
              className="w-13 h-13 rounded-full object-cover shadow-xs border-2 border-[#0A643B]/20 flex-shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-[#0A643B] tracking-tight">
                  DAKSHANA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30">
                  Outreach Internship
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Honor • Knowledge • Service
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs with Dakshana Brand Palette */}
          <nav className="hidden lg:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0A643B] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-[#EBF7F0] hover:text-[#0A643B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#7B2E68] text-white font-extrabold animate-pulse">
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Profile & Role Switch Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              title="Click to switch role or sign in"
            >
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
              />
              <div className="text-left hidden sm:block pr-1">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`text-[10px] font-semibold ${badge.label === 'Senior Secretary' ? 'text-[#0A643B]' : 'text-slate-500'}`}>
                    {badge.label}
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-medium">Switch</span>
                </div>
              </div>
              <LogIn className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-100 space-x-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#0A643B] text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

      </div>
    </header>
  )
}
