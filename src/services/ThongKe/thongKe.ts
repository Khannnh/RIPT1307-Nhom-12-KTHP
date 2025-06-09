// src/services/thongKe.ts
import axios from 'axios';
import type { ThongKeApiResponse } from '@/models/thongKe';

// Cấu hình base URL cho API của bạn
const API_BASE_URL = 'http://localhost:3456'; 

/**
 * Hàm để gọi API lấy dữ liệu thống kê.
 * @param params Các tham số cho API (ví dụ: month, year, type).
 * @returns Promise chứa dữ liệu ThongKeApiResponse.
 */
export async function getThongKeData(params?: { type?: string; month?: number; year?: number }): Promise<ThongKeApiResponse> {
  try {
    const response = await axios.get<ThongKeApiResponse>(`${API_BASE_URL}/thongke`, {
      params: {
        type: params?.type || 'month', // Mặc định là month
        month: params?.month || 6,     // Mặc định là tháng 6
        year: params?.year || 2025,    // Mặc định là năm 2025
        // Thêm các tham số khác nếu API của bạn hỗ trợ lọc theo tuần, v.v.
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching thong ke data:', error);
    throw error; // Ném lỗi để hook có thể bắt và xử lý
  }
}

//hàm thống kê tổng lượt mượn
export async function getTotalBorrowRequests(): Promise<number> {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/borrow-requests`);
    if (Array.isArray(response.data)) {
      return response.data.length;
    }
    // Nếu API trả về object có thuộc tính data là mảng
    if (Array.isArray(response.data?.data)) {
      return response.data.data.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching total borrow requests:', error);
    throw error;
  }
}
