import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Science Centre render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#060913] px-4 text-center text-slate-100">
          <div className="max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6">
            <p className="font-mono text-xs text-cyan-400">
              Mission: Little Astronaut
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-white">
              Display Recovery Needed
            </h1>
            <p className="mt-2 text-sm text-slate-300">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex min-h-[40px] items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
            >
              Reload Science Centre
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
