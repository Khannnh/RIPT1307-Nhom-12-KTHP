import type { ThietBi } from './typing';
import { mockEquipments } from '../../../mock/database'; // Import từ database chung

const APICustom = '/api/equipments';

export async function getThietBi(params: {
  page: number;
  limit: number;
  [key: string]: any;
}): Promise<{ data: ThietBi[]; total: number }> {
  const { page = 1, limit = 10, tenThietBi } = params;
  let data = [...mockEquipments];
  if (tenThietBi) {
    data = data.filter((item) => item.tenThietBi.toLowerCase().includes(tenThietBi.toLowerCase()));
  }
  const total = data.length;
  const paginatedData = data.slice((page - 1) * limit, page * limit);
  return Promise.resolve({ data: paginatedData, total });
}

export async function addThietBi(data: Omit<ThietBi, '_id'>) {
  const newEquipment: ThietBi = {
    _id: `device-${new Date().getTime()}`,
    ...data,
    soLuongDaChoMuon: 0,
    soLuongConLai: data.soLuongTong,
    ngayTao: new Date().toISOString(),
  };
  mockEquipments.unshift(newEquipment);
  return Promise.resolve(newEquipment);
}

export async function updThietBi(id: string, data: Partial<ThietBi>) {
  const index = mockEquipments.findIndex(item => item._id === id);
  if (index !== -1) {
    mockEquipments[index] = { ...mockEquipments[index], ...data };
  }
  return Promise.resolve(mockEquipments[index]);
}

export async function delThietBi(id: string) {
    const index = mockEquipments.findIndex(item => item._id === id);
    if (index !== -1) {
        mockEquipments.splice(index, 1);
    }
  return Promise.resolve({ success: true });
}