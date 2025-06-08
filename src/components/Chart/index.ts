// src/components/Chart/index.ts
import { type ApexOptions } from 'apexcharts';

export type DataChartType = {
	title?: string;
	xAxis: string[] | number[]; // Danh sách các nhãn trên trục X (tên thiết bị cho cột/tròn)
	yAxis: number[][]; // Mảng 2 chiều chứa các giá trị cho trục Y (số lượt mượn)
	yLabel: string[]; // Nhãn cho từng series (ví dụ: ['Số lượt mượn'])
	height?: number;
	width?: number;
	type?: 'bar' | 'donut' | 'line' | 'area' | 'radialBar' | 'pie'; // Các kiểu biểu đồ ApexCharts
	formatY?: (val: number) => string;
	colors?: string[];
	showTotal?: boolean; // Dành riêng cho DonutChart
	otherOptions?: ApexOptions; // Cho phép truyền thêm các tùy chọn ApexCharts
};

// Bạn có thể thêm các export khác nếu cần