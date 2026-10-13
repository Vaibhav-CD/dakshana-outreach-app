import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import InstallAppBanner from './components/InstallAppBanner'
import SeniorSecView from './components/SeniorSecView'
import JuniorSecView from './components/JuniorSecView'
import InternView from './components/InternView'
import ManagementView from './components/ManagementView'
import TeamShowcase from './components/TeamShowcase'
import ReimbursementModule from './components/ReimbursementModule'
import ResourceHub from './components/ResourceHub'
import VisualDataBoard from './components/VisualDataBoard'
import BroadcastCenter from './components/BroadcastCenter'
import AuthModal from './components/AuthModal'
import {
  INITIAL_USERS,
  INITIAL_REPORTS,
  INITIAL_SESSIONS,
  INITIAL_REIMBURSEMENT_CYCLE,
  INITIAL_REIMBURSEMENT_CLAIMS,
  INITIAL_RESOURCES,
  INITIAL_BROADCASTS
} from './mockData'
import {
  isSupabaseConfigured,
  dbFetchProfiles,
  dbCreateProfile,
  dbUpdateProfile,
  dbFetchReports,
  dbCreateReport,
  dbUpdateReport,
  dbFetchClaims,
  dbCreateClaim,
  dbUpdateClaim,
  dbFetchBroadcasts,
  dbCreateBroadcast
} from './supabase'

export default function App() {
  const [allUsers, setAllUsers] = useState(INITIAL_USERS)
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [cycle, setCycle] = useState(INITIAL_REIMBURSEMENT_CYCLE)
  const [claims, setClaims] = useState(INITIAL_REIMBURSEMENT_CLAIMS)
  const [resources, setResources] = useState(INITIAL_RESOURCES)
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS)

  // Current logged in user (defaults to Senior Secretary)
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // 1. Initial Cloud Sync from Supabase on App Mount
  useEffect(() => {
    async function syncFromCloud() {
      try {
        const [cloudProfiles, cloudReports, cloudClaims, cloudBroadcasts] = await Promise.all([
          dbFetchProfiles(),
          dbFetchReports(),
          dbFetchClaims(),
          dbFetchBroadcasts()
        ])

        if (cloudProfiles && cloudProfiles.length > 0) {
          // Merge leadership if not present
          setAllUsers(prev => {
            const combined = [...cloudProfiles]
            INITIAL_USERS.slice(0, 5).forEach(lead => {
              if (!combined.some(u => u.email === lead.email)) combined.unshift(lead)
            })
            return combined
          })
        }
        if (cloudReports && cloudReports.length > 0) setReports(cloudReports)
        if (cloudClaims && cloudClaims.length > 0) setClaims(cloudClaims)
        if (cloudBroadcasts && cloudBroadcasts.length > 0) setBroadcasts(cloudBroadcasts)
      } catch (err) {
        console.warn('Running in offline/prototype mode:', err)
      }
    }
    syncFromCloud()
  }, [])

  // Handlers
  const handleReassignIntern = (internId, newJuniorSecId) => {
    setAllUsers(prev => prev.map(user => {
      if (user.id === internId) {
        return { ...user, assignedTo: newJuniorSecId }
      }
      return user
    }))

    setReports(prev => prev.map(rep => {
      if (rep.internId === internId) {
        return { ...rep, juniorSecId: newJuniorSecId }
      }
      return rep
    }))

    // Persist to Supabase
    dbUpdateProfile(internId, { assignedTo: newJuniorSecId }).catch(console.error)
  }

  const handleUpdateInternBatch = (internId, newBatch) => {
    setAllUsers(prev => prev.map(user => {
      if (user.id === internId) {
        return { ...user, batch: newBatch }
      }
      return user
    }))

    setReports(prev => prev.map(rep => {
      if (rep.internId === internId) {
        return { ...rep, batch: newBatch }
      }
      return rep
    }))

    setSessions(prev => prev.map(s => {
      if (s.internId === internId) {
        return { ...s, batch: newBatch }
      }
      return s
    }))

    // Persist to Supabase
    dbUpdateProfile(internId, { batch: newBatch }).catch(console.error)
  }

  const handleAddIntern = (newIntern) => {
    setAllUsers(prev => [...prev, newIntern])
    // Persist to Supabase
    dbCreateProfile(newIntern).catch(console.error)
  }

  const handleSubmitReport = (newReport) => {
    setReports(prev => [newReport, ...prev])
    // Persist to Supabase
    dbCreateReport(newReport).catch(console.error)
  }

  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return { ...rep, ...updates }
      }
      return rep
    }))
    // Persist to Supabase
    dbUpdateReport(reportId, updates).catch(console.error)
  }

  // Reimbursement handlers
  const handleToggleCycle = () => {
    setCycle(prev => ({
      ...prev,
      isActive: !prev.isActive,
      activatedBy: currentUser.name
    }))
  }

  const handleSubmitClaim = (newClaim) => {
    setClaims(prev => [newClaim, ...prev])
    // Persist to Supabase
    dbCreateClaim(newClaim).catch(console.error)
  }

  const handleUpdateClaimStatus = (claimId, newStatus, approverName) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: newStatus,
          approvedBy: approverName,
          paidAt: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : c.paidAt
        }
      }
      return c
    }))
    // Persist to Supabase
    dbUpdateClaim(claimId, {
      status: newStatus,
      approvedBy: approverName,
      paidAt: newStatus === 'paid' ? new Date().toISOString() : null
    }).catch(console.error)
  }

  // Resources handlers
  const handleAddResource = (newResource) => {
    setResources(prev => [newResource, ...prev])
  }

  // Broadcast handlers
  const handleSendBroadcast = (newBroadcast) => {
    setBroadcasts(prev => [newBroadcast, ...prev])
    // Persist to Supabase
    dbCreateBroadcast(newBroadcast).catch(console.error)
  }

  const unreadCount = broadcasts.filter(b => b.isNew).length

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Install App Prompt (PWA Banner) */}
      <InstallAppBanner />

      {/* Top Header & Navigation */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        unreadBroadcastsCount={unreadCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        
        {/* Tab 1: Role-Based Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {currentUser.role === 'senior_sec' && (
              <SeniorSecView
                allUsers={allUsers}
                reports={reports}
                onReassignIntern={handleReassignIntern}
                onUpdateInternBatch={handleUpdateInternBatch}
                onAddIntern={handleAddIntern}
              />
            )}

            {currentUser.role === 'junior_sec' && (
              <JuniorSecView
                currentUser={currentUser}
                allUsers={allUsers}
                reports={reports}
                onUpdateReport={handleUpdateReport}
              />
            )}

            {currentUser.role === 'intern' && (
              <InternView
                currentUser={currentUser}
                allUsers={allUsers}
                reports={reports}
                onSubmitReport={handleSubmitReport}
              />
            )}

            {currentUser.role === 'management' && (
              <ManagementView
                allUsers={allUsers}
                reports={reports}
              />
            )}
          </>
        )}

        {/* Tab 2: Visual Stats & Sessions Board (Above Interns only) */}
        {activeTab === 'visual_stats' && (
          <VisualDataBoard
            sessions={sessions}
            allUsers={allUsers}
          />
        )}

        {/* Tab 3: Monthly Reimbursements & Stipend Portal */}
        {activeTab === 'reimbursements' && (
          <ReimbursementModule
            currentUser={currentUser}
            cycle={cycle}
            onToggleCycle={handleToggleCycle}
            claims={claims}
            onSubmitClaim={handleSubmitClaim}
            onUpdateClaimStatus={handleUpdateClaimStatus}
          />
        )}

        {/* Tab 4: Materials & Resource Hub (Staff vs Intern Spaces) */}
        {activeTab === 'resources' && (
          <ResourceHub
            currentUser={currentUser}
            resources={resources}
            onAddResource={handleAddResource}
          />
        )}

        {/* Tab 5: Meet Our Leadership Team */}
        {activeTab === 'team' && (
          <TeamShowcase
            allUsers={allUsers}
          />
        )}

        {/* Tab 6: Secretariat Broadcasts & Targeted Notices */}
        {activeTab === 'broadcasts' && (
          <BroadcastCenter
            currentUser={currentUser}
            broadcasts={broadcasts}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

      </main>

      {/* Auth / Switch Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        allUsers={allUsers}
        onRegisterScholar={handleAddIntern}
        onLogin={(selectedUser) => {
          setCurrentUser(selectedUser)
          // Interns cannot view visual stats board directly, fallback to dashboard
          if (selectedUser.role === 'intern' && activeTab === 'visual_stats') {
            setActiveTab('dashboard')
          }
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Dakshana Outreach Internship Portal • "Honor. Knowledge. Service" • PWA Ready (Mobile & Web)
      </footer>

    </div>
  )
}
