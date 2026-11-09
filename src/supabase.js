import { createClient } from '@supabase/supabase-js'
import { sanitizeInput } from './utils/security'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zbtvjqxmwrucnetzrywx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHZqcXhtd3J1Y25ldHpyeXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MDMwNjQsImV4cCI6MjEwNzQ3OTA2NH0.ewBkHNm5hHb72m3ls7FCi2NJrIzIa7I3D90ouapIDAI'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Deterministic UUID mapping for legacy/mock IDs to satisfy PostgreSQL UUID constraints
export const LEGACY_ID_MAP = {
  'user-senior-sec': '00000000-0000-4000-8000-000000000001',
  'user-ssec-1': '00000000-0000-4000-8000-000000000001',
  'user-mgmt': '00000000-0000-4000-8000-000000000002',
  'user-mgmt-1': '00000000-0000-4000-8000-000000000002',
  'user-jsec-1': '11111111-1111-4111-8111-111111111111',
  'user-jsec-2': '22222222-2222-4222-8222-222222222222',
  'user-jsec-3': '33333333-3333-4333-8333-333333333333',
  'user-intern-1': 'aaaa0001-0000-4000-8000-000000000001',
  'user-intern-2': 'aaaa0002-0000-4000-8000-000000000002',
  'user-intern-3': 'aaaa0003-0000-4000-8000-000000000003',
  'user-intern-4': 'aaaa0004-0000-4000-8000-000000000004',
  'user-intern-5': 'aaaa0005-0000-4000-8000-000000000005'
}

export const REVERSE_LEGACY_ID_MAP = Object.entries(LEGACY_ID_MAP).reduce((acc, [k, v]) => {
  acc[v] = k
  return acc
}, {})

export function toValidUuid(val) {
  if (!val) return null
  if (LEGACY_ID_MAP[val]) return LEGACY_ID_MAP[val]
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(val) ? val : null
}

// ==========================================
// SUPABASE DATABASE SYNC HELPERS
// ==========================================

// Profiles (Users / Scholars)
export async function dbFetchProfiles() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
      console.warn('Error fetching profiles from Supabase:', error.message)
      return null
    }
    if (!data || data.length === 0) return null
    return data.map(d => ({
      id: REVERSE_LEGACY_ID_MAP[d.id] || d.id,
      name: d.full_name,
      email: d.email,
      role: d.role,
      batch: d.batch,
      title: d.role === 'intern' ? 'Outreach Scholar' : d.role === 'senior_sec' ? 'Senior Secretary' : d.role === 'junior_sec' ? 'Junior Secretary' : 'Trustee',
      department: d.department || (d.role === 'junior_sec' ? (d.id === '11111111-1111-4111-8111-111111111111' ? 'Panel 1' : d.id === '22222222-2222-4222-8222-222222222222' ? 'Panel 2' : 'Panel 3') : ''),
      phone: d.phone,
      photo: d.photo_url || null,
      assignedTo: REVERSE_LEGACY_ID_MAP[d.assigned_to] || d.assigned_to,
      bio: d.bio,
      passwordHash: d.password_hash || null,
      targetVisits: d.target_visits || 15
    }))
  } catch (err) {
    console.warn('Network error fetching profiles from Supabase:', err)
    return null
  }
}

export async function dbCreateProfile(user) {
  if (!supabase) return { data: null, error: new Error('Supabase client not initialized') }
  try {
    const payload = {
      full_name: sanitizeInput(user.name),
      email: user.email.toLowerCase().trim(),
      // Strict Security: All user self-registrations are strictly Outreach Scholars (intern role).
      // Secretariat, Trustee and Junior Secretary accounts cannot be created via public registration.
      role: 'intern',
      batch: user.batch || 'Batch 1',
      department: user.department || 'General Outreach',
      phone: user.phone ? sanitizeInput(user.phone) : null,
      photo_url: user.photo || null,
      bio: user.bio ? sanitizeInput(user.bio) : null,
      assigned_to: toValidUuid(user.assignedTo),
      password_hash: user.passwordHash || null,
      target_visits: user.targetVisits || 15
    }

    // Only assign id if it is already a valid UUID
    const validId = toValidUuid(user.id)
    if (validId) {
      payload.id = validId
    }

    const { data, error } = await supabase.from('profiles').insert([payload]).select().single()
    if (error) {
      console.error('Supabase profile insertion error:', error)
    } else {
      console.log('Supabase profile successfully created:', data)
    }
    return { data, error }
  } catch (err) {
    console.error('Exception during dbCreateProfile:', err)
    return { data: null, error: err }
  }
}

export async function dbUpdateProfile(id, updates) {
  if (!supabase || !id) return null
  try {
    const targetId = toValidUuid(id) || id
    const payload = {}
    if (updates.name) payload.full_name = sanitizeInput(updates.name)
    if (updates.email) payload.email = sanitizeInput(updates.email).toLowerCase().trim()
    if (updates.batch) payload.batch = updates.batch
    if (updates.department !== undefined) payload.department = sanitizeInput(updates.department)
    if (updates.bio !== undefined) payload.bio = sanitizeInput(updates.bio)
    if (updates.phone !== undefined) payload.phone = sanitizeInput(updates.phone)
    if (updates.assignedTo !== undefined) payload.assigned_to = toValidUuid(updates.assignedTo)
    if (updates.photo_url !== undefined) payload.photo_url = updates.photo_url
    if (updates.photo !== undefined) payload.photo_url = updates.photo
    if (updates.password_hash !== undefined) payload.password_hash = updates.password_hash
    if (updates.passwordHash !== undefined) payload.password_hash = updates.passwordHash
    if (updates.target_visits !== undefined || updates.targetVisits !== undefined) {
      const rawTarget = updates.target_visits !== undefined ? updates.target_visits : updates.targetVisits
      payload.target_visits = Math.min(100, Math.max(1, parseInt(rawTarget, 10) || 15))
    }

    if (Object.keys(payload).length === 0) return { data: null, error: null }
    const { data, error } = await supabase.from('profiles').update(payload).eq('id', targetId)
    return { data, error }
  } catch (err) {
    console.error('dbUpdateProfile error:', err)
    return { data: null, error: err }
  }
}

// Monthly Reports
export async function dbFetchReports() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('monthly_reports').select('*')
    if (error || !data || data.length === 0) return null
    return data.map(r => ({
      id: r.id,
      internId: REVERSE_LEGACY_ID_MAP[r.intern_id] || r.intern_id,
      internName: r.intern_name,
      batch: r.batch,
      juniorSecId: REVERSE_LEGACY_ID_MAP[r.junior_sec_id] || r.junior_sec_id,
      monthYear: r.month_year,
      tasksCompleted: r.tasks_completed,
      hoursContributed: r.hours_contributed,
      challengesFaced: r.challenges_faced,
      nextMonthGoals: r.next_month_goals,
      status: r.status,
      reviewerFeedback: r.reviewer_feedback,
      reviewedBy: r.reviewed_by,
      updatedAt: r.updated_at ? r.updated_at.split('T')[0] : '2026-10-13'
    }))
  } catch (err) {
    console.warn('Network error fetching reports:', err)
    return null
  }
}

export async function dbCreateReport(report) {
  if (!supabase) return null
  try {
    const internUuid = toValidUuid(report.internId) || report.internId
    const { data, error } = await supabase.from('monthly_reports').insert([{
      intern_id: internUuid,
      intern_name: sanitizeInput(report.internName),
      batch: report.batch || 'Batch 1',
      junior_sec_id: toValidUuid(report.juniorSecId),
      month_year: report.monthYear,
      tasks_completed: sanitizeInput(report.tasksCompleted),
      hours_contributed: Math.max(0, parseInt(report.hoursContributed, 10) || 0),
      challenges_faced: sanitizeInput(report.challengesFaced || '', 1000),
      next_month_goals: sanitizeInput(report.nextMonthGoals || '', 1000),
      status: 'submitted', // Enforce default submitted status; cannot be created as pre-reviewed
      reviewer_feedback: '',
      reviewed_by: null
    }]).select().single()
    return { data, error }
  } catch (err) {
    console.error('dbCreateReport error:', err)
    return { data: null, error: err }
  }
}

export async function dbUpdateReport(id, updates) {
  if (!supabase || !id) return null
  try {
    const payload = {}
    if (updates.status) payload.status = updates.status
    if (updates.reviewerFeedback !== undefined) payload.reviewer_feedback = sanitizeInput(updates.reviewerFeedback)
    if (updates.reviewedBy !== undefined) payload.reviewed_by = sanitizeInput(updates.reviewedBy)
    if (updates.reviewedAt) payload.reviewed_at = updates.reviewedAt

    if (Object.keys(payload).length === 0) return { data: null, error: null }
    const { data, error } = await supabase.from('monthly_reports').update(payload).eq('id', id)
    return { data, error }
  } catch (err) {
    console.error('dbUpdateReport error:', err)
    return { data: null, error: err }
  }
}

// Reimbursement Claims
export async function dbFetchClaims() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('reimbursement_claims').select('*')
    if (error || !data || data.length === 0) return null
    return data.map(c => ({
      id: c.id,
      internId: c.intern_id,
      internName: c.intern_name,
      batch: c.batch,
      monthYear: c.month_year,
      amount: Number(c.amount),
      upiOrBank: c.upi_or_bank,
      purpose: c.purpose,
      status: c.status,
      approvedBy: c.approved_by,
      paidAt: c.paid_at ? c.paid_at.split('T')[0] : null
    }))
  } catch (err) {
    console.warn('Network error fetching claims:', err)
    return null
  }
}

export async function dbCreateClaim(claim) {
  if (!supabase) return null
  try {
    const internUuid = toValidUuid(claim.internId) || claim.internId
    const validatedAmount = Math.min(25000, Math.max(1, parseFloat(claim.amount) || 0))
    const { data, error } = await supabase.from('reimbursement_claims').insert([{
      intern_id: internUuid,
      intern_name: sanitizeInput(claim.internName, 100),
      batch: claim.batch || 'Batch 1',
      month_year: claim.monthYear,
      amount: validatedAmount,
      upi_or_bank: sanitizeInput(claim.upiOrBank, 100),
      purpose: sanitizeInput(claim.purpose, 500),
      status: 'pending' // Enforce initial pending status; cannot be created as pre-approved or pre-paid
    }]).select().single()
    return { data, error }
  } catch (err) {
    console.error('dbCreateClaim error:', err)
    return { data: null, error: err }
  }
}

export async function dbUpdateClaim(id, updates) {
  if (!supabase || !id) return null
  try {
    const payload = {}
    if (updates.status) payload.status = updates.status
    if (updates.approvedBy !== undefined) payload.approved_by = sanitizeInput(updates.approvedBy)
    if (updates.paidAt !== undefined) payload.paid_at = updates.paidAt

    if (Object.keys(payload).length === 0) return { data: null, error: null }
    const { data, error } = await supabase.from('reimbursement_claims').update(payload).eq('id', id)
    return { data, error }
  } catch (err) {
    console.error('dbUpdateClaim error:', err)
    return { data: null, error: err }
  }
}

// Broadcast Notices
export async function dbFetchBroadcasts() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('broadcast_messages').select('*').order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return null
    return data.map(b => ({
      id: b.id,
      sender: b.sender,
      title: b.title,
      message: b.message,
      audience: b.audience,
      date: new Date(b.created_at).toLocaleDateString(),
      isNew: false
    }))
  } catch (err) {
    console.warn('Network error fetching broadcasts:', err)
    return null
  }
}

export async function dbCreateBroadcast(b) {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('broadcast_messages').insert([{
      sender: sanitizeInput(b.sender),
      title: sanitizeInput(b.title),
      message: sanitizeInput(b.message),
      audience: b.audience || 'all'
    }]).select().single()
    return { data, error }
  } catch (err) {
    console.error('dbCreateBroadcast error:', err)
    return { data: null, error: err }
  }
}

// ==========================================
// Community Outreach Posts & Notes
// ==========================================
export async function dbFetchPosts() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      // Table may not yet be created in schema
      return null
    }
    if (!data || data.length === 0) return null
    return data.map(p => ({
      id: p.id,
      authorId: p.author_id,
      authorName: p.author_name,
      authorPhoto: p.author_photo,
      batch: p.batch || 'Batch 1',
      wing: p.wing,
      title: p.title,
      content: p.content,
      photoUrl: p.photo_url,
      schoolName: p.school_name,
      isCompleted: Boolean(p.is_completed),
      visitsLogged: p.visits_logged || 0,
      studentsReached: p.students_reached || 0,
      cheersCount: p.cheers_count || 0,
      comments: Array.isArray(p.comments) ? p.comments : [],
      createdAt: p.created_at
    }))
  } catch (err) {
    console.warn('Network error fetching posts from Supabase:', err)
    return null
  }
}

export async function dbCreatePost(post) {
  if (!supabase) return null
  try {
    const payload = {
      id: post.id || undefined,
      author_id: String(post.authorId),
      author_name: sanitizeInput(post.authorName),
      author_photo: post.authorPhoto || null,
      batch: post.batch || 'Batch 1',
      wing: sanitizeInput(post.wing || 'Outreach Wing'),
      title: sanitizeInput(post.title || 'Outreach Milestone Update'),
      content: sanitizeInput(post.content || ''),
      photo_url: post.photoUrl || null,
      school_name: post.schoolName ? sanitizeInput(post.schoolName) : null,
      is_completed: Boolean(post.isCompleted),
      visits_logged: Math.max(0, parseInt(post.visitsLogged, 10) || (post.isCompleted ? 1 : 0)),
      students_reached: Math.max(0, parseInt(post.studentsReached, 10) || 0),
      cheers_count: Math.max(0, parseInt(post.cheersCount, 10) || 1),
      comments: Array.isArray(post.comments) ? post.comments : []
    }
    const { data, error } = await supabase.from('posts').insert([payload]).select().single()
    if (error) {
      console.warn('Supabase post insert notification:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn('Error during dbCreatePost:', err)
    return null
  }
}

export async function dbAddCommentToPost(postId, comment) {
  if (!supabase || !postId) return null
  try {
    const { data: post, error: fetchErr } = await supabase
      .from('posts')
      .select('comments')
      .eq('id', postId)
      .single()
    if (fetchErr || !post) return null

    const existingComments = Array.isArray(post.comments) ? post.comments : []
    const cleanComment = {
      ...comment,
      authorName: sanitizeInput(comment.authorName || 'Scholar'),
      text: sanitizeInput(comment.text || '')
    }
    const updatedComments = [...existingComments, cleanComment]

    const { data, error } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('id', postId)
      .select()
      .single()
    return { data, error }
  } catch (err) {
    console.warn('Error adding comment to post:', err)
    return null
  }
}
