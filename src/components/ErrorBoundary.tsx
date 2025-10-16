import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('[ErrorBoundary] Error caught:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    console.error('[ErrorBoundary] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
          <div className="max-w-2xl w-full bg-bg-panel p-8 border-2 border-state-negative">
            <div className="mb-6">
              <h1 className="text-3xl font-brand text-state-negative mb-2">
                Application Error
              </h1>
              <p className="text-text-secondary text-lg">
                Something went wrong. The application encountered an unexpected error.
              </p>
            </div>

            <div className="bg-bg-base p-4 border border-border-line mb-6">
              <p className="text-sm text-text-primary font-semibold mb-2">
                Error: {this.state.error?.name}
              </p>
              <p className="text-sm text-text-secondary">
                {this.state.error?.message}
              </p>
            </div>

            <details className="mb-6">
              <summary className="cursor-pointer text-accent-orange font-medium mb-3 hover:underline">
                View Technical Details
              </summary>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-2">Stack Trace:</p>
                  <pre className="text-xs bg-bg-base p-4 overflow-auto border border-border-line max-h-60 text-text-primary font-mono">
                    {this.state.error?.stack}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <p className="text-xs font-semibold text-text-secondary mb-2">Component Stack:</p>
                    <pre className="text-xs bg-bg-base p-4 overflow-auto border border-border-line max-h-60 text-text-primary font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-accent-orange text-white hover:bg-accent-orange/90 font-medium transition-smooth"
              >
                Reload Application
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="px-6 py-3 border border-border-line text-text-primary hover:bg-bg-base font-medium transition-smooth"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
