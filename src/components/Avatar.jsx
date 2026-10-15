import React, { useState } from 'react'
import { User } from 'lucide-react'

export default function Avatar({
  src,
  name = '',
  role = 'intern',
  size = 'md',
  className = '',
  alt = ''
}) {
  const [hasError, setHasError] = useState(false)

  // Size mappings
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
    '2xl': 'w-20 h-20 text-lg',
    '3xl': 'w-24 h-24 text-xl'
  }

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-12 h-12'
  }

  const currentSizeClass = sizeClasses[size] || sizeClasses.md
  const currentIconSize = iconSizes[size] || iconSizes.md

  // Initials generator
  const getInitials = (n) => {
    if (!n) return ''
    const parts = n.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return n.slice(0, 2).toUpperCase()
  }

  // Role color palette for default icon
  const getRoleGradient = (r) => {
    switch (r) {
      case 'senior_sec':
        return 'bg-gradient-to-br from-[#0A643B] to-[#074D2D] text-white border-[#0A643B]/30'
      case 'management':
        return 'bg-gradient-to-br from-[#7B2E68] to-[#5F2150] text-white border-[#7B2E68]/30'
      case 'junior_sec':
        return 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-400/30'
      case 'intern':
      default:
        return 'bg-gradient-to-br from-emerald-700 via-[#0A643B] to-emerald-800 text-white border-emerald-500/20'
    }
  }

  const initials = getInitials(name)
  const isImageValid = src && typeof src === 'string' && src.trim().length > 0 && !hasError

  if (isImageValid) {
    return (
      <img
        src={src}
        alt={alt || name || 'User avatar'}
        onError={() => setHasError(true)}
        className={`${currentSizeClass} rounded-2xl object-cover border border-slate-200 shadow-2xs flex-shrink-0 ${className}`}
      />
    )
  }

  // Fallback: Default Icon with monogram initials
  return (
    <div
      className={`${currentSizeClass} rounded-2xl flex items-center justify-center font-black select-none shadow-2xs flex-shrink-0 border ${getRoleGradient(role)} ${className}`}
      title={name || 'Default Avatar'}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User className={currentIconSize} />
      )}
    </div>
  )
}
