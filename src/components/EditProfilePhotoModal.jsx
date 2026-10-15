import React, { useState } from 'react'
import {
  X,
  Camera,
  Upload,
  User,
  Trash2,
  Check,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import Avatar from './Avatar'

export default function EditProfilePhotoModal({
  isOpen,
  onClose,
  currentUser,
  onUpdatePhoto
}) {
  if (!isOpen || !currentUser) return null

  const [previewPhoto, setPreviewPhoto] = useState(currentUser.photo || null)
  const [photoUrlInput, setPhotoUrlInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const sampleAvatars = [
    { label: 'Scholar 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scholar 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scholar 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scholar 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scholar 5', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scholar 6', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' }
  ]

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

  const handleApplyUrl = () => {
    if (photoUrlInput.trim()) {
      setPreviewPhoto(photoUrlInput.trim())
      setPhotoUrlInput('')
    }
  }

  const handleResetToDefault = () => {
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
              <h3 className="font-extrabold text-slate-900 text-sm">Update Profile Picture</h3>
              <p className="text-[11px] text-slate-400">Upload a photo or choose a default icon</p>
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
                onClick={handleResetToDefault}
                className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                title="Remove photo & use default icon"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <span className="font-extrabold text-slate-900 text-sm">{currentUser.name}</span>
          <span className="text-[11px] text-slate-500 font-medium">
            {previewPhoto ? 'Custom profile photo active' : 'Using default scholar icon'}
          </span>
        </div>

        {/* Upload & Options Tabs */}
        <div className="space-y-4 text-xs">
          
          {/* Action 1: Upload from Device */}
          <div>
            <label className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-[#0A643B] font-bold cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-4 h-4" />
              <span>Upload Photo from Device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Action 2: Reset / Keep Default Icon */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs block">Keep Default Icon</span>
                <span className="text-[10px] text-slate-500">Show official Dakshana monogram</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToDefault}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition-colors cursor-pointer ${
                previewPhoto === null
                  ? 'bg-[#0A643B] text-white border-[#0A643B]'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {previewPhoto === null ? 'Selected ✓' : 'Use Default'}
            </button>
          </div>

          {/* Action 3: Preset Avatars */}
          <div>
            <span className="block font-bold text-slate-700 mb-2 text-[11px] uppercase tracking-wider">
              Or pick sample avatar:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {sampleAvatars.map((av, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPreviewPhoto(av.url)}
                  className={`p-1 rounded-xl border transition-all cursor-pointer ${
                    previewPhoto === av.url
                      ? 'border-[#0A643B] ring-2 ring-[#0A643B]/40'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={av.url} alt="" className="w-full h-10 object-cover rounded-lg" />
                </button>
              ))}
            </div>
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
            {isSaving ? 'Saving...' : 'Save Profile Picture'}
          </button>
        </div>

      </div>
    </div>
  )
}
