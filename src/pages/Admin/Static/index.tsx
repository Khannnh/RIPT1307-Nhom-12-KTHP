import React from 'react';
import { useStatistic } from '@/hooks/useStatistic';
import { useTopBorrowedDevices } from '@/hooks/useTopBorrow';
import { useDeviceCategoryCount } from '@/hooks/useDevice';
import { useBorrowedDeviceTable } from '@/hooks/useTable';
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

const DeviceStatisticsPage: React.FC = () => {
  const { totalBorrows } = useStatistic();
  const { devices: topBorrowedDevices } = useTopBorrowedDevices();
  const topDevice = topBorrowedDevices[0];
  const popularDevice = topDevice ? topDevice.deviceName : '---';
  const popularDeviceBorrows = topDevice ? topDevice.borrowCount : 0;
  // Lấy số lượng thiết bị theo danh mục
  const categoryCount = useDeviceCategoryCount();
  const uniqueDeviceTypes = Object.keys(categoryCount).length;
  const { tableData, loading } = useBorrowedDeviceTable();

  // Tạo filters động từ tableData
  const categoryFilters = Array.from(new Set(tableData.map(d => d.category))).map(category => ({
    text: category,
    value: category,
  }));
  const nameFilters = Array.from(new Set(tableData.map(d => d.name))).map(name => ({
    text: name,
    value: name,
  }));

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
      filters: nameFilters,
      onFilter: (value: string | number | boolean, record: Device) => record.name.indexOf(value as string) === 0,
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      filters: categoryFilters,
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
    const ws = XLSX.utils.json_to_sheet(tableData.map((item: Device) => item));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Thống kê thiết bị');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'thong_ke_thiet_bi.xlsx');
  };

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
          dataSource={tableData}
          loading={loading}
          rowKey="rank"
          pagination={{ pageSize: 5 }}
        />
      </div>
      <div className="charts-container" style={{ marginTop: 32 }}>
        <div className="chart-item" style={{ marginBottom: 32 }}>
          <h2>Biểu đồ cột</h2>
          <ColumnChart
            title="Số lượt mượn theo thiết bị"
            xAxis={tableData.map(d => d.name)}
            yAxis={[tableData.map(d => d.borrows)]}
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
            xAxis={tableData.map(d => d.name)}
            yAxis={[tableData.map(d => d.borrows)]}
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