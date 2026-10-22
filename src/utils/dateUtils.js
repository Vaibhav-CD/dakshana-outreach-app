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

/**
 * Parses any date format (ISO timestamp, relative string, or Date)
 * into a numeric Unix timestamp in milliseconds for sorting "latest at the top".
 */
export function parseDateToTimestamp(dateInput) {
  if (!dateInput) return 0
  if (typeof dateInput === 'number') return dateInput
  if (dateInput instanceof Date) return dateInput.getTime()

  const inputStr = String(dateInput).trim()
  const lower = inputStr.toLowerCase()
  const now = Date.now()

  if (lower.includes('just now')) return now
  if (lower.includes('min')) {
    const match = lower.match(/(\d+)\s*min/)
    const mins = match ? parseInt(match[1], 10) : 5
    return now - mins * 60 * 1000
  }
  if (lower.includes('hour')) {
    const match = lower.match(/(\d+)\s*hour/)
    const hours = match ? parseInt(match[1], 10) : 1
    return now - hours * 60 * 60 * 1000
  }
  if (lower.includes('today')) {
    if (lower.includes(':')) {
      const timeMatch = lower.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/)
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10)
        const m = parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3]
        if (ampm === 'pm' && h < 12) h += 12
        if (ampm === 'am' && h === 12) h = 0
        const d = new Date()
        d.setHours(h, m, 0, 0)
        return d.getTime()
      }
    }
    return now - 2 * 60 * 60 * 1000
  }
  if (lower.includes('yesterday')) {
    if (lower.includes(':')) {
      const timeMatch = lower.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/)
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10)
        const m = parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3]
        if (ampm === 'pm' && h < 12) h += 12
        if (ampm === 'am' && h === 12) h = 0
        const d = new Date(now - 24 * 60 * 60 * 1000)
        d.setHours(h, m, 0, 0)
        return d.getTime()
      }
    }
    return now - 24 * 60 * 60 * 1000
  }
  if (lower.includes('day')) {
    const match = lower.match(/(\d+)\s*day/)
    const days = match ? parseInt(match[1], 10) : 2
    return now - days * 24 * 60 * 60 * 1000
  }

  const parsed = Date.parse(inputStr)
  if (!isNaN(parsed)) return parsed

  return 0
}

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

/**
 * Calculates remaining duration until internship end date.
 * Formats strictly as: "X months, Y days remaining" (e.g. "6 months, 8 days remaining").
 * Handles calendar variations and past target dates cleanly.
 *
 * @param {string} targetDateStr - Target end date in 'YYYY-MM-DD' format (e.g. '2027-04-30')
 * @param {string} [startDateStr='2026-06-01'] - Program cycle start date
 * @returns {object} Countdown breakdown and formatted string
 */
export function calculateInternshipCountdown(targetDateStr, startDateStr = '2026-06-01') {
  if (!targetDateStr) {
    return {
      isValid: false,
      formatted: 'Date not set',
      formattedShort: 'Not set',
      totalDays: 0,
      months: 0,
      days: 0,
      isCompleted: false,
      endDateFormatted: 'Not set',
      endDateFullFormatted: 'Not set',
      progressPct: 0
    }
  }

  const parts = targetDateStr.split('-').map(Number)
  const tYear = parts[0]
  const tMonth = parts[1]
  const tDay = parts[2]
  const target = new Date(tYear, tMonth - 1, tDay)

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const diffTime = target.getTime() - today.getTime()
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const endDateFormatted = `${tDay} ${monthNames[tMonth - 1]} ${tYear}`
  const endDateFullFormatted = `${tDay} ${fullMonthNames[tMonth - 1]} ${tYear}`

  if (totalDays <= 0) {
    return {
      isValid: true,
      isCompleted: true,
      totalDays: 0,
      months: 0,
      days: 0,
      formatted: 'Internship Completed',
      formattedShort: 'Completed',
      endDateFormatted,
      endDateFullFormatted,
      targetDateStr,
      progressPct: 100
    }
  }

  // Count full calendar months
  let months = (tYear - today.getFullYear()) * 12 + ((tMonth - 1) - today.getMonth())
  
  const targetMonthIndex = today.getMonth() + months
  const targetYear = today.getFullYear() + Math.floor(targetMonthIndex / 12)
  const normMonthIndex = ((targetMonthIndex % 12) + 12) % 12
  const maxDaysInTargetMonth = getDaysInMonth(targetYear, normMonthIndex)
  const clampedDay = Math.min(today.getDate(), maxDaysInTargetMonth)

  let milestoneDate = new Date(targetYear, normMonthIndex, clampedDay)

  if (milestoneDate > target) {
    months--
    const prevMonthIndex = today.getMonth() + months
    const prevYear = today.getFullYear() + Math.floor(prevMonthIndex / 12)
    const normPrevMonth = ((prevMonthIndex % 12) + 12) % 12
    const maxDaysPrev = getDaysInMonth(prevYear, normPrevMonth)
    const clampedPrevDay = Math.min(today.getDate(), maxDaysPrev)
    milestoneDate = new Date(prevYear, normPrevMonth, clampedPrevDay)
  }

  const remainingMs = target.getTime() - milestoneDate.getTime()
  const days = Math.round(remainingMs / (1000 * 60 * 60 * 24))

  let formatted = ''
  let formattedShort = ''

  if (months > 0 && days > 0) {
    const monthText = months === 1 ? 'month' : 'months'
    const dayText = days === 1 ? 'day' : 'days'
    formatted = `${months} ${monthText}, ${days} ${dayText} remaining`
    formattedShort = `${months} mo, ${days} d left`
  } else if (months > 0 && days === 0) {
    const monthText = months === 1 ? 'month' : 'months'
    formatted = `${months} ${monthText} remaining`
    formattedShort = `${months} mo left`
  } else {
    const dayText = days === 1 ? 'day' : 'days'
    formatted = `${days} ${dayText} remaining`
    formattedShort = `${days} d left`
  }

  let progressPct = 0
  if (startDateStr) {
    const sParts = startDateStr.split('-').map(Number)
    const start = new Date(sParts[0], sParts[1] - 1, sParts[2])
    const totalDuration = target.getTime() - start.getTime()
    const elapsed = today.getTime() - start.getTime()
    if (totalDuration > 0) {
      progressPct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)))
    }
  }

  return {
    isValid: true,
    isCompleted: false,
    totalDays,
    months,
    days,
    formatted,
    formattedShort,
    endDateFormatted,
    endDateFullFormatted,
    targetDateStr,
    progressPct
  }
}
