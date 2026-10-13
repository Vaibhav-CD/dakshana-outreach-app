import React from 'react'
import { Mail, Shield, Award, Users, Sparkles } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function TeamShowcase({ allUsers }) {
  const management = allUsers.find(u => u.role === 'management')
  const seniorSec = allUsers.find(u => u.role === 'senior_sec')
  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')

  return (
    <div className="space-y-8">
      {/* Official Emblem & Page Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={logoImg}
            alt="Dakshana Outreach Internship Official Seal"
            className="w-24 h-24 rounded-full object-cover shadow-md border-3 border-[#0A643B] flex-shrink-0"
          />
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#EBF7F0] border border-[#0A643B]/30 text-[#0A643B] text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dakshana Outreach Internship Leadership</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secretariat & Governance Structure</h2>
            <p className="text-slate-500 text-xs mt-1">
              "Honor. Knowledge. Service." • Governing authority, central operations, and wing leads coordinating ~70 outreach scholars.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 1 & 2: Executive Management & Senior Secretary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Management Card */}
        {management && (
          <div className="bg-white rounded-2xl border-2 border-[#7B2E68]/30 shadow-sm p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="absolute top-0 right-0 bg-[#7B2E68] text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
              Board / Trustees
            </div>
            <img
              src={management.photo}
              alt={management.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-[#7B2E68]/20 flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{management.name}</h3>
                <p className="text-xs font-semibold text-[#7B2E68]">{management.title}</p>
                <p className="text-[11px] text-slate-500">{management.department}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{management.bio}</p>
              <div className="pt-2 flex items-center justify-center sm:justify-start text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-[#7B2E68]" />
                <span>{management.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Senior Secretary Card (The User!) */}
        {seniorSec && (
          <div className="bg-white rounded-2xl border-2 border-[#0A643B]/30 shadow-sm p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="absolute top-0 right-0 bg-[#0A643B] text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
              Central Authority
            </div>
            <img
              src={seniorSec.photo}
              alt={seniorSec.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-[#0A643B]/20 flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{seniorSec.name}</h3>
                <p className="text-xs font-semibold text-[#0A643B]">{seniorSec.title}</p>
                <p className="text-[11px] text-slate-500">{seniorSec.department}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{seniorSec.bio}</p>
              <div className="pt-2 flex items-center justify-center sm:justify-start text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                <span>{seniorSec.email}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Tier 3: The 3 Junior Secretaries */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-[#0A643B]" />
          <h3 className="text-lg font-bold text-slate-900">Junior Secretaries (Supervisory Wing Leads)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {juniorSecs.map((jsec, index) => (
            <div key={jsec.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-[#0A643B]/40 transition-all">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={jsec.photo}
                    alt={jsec.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-100 shadow-xs flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30">
                      Wing Lead 0{index + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{jsec.name}</h4>
                    <p className="text-xs text-[#0A643B] font-semibold">{jsec.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-2">{jsec.department}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{jsec.bio}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A643B] flex-shrink-0" />
                <span className="truncate">{jsec.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
