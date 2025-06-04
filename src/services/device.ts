import axios from 'axios';

export interface Device {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  quantity: number;
}

// API Base URL – thay thế bằng địa chỉ thực
const API_BASE_URL = 'https://your-api-server.com';

export const fetchUserDevices = async (): Promise<Device[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user devices:', error);
    return [];
  }
};

export const createBorrowRequest = async (
  deviceId: string,
  borrowDate: string,
  returnDate: string
): Promise<boolean> => {
  try {
    await axios.post(`${API_BASE_URL}/user/borrow-requests`, {
      deviceId,
      borrowDate,
      returnDate,
    });
    return true;
  } catch (error) {
    console.error('Error creating borrow request:', error);
    return false;
  }
};

export const fetchAdminDevices = async (): Promise<Device[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin devices:', error);
    return [];
  }
};

// Thêm thiết bị mới (POST /admin/devices)
export const addDevice = async (device: Partial<Device>): Promise<Device | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/devices`, device);
    return response.data;
  } catch (error) {
    console.error('Error adding device:', error);
    return null;
  }
};

// Cập nhật thiết bị (PUT /admin/devices/:id)
export const updateDevice = async (
  deviceId: string,
  updatedData: Partial<Device>
): Promise<Device | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/admin/devices/${deviceId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating device:', error);
    return null;
  }
};

// Xóa thiết bị (DELETE /admin/devices/:id)
export const deleteDevice = async (deviceId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/admin/devices/${deviceId}`);
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    return false;
  }
};
