import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="border border-red-500/30 rounded-lg bg-red-500/5 p-6 text-center">
            <p className="text-red-400 text-sm font-mono">
              <span className="text-red-500">&gt;</span> Editor failed to load
            </p>
            <p className="text-geek-text/50 text-xs mt-2 font-mono">
              {this.state.error.message}
            </p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
