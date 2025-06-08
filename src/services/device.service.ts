import axios from 'axios';

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken';
  location: string;
  description?: string;
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
  const response = await axios.get('/api/devices', { params });
  return response.data;
};

export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await axios.get(`/api/devices/${id}`);
  return response.data;
};

export const getDeviceStatistics = async (): Promise<DeviceStatistics> => {
  const response = await axios.get('/api/devices/statistics');
  return response.data;
}; 