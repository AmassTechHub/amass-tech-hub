'use client';

import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

type AdminPageProps = {
  title: string;
  isLoading?: boolean;
  error?: Error | string | null;
  children: ReactNode;
  actions?: ReactNode;
};

export function AdminPage({
  title,
  isLoading = false,
  error = null,
  children,
  actions,
}: AdminPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && <div className="space-y-6">{children}</div>}
    </div>
  );
}
