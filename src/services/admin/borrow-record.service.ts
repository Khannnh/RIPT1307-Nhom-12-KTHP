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

export interface BorrowRecordStatistics {
  totalBorrowed: number;
  totalReturned: number;
  totalOverdue: number;
  dueSoon: number;
}

export interface BorrowRecordQuery {
  current?: number;
  pageSize?: number;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  deviceId?: string;
}

interface BorrowRecordResponse {
  data: BorrowRecord[];
  current: number;
  pageSize: number;
  total: number;
  statistics: BorrowRecordStatistics;
}

// Lấy tất cả bản ghi mượn trả - Sửa để parse đúng nested structure
export const getAllBorrowRecords = async (params: BorrowRecordParams = {}): Promise<BorrowRecordResponse> => {
  try {
    console.log('=== BORROW RECORD SERVICE CALL START ===');
    console.log('Input params:', params);

    // Check authentication first
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      throw new Error('Authentication required');
    }

    // Sử dụng borrow requests với status approved để lấy records
    console.log('Making API call to /admin/borrow-requests (approved status)');

    const response = await axios.get('/admin/borrow-requests', {
      params: {
        page: params.current,
        limit: params.pageSize,
        status: 'approved', // Chỉ lấy các request đã được duyệt
        keyword: params.keyword,
        startDate: params.startDate,
        endDate: params.endDate,
      }
    });

    console.log('=== RAW API RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);

    // Handle different response structures - Same logic as borrow-request
    let records = [];
    let total = 0;

    if (response.data) {
      // Case 1: Nested structure {message: "...", data: {data: [...], total: ...}}
      if (response.data.message && response.data.data && Array.isArray(response.data.data.data)) {
        console.log('✅ Found nested backend response format');
        records = response.data.data.data;
        total = response.data.data.total || records.length;
      }
      // Case 2: Standard format {message: "...", data: [...]}
      else if (response.data.message && Array.isArray(response.data.data)) {
        console.log('✅ Found standard backend response format');
        records = response.data.data;
        total = response.data.total || records.length;
      }
      // Case 3: Direct array
      else if (Array.isArray(response.data)) {
        records = response.data;
        total = records.length;
      }
      // Case 4: Object with data property
      else if (response.data.data && Array.isArray(response.data.data)) {
        records = response.data.data;
        total = response.data.total || records.length;
      }
      else {
        console.log('❌ Unknown response structure');
        console.log('Response keys:', Object.keys(response.data));

        // Try to find array in nested structure
        if (response.data.data && typeof response.data.data === 'object') {
          for (const key of Object.keys(response.data.data)) {
            if (Array.isArray(response.data.data[key])) {
              console.log(`✅ Found array in nested key: data.${key}`);
              records = response.data.data[key];
              total = records.length;
              break;
            }
          }
        }
      }
    }

    console.log('=== PROCESSED RESULTS ===');
    console.log('Records found:', records.length);

    // Map borrow requests thành borrow records format
    const mappedRecords = records.map((record: any, index: number) => ({
      _id: record._id || `record-${index}`,
      borrowRequestId: record._id,
      userId: record.userId || record.user?._id,
      deviceId: record.deviceId || record.device?._id,
      borrowDate: record.borrowDate || new Date().toISOString(),
      returnDate: record.returnDate || new Date().toISOString(),
      actualReturnDate: record.actualReturnDate || null,
      status: 'borrowed' as const, // Vì đây là approved requests nên status là borrowed
      note: record.note || '',
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: record.updatedAt || new Date().toISOString(),
      borrowRequest: {
        _id: record._id,
        purpose: record.purpose || 'No purpose',
        note: record.note || '',
      },
      user: {
        _id: record.user?._id || 'unknown',
        name: record.user?.name || 'Unknown User',
        email: record.user?.email || 'unknown@email.com',
        phone: record.user?.phone || '',
        studentId: record.user?.studentId || '',
        ...record.user,
      },
      device: {
        _id: record.device?._id || 'unknown',
        name: record.device?.name || 'Unknown Device',
        serialNumber: record.device?.serialNumber || 'N/A',
        category: record.device?.category || 'Other',
        imageUrl: record.device?.imageUrl || '',
        ...record.device,
      },
    }));

    // Calculate statistics từ mapped records
    const today = new Date();
    const statistics = {
      totalBorrowed: mappedRecords.filter((r: any) => r.status === 'borrowed').length,
      totalReturned: mappedRecords.filter((r: any) => r.status === 'returned').length,
      totalOverdue: mappedRecords.filter((r: any) => {
        if (r.status === 'returned') return false;
        const dueDate = new Date(r.returnDate);
        return today > dueDate;
      }).length,
      dueSoon: mappedRecords.filter((r: any) => {
        if (r.status === 'returned') return false;
        const dueDate = new Date(r.returnDate);
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return diffDays >= 0 && diffDays <= 3;
      }).length,
    };

    const result = {
      data: mappedRecords,
      current: params.current || 1,
      pageSize: params.pageSize || 10,
      total: total,
      statistics: statistics,
    };

    console.log('=== FINAL BORROW RECORDS RESULT ===');
    console.log('Returning result:', result);

    return result;

  } catch (error: any) {
    console.error('=== BORROW RECORD SERVICE ERROR ===');
    console.error('Error:', error);

    if (error.response?.status === 401) {
      console.error('❌ Authentication failed');
      localStorage.clear();
      window.location.href = '/auth/login';
    }

    return {
      data: [],
      current: params.current || 1,
      pageSize: params.pageSize || 10,
      total: 0,
      statistics: {
        totalBorrowed: 0,
        totalReturned: 0,
        totalOverdue: 0,
        dueSoon: 0,
      },
    };
  }
};

// Lấy chi tiết bản ghi mượn trả - theo cách device service
export const getBorrowRecordById = async (id: string): Promise<BorrowRecord> => {
  try {
    console.log('=== GET BORROW RECORD BY ID ===');
    console.log('Record ID:', id);

    // Sử dụng borrow request endpoint vì record được map từ approved request
    const response = await axios.get(`/admin/borrow-requests/${id}`);

    console.log('Response:', response.data);

    let record = response.data?.data || response.data;

    // Map từ borrow request sang borrow record format
    return {
      _id: record._id || record.id,
      borrowRequestId: record._id,
      userId: record.userId || record.user?._id,
      deviceId: record.deviceId || record.device?._id,
      borrowDate: record.borrowDate || new Date().toISOString(),
      returnDate: record.returnDate || new Date().toISOString(),
      actualReturnDate: record.actualReturnDate || null,
      status: 'borrowed',
      note: record.note || '',
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: record.updatedAt || new Date().toISOString(),
      borrowRequest: {
        _id: record._id,
        purpose: record.purpose || 'No purpose',
        note: record.note || '',
      },
      user: {
        _id: record.user?._id || 'unknown',
        name: record.user?.name || 'Unknown User',
        email: record.user?.email || 'unknown@email.com',
        phone: record.user?.phone || '',
        studentId: record.user?.studentId || '',
        ...record.user,
      },
      device: {
        _id: record.device?._id || 'unknown',
        name: record.device?.name || 'Unknown Device',
        serialNumber: record.device?.serialNumber || 'N/A',
        category: record.device?.category || 'Other',
        imageUrl: record.device?.imageUrl || '',
        ...record.device,
      },
    };
  } catch (error: any) {
    console.error('Error fetching borrow record details:', error);
    throw error;
  }
};

// Xác nhận trả thiết bị - sử dụng return endpoint từ borrow request
export const confirmReturnDevice = async (id: string): Promise<void> => {
  try {
    console.log('=== CONFIRM RETURN DEVICE ===');
    console.log('Record ID:', id);

    const response = await axios.patch(`/admin/borrow-requests/${id}/return`);

    console.log('Confirm return response:', response.data);

    if (response.data?.message) {
      console.log('Server message:', response.data.message);
    }
  } catch (error: any) {
    console.error('Error confirming return device:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Lấy thống kê bản ghi mượn trả - theo cách device service
export const getBorrowRecordStatistics = async (): Promise<BorrowRecordStatistics> => {
  try {
    let response;
    try {
      response = await axios.get('/admin/borrow-records/statistics');
    } catch (e) {
      try {
        response = await axios.get('/admin/stats/borrow-records');
      } catch (e2) {
        // Fallback: calculate from record list
        const recordsResponse = await getAllBorrowRecords();
        const records = recordsResponse.data;
        const today = new Date();

        return {
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
    }

    let stats = {
      totalBorrowed: 0,
      totalReturned: 0,
      totalOverdue: 0,
      dueSoon: 0,
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
    console.error('Error fetching borrow record statistics:', error);
    return {
      totalBorrowed: 0,
      totalReturned: 0,
      totalOverdue: 0,
      dueSoon: 0,
    };
  }
};

// Gửi email nhắc nhở - có thể chưa có endpoint, để fallback
export const sendReminderEmail = async (id: string): Promise<void> => {
  try {
    console.log('=== SEND REMINDER EMAIL ===');
    console.log('Record ID:', id);

    const response = await axios.post(`/admin/borrow-requests/${id}/send-reminder`);

    console.log('Send reminder response:', response.data);

    if (response.data?.message) {
      console.log('Server message:', response.data.message);
    }
  } catch (error: any) {
    console.error('Error sending reminder email:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};

// Cập nhật trạng thái - có thể chưa có endpoint
export const updateState = async (recordId: string, data: { state: string }) => {
  try {
    console.log('=== UPDATE RECORD STATE ===');
    console.log('Record ID:', recordId);
    console.log('Update data:', data);

    const response = await axios.patch(`/admin/borrow-requests/${recordId}`, data);

    console.log('Update state response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Error updating record state:', error);
    console.error('Response data:', error.response?.data);
    throw error;
  }
};
