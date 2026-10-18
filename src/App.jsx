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
import ChangePasswordModal from './components/ChangePasswordModal'
import FeedbackModal from './components/FeedbackModal'
import ErrorBoundary from './components/ErrorBoundary'
import { Radio, X, Bell, Bug } from 'lucide-react'
import QueriesHub from './components/QueriesHub'
import { parseDateToTimestamp } from './utils/dateUtils'
import {
  INITIAL_USERS,
  INITIAL_REPORTS,
  INITIAL_SESSIONS,
  INITIAL_REIMBURSEMENT_CYCLE,
  INITIAL_REIMBURSEMENT_CLAIMS,
  INITIAL_RESOURCES,
  INITIAL_BROADCASTS,
  INITIAL_POSTS,
  INITIAL_QUERIES,
  INITIAL_ASSIGNED_TASKS,
  INITIAL_SUGGESTIONS
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
  dbCreateBroadcast,
  dbFetchPosts,
  dbCreatePost,
  dbAddCommentToPost
} from './supabase'

// 2 Weeks session duration in milliseconds (14 days = 14 * 24 * 60 * 60 * 1000)
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

// Pleasant notification sound synthesizer for incoming notices & circulars
function playNoticeChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    osc.start(now)
    osc.stop(now + 0.5)
  } catch (e) {
    // Audio context may require user gesture on some browsers
  }
}

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

  // 12. Queries & Doubt Resolution Hub
  const [queries, setQueries] = useState(() => {
    const saved = localStorage.getItem('dakshana_queries')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return INITIAL_QUERIES
  })

  // 13. Assigned Tasks with "Done or Not" tracking (Junior Secs and Senior Sec)
  const [assignedTasks, setAssignedTasks] = useState(() => {
    const saved = localStorage.getItem('dakshana_assigned_tasks')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return INITIAL_ASSIGNED_TASKS
  })

  // 14. Suggestions & Maintenance Issues Tracker (For Senior Secretary)
  const [suggestions, setSuggestions] = useState(() => {
    const saved = localStorage.getItem('dakshana_suggestions')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) { }
    }
    return INITIAL_SUGGESTIONS
  })

  // 15. Read Broadcasts tracking & Active Toast for real-time alerts
  const [readBroadcastIds, setReadBroadcastIds] = useState(() => {
    const saved = localStorage.getItem('dakshana_read_broadcasts')
    if (saved) {
      try { return JSON.parse(saved) } catch (e) { }
    }
    return []
  })
  const [activeNoticeToast, setActiveNoticeToast] = useState(null)

  // 14. UI States: Modals & Sidebar
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [selectedInternForModal, setSelectedInternForModal] = useState(null)

  // Cloud Sync from Supabase on App Mount
  useEffect(() => {
    async function syncFromCloud() {
      try {
        const [cloudProfiles, cloudReports, cloudClaims, cloudBroadcasts, cloudPosts] = await Promise.all([
          dbFetchProfiles(),
          dbFetchReports(),
          dbFetchClaims(),
          dbFetchBroadcasts(),
          dbFetchPosts()
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
          const sortedCloudBroadcasts = [...cloudBroadcasts].sort((a, b) => {
            return parseDateToTimestamp(b?.date || b?.createdAt) - parseDateToTimestamp(a?.date || a?.createdAt)
          })
          setBroadcasts(sortedCloudBroadcasts)
          localStorage.setItem('dakshana_broadcasts', JSON.stringify(sortedCloudBroadcasts))
        }
        if (cloudPosts && cloudPosts.length > 0) {
          setPosts(prev => {
            const combined = [...cloudPosts]
            prev.forEach(localPost => {
              if (!combined.some(cp => cp.id === localPost.id)) {
                combined.unshift(localPost)
              }
            })
            combined.sort((a, b) => {
              return parseDateToTimestamp(b?.createdAt || b?.date) - parseDateToTimestamp(a?.createdAt || a?.date)
            })
            localStorage.setItem('dakshana_posts', JSON.stringify(combined))
            return combined
          })
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

  const handleUpdatePassword = async (newPassword) => {
    if (!currentUser) return false
    const updatedUser = { ...currentUser, password: newPassword }
    setCurrentUser(updatedUser)

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
      const updated = prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u)
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    try {
      await dbUpdateProfile(currentUser.id, { password: newPassword })
    } catch (err) {
      console.warn('Could not sync password to Supabase:', err)
    }

    return true
  }

  const handleAddPost = async (newPost) => {
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

    try {
      await dbCreatePost(newPost)
    } catch (err) {
      console.warn('Could not sync new post to Supabase:', err)
    }
  }

  const handleAddComment = async (postId, newComment) => {
    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          const comments = [...(p.comments || []), newComment]
          return { ...p, comments }
        }
        return p
      })
      localStorage.setItem('dakshana_posts', JSON.stringify(updated))
      return updated
    })

    try {
      await dbAddCommentToPost(postId, newComment)
    } catch (err) {
      console.warn('Could not sync comment to Supabase:', err)
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

  const handleUpdateInternStream = (internId, newStream) => {
    setAllUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === internId) {
          return { ...user, stream: newStream }
        }
        return user
      })
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    if (currentUser && currentUser.id === internId) {
      setCurrentUser(prev => {
        const updated = { ...prev, stream: newStream }
        localStorage.setItem('dakshana_current_user', JSON.stringify(updated))
        const sessionStr = localStorage.getItem('dakshana_session')
        if (sessionStr) {
          try {
            const session = JSON.parse(sessionStr)
            session.user = updated
            localStorage.setItem('dakshana_session', JSON.stringify(session))
          } catch (e) { }
        }
        return updated
      })
    }

    dbUpdateProfile(internId, { stream: newStream }).catch(console.error)
  }

  const handleUpdateInternTargetVisits = (internId, newTarget) => {
    const parsedTarget = Math.max(1, parseInt(newTarget, 10) || 15)

    setAllUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === internId) {
          return { ...user, targetVisits: parsedTarget }
        }
        return user
      })
      localStorage.setItem('dakshana_all_users', JSON.stringify(updated))
      return updated
    })

    if (currentUser && currentUser.id === internId) {
      setCurrentUser(prev => ({ ...prev, targetVisits: parsedTarget }))
    }

    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.internId === internId) {
          return { ...s, targetVisits: parsedTarget }
        }
        return s
      })
      localStorage.setItem('dakshana_sessions', JSON.stringify(updated))
      return updated
    })

    dbUpdateProfile(internId, { target_visits: parsedTarget }).catch(console.error)
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

  // Query & Doubts Forum Handlers
  const handleAddQuery = (newQuery) => {
    setQueries(prev => {
      const updated = [newQuery, ...prev]
      localStorage.setItem('dakshana_queries', JSON.stringify(updated))
      return updated
    })
  }

  const handleAddAnswer = (queryId, newAnswer) => {
    setQueries(prev => {
      const updated = prev.map(q => {
        if (q.id === queryId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer]
          }
        }
        return q
      })
      localStorage.setItem('dakshana_queries', JSON.stringify(updated))
      return updated
    })
  }

  const handleToggleResolveQuery = (queryId) => {
    setQueries(prev => {
      const updated = prev.map(q => {
        if (q.id === queryId) {
          const nextStatus = q.status === 'resolved' ? 'open' : 'resolved'
          return {
            ...q,
            status: nextStatus,
            resolvedAt: nextStatus === 'resolved' ? 'Just now' : null
          }
        }
        return q
      })
      localStorage.setItem('dakshana_queries', JSON.stringify(updated))
      return updated
    })
  }

  const handleUpvoteQuery = (queryId) => {
    setQueries(prev => {
      const updated = prev.map(q => {
        if (q.id === queryId) {
          return { ...q, upvotes: (q.upvotes || 0) + 1 }
        }
        return q
      })
      localStorage.setItem('dakshana_queries', JSON.stringify(updated))
      return updated
    })
  }

  // Assigned Directives & Tasks Handlers ("Done or Not" update tracking)
  const handleToggleTaskDone = (taskId) => {
    setAssignedTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.isCompleted
          return {
            ...t,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null
          }
        }
        return t
      })
      localStorage.setItem('dakshana_assigned_tasks', JSON.stringify(updated))
      return updated
    })
  }

  const handleAssignTask = (newTask) => {
    setAssignedTasks(prev => {
      const updated = [newTask, ...prev]
      localStorage.setItem('dakshana_assigned_tasks', JSON.stringify(updated))
      return updated
    })
  }

  // System Improvement & Maintenance Handlers (Senior Secretary Exclusive)
  const handleRectifySuggestion = (suggestionId, rectificationNote) => {
    setSuggestions(prev => {
      const updated = prev.map(s => {
        if (s.id === suggestionId) {
          return {
            ...s,
            status: 'rectified',
            rectifiedAt: new Date().toISOString(),
            rectifiedBy: currentUser?.name || 'Senior Secretary',
            rectifiedNote: rectificationNote || 'Rectified and verified in maintenance update.'
          }
        }
        return s
      })
      localStorage.setItem('dakshana_suggestions', JSON.stringify(updated))
      return updated
    })
  }

  const handleAddSuggestion = (newSug) => {
    setSuggestions(prev => {
      const updated = [newSug, ...prev]
      localStorage.setItem('dakshana_suggestions', JSON.stringify(updated))
      return updated
    })
  }

  // Circulars / Notices Visibility & Notification Dispatcher
  const visibleBroadcasts = broadcasts.filter(b => {
    if (!currentUser) return true
    if (currentUser.role === 'senior_sec' || currentUser.role === 'management') return true
    if (b.audience === 'all') return true
    if (currentUser.role === 'junior_sec') {
      return b.audience === 'junior_secs' || b.audience === 'all_interns' || b.audience === 'batch_1' || b.audience === 'batch_2'
    }
    if (currentUser.role === 'intern') {
      if (b.audience === 'all_interns') return true
      if (currentUser.batch === 'Batch 1' && b.audience === 'batch_1') return true
      if (currentUser.batch === 'Batch 2' && b.audience === 'batch_2') return true
      return false
    }
    return false
  })

  const unreadCount = visibleBroadcasts.filter(b => !readBroadcastIds.includes(b.id)).length

  const handleMarkAllNoticesRead = () => {
    const allIds = visibleBroadcasts.map(b => b.id)
    const updated = Array.from(new Set([...readBroadcastIds, ...allIds]))
    setReadBroadcastIds(updated)
    localStorage.setItem('dakshana_read_broadcasts', JSON.stringify(updated))
  }

  const handleSelectNotice = (notice) => {
    if (notice) {
      if (!readBroadcastIds.includes(notice.id)) {
        const updated = [...readBroadcastIds, notice.id]
        setReadBroadcastIds(updated)
        localStorage.setItem('dakshana_read_broadcasts', JSON.stringify(updated))
      }
    }
    handleSetActiveTab('notices')
  }

  const handleSendBroadcast = (newBroadcast) => {
    setBroadcasts(prev => {
      const updated = [newBroadcast, ...prev]
      localStorage.setItem('dakshana_broadcasts', JSON.stringify(updated))
      return updated
    })
    dbCreateBroadcast(newBroadcast).catch(console.error)

    // Notify immediately with high-priority audio & visual alert
    setActiveNoticeToast(newBroadcast)
    playNoticeChime()
  }

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
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
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
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          unreadBroadcastsCount={unreadCount}
          broadcasts={visibleBroadcasts}
          onSelectNotice={handleSelectNotice}
          onMarkAllNoticesRead={handleMarkAllNoticesRead}
        />

        {/* Dynamic Page Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          <ErrorBoundary onReset={() => setActiveTab('dashboard')} onGoHome={() => handleSetActiveTab('dashboard')}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && currentUser && (
            <>
              {currentUser.role === 'senior_sec' && (
                <SeniorSecView
                  currentUser={currentUser}
                  allUsers={allUsers}
                  reports={reports}
                  sessions={sessions}
                  onReassignIntern={handleReassignIntern}
                  onUpdateInternBatch={handleUpdateInternBatch}
                  onUpdateInternStream={handleUpdateInternStream}
                  onUpdateInternTargetVisits={handleUpdateInternTargetVisits}
                  onAddIntern={handleAddIntern}
                  onSelectIntern={(intern) => setSelectedInternForModal(intern)}
                  delegatedPowers={delegatedPowers}
                  onTogglePrivilege={handleTogglePrivilege}
                  onBulkPrivilege={handleBulkPrivilege}
                  assignedTasks={assignedTasks}
                  onToggleTaskDone={handleToggleTaskDone}
                  onAssignTask={handleAssignTask}
                  suggestions={suggestions}
                  onRectifySuggestion={handleRectifySuggestion}
                  onAddSuggestion={handleAddSuggestion}
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
                  onUpdateInternTargetVisits={handleUpdateInternTargetVisits}
                  onSelectIntern={(intern) => setSelectedInternForModal(intern)}
                  assignedTasks={assignedTasks}
                  onToggleTaskDone={handleToggleTaskDone}
                  onAddSuggestion={handleAddSuggestion}
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
                  onAddSuggestion={handleAddSuggestion}
                />
              )}

              {currentUser.role === 'management' && (
                <ManagementView
                  allUsers={allUsers}
                  reports={reports}
                  sessions={sessions}
                  assignedTasks={assignedTasks}
                  onToggleTaskDone={handleToggleTaskDone}
                  onAssignTask={handleAssignTask}
                  suggestions={suggestions}
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
              onAddComment={handleAddComment}
              onSelectIntern={(intern) => setSelectedInternForModal(intern)}
            />
          )}

          {/* TAB 4: QUERIES & DOUBTS HUB */}
          {activeTab === 'queries' && (
            <QueriesHub
              currentUser={currentUser}
              queries={queries}
              onAddQuery={handleAddQuery}
              onAddAnswer={handleAddAnswer}
              onToggleResolve={handleToggleResolveQuery}
              onUpvoteQuery={handleUpvoteQuery}
            />
          )}

          {/* TAB 5: MATERIALS HUB (Strictly the 2 official links + Extra resources) */}
          {activeTab === 'resources' && (
            <ResourceHub currentUser={currentUser} />
          )}

          {/* TAB 6: REIMBURSEMENTS */}
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

          {/* TAB 7: TEAM (Kept at the end) */}
          {activeTab === 'team' && (
            <TeamShowcase
              allUsers={allUsers}
              onSelectIntern={(intern) => setSelectedInternForModal(intern)}
            />
          )}

          </ErrorBoundary>
        </main>

        {/* Live Circular Notification Banner / Toast */}
        {activeNoticeToast && (
          <div className="fixed top-20 right-4 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-[#0A643B] flex items-start space-x-3 shadow-2xl">
              <div className="p-2.5 rounded-xl bg-[#0A643B] text-white flex-shrink-0 animate-bounce">
                <Radio className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center">
                    <Bell className="w-3 h-3 inline mr-1" />
                    New Notice from {activeNoticeToast.senderTitle || 'Secretariat'}
                  </span>
                  <button
                    onClick={() => setActiveNoticeToast(null)}
                    className="text-slate-400 hover:text-white p-0.5 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-white truncate mt-0.5">
                  {activeNoticeToast.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {activeNoticeToast.message}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    From: <strong className="text-white">{activeNoticeToast.sender}</strong>
                  </span>
                  <button
                    onClick={() => {
                      handleSelectNotice(activeNoticeToast)
                      setActiveNoticeToast(null)
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap ml-2"
                  >
                    View Circular &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
        onUpdateInternStream={handleUpdateInternStream}
        onUpdateInternTargetVisits={handleUpdateInternTargetVisits}
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

      {/* Change Password Modal (Strictly Accessible When Logged In) */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        currentUser={currentUser}
        onUpdatePassword={handleUpdatePassword}
      />

      {/* Global Feedback & Bug Report Desk Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        currentUser={currentUser}
        activeTab={activeTab}
        onSubmitFeedback={handleAddSuggestion}
        onNavigateToMaintenance={() => handleSetActiveTab('dashboard')}
      />

      {/* Floating 1-Click Bug / Feedback Desk Button */}
      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        className="fixed bottom-5 right-5 z-40 bg-[#0A643B] hover:bg-[#074D2D] text-white py-2.5 px-3.5 sm:px-4 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border-2 border-white/80 transition-all hover:scale-105 cursor-pointer group"
        title="Report any bug, glitch, or share feedback directly with Senior Secretary"
      >
        <Bug className="w-4 h-4 text-rose-300 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Report Bug / Feedback</span>
      </button>

    </div>
  )
}
