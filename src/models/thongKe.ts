
/**
 * Interface cho dữ liệu thiết bị trong bảng thống kê.
 */
export interface DeviceStatistic {
  key: string;
  rank: string;
  name: string;
  category: string;
  borrowed: number;
  percentage: string;
}

/**
 * Interface cho dữ liệu tổng quan thống kê.
 */
export interface ThongKeSummary {
  totalBorrowed: number;
  month: string;
  mostPopularDevice: string;
  mostPopularBorrowedCount: number;
  deviceTypes: number;
}

/**
 * Interface cho phản hồi hoàn chỉnh từ API thống kê.
 */
export interface ThongKeApiResponse {
  summary: ThongKeSummary;
  deviceList: DeviceStatistic[];
  // Thêm các trường khác nếu API của bạn trả về
}