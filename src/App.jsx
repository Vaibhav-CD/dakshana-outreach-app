import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import InstallAppBanner from './components/InstallAppBanner'
import SeniorSecView from './components/SeniorSecView'
import JuniorSecView from './components/JuniorSecView'
import InternView from './components/InternView'
import ManagementView from './components/ManagementView'
import TeamShowcase from './components/TeamShowcase'
import ReimbursementModule from './components/ReimbursementModule'
import ResourceHub from './components/ResourceHub'
import BroadcastCenter from './components/BroadcastCenter'
import PostsFeed from './components/PostsFeed'
import InternDetailModal from './components/InternDetailModal'
import EditProfilePhotoModal from './components/EditProfilePhotoModal'
import AuthModal from './components/AuthModal'
import {
  INITIAL_USERS,
  INITIAL_REPORTS,
  INITIAL_SESSIONS,
  INITIAL_REIMBURSEMENT_CYCLE,
  INITIAL_REIMBURSEMENT_CLAIMS,
  INITIAL_RESOURCES,
  INITIAL_BROADCASTS,
  INITIAL_POSTS
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

// 2 Weeks session duration in milliseconds (14 days = 14 * 24 * 60 * 60 * 1000)
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

export default function App() {
  // 1. Current logged in user with 2-week session persistence
  // App starts from the login page unless a valid session exists within 2 weeks
  const [currentUser, setCurrentUser] = useState(() => {
    const sessionStr = localStorage.getItem('dakshana_session')
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr)
        if (session && session.user && session.expiresAt) {
          const now = Date.now()
          if (now < session.expiresAt) {
            // Valid session within 2 weeks!
            return session.user
          } else {
            console.log('Session expired after 2 weeks. Redirecting to login page.')
            localStorage.removeItem('dakshana_session')
            localStorage.removeItem('dakshana_current_user')
            return null
          }
        }
      } catch (e) {
        localStorage.removeItem('dakshana_session')
        localStorage.removeItem('dakshana_current_user')
      }
    }
    // No active session: Start directly from Login Page
    return null
  })

  // 2. Active Tab (Ordered: dashboard, notices, posts, resources, reimbursements, team)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dakshana_active_tab') || 'dashboard'
  })

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('dakshana_active_tab', tab)
  }

  // 3. All Users
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

  // 4. Reports
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

  // 5. Sessions / School Visits
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

  // 6. Community Posts
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('dakshana_posts')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return INITIAL_POSTS
  })
  
  // 7. Reimbursement cycle state
  const [cycle, setCycle] = useState(() => {
    const saved = localStorage.getItem('dakshana_reimbursement_cycle')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { }
    }
    return INITIAL_REIMBURSEMENT_CYCLE
  })

  // 8. Delegated powers: Senior Sec -> Junior Secs
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

  // 9. Claims
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

  // 10. Materials Hub
  const [resources, setResources] = useState(() => {
    return INITIAL_RESOURCES
  })

  // 11. Broadcasts / Notices
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

  // 12. UI States: Modals & Sidebar
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [selectedInternForModal, setSelectedInternForModal] = useState(null)

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
          setAllUsers(prev => {
            const combined = [...cloudProfiles]
            INITIAL_USERS.slice(0, 5).forEach(lead => {
              if (!combined.some(u => u.email === lead.email)) combined.unshift(lead)
            })
            localStorage.setItem('dakshana_all_users', JSON.stringify(combined))
            return combined
          })

          setCurrentUser(prevUser => {
            if (!prevUser) return prevUser
            const matching = cloudProfiles.find(p => p.id === prevUser.id || p.email === prevUser.email)
            if (matching) {
              const updated = { ...prevUser, ...matching }
              const sessionStr = localStorage.getItem('dakshana_session')
              if (sessionStr) {
                try {
                  const session = JSON.parse(sessionStr)
                  session.user = updated
                  localStorage.setItem('dakshana_session', JSON.stringify(session))
                } catch (e) { }
              }
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

  // Handlers
  const handleSignOut = () => {
    localStorage.removeItem('dakshana_session')
    localStorage.removeItem('dakshana_current_user')
    setCurrentUser(null)
    setIsAuthModalOpen(false)
  }

  const handleUserLogin = (selectedUser) => {
    const now = Date.now()
    const sessionData = {
      user: selectedUser,
      loggedInAt: now,
      expiresAt: now + TWO_WEEKS_MS
    }
    setCurrentUser(selectedUser)
    localStorage.setItem('dakshana_session', JSON.stringify(sessionData))
    localStorage.setItem('dakshana_current_user', JSON.stringify(selectedUser))
    setIsAuthModalOpen(false)
  }

  const handleUpdatePhoto = async (newPhotoUrl) => {
    if (!currentUser) return
    const updatedUser = { ...currentUser, photo: newPhotoUrl }
    setCurrentUser(updatedUser)
    
    // Update persistent 2-week session
    const sessionStr = localStorage.getItem('dakshana_session')
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr)
        session.user = updatedUser
        localStorage.setItem('dakshana_session', JSON.stringify(session))
      } catch (e) { }
    }
    localStorage.setItem('dakshana_current_user', JSON.stringify(updatedUser))

    setAllUsers(prev => {
      const updated = prev.map(u => u.id === currentUser.id ? { ...u, photo: newPhotoUrl } : u)
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    try {
      await dbUpdateProfile(currentUser.id, { photo_url: newPhotoUrl })
    } catch (err) {
      console.warn('Could not sync photo to Supabase:', err)
    }
  }

  const handleAddPost = (newPost) => {
    setPosts(prev => {
      const updated = [newPost, ...prev]
      localStorage.setItem('dakshana_posts', JSON.stringify(updated))
      return updated
    })

    // If marked as done, increment intern's visits count in sessions
    if (newPost.isCompleted) {
      setSessions(prev => {
        const found = prev.find(s => s.internId === newPost.authorId)
        let updated
        if (found) {
          updated = prev.map(s => {
            if (s.internId === newPost.authorId) {
              return {
                ...s,
                sessionsCount: (s.sessionsCount || 0) + (newPost.visitsLogged || 1),
                studentsReached: (s.studentsReached || 0) + (newPost.studentsReached || 0)
              }
            }
            return s
          })
        } else {
          updated = [...prev, {
            internId: newPost.authorId,
            internName: newPost.authorName,
            batch: newPost.batch,
            sessionsCount: newPost.visitsLogged || 1,
            studentsReached: newPost.studentsReached || 0,
            wing: newPost.wing,
            topic: newPost.title
          }]
        }
        localStorage.setItem('dakshana_sessions', JSON.stringify(updated))
        return updated
      })
    }
  }

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

    dbUpdateProfile(internId, { batch: newBatch }).catch(console.error)
  }

  const handleAddIntern = async (newIntern) => {
    let finalScholar = { ...newIntern }

    try {
      const { data, error } = await dbCreateProfile(newIntern)
      if (error) {
        console.error('Supabase profile insertion error:', error)
      } else if (data && data.id) {
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
    dbUpdateReport(reportId, updates).catch(console.error)
  }

  const handleToggleCycle = () => {
    setCycle(prev => {
      const updated = {
        ...prev,
        isActive: !prev.isActive,
        activatedBy: currentUser?.name || 'Senior Secretary'
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
    dbUpdateClaim(claimId, {
      status: newStatus,
      approvedBy: approverName,
      paidAt: newStatus === 'paid' ? new Date().toISOString() : null
    }).catch(console.error)
  }

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

  const handleSendBroadcast = (newBroadcast) => {
    setBroadcasts(prev => {
      const updated = [newBroadcast, ...prev]
      localStorage.setItem('dakshana_broadcasts', JSON.stringify(updated))
      return updated
    })
    dbCreateBroadcast(newBroadcast).catch(console.error)
  }

  const unreadCount = broadcasts.filter(b => b.isNew).length

  // Start everything from a dedicated full-screen login page if no active user session
  if (!currentUser) {
    return (
      <AuthModal
        isOpen={true}
        isFullScreen={true}
        onClose={() => {}}
        allUsers={allUsers}
        onRegisterScholar={handleAddIntern}
        onLogin={handleUserLogin}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Sidebar Navigation (Ordered strictly as requested) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        currentUser={currentUser}
        unreadBroadcastsCount={unreadCount}
        onSignOut={handleSignOut}
        onSwitchProfile={() => setIsAuthModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* PWA App Prompt */}
        <InstallAppBanner />

        {/* Top Navbar */}
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          unreadBroadcastsCount={unreadCount}
        />

        {/* Dynamic Page Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && currentUser && (
            <>
              {currentUser.role === 'senior_sec' && (
                <SeniorSecView
                  allUsers={allUsers}
                  reports={reports}
                  sessions={sessions}
                  onReassignIntern={handleReassignIntern}
                  onUpdateInternBatch={handleUpdateInternBatch}
                  onAddIntern={handleAddIntern}
                  onSelectIntern={(intern) => setSelectedInternForModal(intern)}
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
                  sessions={sessions}
                  onUpdateReport={handleUpdateReport}
                  delegatedPowers={delegatedPowers}
                  onReassignIntern={handleReassignIntern}
                  onUpdateInternBatch={handleUpdateInternBatch}
                  onSelectIntern={(intern) => setSelectedInternForModal(intern)}
                />
              )}

              {currentUser.role === 'intern' && (
                <InternView
                  currentUser={currentUser}
                  allUsers={allUsers}
                  reports={reports}
                  sessions={sessions}
                  onSubmitReport={handleSubmitReport}
                  onSelectIntern={(intern) => setSelectedInternForModal(intern)}
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

          {/* TAB 2: NOTICES & CIRCULARS */}
          {(activeTab === 'notices' || activeTab === 'broadcasts') && (
            <BroadcastCenter
              currentUser={currentUser}
              broadcasts={broadcasts}
              onSendBroadcast={handleSendBroadcast}
              delegatedPowers={delegatedPowers}
            />
          )}

          {/* TAB 3: POSTS & ACTIVITY FEED */}
          {activeTab === 'posts' && (
            <PostsFeed
              currentUser={currentUser}
              posts={posts}
              onAddPost={handleAddPost}
              onSelectIntern={(intern) => setSelectedInternForModal(intern)}
            />
          )}

          {/* TAB 4: MATERIALS HUB (Strictly the 2 official links) */}
          {activeTab === 'resources' && (
            <ResourceHub />
          )}

          {/* TAB 5: REIMBURSEMENTS */}
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

          {/* TAB 6: TEAM (Kept at the end) */}
          {activeTab === 'team' && (
            <TeamShowcase
              allUsers={allUsers}
              onSelectIntern={(intern) => setSelectedInternForModal(intern)}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          Dakshana Outreach Internship Portal • "Honor. Knowledge. Service" • Batch 1 & Batch 2
        </footer>

      </div>

      {/* Student Profile Inspection Modal (For Junior Sec & Above) */}
      <InternDetailModal
        intern={selectedInternForModal}
        onClose={() => setSelectedInternForModal(null)}
        sessions={sessions}
        reports={reports}
        posts={posts}
        allUsers={allUsers}
        currentUser={currentUser}
        onReassignIntern={handleReassignIntern}
        onUpdateInternBatch={handleUpdateInternBatch}
      />

      {/* Auth / Switch Profile / Login Modal (When logged in) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        isFullScreen={false}
        onClose={() => setIsAuthModalOpen(false)}
        allUsers={allUsers}
        onRegisterScholar={handleAddIntern}
        onLogin={handleUserLogin}
      />

      {/* Edit Profile Photo Modal (Upload or Default Icon) */}
      <EditProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentUser={currentUser}
        onUpdatePhoto={handleUpdatePhoto}
      />

    </div>
  )
}
