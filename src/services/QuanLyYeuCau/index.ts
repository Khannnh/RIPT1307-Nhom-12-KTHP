import type { YeuCau } from './typing';
import { mockRequests } from '../../../mock/database'; // Import từ database chung

export async function getYeuCau(params: {
  page: number;
  limit: number;
  [key: string]: any;
}): Promise<{ data: YeuCau[]; total: number }> {
  const { page = 1, limit = 10 } = params;
  const total = mockRequests.length;
  const paginatedData = mockRequests.slice((page - 1) * limit, page * limit);
  return Promise.resolve({ data: paginatedData, total });
}

export async function updateTrangThaiYeuCau(id: string, trangThai: YeuCau['trangThai']) {
  const index = mockRequests.findIndex((item) => item._id === id);
  if (index !== -1) {
    mockRequests[index].trangThai = trangThai;
  }
  return Promise.resolve({ success: true });
}