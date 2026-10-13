import React from 'react'
import { Mail, Shield, Award, Users, Star, Sparkles } from 'lucide-react'

export default function TeamShowcase({ allUsers }) {
  const management = allUsers.find(u => u.role === 'management')
  const seniorSec = allUsers.find(u => u.role === 'senior_sec')
  const juniorSecs = allUsers.filter(u => u.role === 'junior_sec')

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Leadership & Secretariat Structure</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Meet Our Leadership Team</h2>
          <p className="text-slate-500 text-xs mt-1">
            Governing authority, central operations, and wing leadership coordinating our cohort of ~70 scholars.
          </p>
        </div>
      </div>

      {/* Tier 1 & 2: Executive Management & Senior Secretary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Management Card */}
        {management && (
          <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-sm p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
              Board of Trustees
            </div>
            <img
              src={management.photo}
              alt={management.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-purple-100 flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{management.name}</h3>
                <p className="text-xs font-semibold text-purple-700">{management.title}</p>
                <p className="text-[11px] text-slate-500">{management.department}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{management.bio}</p>
              <div className="pt-2 flex items-center justify-center sm:justify-start text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span>{management.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Senior Secretary Card (The User!) */}
        {seniorSec && (
          <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
              Central Authority
            </div>
            <img
              src={seniorSec.photo}
              alt={seniorSec.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-md border-2 border-indigo-100 flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{seniorSec.name}</h3>
                <p className="text-xs font-semibold text-indigo-700">{seniorSec.title}</p>
                <p className="text-[11px] text-slate-500">{seniorSec.department}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{seniorSec.bio}</p>
              <div className="pt-2 flex items-center justify-center sm:justify-start text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                <span>{seniorSec.email}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Tier 3: The 3 Junior Secretaries */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Junior Secretaries (Supervisory Wing Leads)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {juniorSecs.map((jsec, index) => (
            <div key={jsec.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={jsec.photo}
                    alt={jsec.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-100 shadow-xs flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Wing Lead 0{index + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{jsec.name}</h4>
                    <p className="text-xs text-emerald-700 font-medium">{jsec.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-2">{jsec.department}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{jsec.bio}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">{jsec.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
