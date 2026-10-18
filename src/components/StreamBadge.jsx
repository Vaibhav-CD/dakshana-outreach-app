import React from 'react'

/**
 * Reusable Stream Badge for Dakshana Scholars.
 * JEE = Engineering stream (Dakshana Forest Green theme #0A643B)
 * NEET = Medical stream (Dakshana Plum/Maroon theme #7B2E68)
 */
export default function StreamBadge({ stream = 'JEE', size = 'sm', className = '' }) {
  const isNeet = String(stream).toUpperCase() === 'NEET'
  const label = isNeet ? 'NEET' : 'JEE'
  const sublabel = isNeet ? 'Medical' : 'Engineering'

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.2',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1 font-bold'
  }[size] || 'text-[10px] px-2 py-0.5'

  const themeClasses = isNeet
    ? 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/40'
    : 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/40'

  const dotColor = isNeet ? 'bg-[#7B2E68]' : 'bg-[#0A643B]'

  return (
    <span
      className={`inline-flex items-center font-black tracking-wider rounded-full border shadow-2xs transition-colors select-none ${themeClasses} ${sizeClasses} ${className}`}
      title={`Dakshana ${label} Stream (${sublabel})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 ${dotColor}`} />
      <span>{label}</span>
    </span>
  )
}
