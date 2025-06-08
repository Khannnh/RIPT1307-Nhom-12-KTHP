import axios from 'axios';

export interface OverviewStatistics {
  totalDevices: number;
  availableDevices: number;
  borrowedDevices: number;
  pendingRequests: number;
}

export interface DeviceStatistics {
  total: number;
  available: number;
  borrowed: number;
  maintenance: number;
  broken: number;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  totalBorrows: number;
  pendingBorrows: number;
}

export const getOverviewStatistics = async (): Promise<OverviewStatistics> => {
  const response = await axios.get('/api/statistics/overview');
  return response.data;
};

export const getDeviceStatistics = async (): Promise<DeviceStatistics> => {
  const response = await axios.get('/api/statistics/devices');
  return response.data;
};

export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await axios.get('/api/statistics/users');
  return response.data;
}; 