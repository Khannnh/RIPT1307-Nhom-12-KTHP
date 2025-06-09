import { useState, useEffect, useCallback } from 'react';
import { getThongKeData } from '@/services/ThongKe/thongKe';
import type { ThongKeApiResponse } from '@/models/thongKe';


export interface UseThongKeDataOptions {
  initialType?: string;
  initialMonth?: number;
  initialYear?: number;
}

export interface UseThongKeDataResult {
  data: ThongKeApiResponse | null;
  loading: boolean;
  error: any;
  refetch: (params?: { type?: string; month?: number; year?: number }) => void;
}

export function useThongKeData(options?: UseThongKeDataOptions): UseThongKeDataResult {
  const [data, setData] = useState<UseThongKeDataResult['data']>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [currentParams, setCurrentParams] = useState({
    type: options?.initialType || 'month',
    month: options?.initialMonth || 6,
    year: options?.initialYear || 2025,
  });
  
  

  const fetchData = useCallback(async (params: { type?: string; month?: number; year?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getThongKeData(params);
      setData(result);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentParams)]);

  const refetch = useCallback((newParams?: { type?: string; month?: number; year?: number }) => {
    setCurrentParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  return { data, loading, error, refetch };
}