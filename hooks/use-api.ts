import { useState, useCallback } from 'react';
import { toast } from 'sonner';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface ApiRequestOptions<T> {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
  skipToast?: boolean;
}

export function useApi<T = any>(endpoint: string) {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = useCallback(async (options: ApiRequestOptions<T> = {}) => {
    const {
      method = 'GET',
      body,
      headers = {},
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      skipToast = false,
    } = options;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      setState(prev => ({
        ...prev,
        data,
        loading: false,
      }));

      if (successMessage && !skipToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(data);
      }

      return { data, error: null };
    } catch (error: any) {
      const errorMessageToShow = errorMessage || error.message || 'An error occurred';
      
      setState(prev => ({
        ...prev,
        error: errorMessageToShow,
        loading: false,
      }));

      if (!skipToast) {
        toast.error(errorMessageToShow);
      }

      if (onError) {
        onError(errorMessageToShow);
      }

      return { data: null, error: errorMessageToShow };
    }
  }, [endpoint]);

  // Helper methods for common HTTP methods
  const get = useCallback((options?: Omit<ApiRequestOptions<T>, 'method'>) => 
    request({ ...options, method: 'GET' }),
    [request]
  );

  const post = useCallback((body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) => 
    request({ ...options, method: 'POST', body }),
    [request]
  );

  const put = useCallback((body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) => 
    request({ ...options, method: 'PUT', body }),
    [request]
  );

  const patch = useCallback((body: any, options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>) => 
    request({ ...options, method: 'PATCH', body }),
    [request]
  );

  const remove = useCallback((options?: Omit<ApiRequestOptions<T>, 'method'>) => 
    request({ ...options, method: 'DELETE' }),
    [request]
  );

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    delete: remove,
    reset: () => setState({ data: null, error: null, loading: false }),
  };
}
