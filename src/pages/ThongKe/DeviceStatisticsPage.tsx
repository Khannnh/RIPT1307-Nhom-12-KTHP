// src/components/DeviceStatisticsPage.tsx
import React from 'react';
import HeroSection from './HeroSection';
import DeviceTable from './DeviceTable';
import './DeviceStatisticsPage.less'; 
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';

// // Dữ liệu mẫu (thay thế bằng dữ liệu thực tế từ API của bạn)
// const mockHeroData = {
//   totalBorrows: 897,
//   popularDevice: 'Laptop',
//   popularDeviceBorrows: 180,
//   uniqueDeviceTypes: 4,
// };

// Định dạng dữ liệu cho ColumnChart và DonutChart theo DataChartType
const mockColumnChartData = {
  xAxis: ['Laptop Dell XPS 13', 'iPad Pro 12.9"', 'Canon EOS R5', 'Macbook Air M2', 'Surface Pro 9', 'iPhone 14 Pro', 'Sony A7 IV', 'Lenovo ThinkPad X1'],
  yAxis: [[180, 152, 128, 112, 100, 88, 76, 61]],
  yLabel: ['Số lượt mượn'],
};

const mockDonutChartData = {
    xAxis: ['Laptop Dell XPS 13', 'iPad Pro 12.9"', 'Canon EOS R5', 'Macbook Air M2', 'Surface Pro 9', 'iPhone 14 Pro', 'Sony A7 IV', 'Lenovo ThinkPad X1'],
    yAxis: [[180, 152, 128, 112, 100, 88, 76, 61]], // DonutChart sử dụng yAxis[0] làm series data
    yLabel: ['Tỷ lệ'], // Mặc dù DonutChart của bạn không sử dụng yLabel trực tiếp, nó vẫn cần có để phù hợp DataChartType
};

const mockDeviceTableData = [
  { rank: 1, name: 'Laptop Dell XPS 13', category: 'Máy tính xách tay', borrows: 180, percentage: '20.1%' },
  { rank: 2, name: 'iPad Pro 12.9"', category: 'Máy tính bảng', borrows: 152, percentage: '16.9%' },
  { rank: 3, name: 'Canon EOS R5', category: 'Máy ảnh', borrows: 128, percentage: '14.3%' },
  { rank: 4, name: 'Macbook Air M2', category: 'Máy tính xách tay', borrows: 112, percentage: '12.5%' },
  { rank: 5, name: 'Surface Pro 9', category: 'Máy tính bảng', borrows: 100, percentage: '11.1%' },
  { rank: 6, name: 'iPhone 14 Pro', category: 'Điện thoại', borrows: 88, percentage: '9.8%' },
  { rank: 7, name: 'Sony A7 IV', category: 'Máy ảnh', borrows: 76, percentage: '8.5%' },
  { rank: 8, name: 'Lenovo ThinkPad X1', category: 'Máy tính xách tay', borrows: 61, percentage: '6.8%' },
];


const DeviceStatisticsPage: React.FC = () => {
  return (
    <div className="device-statistics-page-container">
      <h1 className="page-title">Thống Kê Thiết Bị</h1>
      <p className="page-subtitle">Theo dõi và phân tích thiết bị được mượn nhiều nhất theo tuần, tháng và năm</p>
    <HeroSection
        popularDevice="Laptop Dell XPS 13"
        popularDeviceBorrows={180}
        uniqueDeviceTypes={4}
      />
        <DeviceTable data={mockDeviceTableData} />
        <div className="charts-container">
            <div className="chart-item">
            <h2>Biểu đồ cột</h2>
            <ColumnChart
                title="Số lượt mượn theo thiết bị"
                xAxis={mockColumnChartData.xAxis}
                yAxis={mockColumnChartData.yAxis}
                yLabel={mockColumnChartData.yLabel}
                height={350}
                width={1000}
                type="bar"
            />
            </div>
            <div className="chart-item">
            <h2>Biểu đồ tròn</h2>
            <DonutChart
                title="Tỷ lệ mượn theo thiết bị"
                xAxis={mockDonutChartData.xAxis}
                yAxis={mockDonutChartData.yAxis}
                yLabel={mockDonutChartData.yLabel}
                height={350}
                width={1000}
                showTotal={true}
            />
            </div>
        </div>
      </div>
  );
};


export default DeviceStatisticsPage;