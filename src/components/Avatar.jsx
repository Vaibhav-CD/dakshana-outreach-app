import React, { useState } from 'react'

export function WhatsAppSilhouette({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="100" rx="50" fill="#CFD9DE" />
      {/* Head */}
      <circle cx="50" cy="38" r="17" fill="#FFFFFF" />
      {/* Shoulders / Torso */}
      <path
        d="M50 60C33.5 60 20 73.5 20 90C20 92.5 22 94.5 24.5 94.5H75.5C78 94.5 80 92.5 80 90C80 73.5 66.5 60 50 60Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

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
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  }

  const currentSizeClass = sizeClasses[size] || sizeClasses.md

  // Do not show strangers' face photos (purges all unsplash mock photos)
  const isStrangerFace = typeof src === 'string' && src.includes('unsplash.com')
  const isImageValid = src && typeof src === 'string' && src.trim().length > 0 && !hasError && !isStrangerFace

  if (isImageValid) {
    return (
      <img
        src={src}
        alt={alt || name || 'User avatar'}
        onError={() => setHasError(true)}
        className={`${currentSizeClass} rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0 ${className}`}
      />
    )
  }

  // Universal WhatsApp Default Silhouette Profile
  return (
    <div
      className={`${currentSizeClass} rounded-full flex items-center justify-center select-none shadow-2xs flex-shrink-0 overflow-hidden border border-slate-200/60 ${className}`}
      title={name || 'Default WhatsApp Avatar'}
    >
      <WhatsAppSilhouette />
    </div>
  )
}
