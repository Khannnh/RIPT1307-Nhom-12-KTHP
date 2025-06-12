import axios from '@/utils/axios';

export interface BorrowRequest {
  id: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface CreateBorrowRequestParams {
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
}
//lấy danh sách lịch sử mượn của mìnhmình
export const getUserBorrowRequests = async () => {
  const response = await axios.get('/user/borrow-requests');
  return {
    data: response.data.data.data,
    pagination: response.data.data.pagination,
  };
};
export const createBorrowRequest = async (params: CreateBorrowRequestParams): Promise<BorrowRequest> => {
  const response = await axios.post('/user/borrow-requests', params);
  return response.data;
};

export const getBorrowRequestDetail = async (id: string): Promise<BorrowRequest> => {
  const response = await axios.get(`/user/borrow-requests/${id}`);
  return response.data;
};

export const cancelBorrowRequest = async (id: string): Promise<BorrowRequest> => {
  const response = await axios.put(`/user/borrow-requests/${id}/cancel`);
  return response.data;
};