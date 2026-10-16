/**
 * Date and relative time formatting utilities for Dakshana Outreach App.
 * Displays clean human-readable date along with "how many days ago" relative indicator.
 */

export function formatDateWithRelative(dateInput) {
  if (!dateInput) return 'Today'

  const inputStr = String(dateInput).trim()

  // Base anchor: today is in October 2026 as per application timeline
  const now = new Date()

  let dateObj = null
  let relativeText = ''

  // 1. Check if input is standard ISO (YYYY-MM-DD) or parseable timestamp
  const isStandardDate = /^\d{4}-\d{2}-\d{2}/.test(inputStr) || !isNaN(Date.parse(inputStr))
  
  if (isStandardDate && !inputStr.toLowerCase().includes('ago') && !inputStr.toLowerCase().includes('today') && !inputStr.toLowerCase().includes('yesterday')) {
    dateObj = new Date(inputStr)
    const diffMs = now.getTime() - dateObj.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffDays <= 0 && diffHours < 24) {
      relativeText = diffHours <= 1 ? 'Today • Just now' : `Today (${diffHours} hrs ago)`
    } else if (diffDays === 1) {
      relativeText = 'Yesterday (1 day ago)'
    } else if (diffDays > 1) {
      relativeText = `${diffDays} days ago`
    } else {
      relativeText = 'Today'
    }
  } else {
    // 2. Parse relative descriptive strings like "2 hours ago", "Yesterday", "2 days ago"
    const lower = inputStr.toLowerCase()

    if (lower.includes('just now') || lower.includes('mins ago') || lower.includes('hour')) {
      dateObj = now
      relativeText = inputStr
    } else if (lower.includes('today')) {
      dateObj = now
      relativeText = inputStr
    } else if (lower.includes('yesterday')) {
      dateObj = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      relativeText = 'Yesterday (1 day ago)'
    } else if (lower.includes('2 days ago')) {
      dateObj = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      relativeText = '2 days ago'
    } else if (lower.includes('3 days ago')) {
      dateObj = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      relativeText = '3 days ago'
    } else if (lower.includes('days ago')) {
      const match = lower.match(/(\d+)\s*days?\s*ago/)
      const days = match ? parseInt(match[1], 10) : 4
      dateObj = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      relativeText = `${days} days ago`
    } else {
      dateObj = now
      relativeText = inputStr
    }
  }

  // Format date part: "16 Oct 2026"
  const day = dateObj.getDate()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[dateObj.getMonth()]
  const year = dateObj.getFullYear()
  const formattedDate = `${day} ${month} ${year}`

  return `${formattedDate} • ${relativeText}`
}

export function getDaysAgoBadge(dateInput) {
  if (!dateInput) return 'Today'
  const text = formatDateWithRelative(dateInput)
  const parts = text.split('•')
  return parts.length > 1 ? parts[1].trim() : parts[0].trim()
}
