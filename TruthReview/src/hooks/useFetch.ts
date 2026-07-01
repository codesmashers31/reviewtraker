import { useState, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';
import { api } from '../services/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseFetchOptions extends AxiosRequestConfig {
  method?: HttpMethod;
}

export function useFetch<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, options?: UseFetchOptions, body?: any) => {
      setLoading(true);
      setError(null);
      try {
        const method = options?.method || 'GET';
        const config: AxiosRequestConfig = {
          ...options,
          url,
          method,
          data: body,
        };

        const response = await api(config);
        setData(response.data);
        return response.data;
      } catch (err: any) {
        // err is already formatted by api.ts interceptor
        const errorMessage = err?.message || 'Something went wrong';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, execute, setData };
}
