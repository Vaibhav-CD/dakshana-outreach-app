import React, { useState } from 'react'
import { ExternalLink, Sparkles, FileText, Briefcase, Check, Copy, BookOpen } from 'lucide-react'

export default function ResourceHub() {
  const [copiedLink, setCopiedLink] = useState(null)

  const officialResources = [
    {
      id: 'session-form',
      title: 'Dakshana outreach session form',
      badge: 'Mandatory Form',
      badgeColor: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30',
      icon: FileText,
      iconBg: 'bg-emerald-100 text-[#0A643B] border-emerald-200',
      buttonBg: 'bg-[#0A643B] hover:bg-[#074D2D] text-white',
      cardBorder: 'hover:border-[#0A643B]',
      url: 'https://tinyurl.com/Outreach-session-form',
      description: 'Fill out this official session form to record each school visit, student attendance count, class topics covered, and field outreach activities.',
      usageNote: 'Must be filled after every completed school outreach session.'
    },
    {
      id: 'intern-toolkit',
      title: 'Dakshana intern toolkit',
      badge: 'Official Toolkit 2026–27',
      badgeColor: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30',
      icon: Briefcase,
      iconBg: 'bg-[#F8EDF5] text-[#7B2E68] border-[#7B2E68]/30',
      buttonBg: 'bg-[#7B2E68] hover:bg-[#5F2150] text-white',
      cardBorder: 'hover:border-[#7B2E68]',
      url: 'https://tinyurl.com/interntoolkit26-27',
      description: 'Comprehensive 2026–27 outreach teaching resources, presentation decks, curriculum modules, guidelines, and scholar handbook.',
      usageNote: 'Reference before and during school visits for approved materials.'
    }
  ]

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedLink(id)
    setTimeout(() => setCopiedLink(null), 2500)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Materials Hub Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#0A643B] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dakshana Materials Hub</h2>
            <p className="text-slate-500 text-xs">
              Official outreach resources, session logging forms, and intern toolkits for 2026–27.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Official Links - Strictly the 2 links provided */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {officialResources.map((item) => {
          const Icon = item.icon
          const isCopied = copiedLink === item.id

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between transition-all ${item.cardBorder} hover:shadow-md`}
            >
              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* URL Pill */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-700 truncate mr-2 select-all">
                    {item.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url, item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer flex items-center text-[11px] font-medium flex-shrink-0"
                    title="Copy URL to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
                        <span className="text-[#0A643B] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Usage Note */}
                <div className="text-[11px] text-slate-500 italic mb-6">
                  📌 {item.usageNote}
                </div>
              </div>

              {/* Direct Open Button */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center transition-all shadow-xs hover:shadow-md cursor-pointer ${item.buttonBg}`}
              >
                <span>Open {item.title}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )
        })}
      </div>

      {/* Helpful Instructions Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-purple-50/50 rounded-2xl p-5 border border-[#0A643B]/20 text-xs text-slate-700">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-[#0A643B] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-slate-900 block text-sm">
              Quick Reference for Outreach Interns & Supervisors
            </span>
            <p>
              • <strong>Session Form:</strong> Every outreach scholar must submit the form after conducting each workshop to record attendance and school feedback.
            </p>
            <p>
              • <strong>Intern Toolkit:</strong> Contains all official slides, handouts, and foundational numeracy & science materials for your visits.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
