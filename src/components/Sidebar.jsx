import {
  LayoutDashboard,
  Radio,
  Share2,
  BookOpen,
  CreditCard,
  Users,
  LogOut,
  LogIn,
  X,
  ChevronRight,
  ShieldCheck,
  Camera,
  HelpCircle,
  Bug,
  Key,
  Clock
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  unreadBroadcastsCount = 0,
  onSignOut,
  onSwitchProfile,
  onOpenPhotoModal,
  onOpenFeedback,
  onOpenChangePassword,
  isMobileOpen,
  setIsMobileOpen,
  countdown,
  onOpenSetEndDateModal
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

  // Re-ordered navigation strictly as requested:
  // 1. Dashboard, 2. Notices, 3. Posts, 4. Queries & Doubts, 5. Materials, 6. Reimbursements, 7. Team
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notices', label: 'Notices', icon: Radio, count: unreadBroadcastsCount },
    { id: 'posts', label: 'Posts & Feed', icon: Share2 },
    { id: 'queries', label: 'Queries & Doubts', icon: HelpCircle },
    { id: 'resources', label: 'Materials Hub', icon: BookOpen },
    { id: 'reimbursements', label: 'Reimbursements', icon: CreditCard },
    { id: 'team', label: 'Meet the Team', icon: Users }
  ]

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    if (setIsMobileOpen) setIsMobileOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      
      {/* Brand & Organization Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
          <img
            src={logoImg}
            alt="Dakshana"
            className="w-11 h-11 rounded-full object-cover shadow-xs border-2 border-[#0A643B]/20 flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-base text-[#0A643B] tracking-tight">
                DAKSHANA
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30">
                Outreach
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Honor • Knowledge • Service
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {setIsMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Current User Card */}
      {currentUser && (
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center space-x-3 mb-2.5">
            <div className="relative group cursor-pointer" onClick={onOpenPhotoModal} title="Click to change profile picture or use default icon">
              <Avatar
                src={currentUser.photo}
                name={currentUser.name}
                role={currentUser.role}
                size="md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0A643B] text-white rounded-full flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-extrabold text-slate-900 text-xs block truncate">
                {currentUser.name}
              </span>
              <div className="flex items-center space-x-1.5 flex-wrap mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border inline-block truncate ${badge.bg}`}>
                  {badge.label}
                </span>
                {currentUser.role === 'intern' && currentUser.stream && (
                  <StreamBadge stream={currentUser.stream} size="xs" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-200/60 text-[11px]">
            <button
              onClick={onOpenChangePassword}
              className="flex-1 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#0A643B] font-bold text-center border border-slate-200 hover:border-[#0A643B]/30 transition-colors cursor-pointer flex items-center justify-center space-x-1"
              title="Change account password"
            >
              <Key className="w-3 h-3 text-[#0A643B]" />
              <span>Password</span>
            </button>
            <button
              onClick={onSwitchProfile}
              className="flex-1 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-center border border-slate-200 transition-colors cursor-pointer"
            >
              Switch
            </button>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-center border border-rose-200 transition-colors cursor-pointer flex items-center justify-center"
              title="Sign out of current account"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Ordered Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-[#0A643B] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-[#EBF7F0]/70 hover:text-[#0A643B]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#0A643B]'}`} />
                <span>{item.label}</span>
              </div>

              {item.count > 0 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-[#7B2E68] text-white font-black animate-pulse">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Internship Timeline Countdown in Sidebar */}
      {countdown && countdown.isValid && (
        <div className="mx-3 my-2 p-3 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-[#F8EDF5] border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[#0A643B] mb-1">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-[#7B2E68]" />
              Days Remaining
            </span>
            <span className="text-slate-500 font-bold">{countdown.totalDays}d left</span>
          </div>
          <div className="text-xs font-black text-slate-900 leading-snug">
            {countdown.formatted}
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Target: {countdown.endDateFormatted}</span>
            {currentUser && (currentUser.role === 'senior_sec' || currentUser.role === 'management' || currentUser.role === 'junior_sec') && onOpenSetEndDateModal && (
              <button
                onClick={onOpenSetEndDateModal}
                className="text-[10px] font-bold text-[#0A643B] hover:underline cursor-pointer"
              >
                Change Date
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Section with Permanent Sign Out */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button
          onClick={() => {
            if (onOpenFeedback) onOpenFeedback()
            if (setIsMobileOpen) setIsMobileOpen(false)
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-2xl text-slate-700 bg-white hover:bg-rose-50 hover:border-rose-200 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:text-rose-700"
          title="Report any technical bug or give feedback to Senior Secretary"
        >
          <Bug className="w-3.5 h-3.5 text-rose-600" />
          <span>Report Bug / Feedback</span>
        </button>

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Sign Out from Portal</span>
        </button>

        <div className="text-[10px] text-center text-slate-400 font-medium">
          Dakshana Outreach • 2026–27
        </div>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-Over) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer Box */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
