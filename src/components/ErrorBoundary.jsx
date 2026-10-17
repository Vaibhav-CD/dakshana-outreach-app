import React from 'react'
import { AlertTriangle, RotateCcw, LayoutDashboard } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[380px] flex items-center justify-center p-6">
          <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Unable to display this section</h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                A temporary rendering issue occurred in this tab. Your saved data and session remain completely safe.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-[#0A643B] hover:bg-[#074D2D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Tab</span>
              </button>
              {this.props.onGoHome && (
                <button
                  onClick={() => {
                    this.handleReset()
                    this.props.onGoHome()
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Return to Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
