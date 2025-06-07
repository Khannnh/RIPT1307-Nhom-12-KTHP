// src/pages/ThongKe/chartPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Select, Radio, Table, Spin, Alert } from 'antd';
import { LineChartOutlined, PieChartOutlined, TableOutlined, CalendarOutlined } from '@ant-design/icons';
import { useThongKeData } from '../../hooks/useThongKeData';
import './index.less'; 

const { Option } = Select;

const ThongKe: React.FC = () => {
  const [activeTab, setActiveTab] = useState('columnChart');
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedType, setSelectedType] = useState<string>('month');

  const { data, loading, error, refetch } = useThongKeData({
    initialType: selectedType,
    initialMonth: selectedMonth,
    initialYear: selectedYear,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && ['columnChart', 'pieChart', 'detailTable'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, []);

  useEffect(() => {
    refetch({ type: selectedType, month: selectedMonth, year: selectedYear });
  }, [selectedType, selectedMonth, selectedYear, refetch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  const columns = [
    { title: 'Hạng', dataIndex: 'rank', key: 'rank' },
    { title: 'Tên Thiết Bị', dataIndex: 'name', key: 'name' },
    { title: 'Danh Mục', dataIndex: 'category', key: 'category' },
    { title: 'Số Lượt Mượn', dataIndex: 'borrowedCount', key: 'borrowedCount' }, // Sử dụng 'borrowedCount'
    { title: 'Tỷ Lệ', dataIndex: 'percentage', key: 'percentage' },
  ];

  return (
    // Xóa header và chỉ giữ lại phần nội dung của trang thống kê
    <div className="thongke-container">
      <h1 className="main-title">
        <LineChartOutlined /> Thống Kê Thiết Bị
      </h1>
      <p className="subtitle">Theo dõi và phân tích thiết bị được mượn nhiều nhất theo tuần, tháng và năm</p>

      {/* Filter Section */}
      <Card className="filter-card">
        <div className="filter-row">
          <div className="filter-item">
            <Button icon={<CalendarOutlined />}>Bộ lọc thời gian:</Button>
          </div>
          <div className="filter-item">
            <Radio.Group defaultValue="month" buttonStyle="solid" onChange={e => setSelectedType(e.target.value)}>
              <Radio.Button value="week">Tuần</Radio.Button>
              <Radio.Button value="month">Tháng</Radio.Button>
              <Radio.Button value="year">Năm</Radio.Button>
            </Radio.Group>
          </div>
          {selectedType !== 'year' && (
            <div className="filter-item">
              <Select defaultValue={selectedMonth} style={{ width: 100 }} onChange={value => setSelectedMonth(value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <Option key={m} value={m}>{`Tháng ${m}`}</Option>
                ))}
              </Select>
            </div>
          )}
          <div className="filter-item">
            <Select defaultValue={selectedYear} style={{ width: 100 }} onChange={value => setSelectedYear(value)}>
              <Option value={2025}>Năm 2025</Option>
              <Option value={2024}>Năm 2024</Option>
            </Select>
          </div>
        </div>
      </Card>

      {loading && <Spin tip="Đang tải dữ liệu..." style={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert message="Lỗi khi tải dữ liệu thống kê" description={error.message} type="error" showIcon />}

      {!loading && !error && data && (
        <>
          {/* Summary Cards */}
          <Row gutter={[24, 24]} className="summary-cards">
            <Col xs={24} sm={8}>
              <Card>
                <div className="card-content">
                  <div className="card-header">
                    <h3>Tổng Lượt Mượn</h3>
                    <LineChartOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <p className="card-value">{data.summary.totalBorrowed}</p>
                  <p className="card-description">{data.summary.month}</p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="card-content">
                  <div className="card-header">
                    <h3>Thiết Bị Phổ Biến Nhất</h3>
                    <CalendarOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <p className="card-value">{data.summary.mostPopularDevice}</p>
                  <p className="card-description">{data.summary.mostPopularBorrowedCount} lượt mượn</p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="card-content">
                  <div className="card-header">
                    <h3>Loại Thiết Bị</h3>
                    <TableOutlined style={{ color: '#9254de' }} />
                  </div>
                  <p className="card-value">{data.summary.deviceTypes}</p>
                  <p className="card-description">Danh mục khác nhau</p>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Chart/Table Navigation */}
          <div className="chart-table-nav">
            <Button
              type={activeTab === 'columnChart' ? 'primary' : 'default'}
              onClick={() => handleTabChange('columnChart')}
            >
              Biểu Đồ Cột
            </Button>
            <Button
              type={activeTab === 'pieChart' ? 'primary' : 'default'}
              onClick={() => handleTabChange('pieChart')}
            >
              Biểu Đồ Tròn
            </Button>
            <Button
              type={activeTab === 'detailTable' ? 'primary' : 'default'}
              onClick={() => handleTabChange('detailTable')}
            >
              Bảng Chi Tiết
            </Button>
          </div>

          {/* Conditional Rendering for Charts/Table */}
          <Card className="chart-display-card">
            {activeTab === 'columnChart' && (
              <div className="chart-section">
                <h3 className="chart-title">Biểu Đồ Thiết Bị Được Mượn Nhiều Nhất</h3>
                <p className="chart-subtitle">Dữ liệu cho {data.summary.month}</p>
                <div className="placeholder-chart" style={{ height: '300px', border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                  <p>Biểu đồ cột sẽ hiển thị ở đây (chưa có dữ liệu thực tế)</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', width: '100%', padding: '20px', gap: '10px' }}>
                    {/* {data.deviceList.slice(0, 5).map((device, index) => (
                      <div
                        key={device._id || `device-${index}`} // Sử dụng _id từ model backend
                        style={{
                          flex: '1',
                          height: `${(device.borrowedCount / data.summary.mostPopularBorrowedCount) * 100}%`,
                          backgroundColor: ['#4096ff', '#8c8c8c', '#52c41a', '#fa8c16', '#f5222d'][index % 5]
                        }}
                        title={`${device.name}: ${device.borrowedCount} lượt mượn`}
                      ></div>
                    ))} */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pieChart' && (
              <div className="chart-section">
                <h3 className="chart-title">Tỷ Lệ Phần Trăm Thiết Bị Được Mượn</h3>
                <p className="chart-subtitle">Phân bổ theo phần trăm cho {data.summary.month}</p>
                <div className="placeholder-chart" style={{ height: '300px', border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                  <p>Biểu đồ tròn sẽ hiển thị ở đây (chưa có dữ liệu thực tế)</p>
                  <img src="https://gw.alipayobjects.com/zos/antfincdn/a%26A6LpH%24R%2FA/chart-pie.svg" alt="Placeholder Pie Chart" style={{ width: '200px', height: '200px' }}/>
                </div>
              </div>
            )}

            {activeTab === 'detailTable' && (
              <div className="table-section">
                <h3 className="chart-title">Bảng Chi Tiết Thống Kê</h3>
                <p className="chart-subtitle">Danh sách thiết bị được mượn trong {data.summary.month}</p>
                <Table
                  columns={columns}
                  dataSource={data.deviceList}
                  pagination={false}
                  className="device-table"
                  rowKey="_id" // Quan trọng: Sử dụng _id làm khóa hàng
                />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default ThongKe;