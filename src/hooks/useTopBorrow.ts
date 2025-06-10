import { useEffect, useState } from 'react';
import borrowRecordService from '@/services/borrow-record.service';

export function useTopBorrowedDevices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await borrowRecordService.getTopBorrowedDevices();
      setDevices(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { devices, loading };
}