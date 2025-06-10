import React from 'react';
import { useStatistic } from '@/hooks/useStatistic';
import { Table, Tag, Button } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';

// Hero Section viết trực tiếp trong file này
const HeroSection: React.FC<{
  totalBorrows: number;
  popularDevice: string;
  popularDeviceBorrows: number;
  uniqueDeviceTypes: number;
}> = ({
  totalBorrows,
  popularDevice,
  popularDeviceBorrows,
  uniqueDeviceTypes,
}) => (
  <div className="hero-section-wrapper" style={{ marginBottom: 32 }}>
    <div className="time-filter-section" style={{ marginBottom: 24 }}>
      <span style={{ marginRight: 8 }}>📅 Bộ lọc thời gian:</span>
      <button className="filter-button active" style={{ marginRight: 4 }}>Tuần</button>
      <button className="filter-button active" style={{ marginRight: 4 }}>Tháng</button>
      <button className="filter-button active" style={{ marginRight: 8 }}>Năm</button>
      <select className="filter-dropdown" style={{ marginRight: 8 }}>
        <option>Năm 2023</option>
        <option>Năm 2024</option>
        <option>Năm 2025</option>
      </select>
      <select className="filter-dropdown">
        <option>Tháng 1</option>
        <option>Tháng 2</option>
        <option>Tháng 3</option>
        <option>Tháng 4</option>
        <option>Tháng 5</option>
        <option selected>Tháng 6</option>
        <option>Tháng 7</option>
        <option>Tháng 8</option>
        <option>Tháng 9</option>
        <option>Tháng 10</option>
        <option>Tháng 11</option>
        <option>Tháng 12</option>
      </select>
    </div>
    <div className="hero-cards-container" style={{ display: 'flex', gap: 24 }}>
      <div className="card" style={{ flex: 1, background: '#b3e0ff', borderRadius: 12, padding: 16 }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ flex: 1, margin: 0 }}>Tổng Lượt Mượn</h3>
          <span className="icon">📈</span>
        </div>
        <p className="card-value" style={{ fontSize: 28, fontWeight: 600 }}>{totalBorrows}</p>
        <p className="card-description" style={{ color: '#888' }}>Tháng 6 năm 2025</p>
      </div>
      <div className="card" style={{ flex: 1, background: '#b3e0ff', borderRadius: 12, padding: 16 }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ flex: 1, margin: 0 }}>Thiết Bị Được Mượn Nhiều Nhất</h3>
          <span className="icon">💻</span>
        </div>
        <p className="card-value" style={{ fontSize: 28, fontWeight: 600 }}>{popularDevice}</p>
        <p className="card-description" style={{ color: '#888' }}>{popularDeviceBorrows} lượt mượn</p>
      </div>
      <div className="card" style={{ flex: 1, background: '#b3e0ff', borderRadius: 12, padding: 16 }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ flex: 1, margin: 0 }}>Loại Thiết Bị</h3>
          <span className="icon">📦</span>
        </div>
        <p className="card-value" style={{ fontSize: 28, fontWeight: 600 }}>{uniqueDeviceTypes}</p>
        <p className="card-description" style={{ color: '#888' }}>Danh mục khác nhau</p>
      </div>
    </div>
  </div>
);

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

// Hàm xuất Excel
const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(mockDeviceTableData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Thống kê thiết bị');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'thong_ke_thiet_bi.xlsx');
};

const DeviceStatisticsPage: React.FC = () => {

    const { totalBorrows } = useStatistic();

  // Tính toán số liệu cho HeroSection
  //const totalBorrows = mockDeviceTableData.reduce((sum, d) => sum + d.borrows, 0);
  const popularDeviceObj = mockDeviceTableData.reduce((max, d) => d.borrows > max.borrows ? d : max, mockDeviceTableData[0]);
  const popularDevice = popularDeviceObj.name;
  const popularDeviceBorrows = popularDeviceObj.borrows;
  const uniqueDeviceTypes = new Set(mockDeviceTableData.map(d => d.category)).size;

  return (
    <div className="device-statistics-page-container">
      {/* Hero Section ở đầu trang */}
      <HeroSection
        totalBorrows={totalBorrows}
        popularDevice={popularDevice}
        popularDeviceBorrows={popularDeviceBorrows}
        uniqueDeviceTypes={uniqueDeviceTypes}
      />

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={exportToExcel}>
          Xuất Excel
        </Button>
      </div>
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
      <div className="charts-container" style={{ marginTop: 32 }}>
        <div className="chart-item" style={{ marginBottom: 32 }}>
          <h2>Biểu đồ cột</h2>
          <ColumnChart
            title="Số lượt mượn theo thiết bị"
            xAxis={mockDeviceTableData.map(d => d.name)}
            yAxis={[mockDeviceTableData.map(d => d.borrows)]}
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
            xAxis={mockDeviceTableData.map(d => d.name)}
            yAxis={[mockDeviceTableData.map(d => d.borrows)]}
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