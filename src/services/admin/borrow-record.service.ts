import axios from '@/utils/axios';

export interface BorrowRecord {
  _id: string;
  borrowRequestId: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  actualReturnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  note: string;
  createdAt: string;
  updatedAt: string;
  borrowRequest: {
    _id: string;
    purpose: string;
    note: string;
  };
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

export interface BorrowRecordParams {
  current?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  userId?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  overdue?: boolean;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface BorrowRecordResponse {
  data: BorrowRecord[];
  total: number;
  current: number;
  pageSize: number;
  statistics?: BorrowRecordStatistics; // Make statistics optional
}

export interface BorrowRecordStatistics {
  totalBorrowed: number;
  totalReturned: number;
  totalOverdue: number;
  dueSoon: number;
}

// Lấy tất cả bản ghi mượn trả
export const getAllBorrowRecords = async (params?: BorrowRecordParams): Promise<BorrowRecordResponse> => {
  try {
    console.log('=== BORROW RECORDS API CALL ===');
    console.log('Params:', params);

    const response = await axios.get('/admin/borrow-records', { params });

    console.log('Borrow Records Response:', response.data);

    let records = [];
    let total = 0;
    let statistics = {
      totalBorrowed: 0,
      totalReturned: 0,
      totalOverdue: 0,
      dueSoon: 0,
    };

    if (response.data) {
      if (Array.isArray(response.data)) {
        records = response.data;
        total = records.length;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        records = response.data.data;
        total = response.data.total || records.length;
        // Extract statistics if available
        if (response.data.statistics) {
          statistics = { ...statistics, ...response.data.statistics };
        }
      } else if (response.data.success && response.data.data) {
        records = response.data.data;
        total = response.data.total || records.length;
        if (response.data.statistics) {
          statistics = { ...statistics, ...response.data.statistics };
        }
      }
    }

    // Calculate statistics from records if not provided by API
    if (records.length > 0 && statistics.totalBorrowed === 0) {
      const today = new Date();
      statistics = {
        totalBorrowed: records.filter(r => r.status === 'borrowed').length,
        totalReturned: records.filter(r => r.status === 'returned').length,
        totalOverdue: records.filter(r => {
          if (r.status === 'returned') return false;
          const dueDate = new Date(r.returnDate);
          return today > dueDate;
        }).length,
        dueSoon: records.filter(r => {
          if (r.status === 'returned') return false;
          const dueDate = new Date(r.returnDate);
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          return diffDays >= 0 && diffDays <= 3;
        }).length,
      };
    }

    return {
      data: records,
      total: total,
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      statistics: statistics, // Add statistics to response
    };
  } catch (error) {
    console.error('Error fetching borrow records:', error);
    return {
      data: [],
      total: 0,
      current: params?.current || 1,
      pageSize: params?.pageSize || 10,
      statistics: {
        totalBorrowed: 0,
        totalReturned: 0,
        totalOverdue: 0,
        dueSoon: 0,
      },
    };
  }
};

// Lấy chi tiết bản ghi mượn trả
export const getBorrowRecordById = async (id: string): Promise<BorrowRecord> => {
  const response = await axios.get(`/admin/borrow-records/${id}`);
  return response.data?.data || response.data;
};

// Xác nhận trả thiết bị
export const confirmReturnDevice = async (id: string): Promise<void> => {
  await axios.patch(`/admin/borrow-records/${id}/return`);
};

// Lấy thống kê bản ghi mượn trả
export const getBorrowRecordStatistics = async (): Promise<BorrowRecordStatistics> => {
  try {
    const response = await axios.get('/admin/borrow-records/statistics');
    return response.data?.data || response.data || {
      totalBorrowed: 0,
      totalReturned: 0,
      totalOverdue: 0,
      dueSoon: 0,
    };
  } catch (error) {
    console.error('Error fetching borrow record statistics:', error);
    return {
      totalBorrowed: 0,
      totalReturned: 0,
      totalOverdue: 0,
      dueSoon: 0,
    };
  }
};

// Gửi email nhắc nhở
export const sendReminderEmail = async (id: string): Promise<void> => {
  await axios.post(`/admin/borrow-records/${id}/send-reminder`);
};

// Cập nhật trạng thái
export const updateState = async (recordId: string, data: { state: string }) => {
  const response = await axios.patch(`/admin/borrow-records/${recordId}`, data);
  return response.data;
};
