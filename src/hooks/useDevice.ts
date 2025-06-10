import { useEffect, useState } from 'react';
import borrowRecordService from '@/services/borrow-record.service';

export function useDeviceCategoryCount(month?: number, year?: number) {
  const [categoryCount, setCategoryCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const records = await borrowRecordService.getAllBorrowRecords();
      // Lọc các bản ghi đã duyệt và đúng tháng/năm nếu có
      const approved = records.filter((item: any) => {
        if (item.status !== 'approved') return false;
        if (month && year) {
          const date = new Date(item.borrowDate);
          return date.getMonth() + 1 === month && date.getFullYear() === year;
        }
        return true;
      });

      // Đếm số thiết bị theo category
      const count: Record<string, number> = {};
      approved.forEach((item: any) => {
        const category = item.device?.[0]?.category || item.category || 'Khác';
        count[category] = (count[category] || 0) + 1;
      });
      setCategoryCount(count);
    };
    fetchData();
  }, [month, year]);

  return categoryCount;
}