import axios from '@/utils/axios';

export interface Device {
  _id: string;
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance' | 'broken' | 'lost';
  location: string;
  description?: string;
  quantity: number;
  availableQuantity?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  category?: string;
}

export interface DeviceListResponse {
  data: Device[];
  current: number;
  pageSize: number;
  total: number;
}

export interface CreateDeviceRequest {
  name: string;
  serialNumber: string;
  category: string;
  location: string;
  description?: string;
  quantity: number;
  imageUrl?: string;
}

export interface UpdateDeviceRequest {
  name?: string;
  serialNumber?: string;
  category?: string;
  status?: string;
  location?: string;
  description?: string;
  quantity?: number;
  imageUrl?: string;
}

export interface DeviceStatistics {
  total: number;
  available: number;
  borrowed: number;
  maintenance: number;
  broken: number;
  lost: number;
}

// Lấy danh sách thiết bị (admin có thể xem tất cả)
export const getDevices = async (params: DeviceListParams = {}): Promise<DeviceListResponse> => {
  try {
    console.log('=== DEVICE SERVICE CALL START ===');
    console.log('Input params:', params);

    // Check authentication first
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('Token exists:', !!token);
    console.log('User role:', role);

    if (!token) {
      console.error('❌ No token found');
      throw new Error('No authentication token found');
    }

    // Don't use mock data, call real API
    console.log('Making real API call to /admin/devices');

    const response = await axios.get('/admin/devices');

    console.log('=== RAW API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);

    // Handle different response structures from backend
    let devices = [];
    let total = 0;

    if (response.data) {
      // Direct array response
      if (Array.isArray(response.data)) {
        console.log('✅ Found direct array response');
        devices = response.data;
        total = devices.length;
      }
      // Success wrapper response
      else if (response.data.success !== undefined && response.data.data) {
        console.log('✅ Found success wrapper response');
        if (Array.isArray(response.data.data)) {
          devices = response.data.data;
          total = response.data.total || devices.length;
        }
      }
      // Nested data response
      else if (response.data.data && Array.isArray(response.data.data)) {
        console.log('✅ Found nested data response');
        devices = response.data.data;
        total = response.data.total || devices.length;
      }
      // Check for other possible structures
      else {
        console.log('❌ Unknown response structure');
        console.log('Response keys:', Object.keys(response.data));

        // Try to find any array property
        for (const key of Object.keys(response.data)) {
          if (Array.isArray(response.data[key])) {
            console.log(`✅ Found array in property: ${key}`);
            devices = response.data[key];
            total = devices.length;
            break;
          }
        }
      }
    }

    console.log('=== PROCESSED RESULTS ===');
    console.log('Devices found:', devices.length);

    // Map devices to ensure consistent structure
    const mappedDevices = devices.map((device: any, index: number) => ({
      ...device,
      id: device._id || device.id || `device-${index}`,
      _id: device._id || device.id || `device-${index}`,
      // Ensure all required fields exist
      name: device.name || 'Unknown Device',
      serialNumber: device.serialNumber || 'N/A',
      category: device.category || 'Other',
      status: device.status || 'available',
      location: device.location || 'Unknown',
      quantity: device.quantity || 1,
      availableQuantity: device.availableQuantity || device.quantity || 1,
      createdAt: device.createdAt || new Date().toISOString(),
      updatedAt: device.updatedAt || new Date().toISOString(),
    }));

    const result = {
      data: mappedDevices,
      current: params.current || 1,
      pageSize: params.pageSize || 10,
      total: total,
    };

    console.log('=== FINAL RESULT ===');
    console.log('Returning:', result);
    return result;

  } catch (error: any) {
    console.error('=== DEVICE SERVICE ERROR ===');
    console.error('Error:', error);

    if (error.response?.status === 401) {
      console.error('❌ Authentication failed');
      localStorage.clear();
      window.location.href = '/auth/login';
    }

    // Return empty result instead of throwing
    return {
      data: [],
      current: params.current || 1,
      pageSize: params.pageSize || 10,
      total: 0,
    };
  }
};

// Lấy chi tiết thiết bị theo ID
export const getDeviceById = async (id: string): Promise<Device> => {
  const response = await axios.get(`/admin/devices/${id}`);
  let device = response.data?.data || response.data;
  return {
    ...device,
    id: device._id || device.id,
  };
};

// Tạo thiết bị mới
export const createDevice = async (device: CreateDeviceRequest): Promise<Device> => {
  try {
    console.log('=== CREATE DEVICE SERVICE CALL ===');
    console.log('Device data:', device);

    const response = await axios.post('/admin/devices', device);
    console.log('Create response:', response.data);

    let createdDevice = response.data?.data || response.data;
    return {
      ...createdDevice,
      id: createdDevice._id || createdDevice.id,
    };
  } catch (error) {
    console.error('=== CREATE DEVICE ERROR ===');
    console.error('Error:', error);
    throw error;
  }
};

// Cập nhật thiết bị
export const updateDevice = async (id: string, device: UpdateDeviceRequest): Promise<Device> => {
  try {
    console.log('=== UPDATE DEVICE SERVICE CALL ===');
    console.log('Device ID:', id);
    console.log('Update data:', device);

    const response = await axios.put(`/admin/devices/${id}`, device);
    console.log('Update response:', response.data);

    let updatedDevice = response.data?.data || response.data;
    return {
      ...updatedDevice,
      id: updatedDevice._id || updatedDevice.id,
    };
  } catch (error) {
    console.error('=== UPDATE DEVICE ERROR ===');
    console.error('Error:', error);
    throw error;
  }
};

// Xóa thiết bị
export const deleteDevice = async (id: string): Promise<void> => {
  try {
    console.log('=== DELETE DEVICE SERVICE CALL ===');
    console.log('Device ID:', id);

    await axios.delete(`/admin/devices/${id}`);
    console.log('Device deleted successfully');
  } catch (error) {
    console.error('=== DELETE DEVICE ERROR ===');
    console.error('Error:', error);
    throw error;
  }
};

// Thống kê thiết bị
export const getDeviceStatistics = async (): Promise<DeviceStatistics> => {
  try {
    let response;
    try {
      response = await axios.get('/admin/stats/devices');
    } catch (e) {
      try {
        response = await axios.get('/admin/devices/statistics');
      } catch (e2) {
        // Fallback: calculate from device list
        const devicesResponse = await getDevices();
        const devices = devicesResponse.data;

        return {
          total: devices.length,
          available: devices.filter(d => d.status === 'available').length,
          borrowed: devices.filter(d => d.status === 'borrowed').length,
          maintenance: devices.filter(d => d.status === 'maintenance').length,
          broken: devices.filter(d => d.status === 'broken').length,
          lost: devices.filter(d => d.status === 'lost').length,
        };
      }
    }

    let stats = {
      total: 0,
      available: 0,
      borrowed: 0,
      maintenance: 0,
      broken: 0,
      lost: 0,
    };

    if (response?.data) {
      if (response.data.success && response.data.data) {
        stats = { ...stats, ...response.data.data };
      } else if (response.data.data) {
        stats = { ...stats, ...response.data.data };
      } else {
        stats = { ...stats, ...response.data };
      }
    }

    return stats;
  } catch (error) {
    console.error('Error fetching device statistics:', error);
    return {
      total: 0,
      available: 0,
      borrowed: 0,
      maintenance: 0,
      broken: 0,
      lost: 0,
    };
  }
};
