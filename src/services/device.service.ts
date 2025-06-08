import axios from '@/utils/axios';

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken' | 'lost';
  location: string;
  description?: string;
  quantity: number;
  rating?: number;
  borrowCount?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
}

export interface DeviceListResponse {
  data: Device[];
  current: number;
  pageSize: number;
  total: number;
}

export interface DeviceStatistics {
  total: number;
  available: number;
  borrowed: number;
  maintenance: number;
  broken: number;
}

export const getDevices = async (params: DeviceListParams = {}): Promise<DeviceListResponse> => {
  const response = await axios.get('/user/devices', { params });
  return response.data;
};

export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await axios.get(`/user/devices/${id}`);
  return response.data;
};

export const getDeviceStatistics = async (): Promise<DeviceStatistics> => {
  const response = await axios.get('/user/devices/statistics');
  return response.data;
};

export const createDevice = async (device: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>): Promise<Device> => {
  const response = await axios.post('/user/devices', device);
  return response.data;
};

export const updateDevice = async (id: string, device: Partial<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Device> => {
  const response = await axios.put(`/user/devices/${id}`, device);
  return response.data;
};

export const deleteDevice = async (id: string): Promise<void> => {
  await axios.delete(`/user/devices/${id}`);
};
