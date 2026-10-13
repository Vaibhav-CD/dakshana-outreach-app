import React, { useState, useEffect } from 'react'
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react'
import logoImg from '../assets/logo.png'

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true)
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  if (isStandalone || !showBanner) return null

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    } else {
      setShowInstructions(true)
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] text-white px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <img
              src={logoImg}
              alt="Dakshana"
              className="w-7 h-7 rounded-full object-cover border border-white/40 flex-shrink-0"
            />
            <div>
              <p className="font-bold text-white flex items-center gap-1.5">
                <span>Install Dakshana Outreach App</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.2 rounded-full font-normal">PWA</span>
              </p>
              <p className="text-emerald-100 text-[11px]">Install on your phone or PC for 1-tap offline access. Both website and app stay in sync!</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-lg bg-white text-[#0A643B] hover:bg-emerald-50 font-extrabold text-xs flex items-center shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
              Install Dakshana App
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Instructions Modal for iOS / Desktop */}
      {showInstructions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center">
                <img src={logoImg} className="w-5 h-5 rounded-full mr-2" alt="" />
                How to Install the Dakshana App
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1 flex items-center">
                  <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                  On iPhone (Safari):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Add</strong>. The Dakshana icon will be added to your home screen!</li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1 flex items-center">
                  <PlusSquare className="w-3.5 h-3.5 mr-1.5 text-[#7B2E68]" />
                  On Android (Chrome):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                  <li>Tap the <strong>three dots (⋮)</strong> menu in Chrome.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Confirm install. The Dakshana icon will appear in your app launcher.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white font-semibold text-xs cursor-pointer shadow-sm"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
