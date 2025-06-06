import { request } from '@/utils/request';
import type { Device } from '@/types/device';

export const deviceService = {
  // User APIs
  getAllDevices: async (params?: { search?: string; category?: string; status?: string }) => {
    const response = await request.get('/user/devices', { params });
    return response.data;
  },

  getTopDevices: async () => {
    const response = await request.get('/user/devices/top');
    return response.data;
  },

  getDeviceById: async (id: string) => {
    const response = await request.get(`/user/devices/${id}`);
    return response.data;
  },

  borrowDevice: async (data: { deviceId: string; borrowDate: Date; returnDate: Date }) => {
    const response = await request.post('/user/devices/borrow', data);
    return response.data;
  },

  getMyBorrowRequests: async () => {
    const response = await request.get('/user/devices/my-requests');
    return response.data;
  },

  // Admin APIs
  adminGetAllDevices: async () => {
    const response = await request.get('/admin/devices');
    return response.data;
  },

  adminGetDeviceById: async (id: string) => {
    const response = await request.get(`/admin/devices/${id}`);
    return response.data;
  },

  createDevice: async (data: Partial<Device>) => {
    const response = await request.post('/admin/devices', data);
    return response.data;
  },

  updateDevice: async (id: string, data: Partial<Device>) => {
    const response = await request.put(`/admin/devices/${id}`, data);
    return response.data;
  },

  deleteDevice: async (id: string) => {
    const response = await request.delete(`/admin/devices/${id}`);
    return response.data;
  }
};
