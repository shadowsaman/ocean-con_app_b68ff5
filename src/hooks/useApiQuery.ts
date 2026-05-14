import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export function useApiQuery<T>(
  key: string[],
  url: string,
  params?: Record<string, unknown>
): UseQueryResult<T, Error> {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const res = await apiClient.get<T>(url, { params });
      return res.data;
    },
  });
}

export function extractList<T>(data: unknown): T[] {
  if (!data) return [];
  const d = data as Record<string, unknown>;
  if (d.data && typeof d.data === 'object') {
    const inner = (d.data as Record<string, unknown>);
    if (Array.isArray(inner.response)) return inner.response as T[];
    if (Array.isArray(inner.data)) return inner.data as T[];
  }
  if (Array.isArray(d.response)) return d.response as T[];
  if (Array.isArray(d.data)) return d.data as T[];
  if (Array.isArray(data)) return data as T[];
  return [];
}
