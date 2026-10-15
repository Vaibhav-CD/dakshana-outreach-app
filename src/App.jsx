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
  // 1. Current logged in user (with localStorage persistence across refresh)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dakshana_current_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.id) return parsed
      } catch (e) { }
    }
    // Default safe role: Outreach Scholar (never default to Senior Secretary)
    return INITIAL_USERS.find(u => u.role === 'intern') || INITIAL_USERS[0]
  })

  // 2. Active Tab (with localStorage persistence across refresh)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dakshana_active_tab') || 'dashboard'
  })

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('dakshana_active_tab', tab)
  }

  // 3. All Users (with localStorage persistence)
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('dakshana_all_users')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return INITIAL_USERS
  })

  // 4. Reports (with localStorage persistence)
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('dakshana_reports')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) { }
    }
    return INITIAL_REPORTS
  })

  // 5. Sessions
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('dakshana_sessions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) { }
    }
    return INITIAL_SESSIONS
  })
  
  // 6. Reimbursement cycle state (with localStorage persistence)
  const [cycle, setCycle] = useState(() => {
    const saved = localStorage.getItem('dakshana_reimbursement_cycle')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { }
    }
    return INITIAL_REIMBURSEMENT_CYCLE
  })

  // 7. Delegated special powers state: Senior Secretary -> Junior Secretaries
  const [delegatedPowers, setDelegatedPowers] = useState(() => {
    const saved = localStorage.getItem('dakshana_delegated_powers')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { }
    }
    return {
      'user-jsec-1': { canManageReimbursements: false, canReassignBatches: false, canBroadcast: false, canViewAllReports: false },
      'user-jsec-2': { canManageReimbursements: false, canReassignBatches: false, canBroadcast: false, canViewAllReports: false },
      'user-jsec-3': { canManageReimbursements: false, canReassignBatches: false, canBroadcast: false, canViewAllReports: false }
    }
  })

  // 8. Claims (with localStorage persistence)
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('dakshana_claims')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) { }
    }
    return INITIAL_REIMBURSEMENT_CLAIMS
  })

  // 9. Materials Hub (Strictly the two official Dakshana links provided)
  const [resources, setResources] = useState(() => {
    return INITIAL_RESOURCES
  })

  // 10. Broadcasts (with localStorage persistence)
  const [broadcasts, setBroadcasts] = useState(() => {
    const saved = localStorage.getItem('dakshana_broadcasts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (e) { }
    }
    return INITIAL_BROADCASTS
  })

  // Prompt portal gateway on first visit if no session is saved
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !localStorage.getItem('dakshana_current_user'))

  // Cloud Sync from Supabase on App Mount
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
            localStorage.setItem('dakshana_all_users', JSON.stringify(combined))
            return combined
          })

          // Keep current logged-in user refreshed with cloud data if available
          setCurrentUser(prevUser => {
            if (!prevUser) return prevUser
            const matching = cloudProfiles.find(p => p.id === prevUser.id || p.email === prevUser.email)
            if (matching) {
              const updated = { ...prevUser, ...matching }
              localStorage.setItem('dakshana_current_user', JSON.stringify(updated))
              return updated
            }
            return prevUser
          })
        }
        if (cloudReports && cloudReports.length > 0) {
          setReports(cloudReports)
          localStorage.setItem('dakshana_reports', JSON.stringify(cloudReports))
        }
        if (cloudClaims && cloudClaims.length > 0) {
          setClaims(cloudClaims)
          localStorage.setItem('dakshana_claims', JSON.stringify(cloudClaims))
        }
        if (cloudBroadcasts && cloudBroadcasts.length > 0) {
          setBroadcasts(cloudBroadcasts)
          localStorage.setItem('dakshana_broadcasts', JSON.stringify(cloudBroadcasts))
        }
      } catch (err) {
        console.warn('Running in offline/prototype mode:', err)
      }
    }
    syncFromCloud()
  }, [])

  // Handlers with dual persistence (State + localStorage + Supabase)
  const handleReassignIntern = (internId, newJuniorSecId) => {
    setAllUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === internId) {
          return { ...user, assignedTo: newJuniorSecId }
        }
        return user
      })
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    setReports(prev => {
      const updated = prev.map(rep => {
        if (rep.internId === internId) {
          return { ...rep, juniorSecId: newJuniorSecId }
        }
        return rep
      })
      localStorage.setItem('dakshana_reports', JSON.stringify(updated))
      return updated
    })

    // Persist to Supabase
    dbUpdateProfile(internId, { assignedTo: newJuniorSecId }).catch(console.error)
  }

  const handleUpdateInternBatch = (internId, newBatch) => {
    setAllUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === internId) {
          return { ...user, batch: newBatch }
        }
        return user
      })
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    setReports(prev => {
      const updated = prev.map(rep => {
        if (rep.internId === internId) {
          return { ...rep, batch: newBatch }
        }
        return rep
      })
      localStorage.setItem('dakshana_reports', JSON.stringify(updated))
      return updated
    })

    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.internId === internId) {
          return { ...s, batch: newBatch }
        }
        return s
      })
      localStorage.setItem('dakshana_sessions', JSON.stringify(updated))
      return updated
    })

    // Persist to Supabase
    dbUpdateProfile(internId, { batch: newBatch }).catch(console.error)
  }

  const handleAddIntern = async (newIntern) => {
    let finalScholar = { ...newIntern }

    // Persist to Supabase
    try {
      const { data, error } = await dbCreateProfile(newIntern)
      if (error) {
        console.error('Supabase profile insertion error:', error)
      } else if (data && data.id) {
        console.log('Profile successfully saved in Supabase with id:', data.id)
        finalScholar.id = data.id
      }
    } catch (err) {
      console.error('Network error during Supabase sync:', err)
    }

    if (!finalScholar.id) {
      finalScholar.id = `user-intern-${Date.now()}`
    }

    setAllUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== finalScholar.email.toLowerCase())
      const updated = [...filtered, finalScholar]
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    return finalScholar
  }

  const handleSubmitReport = (newReport) => {
    setReports(prev => {
      const updated = [newReport, ...prev]
      localStorage.setItem('dakshana_reports', JSON.stringify(updated))
      return updated
    })
    // Persist to Supabase
    dbCreateReport(newReport).catch(console.error)
  }

  const handleUpdateReport = (reportId, updates) => {
    setReports(prev => {
      const updated = prev.map(rep => {
        if (rep.id === reportId) {
          return { ...rep, ...updates }
        }
        return rep
      })
      localStorage.setItem('dakshana_reports', JSON.stringify(updated))
      return updated
    })
    // Persist to Supabase
    dbUpdateReport(reportId, updates).catch(console.error)
  }

  // Reimbursement handlers
  const handleToggleCycle = () => {
    setCycle(prev => {
      const updated = {
        ...prev,
        isActive: !prev.isActive,
        activatedBy: currentUser.name
      }
      localStorage.setItem('dakshana_reimbursement_cycle', JSON.stringify(updated))
      return updated
    })
  }

  const handleUpdateCycleSettings = (updates) => {
    setCycle(prev => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('dakshana_reimbursement_cycle', JSON.stringify(updated))
      return updated
    })
  }

  const handleSubmitClaim = (newClaim) => {
    setClaims(prev => {
      const updated = [newClaim, ...prev]
      localStorage.setItem('dakshana_claims', JSON.stringify(updated))
      return updated
    })
    // Persist to Supabase
    dbCreateClaim(newClaim).catch(console.error)
  }

  const handleUpdateClaimStatus = (claimId, newStatus, approverName) => {
    setClaims(prev => {
      const updated = prev.map(c => {
        if (c.id === claimId) {
          return {
            ...c,
            status: newStatus,
            approvedBy: approverName,
            paidAt: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : c.paidAt
          }
        }
        return c
      })
      localStorage.setItem('dakshana_claims', JSON.stringify(updated))
      return updated
    })
    // Persist to Supabase
    dbUpdateClaim(claimId, {
      status: newStatus,
      approvedBy: approverName,
      paidAt: newStatus === 'paid' ? new Date().toISOString() : null
    }).catch(console.error)
  }

  // Privilege delegation handlers
  const handleTogglePrivilege = (juniorSecId, privilegeKey) => {
    setDelegatedPowers(prev => {
      const secPowers = prev[juniorSecId] || {
        canManageReimbursements: false,
        canReassignBatches: false,
        canBroadcast: false,
        canViewAllReports: false
      }
      const updated = {
        ...prev,
        [juniorSecId]: {
          ...secPowers,
          [privilegeKey]: !secPowers[privilegeKey]
        }
      }
      localStorage.setItem('dakshana_delegated_powers', JSON.stringify(updated))
      return updated
    })
  }

  const handleBulkPrivilege = (juniorSecId, grantAll) => {
    setDelegatedPowers(prev => {
      const updated = {
        ...prev,
        [juniorSecId]: {
          canManageReimbursements: grantAll,
          canReassignBatches: grantAll,
          canBroadcast: grantAll,
          canViewAllReports: grantAll
        }
      }
      localStorage.setItem('dakshana_delegated_powers', JSON.stringify(updated))
      return updated
    })
  }

  // Resources handlers
  const handleAddResource = (newResource) => {
    setResources(prev => {
      const updated = [newResource, ...prev]
      localStorage.setItem('dakshana_resources', JSON.stringify(updated))
      return updated
    })
  }

  // Broadcast handlers
  const handleSendBroadcast = (newBroadcast) => {
    setBroadcasts(prev => {
      const updated = [newBroadcast, ...prev]
      localStorage.setItem('dakshana_broadcasts', JSON.stringify(updated))
      return updated
    })
    // Persist to Supabase
    dbCreateBroadcast(newBroadcast).catch(console.error)
  }

  const handleUserLogin = (selectedUser) => {
    setCurrentUser(selectedUser)
    localStorage.setItem('dakshana_current_user', JSON.stringify(selectedUser))
    // Interns cannot view visual stats board directly, fallback to dashboard
    if (selectedUser.role === 'intern' && activeTab === 'visual_stats') {
      handleSetActiveTab('dashboard')
    }
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
        setActiveTab={handleSetActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(false) || setIsAuthModalOpen(true)}
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
                delegatedPowers={delegatedPowers}
                onTogglePrivilege={handleTogglePrivilege}
                onBulkPrivilege={handleBulkPrivilege}
              />
            )}

            {currentUser.role === 'junior_sec' && (
              <JuniorSecView
                currentUser={currentUser}
                allUsers={allUsers}
                reports={reports}
                onUpdateReport={handleUpdateReport}
                delegatedPowers={delegatedPowers}
                onReassignIntern={handleReassignIntern}
                onUpdateInternBatch={handleUpdateInternBatch}
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

        {/* Tab 3: Monthly Reimbursements & Expense Portal */}
        {activeTab === 'reimbursements' && (
          <ReimbursementModule
            currentUser={currentUser}
            cycle={cycle}
            onToggleCycle={handleToggleCycle}
            onUpdateCycleSettings={handleUpdateCycleSettings}
            claims={claims}
            onSubmitClaim={handleSubmitClaim}
            onUpdateClaimStatus={handleUpdateClaimStatus}
            delegatedPowers={delegatedPowers}
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
            delegatedPowers={delegatedPowers}
          />
        )}

      </main>

      {/* Auth / Switch Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        allUsers={allUsers}
        onRegisterScholar={handleAddIntern}
        onLogin={handleUserLogin}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Dakshana Outreach Internship Portal • "Honor. Knowledge. Service" • PWA Ready (Mobile & Web)
      </footer>

    </div>
  )
}
