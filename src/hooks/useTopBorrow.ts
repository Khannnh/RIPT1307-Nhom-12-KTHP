// 
import { useEffect, useState } from 'react';
import borrowRecordService from '@/services/borrow-record.service';

export function useTopBorrowedDevices(/*month?: number, year?: number*/) {
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await borrowRecordService.getTopBorrowedDevices();
      // Không filter theo tháng/năm vì không có borrowDate
      setDevice(data && data.length > 0 ? data[0] : null);
      setLoading(false);
    };
    fetchData();
  }, []); // Không phụ thuộc vào month, year

  return { device, loading };
}