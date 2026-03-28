import { useState, useCallback } from 'react';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | string[] | number[]>;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  rateLimitInfo: {
    limit: number;
    remaining: number;
    reset: string;
  } | null;
}

export function useFetch<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
    rateLimitInfo: null,
  });

  const fetchData = useCallback(async (url: string, options: FetchOptions = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Build URL with query params
      let fullUrl = url;
      if (options.params) {
        const params = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, String(value));
            }
          }
        });
        const queryString = params.toString();
        if (queryString) {
          fullUrl += `?${queryString}`;
        }
      }

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Extract rate limit headers
      const rateLimitInfo = {
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
        reset: response.headers.get('X-RateLimit-Reset') || '',
      };

      // Handle rate limiting
      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(
          `Rate limit exceeded. Please try again in ${errorData.retryAfter} seconds.`
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setState({
        data,
        loading: false,
        error: null,
        rateLimitInfo,
      });

      return { data, rateLimitInfo };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      rateLimitInfo: null,
    });
  }, []);

  return {
    ...state,
    fetchData,
    reset,
  };
}
