import axios from '@/utils/axios';
import type { BorrowRequest } from '@/types/borrow-request';

export const borrowRequestService = {
  // User APIs
  getUserBorrowRequests: () => {
    return axios.get<BorrowRequest[]>('/user/borrow-requests');
  },

  getBorrowRequestById: (id: string) => {
    return axios.get<BorrowRequest>(`/user/borrow-requests/${id}`);
  },

  createBorrowRequest: (data: {
    deviceId: string;
    borrowDate: Date;
    returnDate: Date;
    note?: string;
  }) => {
    return axios.post<BorrowRequest>('/user/borrow-requests', data);
  },

  // Cancel a borrow request
  cancelBorrowRequest: (id: string) => {
    return axios.post<BorrowRequest>(`/user/borrow-requests/${id}/cancel`);
  },

  // Admin APIs
  getAllBorrowRequests: () => {
    return axios.get<BorrowRequest[]>('/admin/borrow-requests');
  },

  adminGetBorrowRequestById: async (id: string) => {
    const response = await axios.get<BorrowRequest>(`/admin/borrow-requests/${id}`);
    return response.data;
  },

  approveRequest: (id: string) => {
    return axios.post<BorrowRequest>(`/admin/borrow-requests/${id}/approve`);
  },

  rejectRequest: (id: string, reason?: string) => {
    return axios.post<BorrowRequest>(`/admin/borrow-requests/${id}/reject`, { reason });
  },

  returnDevice: (id: string) => {
    return axios.post<BorrowRequest>(`/admin/borrow-requests/${id}/return`);
  }
};
