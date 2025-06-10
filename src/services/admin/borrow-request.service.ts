import axios from '@/utils/axios';

export interface BorrowRequest {
  id: string;
  _id: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  purpose: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    studentId?: string;
  };
  device: {
    _id: string;
    name: string;
    serialNumber: string;
    category: string;
    imageUrl?: string;
  };
}

export interface BorrowRequestParams {
  current?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  userId?: string;
  deviceId?: string;
  sortField?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface BorrowRequestResponse {
  data: BorrowRequest[];
  total: number;
  current: number;
  pageSize: number;
  statistics?: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  };
}

export interface UpdateStatusRequest {
  status: 'approved' | 'rejected';
}

// Lấy tất cả yêu cầu mượn
export const getAllBorrowRequests = async (params?: BorrowRequestParams): Promise<BorrowRequestResponse> => {
  try {
    console.log('=== BORROW REQUESTS API CALL ===');
    console.log('Params:', params);

    const response = await axios.get('/admin/borrow-requests', { params });

    console.log('Borrow Requests Response:', response.data);

    let requests = [];
    let total = 0;
    let statistics = {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
    };

    if (response.data) {
      if (Array.isArray(response.data)) {
        requests = response.data;
        total = requests.length;
        console.log('Borrow requests - Direct array response');
      } else if (response.data.data && Array.isArray(response.data.data)) {
        requests = response.data.data;
        total = response.data.total || requests.length;
        if (response.data.statistics) {
          statistics = { ...statistics, ...response.data.statistics };
        }
        console.log('Borrow requests - Nested data response');
      } else if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          requests = response.data.data;
          total = response.data.total || requests.length;
        } else if (response.data.data.docs) {
          requests = response.data.data.docs;
          total = response.data.data.totalDocs || requests.length;
        }
        if (response.data.statistics) {
          statistics = { ...statistics, ...response.data.statistics };
        }
        console.log('Borrow requests - Success wrapper response');
      }
    }

    // Calculate statistics from requests if not provided by API
    if (requests.length > 0 && statistics.totalRequests === 0) {
      statistics = {
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        approvedRequests: requests.filter(r => r.status === 'approved').length,
        rejectedRequests: requests.filter(r => r.status === 'rejected').length,
      };
    }

    console.log('Processed borrow requests:', requests);
    console.log('Borrow requests total:', total);
    console.log('Borrow requests statistics:', statistics);

    return {
      data: requests,
      total: total,
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      statistics: statistics,
    };
  } catch (error) {
    console.error('Error fetching borrow requests:', error);
    console.error('Error response:', error.response?.data);

    // Return empty result instead of throwing
    return {
      data: [],
      total: 0,
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      statistics: {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
      },
    };
  }
};

// Lấy chi tiết yêu cầu mượn
export const getBorrowRequestById = async (id: string): Promise<BorrowRequest> => {
  const response = await axios.get(`/admin/borrow-requests/${id}`);
  return response.data?.data || response.data;
};

// Duyệt yêu cầu mượn
export const approveRequest = async (id: string): Promise<void> => {
  await axios.patch(`/admin/borrow-requests/${id}/approve`);
};

// Từ chối yêu cầu mượn
export const rejectRequest = async (id: string): Promise<void> => {
  await axios.patch(`/admin/borrow-requests/${id}/reject`);
};

// Trả thiết bị (Admin only)
export const returnDevice = async (id: string): Promise<void> => {
  await axios.patch(`/admin/borrow-requests/${id}/return`);
};

// Lấy thống kê yêu cầu mượn
export const getBorrowRequestStatistics = async () => {
  try {
    const response = await axios.get('/admin/borrow-requests/statistics');
    return response.data?.data || response.data || {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
    };
  } catch (error) {
    console.error('Error fetching borrow request statistics:', error);
    return {
      totalRequests: 0,
      pendingRequests: 0,
      approvedRequests: 0,
      rejectedRequests: 0,
    };
  }
};
