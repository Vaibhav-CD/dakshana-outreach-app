import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zbtvjqxmwrucnetzrywx.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHZqcXhtd3J1Y25ldHpyeXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MDMwNjQsImV4cCI6MjEwNzQ3OTA2NH0.ewBkHNm5hHb72m3ls7FCi2NJrIzIa7I3D90ouapIDAI'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ==========================================
// SUPABASE DATABASE SYNC HELPERS
// ==========================================

// Profiles (Users / Scholars)
export async function dbFetchProfiles() {
  if (!supabase) return null
  const { data, error } = await supabase.from('profiles').select('*')
  if (error || !data || data.length === 0) return null
  return data.map(d => ({
    id: d.id,
    name: d.full_name,
    email: d.email,
    role: d.role,
    batch: d.batch,
    title: d.role === 'intern' ? 'Outreach Scholar' : d.role === 'senior_sec' ? 'Senior Secretary' : d.role === 'junior_sec' ? 'Junior Secretary' : 'Trustee',
    department: d.department,
    phone: d.phone,
    photo: d.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    assignedTo: d.assigned_to,
    bio: d.bio
  }))
}

export async function dbCreateProfile(user) {
  if (!supabase) return null
  const { data, error } = await supabase.from('profiles').insert([{
    full_name: user.name,
    email: user.email,
    role: user.role,
    batch: user.batch || 'Batch 1',
    department: user.department,
    phone: user.phone || null,
    photo_url: user.photo || null,
    bio: user.bio || null,
    assigned_to: user.assignedTo || null
  }]).select().single()
  return { data, error }
}

export async function dbUpdateProfile(id, updates) {
  if (!supabase) return null
  const payload = {}
  if (updates.name) payload.full_name = updates.name
  if (updates.batch) payload.batch = updates.batch
  if (updates.assignedTo) payload.assigned_to = updates.assignedTo
  const { data, error } = await supabase.from('profiles').update(payload).eq('id', id)
  return { data, error }
}

// Monthly Reports
export async function dbFetchReports() {
  if (!supabase) return null
  const { data, error } = await supabase.from('monthly_reports').select('*')
  if (error || !data || data.length === 0) return null
  return data.map(r => ({
    id: r.id,
    internId: r.intern_id,
    internName: r.intern_name,
    batch: r.batch,
    juniorSecId: r.junior_sec_id,
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
}

export async function dbCreateReport(report) {
  if (!supabase) return null
  const { data, error } = await supabase.from('monthly_reports').insert([{
    intern_id: report.internId,
    intern_name: report.internName,
    batch: report.batch || 'Batch 1',
    junior_sec_id: report.juniorSecId || null,
    month_year: report.monthYear,
    tasks_completed: report.tasksCompleted,
    hours_contributed: report.hoursContributed,
    challenges_faced: report.challengesFaced || '',
    next_month_goals: report.nextMonthGoals || '',
    status: report.status || 'submitted',
    reviewer_feedback: report.reviewerFeedback || '',
    reviewed_by: report.reviewedBy || null
  }]).select().single()
  return { data, error }
}

export async function dbUpdateReport(id, updates) {
  if (!supabase) return null
  const payload = {}
  if (updates.status) payload.status = updates.status
  if (updates.reviewerFeedback !== undefined) payload.reviewer_feedback = updates.reviewerFeedback
  if (updates.reviewedBy !== undefined) payload.reviewed_by = updates.reviewedBy
  if (updates.reviewedAt) payload.reviewed_at = updates.reviewedAt
  const { data, error } = await supabase.from('monthly_reports').update(payload).eq('id', id)
  return { data, error }
}

// Reimbursement Claims
export async function dbFetchClaims() {
  if (!supabase) return null
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
}

export async function dbCreateClaim(claim) {
  if (!supabase) return null
  const { data, error } = await supabase.from('reimbursement_claims').insert([{
    intern_id: claim.internId,
    intern_name: claim.internName,
    batch: claim.batch || 'Batch 1',
    month_year: claim.monthYear,
    amount: claim.amount,
    upi_or_bank: claim.upiOrBank,
    purpose: claim.purpose,
    status: claim.status || 'pending'
  }]).select().single()
  return { data, error }
}

export async function dbUpdateClaim(id, updates) {
  if (!supabase) return null
  const payload = {}
  if (updates.status) payload.status = updates.status
  if (updates.approvedBy !== undefined) payload.approved_by = updates.approvedBy
  if (updates.paidAt !== undefined) payload.paid_at = updates.paidAt
  const { data, error } = await supabase.from('reimbursement_claims').update(payload).eq('id', id)
  return { data, error }
}

// Broadcast Notices
export async function dbFetchBroadcasts() {
  if (!supabase) return null
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
}

export async function dbCreateBroadcast(b) {
  if (!supabase) return null
  const { data, error } = await supabase.from('broadcast_messages').insert([{
    sender: b.sender,
    title: b.title,
    message: b.message,
    audience: b.audience
  }]).select().single()
  return { data, error }
}
