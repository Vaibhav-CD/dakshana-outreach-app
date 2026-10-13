import React from 'react'
import { Layers, BarChart3, CreditCard, FolderLock, Users, Radio, LogIn, Bell } from 'lucide-react'

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
        return { label: 'Management', bg: 'bg-purple-100 text-purple-800 border-purple-200' }
      case 'senior_sec':
        return { label: 'Senior Secretary', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
      case 'junior_sec':
        return { label: 'Junior Secretary', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
      case 'intern':
        return { label: 'Scholar / Intern', bg: 'bg-amber-100 text-amber-800 border-amber-200' }
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
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base text-slate-900 tracking-tight">Inspire NGO</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Cohort Coordination & Scholar Portal</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* User Profile & Switch Auth */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              title="Click to switch user or sign in"
            >
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block pr-1">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
                <span className={`text-[10px] font-semibold ${badge.label === 'Senior Secretary' ? 'text-indigo-600' : 'text-slate-500'}`}>
                  {badge.label}
                </span>
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
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
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
