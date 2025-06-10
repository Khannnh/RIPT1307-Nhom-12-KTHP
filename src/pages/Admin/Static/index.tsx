
import React from 'react';
import { Table, Tag } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';

// Định nghĩa kiểu dữ liệu cho thiết bị
type Device = {
  rank: number;
  name: string;
  category: string;
  borrows: number;
  percentage: string;
};

const mockDeviceTableData: Device[] = [
  { rank: 1, name: 'Laptop Dell XPS 13', category: 'Máy tính xách tay', borrows: 180, percentage: '20.1%' },
  { rank: 2, name: 'iPad Pro 12.9"', category: 'Máy tính bảng', borrows: 152, percentage: '16.9%' },
  { rank: 3, name: 'Canon EOS R5', category: 'Máy ảnh', borrows: 128, percentage: '14.3%' },
  { rank: 4, name: 'Macbook Air M2', category: 'Máy tính xách tay', borrows: 112, percentage: '12.5%' },
  { rank: 5, name: 'Surface Pro 9', category: 'Máy tính bảng', borrows: 100, percentage: '11.1%' },
  { rank: 6, name: 'iPhone 14 Pro', category: 'Điện thoại', borrows: 88, percentage: '9.8%' },
  { rank: 7, name: 'Sony A7 IV', category: 'Máy ảnh', borrows: 76, percentage: '8.5%' },
  { rank: 8, name: 'Lenovo ThinkPad X1', category: 'Máy tính xách tay', borrows: 61, percentage: '6.8%' },
];

const columns = [
  {
    title: 'Hạng',
    dataIndex: 'rank',
    key: 'rank',
    sorter: (a: Device, b: Device) => a.rank - b.rank,
    render: (rank: number) => <b>#{rank}</b>,
  },
  {
    title: 'Tên Thiết Bị',
    dataIndex: 'name',
    key: 'name',
    filterSearch: true,
    filters: mockDeviceTableData.map(d => ({ text: d.name, value: d.name })),
    onFilter: (value: string | number | boolean, record: Device) => record.name.indexOf(value as string) === 0,
  },
  {
    title: 'Danh Mục',
    dataIndex: 'category',
    key: 'category',
    filters: [
      { text: 'Máy tính xách tay', value: 'Máy tính xách tay' },
      { text: 'Máy tính bảng', value: 'Máy tính bảng' },
      { text: 'Máy ảnh', value: 'Máy ảnh' },
      { text: 'Điện thoại', value: 'Điện thoại' },
    ],
    onFilter: (value: string | number | boolean, record: Device) => record.category === value,
    render: (category: string) => <Tag color="blue">{category}</Tag>,
  },
  {
    title: 'Số Lượt Mượn',
    dataIndex: 'borrows',
    key: 'borrows',
    sorter: (a: Device, b: Device) => a.borrows - b.borrows,
  },
  {
    title: 'Tỷ Lệ',
    dataIndex: 'percentage',
    key: 'percentage',
    sorter: (a: Device, b: Device) => parseFloat(a.percentage) - parseFloat(b.percentage),
  },
];

const DeviceStatisticsPage: React.FC = () => {
  return (
    <div className="device-statistics-page-container">
      <h1 className="page-title">Thống Kê Thiết Bị</h1>
      <p className="page-subtitle">Theo dõi và phân tích thiết bị được mượn nhiều nhất theo tuần, tháng và năm</p>
      <div className="device-table-container">
        <div className="table-header">
          <h3>Bảng Chi Tiết Thống Kê</h3>
          <p>Danh sách thiết bị được mượn trong Tháng 6/2025</p>
        </div>
        <Table
          columns={columns}
          dataSource={mockDeviceTableData}
          rowKey="rank"
          pagination={{ pageSize: 5 }}
        />
      </div>
      <div className="charts-container">
        <div className="chart-item">
          <h2>Biểu đồ cột</h2>
          <ColumnChart
            title="Số lượt mượn theo thiết bị"
            xAxis={['Laptop Dell XPS 13', 'iPad Pro 12.9"', 'Canon EOS R5', 'Macbook Air M2', 'Surface Pro 9', 'iPhone 14 Pro', 'Sony A7 IV', 'Lenovo ThinkPad X1']}
            yAxis={[[180, 152, 128, 112, 100, 88, 76, 61]]}
            yLabel={['Số lượt mượn']}
            height={350}
            width={1000}
            type="bar"
          />
        </div>
        <div className="chart-item">
          <h2>Biểu đồ tròn</h2>
          <DonutChart
            title="Tỷ lệ mượn theo thiết bị"
            xAxis={['Laptop Dell XPS 13', 'iPad Pro 12.9"', 'Canon EOS R5', 'Macbook Air M2', 'Surface Pro 9', 'iPhone 14 Pro', 'Sony A7 IV', 'Lenovo ThinkPad X1']}
            yAxis={[[180, 152, 128, 112, 100, 88, 76, 61]]}
            yLabel={['Tỷ lệ']}
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