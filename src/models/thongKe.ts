

export interface DeviceStatistic {
    id: string;
  key: string;
  rank: string;
  name: string;
  category: string;
  borrowed: number;
  percentage: string;
  borrowedCount: number; 
    
  
}

export interface ThongKeSummary {
  totalBorrowed: number;
  month: string;
  mostPopularDevice: string;
  mostPopularBorrowedCount: number;
  deviceTypes: number;
}

export interface ThongKeApiResponse {
  summary: ThongKeSummary;
  deviceList: DeviceStatistic[];
  // Thêm các trường khác nếu API của bạn trả về
}