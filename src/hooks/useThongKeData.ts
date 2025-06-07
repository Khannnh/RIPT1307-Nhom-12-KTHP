// src/hooks/useThongKeData.ts
import { useState, useEffect, useCallback } from 'react';
import { getThongKeData } from '@/services/ThongKe/thongKe'; // Import hàm gọi API
import type { ThongKeApiResponse } from '@/models/thongKe'; // Import model

interface UseThongKeDataOptions {
  initialType?: string;
  initialMonth?: number;
  initialYear?: number;
}

interface UseThongKeDataResult {
  data: ThongKeApiResponse | null;
  loading: boolean;
  error: any;
  refetch: (params?: { type?: string; month?: number; year?: number }) => void;
}

/**
 * Custom Hook để lấy dữ liệu thống kê từ API.
 * @param options Các tùy chọn ban đầu cho việc fetch dữ liệu (loại, tháng, năm).
 * @returns Đối tượng chứa data, loading, error và hàm refetch.
 */
export function useThongKeData(options?: UseThongKeDataOptions): UseThongKeDataResult {
  const [data, setData] = useState<ThongKeApiResponse | null>(null);
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
      setData(null); // Xóa dữ liệu cũ nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentParams);
  }, [fetchData, currentParams]);

  // Hàm để gọi lại API với các tham số mới
  const refetch = useCallback((newParams?: { type?: string; month?: number; year?: number }) => {
    setCurrentParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  return { data, loading, error, refetch };
}