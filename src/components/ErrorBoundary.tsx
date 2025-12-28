import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-card border border-border">
          <AlertTriangle className="w-12 h-12 text-danger mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button 
            onClick={this.handleRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Inline error component for table rows
export const InlineError: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex items-center gap-3 p-4 rounded-lg bg-danger/10 border border-danger/20">
    <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
    <span className="text-sm text-danger flex-1">{message}</span>
    {onRetry && (
      <Button 
        onClick={onRetry} 
        variant="ghost" 
        size="sm"
        className="text-danger hover:text-danger hover:bg-danger/20"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    )}
  </div>
);

export default ErrorBoundary;
