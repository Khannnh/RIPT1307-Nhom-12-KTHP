import axios from '@/utils/axios';

export interface BorrowRequest {
  _id: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  quantity: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  note?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  device?: {
    _id: string;
    name: string;
    serialNumber: string;
    category: string;
  };
}

export interface CreateBorrowRequestData {
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  quantity: number;
  purpose: string;
}

export interface BorrowRequestListResponse {
  data: BorrowRequest[];
  current: number;
  pageSize: number;
  total: number;
}

// Tạo yêu cầu mượn thiết bị
export async function createBorrowRequest(data: CreateBorrowRequestData): Promise<BorrowRequest> {
  const response = await axios.post('/api/user/borrow-requests', data);
  return response.data.data;
}

// Lấy danh sách yêu cầu mượn của user - sử dụng tên function đúng
export async function getUserBorrowRequests(params?: {
  current?: number;
  pageSize?: number;
  status?: string;
}): Promise<BorrowRequestListResponse> {
  const response = await axios.get('/api/user/borrow-requests', { params });
  return response.data;
}

// Alias cho backward compatibility
export const getBorrowRequests = getUserBorrowRequests;

// Lấy chi tiết yêu cầu mượn - sử dụng tên function đúng
export async function getBorrowRequestDetail(id: string): Promise<BorrowRequest> {
  const response = await axios.get(`/api/user/borrow-requests/${id}`);
  return response.data.data;
}

// Alias cho backward compatibility
export const getBorrowRequestById = getBorrowRequestDetail;

// Hủy yêu cầu mượn
export async function cancelBorrowRequest(id: string): Promise<void> {
  await axios.delete(`/api/user/borrow-requests/${id}`);
}
