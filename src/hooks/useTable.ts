import { useEffect, useState } from 'react';
import borrowRecordService from '@/services/borrow-record.service';

export interface DeviceTableRow {
  rank: number;
  name: string;
  category: string;
  borrows: number;
  percentage: string;
}

export function useBorrowedDeviceTable(month: number, year: number) {
  const [tableData, setTableData] = useState<DeviceTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const records = await borrowRecordService.getAllBorrowRecords();
      // Lọc các yêu cầu đã được duyệt và đúng tháng/năm
      const approved = records.filter((item: any) => {
        if (item.status !== 'approved') return false;
        const date = new Date(item.borrowDate);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      // Đếm số lượt mượn theo thiết bị
      const deviceMap: Record<string, { name: string; category: string; borrows: number }> = {};
      approved.forEach((item: any) => {
        const deviceId = item.deviceId;
        const deviceName = item.device?.[0]?.name || item.deviceName || 'Không rõ';
        const category = item.device?.[0]?.category || item.category || 'Không rõ';
        if (!deviceMap[deviceId]) {
          deviceMap[deviceId] = { name: deviceName, category, borrows: 0 };
        }
        deviceMap[deviceId].borrows += 1;
      });

      const total = Object.values(deviceMap).reduce((sum, d) => sum + d.borrows, 0);

      // Chuyển sang mảng và sort giảm dần theo số lượt mượn
      const arr = Object.values(deviceMap)
        .sort((a, b) => b.borrows - a.borrows)
        .map((d, idx) => ({
          rank: idx + 1,
          name: d.name,
          category: d.category,
          borrows: d.borrows,
          percentage: total ? ((d.borrows / total) * 100).toFixed(1) + '%' : '0%',
        }));

      setTableData(arr);
      setLoading(false);
    };
    fetchData();
  }, [month, year]);

  return { tableData, loading };
}