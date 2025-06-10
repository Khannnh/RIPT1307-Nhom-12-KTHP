import { useEffect, useState } from 'react';
import borrowRecordService from '@/services/borrow-record.service';

export interface DeviceTableRow {
  rank: number;
  name: string;
  category: string;
  borrows: number;
  percentage: string;
}

export function useBorrowedDeviceTable() {
  const [tableData, setTableData] = useState<DeviceTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const records = await borrowRecordService.getAllBorrowRecords();
      // Lọc các yêu cầu đã được duyệt
      const approved = records.filter((item: any) => item.status === 'approved');

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

      // Chuyển sang mảng và sort giảm dần theo số lượt mượn
      const arr = Object.values(deviceMap)
        .sort((a, b) => b.borrows - a.borrows)
        .map((d, idx, all) => ({
          rank: idx + 1,
          name: d.name,
          category: d.category,
          borrows: d.borrows,
          percentage: ((d.borrows / all.reduce((sum, x) => sum + x.borrows, 0)) * 100).toFixed(1) + '%',
        }));

      setTableData(arr);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { tableData, loading };
}