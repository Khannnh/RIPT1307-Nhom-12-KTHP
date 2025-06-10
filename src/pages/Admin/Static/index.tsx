import React, { useState } from 'react';
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
  selectedMonth: number;
  setSelectedMonth: (m: number) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
}> = ({
  totalBorrows,
  popularDevice,
  popularDeviceBorrows,
  uniqueDeviceTypes,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => (
  <div className="hero-section-wrapper" style={{ marginBottom: 32 }}>
    <div className="time-filter-section" style={{ marginBottom: 24 }}>
      <span style={{ marginRight: 8 , fontSize: 38}}>📅 Bộ lọc thời gian:</span>
      <select
        className="filter-dropdown"
        value={selectedMonth}
        onChange={e => setSelectedMonth(Number(e.target.value))}
        style={{ marginRight: 8 , fontSize: 28}}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            Tháng {i + 1}
          </option>
        ))}
      </select>
      <select
        className="filter-dropdown"
        value={selectedYear}
        style={{ marginRight: 8 , fontSize: 28}}
        onChange={e => setSelectedYear(Number(e.target.value))}
      >
        {[2023, 2024, 2025].map(y => (
          <option key={y} value={y}>
            Năm {y}
          </option>
        ))}
      </select>
    </div>
    <div className="hero-cards-container" style={{ display: 'flex', gap: 24 , fontSize: 20 }}>
      <div className="card" style={{ flex: 1, background: '#b3e0ff', borderRadius: 12, padding: 16 }}>
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ flex: 1, margin: 0 }}>Tổng Lượt Mượn</h3>
          <span className="icon" >📈</span>
        </div>
        <p className="card-value" style={{ fontSize: 28, fontWeight: 600 }}>{totalBorrows}</p>
        <p className="card-description" style={{ color: '#888' }}>
          Tháng {selectedMonth} năm {selectedYear}
        </p>
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
  // State chọn tháng/năm
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Truyền tháng/năm vào hook
  const { tableData, loading } = useBorrowedDeviceTable(selectedMonth, selectedYear);

  const { totalBorrows } = useStatistic(selectedMonth, selectedYear);
  const { device: topDevice } = useTopBorrowedDevices();
  const popularDevice = topDevice ? topDevice.deviceName : '---';
  const popularDeviceBorrows = topDevice ? topDevice.borrowCount : 0;
  const categoryCount = useDeviceCategoryCount(selectedMonth, selectedYear);
  const uniqueDeviceTypes = Object.keys(categoryCount).length;

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
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={exportToExcel}>
          Xuất File Excel
        </Button>
      </div>
      <div className="device-table-container">
        <div className="table-header">
          <h3 style={{ margin: 'center', fontSize: 28 }}>Bảng Chi Tiết Thống Kê</h3>
          <p>Danh sách thiết bị được mượn trong Tháng {selectedMonth}/{selectedYear}</p>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="rank"
          pagination={{ pageSize: 5 }}
        />
      </div>
      <div className="charts-container" style={{ marginTop: 32 , display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="chart-item" style={{ marginBottom: 32 }}>
          <h2 style={{ marginRight: 8 , fontSize: 28}}>Biểu đồ cột</h2>
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
          <h2 style={{ marginRight: 8 , fontSize: 28}}>Biểu đồ tròn</h2>
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