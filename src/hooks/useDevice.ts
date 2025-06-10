import { useEffect, useState } from 'react';
import { getAdminDevices } from '@/services/device.service';

export function useDeviceCategoryCount() {
  const [categoryCount, setCategoryCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const devices = await getAdminDevices();
      const count: Record<string, number> = {};
      devices.forEach(device => {
        const category = device.category || 'Khác';
        count[category] = (count[category] || 0) + 1;
      });
      setCategoryCount(count);
    };
    fetchData();
  }, []);

  return categoryCount;
}