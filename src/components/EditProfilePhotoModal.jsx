import React, { useState } from 'react'
import {
  X,
  Camera,
  Upload,
  User,
  Trash2,
  Check
} from 'lucide-react'
import Avatar, { WhatsAppSilhouette } from './Avatar'

export default function EditProfilePhotoModal({
  isOpen,
  onClose,
  currentUser,
  onUpdatePhoto
}) {
  if (!isOpen || !currentUser) return null

  const isStrangerFace = typeof currentUser.photo === 'string' && currentUser.photo.includes('unsplash.com')
  const initialPhoto = isStrangerFace ? null : (currentUser.photo || null)

  const [previewPhoto, setPreviewPhoto] = useState(initialPhoto)
  const [isSaving, setIsSaving] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetToWhatsAppDefault = () => {
    setPreviewPhoto(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    if (onUpdatePhoto) {
      await onUpdatePhoto(previewPhoto)
    }
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] text-[#0A643B] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Profile Picture</h3>
              <p className="text-[11px] text-slate-400">Upload your personal photo or use WhatsApp default</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="relative group mb-3">
            <Avatar
              src={previewPhoto}
              name={currentUser.name}
              role={currentUser.role}
              size="3xl"
              className="border-3 border-[#0A643B]/30 shadow-lg"
            />
            {previewPhoto && (
              <button
                type="button"
                onClick={handleResetToWhatsAppDefault}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                title="Remove photo & use WhatsApp default icon"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <span className="font-extrabold text-slate-900 text-sm">{currentUser.name}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5">
            {previewPhoto ? 'Custom photo active' : 'WhatsApp default silhouette active'}
          </span>
        </div>

        {/* Options */}
        <div className="space-y-3 text-xs">
          
          {/* Option 1: Upload from Device */}
          <div>
            <label className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-[#0A643B] font-bold cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-4 h-4" />
              <span>Upload Personal Photo from Device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Option 2: Use WhatsApp Default Silhouette */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-2xs flex-shrink-0">
                <WhatsAppSilhouette />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs block">WhatsApp Default Type</span>
                <span className="text-[11px] text-slate-500">Standard clean profile silhouette</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToWhatsAppDefault}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                previewPhoto === null
                  ? 'bg-[#0A643B] text-white border-[#0A643B]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {previewPhoto === null ? 'Active ✓' : 'Use Default'}
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-2 pt-5 mt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-1.5" />
            {isSaving ? 'Saving...' : 'Apply Avatar'}
          </button>
        </div>

      </div>
    </div>
  )
}
