import borrowRecordService from '@/services/borrow-record.service';
import { useEffect, useState } from 'react';

export function useStatistic(month?: number, year?: number) {
  const [totalBorrows, setTotalBorrows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const records = await borrowRecordService.getAllBorrowRecords();
      const approvedRecords = records.filter((item: any) => {
        if (item.status !== 'approved') return false;
        if (month && year) {
          const date = new Date(item.borrowDate);
          return date.getMonth() + 1 === month && date.getFullYear() === year;
        }
        return true;
      });
      setTotalBorrows(approvedRecords.length);
    };
    fetchData();
  }, [month, year]);

  return { totalBorrows };
}