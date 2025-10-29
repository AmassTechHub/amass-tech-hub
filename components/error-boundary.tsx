'use client';

import { Component, ErrorInfo, ReactNode, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; reset: () => void }) => ReactNode);
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log error to your error tracking service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Integrate with your error tracking service (e.g., Sentry, LogRocket)
    // Example:
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({ 
            error: this.state.error, 
            reset: this.handleReset 
          });
        }
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="container mx-auto p-6 max-w-4xl">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {process.env.NODE_ENV === 'development' ? (
                <div className="mt-2 space-y-2">
                  <p className="font-mono text-sm">{this.state.error?.toString()}</p>
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer">View stack trace</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              ) : (
                <p>An unexpected error occurred. Please try again later.</p>
              )}
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={this.handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="ghost">
              <a href="/">Go to homepage</a>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for function components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
}

// Hook for function components
export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    throw error;
  }
  
  return setError;
}

// Type for error boundary state with reset capability
export type ErrorBoundaryStateWithReset = {
  error: Error | null;
  reset: () => void;
};

// Hook to use error boundary state
// export function useErrorBoundaryState(): ErrorBoundaryStateWithReset {
//   const [error, setError] = useState<Error | null>(null);
  
//   const reset = () => setError(null);
  
//   return { error, reset };
// }
