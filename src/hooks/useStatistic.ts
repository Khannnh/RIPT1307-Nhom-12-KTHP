import borrowRecordService from '@/services/borrow-record.service';
import { useEffect, useState } from 'react';

export function useStatistic() {
  const [totalBorrows, setTotalBorrows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const records = await borrowRecordService.getAllBorrowRecords();
      setTotalBorrows(records.length); // records là mảng, length là tổng lượt mượn
    };
    fetchData();
  }, []);

  return { totalBorrows };
}