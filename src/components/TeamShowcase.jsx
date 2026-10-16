import React from 'react'
import { Mail, Phone, Shield, Award, Users, Sparkles } from 'lucide-react'
import logoImg from '../assets/logo.png'
import Avatar from './Avatar'

export default function TeamShowcase({ allUsers, onSelectIntern }) {
  const managementMembers = allUsers.filter(u => u.role === 'management')
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
              "Honor. Knowledge. Service." • Governing authority, central operations, and junior secretaries coordinating outreach scholars.
            </p>
          </div>
        </div>
      </div>

      {/* Tier 1: Central Operations Authority (Senior Secretary) */}
      {seniorSec && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-[#0A643B]" />
            <h3 className="text-lg font-bold text-slate-900">Central Operational Leadership</h3>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#0A643B]/30 shadow-sm p-6 relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            <div className="absolute top-0 right-0 bg-[#0A643B] text-white text-[10px] font-extrabold uppercase tracking-widest py-1 px-3 rounded-bl-xl">
              Central Authority
            </div>
            <Avatar
              src={seniorSec.photo}
              name={seniorSec.name}
              role={seniorSec.role}
              size="3xl"
              className="shadow-md border-2 border-[#0A643B]/20 flex-shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{seniorSec.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 inline-block mt-1">
                  Senior Secretary
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{seniorSec.department}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{seniorSec.bio}</p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                <a href={`mailto:${seniorSec.email}`} className="flex items-center text-slate-600 hover:text-[#0A643B] transition-colors font-medium">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                  <span>{seniorSec.email}</span>
                </a>
                {seniorSec.phone && (
                  <a href={`tel:${seniorSec.phone}`} className="flex items-center text-[#0A643B] font-bold bg-[#EBF7F0] px-3 py-1 rounded-xl border border-[#0A643B]/20 hover:bg-[#0A643B] hover:text-white transition-colors shadow-2xs">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    <span>{seniorSec.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tier 2: Board of Trustees & Executive Management (3 Members, No Phone Numbers) */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-[#7B2E68]" />
          <h3 className="text-lg font-bold text-slate-900">Board of Trustees & Executive Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {managementMembers.map((mgmt) => (
            <div
              key={mgmt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between hover:border-[#7B2E68]/40 transition-all"
            >
              <div className="absolute top-0 right-0 bg-[#7B2E68] text-white text-[9px] font-extrabold uppercase tracking-widest py-0.5 px-2.5 rounded-bl-lg">
                Board / Trustee
              </div>
              <div>
                <div className="flex items-center space-x-3.5 mb-3">
                  <Avatar
                    src={mgmt.photo}
                    name={mgmt.name}
                    role={mgmt.role}
                    size="xl"
                    className="shadow-xs border-2 border-[#7B2E68]/20 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{mgmt.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8EDF5] text-[#7B2E68] border border-[#7B2E68]/30 inline-block mt-0.5">
                      {mgmt.title}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{mgmt.bio}</p>
              </div>

              {/* Email Only - Strictly No Phone Number for Management */}
              <div className="pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-[#7B2E68] flex-shrink-0" />
                <a href={`mailto:${mgmt.email}`} className="truncate hover:underline text-slate-600">
                  {mgmt.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 3: Junior Secretaries (No specialized sub-roles or departments mentioned) */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-[#0A643B]" />
          <h3 className="text-lg font-bold text-slate-900">Junior Secretaries</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {juniorSecs.map((jsec) => (
            <div key={jsec.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-[#0A643B]/40 transition-all">
              <div>
                <div className="flex items-center space-x-4 mb-3">
                  <Avatar
                    src={jsec.photo}
                    name={jsec.name}
                    role={jsec.role}
                    size="xl"
                    className="border-2 border-emerald-100 shadow-xs flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{jsec.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30 inline-block mt-0.5">
                      Junior Secretary
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{jsec.bio}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <a href={`mailto:${jsec.email}`} className="flex items-center text-slate-500 hover:text-[#0A643B] truncate max-w-[160px]">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#0A643B] flex-shrink-0" />
                  <span className="truncate">{jsec.email}</span>
                </a>
                {jsec.phone && (
                  <a href={`tel:${jsec.phone}`} className="flex items-center text-[#0A643B] font-bold bg-[#EBF7F0] px-2.5 py-1 rounded-lg border border-[#0A643B]/20 hover:bg-[#0A643B] hover:text-white transition-colors shadow-2xs flex-shrink-0">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    <span>{jsec.phone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 4: Cohort Outreach Scholars */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#0A643B]" />
            <h3 className="text-lg font-bold text-slate-900">Outreach Scholars ({allUsers.filter(u => u.role === 'intern').length})</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click on any scholar to view visits, activity logs & graphs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allUsers.filter(u => u.role === 'intern').map((intern) => (
            <div
              key={intern.id}
              onClick={() => onSelectIntern && onSelectIntern(intern)}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-[#0A643B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Avatar
                  src={intern.photo}
                  name={intern.name}
                  role={intern.role || 'intern'}
                  size="md"
                  className="border border-slate-200 group-hover:border-[#0A643B] transition-colors flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate group-hover:text-[#0A643B] transition-colors">
                    {intern.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-50 text-amber-900 border border-amber-200 inline-block mt-0.5">
                    {intern.batch || 'Batch 1'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 truncate mb-2">
                Outreach Scholar
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0A643B]">
                <span>View Visits & Stats</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
